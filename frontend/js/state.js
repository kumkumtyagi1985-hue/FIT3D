/* ============================================================
   state.js — the single mutable runtime state object plus the
   onboarding step definitions. Kept separate from data.js so
   it's obvious what's "static content" vs "live app state".
   ============================================================ */

const state = {
  view: 'onboarding',
  onboardStep: 0,
  profile: { goal: null, level: null, location: null, equipment: [], time: null, target: null, weight: null, height: null },
  tab: 'home',
  explore: { query: '', goalFilter: null, bodyPartFilter: null, equipFilter: null },
  currentExerciseId: null,
  favorites: new Set(),
  customWorkout: [],
  customExercises: [],
  todaysWorkout: null,
  player: null, // {workout, index, phase, secondsLeft, paused, timerId}
  boxing: null,
  workoutHistory: [],
  progress: { workouts: 0, minutes: 0, exercises: 0, streak: 1, boxingCompleted: 0 },
  viewerCleanup: null,
  aiQuery: '',
  aiResult: null,
  adminEditId: null,

  // --- auth / backend session (populated by js/api.js) ---
  auth: {
    mode: 'guest',        // 'guest' | 'online'
    token: null,
    user: null,           // { id, name, email, role, plan }
  },
  backendAvailable: false, // set true once js/api.js confirms the API is reachable
};

const ONBOARD_STEPS = [
  { key: 'goal', title: "What's your primary goal?", multi: false,
    options: GOALS.filter(g => ['FatLoss','Arms','Abs','Boxing','Mobility'].includes(g.id)) },
  { key: 'level', title: 'Fitness level', multi: false,
    options: [{id:'Beginner',label:'Beginner',icon:'①'},{id:'Intermediate',label:'Intermediate',icon:'②'},{id:'Advanced',label:'Advanced',icon:'③'}] },
  { key: 'location', title: 'Workout location', multi: false,
    options: [{id:'Home',label:'Home',icon:'⌂'},{id:'Gym',label:'Gym',icon:'▣'},{id:'Both',label:'Both',icon:'⇄'}] },
  { key: 'equipment', title: 'Equipment', multi: true,
    options: [{id:'None',label:'No Equipment',icon:'✋'},{id:'Dumbbells',label:'Dumbbells',icon:'🏋'},{id:'Barbell',label:'Barbell',icon:'▬'},{id:'Band',label:'Resistance Band',icon:'〰'}] },
  { key: 'time', title: 'Workout time', multi: false,
    options: [{id:10,label:'10 min'},{id:20,label:'20 min'},{id:30,label:'30 min'},{id:45,label:'45 min'},{id:60,label:'60 min'}] },
  { key: 'target', title: 'Target', multi: false,
    options: [{id:null,label:'Full Body',icon:'●'},{id:'Chest',label:'Chest',icon:'▲'},{id:'Back',label:'Back',icon:'◫'},{id:'Arms',label:'Arms',icon:'💪'},{id:'Shoulders',label:'Shoulders',icon:'◇'},{id:'Core',label:'Abs',icon:'◎'},{id:'Legs',label:'Legs',icon:'𝍕'}] },
  { key: 'bio', title: 'A little about you', type: 'bio' },
];

const PLANS = {
  free: { id: 'free', label: 'Free', price: '$0', period: '', features: [
    'Full exercise library & 3D viewer', 'Workout generator', 'Boxing mode', 'Basic progress tracking',
  ]},
  pro: { id: 'pro', label: 'Pro', price: '$7.99', period: '/month', features: [
    'Everything in Free', 'AI workout generator', 'Unlimited custom workouts',
    'Advanced analytics & history export', 'Priority support',
  ]},
};
