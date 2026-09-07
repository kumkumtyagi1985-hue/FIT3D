-- ============================================================
-- FIT3D — PostgreSQL production schema
--
-- The backend ships running on a zero-config JSON file database
-- (see backend/db.js) so the whole project runs with just
-- `npm install && npm start`. This file is the migration target
-- for production: it mirrors backend/db.js's shape (users,
-- exercises, workout_logs) and adds the full table set from the
-- PRD (section 26) for when you outgrow the file DB — goals,
-- body_parts, muscles, exercise_muscles, exercise_equipment,
-- exercise_animations, workouts, workout_exercises, favorites,
-- progress, plus subscriptions for Stripe billing state.
--
-- This file is not wired up automatically — swapping backend/db.js
-- for a real `pg` client that runs these queries is the last step
-- described in the README's "Going to production" section.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- ---------- Users & profiles ----------
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  stripe_customer_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  user_id         INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  goal            TEXT,
  level           TEXT CHECK (level IN ('Beginner','Intermediate','Advanced')),
  location        TEXT CHECK (location IN ('Home','Gym','Both')),
  equipment       TEXT[] DEFAULT ARRAY['Bodyweight'],
  session_minutes INTEGER,
  target_body_part TEXT,
  weight_kg       NUMERIC,
  height_cm       NUMERIC,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status                TEXT NOT NULL DEFAULT 'active',
  price_id              TEXT,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Content taxonomy ----------
CREATE TABLE goals (
  id     TEXT PRIMARY KEY,        -- e.g. 'FatLoss', 'Abs', 'Boxing'
  label  TEXT NOT NULL,
  icon   TEXT
);

CREATE TABLE body_parts (
  id     TEXT PRIMARY KEY,        -- e.g. 'Chest', 'Legs', 'Core'
  label  TEXT NOT NULL
);

CREATE TABLE muscles (
  id     TEXT PRIMARY KEY,        -- e.g. 'chest', 'biceps', 'quads'
  label  TEXT NOT NULL,
  body_part_id TEXT REFERENCES body_parts(id)
);

-- ---------- Exercises ----------
CREATE TABLE exercises (
  id              TEXT PRIMARY KEY,     -- e.g. 'EX01'
  name            TEXT NOT NULL,
  body_part_id    TEXT REFERENCES body_parts(id),
  primary_muscle  TEXT REFERENCES muscles(id),
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  timed           BOOLEAN NOT NULL DEFAULT false,
  work_seconds    INTEGER,
  rest_seconds    INTEGER,
  sets            INTEGER,
  reps            INTEGER,
  calories        INTEGER,
  instructions    TEXT,
  thumbnail_url   TEXT,
  model_url       TEXT,             -- .glb — see PRD §23 asset layout
  animation_url   TEXT,             -- .glb
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exercise_goals (         -- many-to-many: an exercise can serve several goals
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  goal_id     TEXT REFERENCES goals(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, goal_id)
);

CREATE TABLE exercise_muscles (        -- secondary muscles (primary lives on exercises.primary_muscle)
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_id   TEXT REFERENCES muscles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'secondary' CHECK (role IN ('primary','secondary')),
  PRIMARY KEY (exercise_id, muscle_id)
);

CREATE TABLE exercise_equipment (
  exercise_id  TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  equipment_id TEXT NOT NULL,          -- 'Bodyweight' | 'Dumbbell' | 'Barbell' | 'Band'
  PRIMARY KEY (exercise_id, equipment_id)
);

CREATE TABLE exercise_animations (     -- PRD §11: named animation states per exercise
  id           SERIAL PRIMARY KEY,
  exercise_id  TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  state        TEXT NOT NULL,         -- 'idle' | 'start' | 'movement' | 'end'
  clip_url     TEXT NOT NULL
);

-- ---------- Workouts ----------
CREATE TABLE workouts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE, -- null for system-generated templates
  name        TEXT NOT NULL,
  goal_id     TEXT REFERENCES goals(id),
  level       TEXT,
  minutes     INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workout_exercises (       -- ordered exercises within a workout
  id           SERIAL PRIMARY KEY,
  workout_id   INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id  TEXT REFERENCES exercises(id),
  position     INTEGER NOT NULL,
  phase        TEXT NOT NULL DEFAULT 'Main' CHECK (phase IN ('Warm-up','Main','Cooldown'))
);

CREATE TABLE workout_logs (            -- a completed session
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id  INTEGER REFERENCES workouts(id),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'workout' CHECK (type IN ('workout','boxing')),
  goal_id     TEXT REFERENCES goals(id),
  minutes     INTEGER NOT NULL,
  calories    INTEGER DEFAULT 0,
  exercises_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Progress & favorites ----------
CREATE TABLE progress (
  user_id           INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  workouts_completed INTEGER NOT NULL DEFAULT 0,
  total_minutes      INTEGER NOT NULL DEFAULT 0,
  exercises_completed INTEGER NOT NULL DEFAULT 0,
  current_streak      INTEGER NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE favorites (
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);

-- ---------- Helpful indexes ----------
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_created_at ON workout_logs(created_at);
CREATE INDEX idx_exercise_goals_goal_id ON exercise_goals(goal_id);
CREATE INDEX idx_users_email ON users(email);
