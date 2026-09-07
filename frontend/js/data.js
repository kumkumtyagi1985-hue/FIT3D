/* ============================================================
   data.js — static/default dataset + pure client-side logic.
   This is the offline fallback: the app works fully from this
   file alone (GitHub Pages / static hosting, no backend needed).
   When backend/ is deployed and configured (see js/api.js),
   EXERCISES below is transparently replaced with live API data
   on load — every function here keeps working unchanged either
   way, since they all read the same mutable EXERCISES binding.
   ============================================================ */
/* ============ DATA ============ */
const GOALS = [
  { id: 'FatLoss', label: 'Fat Loss', icon: '🔥' },
  { id: 'Abs', label: 'Abs / Core', icon: '◎' },
  { id: 'Arms', label: 'Arms', icon: '💪' },
  { id: 'Chest', label: 'Chest', icon: '▲' },
  { id: 'Back', label: 'Back', icon: '◫' },
  { id: 'Shoulders', label: 'Shoulders', icon: '◇' },
  { id: 'Legs', label: 'Legs', icon: '𝍕' },
  { id: 'Boxing', label: 'Boxing', icon: '🥊' },
  { id: 'Mobility', label: 'Mobility', icon: '↻' },
];

const WORKOUT_NAMES = {
  FatLoss: 'Full Body Burn', Abs: 'Core Crusher', Arms: 'Arm Sculpt',
  Chest: 'Chest Builder', Back: 'Back Strength', Shoulders: 'Shoulder Shape',
  Legs: 'Leg Day', Boxing: 'Boxer Burner', Mobility: 'Reset & Flow',
};

const DIFF_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 };

const MUSCLE_LABELS = {
  chest: 'Chest', abs: 'Abs', obliques: 'Obliques', lats: 'Lats', traps: 'Traps',
  lowerback: 'Lower Back', shoulders: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps',
  forearms: 'Forearms', glutes: 'Glutes', quads: 'Quads', hamstrings: 'Hamstrings',
  calves: 'Calves', neck: 'Neck',
};

