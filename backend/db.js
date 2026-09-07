/* ============================================================
   db.js — a tiny JSON-file "database".
   Not for production scale, but it means this backend runs
   with zero setup: no Postgres/Mongo install, no connection
   string, just `npm install && npm start`. Swap this module
   for a real Postgres client (see database/schema.sql, which
   mirrors this same shape) when you're ready to go to
   production — every route only talks to the functions below,
   so that swap doesn't touch route logic.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_EXERCISES = require('./seed/exercises.json');

function ensureDb(){
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [],
      exercises: SEED_EXERCISES,
      workoutLogs: [],
      nextUserId: 1,
      nextWorkoutId: 1,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}
ensureDb();

function read(){
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function write(data){
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  // --- users ---
  getUserByEmail(email){
    return read().users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  },
  getUserById(id){
    return read().users.find(u => u.id === id);
  },
  createUser(user){
    const db = read();
    const id = db.nextUserId++;
    const record = Object.assign({ id, plan: 'free', role: 'user', createdAt: new Date().toISOString() }, user, { id });
    db.users.push(record);
    write(db);
    return record;
  },
  updateUser(id, patch){
    const db = read();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = Object.assign({}, db.users[idx], patch);
    write(db);
    return db.users[idx];
  },
  listUsers(){
    return read().users;
  },

  // --- exercises ---
  listExercises(){
    return read().exercises;
  },
  createExercise(ex){
    const db = read();
    db.exercises.push(ex);
    write(db);
    return ex;
  },
  updateExercise(id, patch){
    const db = read();
    const idx = db.exercises.findIndex(e => e.id === id);
    if (idx === -1) return null;
    db.exercises[idx] = Object.assign({}, db.exercises[idx], patch);
    write(db);
    return db.exercises[idx];
  },
  deleteExercise(id){
    const db = read();
    db.exercises = db.exercises.filter(e => e.id !== id);
    write(db);
  },

  // --- workout logs ---
  logWorkout(userId, entry){
    const db = read();
    const id = db.nextWorkoutId++;
    const record = Object.assign({ id, userId, createdAt: new Date().toISOString() }, entry);
    db.workoutLogs.push(record);
    write(db);
    return record;
  },
  listWorkoutsForUser(userId){
    return read().workoutLogs.filter(w => w.userId === userId);
  },
  listAllWorkouts(){
    return read().workoutLogs;
  },
};
