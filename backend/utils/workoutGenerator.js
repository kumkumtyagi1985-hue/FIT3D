const DIFF_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 };
const WORKOUT_NAMES = {
  FatLoss: 'Full Body Burn', Abs: 'Core Crusher', Arms: 'Arm Sculpt',
  Chest: 'Chest Builder', Back: 'Back Strength', Shoulders: 'Shoulder Shape',
  Legs: 'Leg Day', Boxing: 'Boxer Burner', Mobility: 'Reset & Flow',
};

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }

function generateWorkout(exercises, profile, opts){
  opts = opts || {};
  const levelRank = DIFF_RANK[profile.level] || 3;
  const equipTags = (profile.equipment && profile.equipment.length) ? profile.equipment : ['Bodyweight'];

  let pool = exercises.filter(e => {
    const diffOk = DIFF_RANK[e.difficulty] <= levelRank;
    const equipOk = e.equipment.every(eq => equipTags.includes(eq));
    const goalOk = e.goal.includes(profile.goal) || (profile.target && e.bodyPart === profile.target);
    return diffOk && equipOk && goalOk && e.id !== 'EX01' && e.id !== 'EX27';
  });
  if (pool.length < 4) {
    pool = exercises.filter(e => DIFF_RANK[e.difficulty] <= levelRank && e.equipment.every(eq => equipTags.includes(eq)) && e.id !== 'EX01' && e.id !== 'EX27');
  }
  pool = shuffle(pool);

  const time = opts.time || profile.time || 20;
  const targetCount = clamp(Math.round(time / 4), 4, 8);
  const main = pool.slice(0, targetCount);
  const warmup = exercises.find(e => e.id === 'EX01');
  const cooldown = exercises.find(e => e.id === 'EX27');

  return {
    name: WORKOUT_NAMES[profile.goal] || 'Custom Workout',
    level: profile.level || 'Beginner',
    time,
    items: [
      ...(warmup ? [{ ...warmup, phase: 'Warm-up' }] : []),
      ...main.map(e => ({ ...e, phase: 'Main' })),
      ...(cooldown ? [{ ...cooldown, phase: 'Cooldown' }] : []),
    ],
  };
}

module.exports = { generateWorkout };