let EXERCISES = [
  ex('EX01','Jumping Jacks',['FatLoss','Mobility'],'Full Body','calves',['quads','shoulders'],['Bodyweight'],'Beginner',true,45,15,8,'Jump feet out while raising arms overhead, then return to start — keep a light, quick rhythm.'),
  ex('EX02','Mountain Climbers',['FatLoss','Abs'],'Core','abs',['shoulders','quads'],['Bodyweight'],'Beginner',true,40,20,9,'From a plank, drive knees toward your chest alternately at a fast pace, keeping hips low.'),
  ex('EX03','High Knees',['FatLoss'],'Legs','quads',['calves'],['Bodyweight'],'Beginner',true,40,20,9,'Run in place, driving knees up toward hip height as fast as you can.'),
  ex('EX04','Burpees',['FatLoss'],'Full Body','chest',['quads','shoulders'],['Bodyweight'],'Intermediate',true,40,30,12,'Drop into a squat, kick back to a plank, do a push-up, then jump up explosively.'),
  ex('EX05','Crunch',['Abs'],'Core','abs',[],['Bodyweight'],'Beginner',false,35,30,4,'Lie back with knees bent and curl your shoulders off the floor by contracting your abs.'),
  ex('EX06','Plank',['Abs'],'Core','abs',['lowerback','shoulders'],['Bodyweight'],'Beginner',true,45,30,5,'Hold a straight line from head to heels, resting on forearms and toes, bracing your core.'),
  ex('EX07','Reverse Crunch',['Abs'],'Core','abs',['obliques'],['Bodyweight'],'Beginner',false,35,30,4,'Lying down, lift your hips off the floor by drawing your knees toward your chest.'),
  ex('EX08','Leg Raise',['Abs'],'Core','abs',['hamstrings'],['Bodyweight'],'Intermediate',false,35,30,5,'Lying flat, raise straight legs toward the ceiling, then lower slowly without arching your back.'),
  ex('EX09','Dumbbell Bicep Curl',['Arms'],'Arms','biceps',['forearms'],['Dumbbell'],'Beginner',false,35,45,4,'Curl the dumbbells toward your shoulders, keeping your elbows pinned to your sides.'),
  ex('EX10','Hammer Curl',['Arms'],'Arms','biceps',['forearms'],['Dumbbell'],'Beginner',false,35,45,4,'Curl the dumbbells with your palms facing each other throughout the movement.'),
  ex('EX11','Triceps Dips',['Arms'],'Arms','triceps',['shoulders'],['Bodyweight'],'Intermediate',false,35,45,5,'Lower your body by bending your elbows off a bench or chair, then press back up.'),
  ex('EX12','Diamond Push-Up',['Arms','Chest'],'Arms','triceps',['chest'],['Bodyweight'],'Advanced',false,35,45,6,'Form a diamond with your hands under your chest and lower into a close push-up.'),
  ex('EX13','Push Up',['Chest','FatLoss'],'Chest','chest',['triceps','shoulders'],['Bodyweight'],'Beginner',false,35,40,6,'Lower your chest to the floor keeping your body straight, then press back up.'),
  ex('EX14','Dumbbell Bench Press',['Chest'],'Chest','chest',['triceps','shoulders'],['Dumbbell'],'Intermediate',false,40,60,6,'Press the dumbbells up from chest level until your arms extend, then lower with control.'),
  ex('EX15','Incline Push Up',['Chest'],'Chest','chest',['shoulders'],['Bodyweight'],'Beginner',false,35,40,5,'Hands on a raised surface, lower your chest toward it and press back up.'),
  ex('EX16','Superman',['Back'],'Back','lowerback',['glutes'],['Bodyweight'],'Beginner',false,35,30,4,'Lying face down, lift your arms and legs off the floor together, then lower.'),
  ex('EX17','Bent-Over Row',['Back'],'Back','lats',['biceps','traps'],['Dumbbell'],'Intermediate',false,40,60,6,'Hinge at the hips and pull the dumbbells toward your ribs, squeezing your shoulder blades.'),
  ex('EX18','Bird Dog',['Back','Mobility'],'Back','lowerback',['glutes'],['Bodyweight'],'Beginner',false,35,30,3,'On all fours, extend opposite arm and leg while keeping your hips level.'),
  ex('EX19','Shoulder Press',['Shoulders'],'Shoulders','shoulders',['triceps'],['Dumbbell'],'Intermediate',false,40,60,5,'Press the dumbbells overhead from shoulder height until your arms are straight.'),
  ex('EX20','Lateral Raise',['Shoulders'],'Shoulders','shoulders',[],['Dumbbell'],'Beginner',false,35,45,4,'Raise the dumbbells out to the sides until your arms are level with your shoulders.'),
  ex('EX21','Bodyweight Squat',['Legs','FatLoss'],'Legs','quads',['glutes','hamstrings'],['Bodyweight'],'Beginner',false,40,40,6,'Sit your hips back and down as if into a chair, keeping your chest up, then stand.'),
  ex('EX22','Lunge',['Legs'],'Legs','quads',['glutes','hamstrings'],['Bodyweight'],'Beginner',false,40,40,6,'Step forward and lower your back knee toward the floor, then push back to start.'),
  ex('EX23','Glute Bridge',['Legs'],'Legs','glutes',['hamstrings'],['Bodyweight'],'Beginner',false,35,30,4,'Lying on your back with knees bent, drive your hips up by squeezing your glutes.'),
  ex('EX24','Calf Raise',['Legs'],'Legs','calves',[],['Bodyweight'],'Beginner',false,30,30,3,'Rise onto your toes as high as possible, then lower slowly under control.'),
  ex('EX25','Jab-Cross Combo',['Boxing'],'Arms','shoulders',['biceps','obliques'],['Bodyweight'],'Intermediate',true,45,30,9,'Throw a quick jab with your lead hand followed by a cross from your rear hand, rotating your hips.'),
  ex('EX26','Shadow Boxing Round',['Boxing','FatLoss'],'Full Body','shoulders',['calves','obliques'],['Bodyweight'],'Beginner',true,60,30,11,'Throw continuous combinations at an imaginary opponent, staying light on your feet.'),
  ex('EX27','Cat-Cow',['Mobility'],'Back','lowerback',['abs'],['Bodyweight'],'Beginner',true,40,15,2,'On all fours, alternate arching and rounding your spine in a slow, controlled flow.'),
  ex('EX28',"World's Greatest Stretch",['Mobility'],'Full Body','hamstrings',['quads','obliques'],['Bodyweight'],'Beginner',true,40,20,3,'From a deep lunge, rotate your torso toward your front leg and reach an arm overhead.'),
  ex('EX29','Hip Circles',['Mobility'],'Legs','glutes',['quads'],['Bodyweight'],'Beginner',true,30,15,2,'Standing tall, circle your hips in a wide, slow rotation, then reverse direction.'),
];

function ex(id,name,goal,bodyPart,primary,secondary,equipment,difficulty,timed,workSec,restSec,calories,instructions){
  return { id,name,goal,bodyPart,primary,secondary,equipment,difficulty,timed,workSec,restSec,calories,instructions,
    sets: timed ? null : 3, reps: timed ? null : Math.round(workSec/3) };
}

/* ============ HELPERS ============ */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function clamp(n,lo,hi){ return Math.max(lo,Math.min(hi,n)); }
function fmtTime(s){ const m=Math.floor(s/60); const sec=s%60; return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0'); }
function equipmentIdsToTags(ids){ const set=new Set(['Bodyweight']); if(ids.includes('Dumbbells')) set.add('Dumbbell'); if(ids.includes('Barbell')) set.add('Barbell'); if(ids.includes('Band')) set.add('Band'); return [...set]; }
function getExercise(id){ return allExercises().find(e=>e.id===id); }
function allExercises(){ return EXERCISES.concat(state.customExercises || []); }

function generateWorkout(profile, opts){
  opts = opts || {};
  const levelRank = DIFF_RANK[profile.level] || 3;
  const equipTags = profile.equipment.length ? profile.equipment : ['Bodyweight'];
  let pool = allExercises().filter(e => {
    const diffOk = DIFF_RANK[e.difficulty] <= levelRank;
    const equipOk = e.equipment.every(eq => equipTags.includes(eq));
    const goalOk = e.goal.includes(profile.goal) || (profile.target && e.bodyPart === profile.target);
    return diffOk && equipOk && goalOk && e.id !== 'EX01' && e.id !== 'EX27';
  });
  if (pool.length < 4) {
    pool = allExercises().filter(e => DIFF_RANK[e.difficulty] <= levelRank && e.equipment.every(eq => equipTags.includes(eq)) && e.id !== 'EX01' && e.id !== 'EX27');
  }
  pool = shuffle(pool);
  const time = opts.time || profile.time || 20;
  const targetCount = clamp(Math.round(time / 4), 4, 8);
  const main = pool.slice(0, targetCount);
  const warmup = getExercise('EX01');
  const cooldown = getExercise('EX27');
  return {
    name: WORKOUT_NAMES[profile.goal] || 'Custom Workout',
    level: profile.level || 'Beginner',
    time,
    items: [
      { ...warmup, phase: 'Warm-up' },
      ...main.map(e => ({ ...e, phase: 'Main' })),
      { ...cooldown, phase: 'Cooldown' },
    ],
  };
}

function workoutSummary(workout){
  let secs = 0, cals = 0;
  workout.items.forEach(it => { secs += it.workSec + it.restSec; cals += it.calories; });
  return { minutes: Math.max(1, Math.round(secs / 60)), calories: cals, exercises: workout.items.length };
}

/* ============ ADMIN CRUD ============ */
function nextExerciseId(){
  const nums = EXERCISES.map(e => parseInt((e.id.match(/\d+/)||['0'])[0], 10)).filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return 'EX' + String(max + 1).padStart(2, '0');
}

function addExercise(data){
  const timed = !!data.timed;
  const workSec = data.workSec || (timed ? 30 : (data.sets||3) * (data.reps||10) * 2.5);
  const restSec = data.restSec || (timed ? 20 : 40);
  const item = {
    id: nextExerciseId(),
    name: data.name,
    goal: data.goal,
    bodyPart: data.bodyPart,
    primary: data.primary,
    secondary: data.secondary || [],
    equipment: data.equipment && data.equipment.length ? data.equipment : ['Bodyweight'],
    difficulty: data.difficulty || 'Beginner',
    timed,
    workSec: Math.round(workSec),
    restSec: Math.round(restSec),
    calories: data.calories || 5,
    instructions: data.instructions || '',
    sets: timed ? null : (data.sets || 3),
    reps: timed ? null : (data.reps || 10),
  };
  EXERCISES.push(item);
  return item;
}

function updateExercise(id, data){
  const idx = EXERCISES.findIndex(e => e.id === id);
  if (idx === -1) return null;
  const timed = !!data.timed;
  const workSec = data.workSec || (timed ? 30 : (data.sets||3) * (data.reps||10) * 2.5);
  const restSec = data.restSec || (timed ? 20 : 40);
  EXERCISES[idx] = {
    ...EXERCISES[idx],
    name: data.name,
    goal: data.goal,
    bodyPart: data.bodyPart,
    primary: data.primary,
    secondary: data.secondary || [],
    equipment: data.equipment && data.equipment.length ? data.equipment : ['Bodyweight'],
    difficulty: data.difficulty || 'Beginner',
    timed,
    workSec: Math.round(workSec),
    restSec: Math.round(restSec),
    calories: data.calories || 5,
    instructions: data.instructions || '',
    sets: timed ? null : (data.sets || 3),
    reps: timed ? null : (data.reps || 10),
  };
  return EXERCISES[idx];
}

function deleteExercise(id){
  EXERCISES = EXERCISES.filter(e => e.id !== id);
}

/* ============ GAMIFICATION ============ */
function getXP(){ return state.progress.workouts * 50 + state.progress.exercises * 5; }
function getLevel(){ return Math.floor(getXP() / 150) + 1; }
function getXPIntoLevel(){ return getXP() % 150; }
function getBadges(){
  const pr = state.progress;
  return [
    { id: 'first', label: 'First Workout', icon: '🏁', achieved: pr.workouts >= 1 },
    { id: 'ten', label: '10 Workouts', icon: '🔟', achieved: pr.workouts >= 10 },
    { id: 'hundred', label: '100 Exercises', icon: '💯', achieved: pr.exercises >= 100 },
    { id: 'boxer', label: 'Boxing Beginner', icon: '🥊', achieved: pr.boxingCompleted >= 1 },
  ];
}

/* ============ BOXING MODE ============ */
const BOXING_MOVES = { 1:'JAB', 2:'CROSS', 3:'HOOK L', 4:'HOOK R', 5:'UPPER L', 6:'UPPER R' };
const BOXING_COMBO_POOL = [ [1,2], [1,2,3], [1,1,2], [3,2], [1,2,3,2], [5,6], [1,2,5] ];
function randomCombo(){ return BOXING_COMBO_POOL[Math.floor(Math.random()*BOXING_COMBO_POOL.length)]; }
function comboText(combo){ return combo.map(n => `${n}·${BOXING_MOVES[n]}`).join('  →  '); }

/* ============ CUSTOM EXERCISE IDS ============ */
function nextCustomId(){ return 'CX' + String(state.customExercises.length + 1).padStart(3,'0'); }

/* ============ AI WORKOUT GENERATOR ============ */
// Rule-based keyword parser — deliberately NOT a generative model call.
// Per the PRD: the AI layer must only ever select from the validated exercise
// database, never invent exercises. Keeping this deterministic guarantees that.
const AI_GOAL_KEYWORDS = {
  Boxing:   ['box','punch','jab','cross','hook','uppercut'],
  FatLoss:  ['fat loss','fat burn','cardio','weight loss','burn calorie','full body','hiit'],
  Abs:      ['abs','ab workout','core','stomach','belly','six pack','six-pack'],
  Arms:     ['arm','bicep','tricep','forearm'],
  Chest:    ['chest','pecs','pec '],
  Back:     ['back','lats','lat '],
  Shoulders:['shoulder','delt'],
  Legs:     ['leg','quad','hamstring','calf','calves','glute'],
  Mobility: ['mobility','stretch','flexib','warm up','warmup','recover'],
};
const AI_EQUIP_KEYWORDS = { Dumbbell: ['dumbbell'], Barbell: ['barbell'], Band: ['resistance band','band'] };
const AI_NO_EQUIP_RE = /no equipment|bodyweight only|without equipment|no gear/;
const AI_TIME_RE = /(\d{1,3})\s*[- ]?\s*(minute|min)\b/;
const AI_LEVEL_KEYWORDS = { Beginner: ['beginner','easy','new to'], Intermediate: ['intermediate'], Advanced: ['advanced','hard','intense'] };

function parseAIPrompt(text){
  const lower = text.toLowerCase();
  let goal = null;
  for (const g of Object.keys(AI_GOAL_KEYWORDS)) {
    if (AI_GOAL_KEYWORDS[g].some(k => lower.includes(k))) { goal = g; break; }
  }
  const timeMatch = lower.match(AI_TIME_RE);
  const time = timeMatch ? clamp(parseInt(timeMatch[1], 10), 5, 90) : null;
  const equipment = [];
  Object.keys(AI_EQUIP_KEYWORDS).forEach(tag => { if (AI_EQUIP_KEYWORDS[tag].some(k => lower.includes(k))) equipment.push(tag); });
  const noEquip = AI_NO_EQUIP_RE.test(lower);
  let level = null;
  for (const l of Object.keys(AI_LEVEL_KEYWORDS)) {
    if (AI_LEVEL_KEYWORDS[l].some(k => lower.includes(k))) { level = l; break; }
  }
  return { goal, time, equipment, noEquip, level };
}

function generateAIWorkout(text, profile){
  const parsed = parseAIPrompt(text);
  const effGoal = parsed.goal || profile.goal || 'FatLoss';
  const effTime = parsed.time || profile.time || 20;
  const effLevel = parsed.level || profile.level || 'Beginner';
  const effEquipment = parsed.noEquip ? ['Bodyweight'] : (parsed.equipment.length ? ['Bodyweight', ...parsed.equipment] : (profile.equipment.length ? profile.equipment : ['Bodyweight']));
  const wk = generateWorkout({ goal: effGoal, level: effLevel, equipment: effEquipment, target: null }, { time: effTime });
  wk.parsed = parsed;
  wk.effGoal = effGoal;
  return wk;
}

