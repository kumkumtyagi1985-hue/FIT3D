/* ============ ICONS ============ */
function icon(path, extra){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>${extra||''}`; }
const ICONS = {
  home: icon('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h14v-9"/><path d="M9.5 19v-5h5v5"/>'),
  explore: icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>'),
  workout: icon('<path d="M6.5 9v6M17.5 9v6M2.5 12h2M19.5 12h2M4.5 12h15"/>'),
  me: icon('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.6-3.8 5-5.5 7-5.5s5.4 1.7 7 5.5"/>'),
  back: icon('<path d="m14 6-6 6 6 6"/>'),
  heart: (filled) => icon(`<path d="M12 20s-7-4.4-9.3-9C1.2 7.9 3 4.5 6.3 4.5c1.9 0 3.4 1 4.7 2.6C12.3 5.5 13.8 4.5 15.7 4.5c3.3 0 5.1 3.4 3.6 6.5C17 15.6 12 20 12 20Z" ${filled?'fill="currentColor"':''}/>`),
  play: icon('<path d="M7 5.5v13l11-6.5-11-6.5Z"/>'),
  pause: icon('<path d="M8 5.5v13M16 5.5v13"/>'),
  skip: icon('<path d="M6 5.5v13l9-6.5-9-6.5Z"/><path d="M17 5.5v13"/>'),
  close: icon('<path d="m6 6 12 12M18 6 6 18"/>'),
  target: icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'),
  drag: icon('<path d="M8 5v14M16 5v14"/><path d="m5 9-3 3 3 3M19 9l3 3-3 3"/>'),
  check: icon('<path d="m5 12 5 5 9-9"/>'),
  flame: icon('<path d="M12 2s5 4.5 5 9.5a5 5 0 0 1-10 0c0-1 .3-2 1-3 .3 1.5 1.3 2 1.3 2C8.5 8 10 6 12 2Z"/>'),
  clock: icon('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  admin: icon('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 4v14"/>'),
  plus: icon('<path d="M12 5v14M5 12h14"/>'),
  trash: icon('<path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0-.8 12.1a1.5 1.5 0 0 1-1.5 1.4H9.3a1.5 1.5 0 0 1-1.5-1.4L7 7"/>'),
  edit: icon('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
  glove: icon('<path d="M7 13V8a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1h1a2.5 2.5 0 0 1 2.5 2.5V13a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-2a2 2 0 0 1 2-2Z"/><path d="M9 9.5v3M12 8.5v4M15 9.5v3"/>'),
  star: icon('<path d="m12 3 2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 16.8 6.5 19.6l1.4-6.1L3.2 9.3l6.2-.6Z"/>'),
  sparkle: icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m7 7 2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"/><circle cx="12" cy="12" r="2"/>'),
  crown: icon('<path d="m4 8 3 3 5-6 5 6 3-3-2 10H6L4 8Z"/>'),
  user: icon('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.6-3.8 5-5.5 7-5.5s5.4 1.7 7 5.5"/>'),
  logout: icon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'),
};

function root(){ return document.getElementById('root'); }
function disposeViewer(){ if (state.viewerCleanup) { state.viewerCleanup(); state.viewerCleanup = null; } }
function stopPlayerTimer(){ if (state.player && state.player.timerId) { clearInterval(state.player.timerId); state.player.timerId = null; } }

/* ============ RENDER DISPATCH ============ */
function render(){
  if (state.view === 'onboarding') return renderOnboarding();
  if (state.view === 'home') return renderHome();
  if (state.view === 'explore') return renderExplore();
  if (state.view === 'exercise') return renderExerciseDetail();
  if (state.view === 'workoutTab') return renderWorkoutTab();
  if (state.view === 'player') return renderPlayer();
  if (state.view === 'summary') return renderSummary();
  if (state.view === 'me') return renderMe();
  if (state.view === 'admin') return renderAdmin();
  if (state.view === 'adminForm') return renderAdminForm();
  if (state.view === 'boxing') return renderBoxing();
  if (state.view === 'aiGenerator') return renderAIGenerator();
  if (state.view === 'auth') return renderAuth();
  if (state.view === 'pricing') return renderPricing();
}

function goTab(tab){ disposeViewer(); stopPlayerTimer(); state.player = null; state.tab = tab; state.view = tab; render(); }
function openExercise(id){ state.currentExerciseId = id; state.returnView = state.view; state.view = 'exercise'; render(); }
function closeExercise(){ state.view = state.returnView || state.tab; render(); }

/* ============ ONBOARDING ============ */
function renderOnboarding(){
  disposeViewer();
  const step = ONBOARD_STEPS[state.onboardStep];
  const isLast = state.onboardStep === ONBOARD_STEPS.length - 1;

  if (step.type === 'bio') {
    root().innerHTML = `
      <div class="ob">
        <div class="ob-brand">${ICONS.target}<span>FIT3D</span></div>
        <div class="ob-dots">${ONBOARD_STEPS.map((_,i)=>`<span class="dot ${i<=state.onboardStep?'on':''}"></span>`).join('')}</div>
        <h1 class="ob-title">${step.title}</h1>
        <div class="ob-bio">
          <label class="field-label">Weight (kg)</label>
          <input class="field-input" type="number" id="bioWeight" min="20" max="300" placeholder="e.g. 70" value="${state.profile.weight||''}"/>
          <label class="field-label">Height (cm)</label>
          <input class="field-input" type="number" id="bioHeight" min="100" max="250" placeholder="e.g. 175" value="${state.profile.height||''}"/>
          <div class="ob-bio-note">Optional — helps personalize calorie estimates later. You can skip this.</div>
        </div>
        <div class="ob-actions">
          <button class="btn ghost" id="obBack">Back</button>
          <button class="btn primary" id="obNext">Generate My Workout</button>
        </div>
      </div>`;
    document.getElementById('bioWeight').addEventListener('input', (e) => { state.profile.weight = e.target.value ? Number(e.target.value) : null; });
    document.getElementById('bioHeight').addEventListener('input', (e) => { state.profile.height = e.target.value ? Number(e.target.value) : null; });
    document.getElementById('obBack').addEventListener('click', () => { state.onboardStep--; renderOnboarding(); });
    document.getElementById('obNext').addEventListener('click', finalizeOnboarding);
    return;
  }

  const selected = step.multi
    ? (state.profile.equipmentIds || [])
    : [state.profile[step.key]];

  root().innerHTML = `
    <div class="ob">
      <div class="ob-brand">${ICONS.target}<span>FIT3D</span></div>
      <div class="ob-dots">${ONBOARD_STEPS.map((_,i)=>`<span class="dot ${i<=state.onboardStep?'on':''}"></span>`).join('')}</div>
      <h1 class="ob-title">${step.title}</h1>
      <div class="ob-grid ${step.multi?'multi':''}">
        ${step.options.map(o => `
          <button class="ob-opt ${selected.includes(o.id)?'sel':''}" data-id="${escAttr(o.id)}">
            ${o.icon?`<span class="ob-opt-icon">${o.icon}</span>`:''}
            <span>${o.label}</span>
          </button>`).join('')}
      </div>
      <div class="ob-actions">
        ${state.onboardStep>0?`<button class="btn ghost" id="obBack">Back</button>`:'<span></span>'}
        <button class="btn primary" id="obNext">${isLast?'Generate My Workout':'Continue'}</button>
      </div>
    </div>`;

  root().querySelectorAll('.ob-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const raw = btn.dataset.id;
      const val = raw === 'null' ? null : (isFinite(raw) && raw !== '' ? Number(raw) : raw);
      if (step.multi) {
        state.profile.equipmentIds = state.profile.equipmentIds || [];
        const idx = state.profile.equipmentIds.indexOf(val);
        if (idx >= 0) state.profile.equipmentIds.splice(idx,1); else state.profile.equipmentIds.push(val);
      } else {
        state.profile[step.key] = val;
      }
      renderOnboarding();
    });
  });
  const backBtn = document.getElementById('obBack');
  if (backBtn) backBtn.addEventListener('click', () => { state.onboardStep--; renderOnboarding(); });
  document.getElementById('obNext').addEventListener('click', () => {
    if (isLast) { finalizeOnboarding(); } else { state.onboardStep++; renderOnboarding(); }
  });
}

function finalizeOnboarding(){
  state.profile.equipment = equipmentIdsToTags(state.profile.equipmentIds || []);
  if (!state.profile.goal) state.profile.goal = 'FatLoss';
  if (!state.profile.level) state.profile.level = 'Beginner';
  if (!state.profile.time) state.profile.time = 20;
  state.todaysWorkout = generateWorkout(state.profile);
  goTab('home');
}

function escAttr(v){ return String(v).replace(/"/g,'&quot;'); }

/* ============ SHELL / BOTTOM NAV ============ */
function shellHTML(contentHTML, activeTab){
  const tabs = [
    ['home','Home',ICONS.home], ['explore','Explore',ICONS.explore],
    ['workoutTab','Workout',ICONS.workout], ['me','Me',ICONS.me],
  ];
  return `
    <div class="shell">
      <div class="topbar">
        <div class="brand">${ICONS.target}<span>FIT3D</span></div>
      </div>
      <div class="content">${contentHTML}</div>
      <div class="bottomnav">
        ${tabs.map(([id,label,ic]) => `
          <button class="navbtn ${activeTab===id?'active':''}" data-tab="${id}">
            <span class="navicon">${ic}</span><span>${label}</span>
          </button>`).join('')}
      </div>
    </div>`;
}
function bindShellNav(){
  root().querySelectorAll('.navbtn').forEach(b => b.addEventListener('click', () => goTab(b.dataset.tab)));
}

/* ============ EXERCISE CARD ============ */
function exerciseCardHTML(e){
  return `
    <button class="excard" data-id="${e.id}">
      <div class="excard-thumb" style="background:${muscleColor(e.primary)}22">
        <span class="excard-badge">${MUSCLE_LABELS[e.primary]}</span>
      </div>
      <div class="excard-body">
        <div class="excard-name">${e.name}</div>
        <div class="excard-meta">${e.goal.map(g=>GOALS.find(x=>x.id===g)?.label||g).join(' · ')} · ${e.difficulty}</div>
      </div>
    </button>`;
}
function muscleColor(){ return '#FF5D5D'; }
function bindExerciseCards(){
  root().querySelectorAll('.excard').forEach(c => c.addEventListener('click', () => openExercise(c.dataset.id)));
}

/* ============ HOME ============ */
function renderHome(){
  disposeViewer();
  const p = state.profile;
  const wk = state.todaysWorkout || generateWorkout(p);
  state.todaysWorkout = wk;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const recs = shuffle(EXERCISES.filter(e => e.goal.includes(p.goal))).slice(0,4);
const workoutDates = JSON.parse(localStorage.getItem('fit3dWorkoutDates') || '[]');

const now = new Date();
const dayIndex = (now.getDay() + 6) % 7;

const monday = new Date(now);
monday.setDate(now.getDate() - dayIndex);

const weekDays = Array.from({length: 7}, (_, i) => {
  const d = new Date(monday);
  d.setDate(monday.getDate() + i);

  const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  return {
    key,
    day: d.toLocaleDateString('en-US', {weekday: 'short'}),
    date: d.getDate(),
    done: workoutDates.includes(key),
    today: key === `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  };
});

const weekDone = weekDays.filter(d => d.done).length;
  const content = `
    <div class="home">
      <div class="greeting">${greet}</div>
      <div class="greeting-sub">Ready for today's workout?</div>

      <div class="today-card">
        <div class="today-label">TODAY'S WORKOUT</div>
        <div class="today-name">${wk.name}</div>
        <div class="today-meta">${wk.time} min · ${wk.level} · ${wk.items.length} exercises</div>
        <button class="btn primary full" id="startToday">${ICONS.play} Start Workout</button>
      </div>

   <div class="section-label">Weekly Goals</div>
<div class="weekly-goal-card">
  <div class="weekly-goal-head">
    <div>
      <div class="weekly-goal-title">Weekly Workout Goal</div>
      <div class="weekly-goal-sub">${weekDone}/5 workouts completed</div>
    </div>
    <div class="weekly-goal-count">${weekDone}/5</div>
  </div>

  <div class="week-calendar">
    ${weekDays.map(d => `
      <div class="week-day ${d.today ? 'today' : ''} ${d.done ? 'done' : ''}">
        <span class="week-day-name">${d.day}</span>
        <span class="week-day-date">${d.date}</span>
        <span class="week-day-mark">${d.done ? '✓' : ''}</span>
      </div>
    `).join('')}
  </div>
</div>   
      <div class="section-label">Your Goal</div>
      <div class="goal-pill">${GOALS.find(g=>g.id===p.goal)?.icon||''} ${GOALS.find(g=>g.id===p.goal)?.label||'Full Body'}</div>

<div class="section-label">Today's Exercises</div>
<div class="home-exercise-list">
  ${wk.items.map((e, i) => `
    <button class="home-exercise-item" data-id="${e.id}">
      <span class="home-exercise-num">${i + 1}</span>
      <span class="home-exercise-info">
        <span class="home-exercise-name">${e.name}</span>
        <span class="home-exercise-meta">
          ${e.timed ? `${e.workSec}s` : `${e.sets} × ${e.reps}`}
        </span>
      </span>
      <span>›</span>
    </button>
  `).join('')}
</div>
      <div class="section-label">Quick Exercises</div>
      <div class="chip-row">
        ${['Abs','Arms','Chest','Legs'].map(g => `<button class="chip" data-goal="${g}">${g}</button>`).join('')}
      </div>

      <div class="section-label">Recommended For You</div>
      <div class="excard-grid">${recs.map(exerciseCardHTML).join('')}</div>

      <div class="section-label">Boxing Mode</div>
      <div class="boxing-card">
        <div class="boxing-card-name">${ICONS.glove} Shadow Boxing</div>
        <div class="boxing-card-sub">Live combos · rounds · rest timer</div>
        <button class="btn boxing full" id="enterBoxing">${ICONS.play} Enter the Ring</button>
      </div>
    </div>`;

  root().innerHTML = shellHTML(content, 'home');
  bindShellNav();
  bindExerciseCards();
  document.getElementById('startToday').addEventListener('click', () => startPlayer(wk));
  document.getElementById('enterBoxing').addEventListener('click', startBoxing);
  root().querySelectorAll('.chip[data-goal]').forEach(c => c.addEventListener('click', () => {
    state.explore.goalFilter = c.dataset.goal === 'Abs' ? 'Abs' : c.dataset.goal;
    goTab('explore');
  }));
}

/* ============ EXPLORE ============ */
function renderExplore(){
  disposeViewer();
  const ex = state.explore;
  const bodyParts = ['Chest','Back','Arms','Shoulders','Core','Legs'];
  let list = allExercises().filter(e => {
    const q = ex.query.trim().toLowerCase();
    const qOk = !q || e.name.toLowerCase().includes(q) || MUSCLE_LABELS[e.primary].toLowerCase().includes(q);
    const goalOk = !ex.goalFilter || e.goal.includes(ex.goalFilter);
    const bpOk = !ex.bodyPartFilter || e.bodyPart === ex.bodyPartFilter;
    const eqOk = !ex.equipFilter || e.equipment.includes(ex.equipFilter);
    return qOk && goalOk && bpOk && eqOk;
  });

  const content = `
    <div class="explore">
      <input class="search" id="searchInput" placeholder="Search exercises..." value="${escAttr(ex.query)}"/>
      <div class="section-label">Goals</div>
      <div class="chip-row wrap">
        ${GOALS.map(g => `<button class="chip ${ex.goalFilter===g.id?'on':''}" data-goal="${g.id}">${g.icon} ${g.label}</button>`).join('')}
      </div>
      ${ex.goalFilter === 'Boxing' ? `
        <div class="boxing-banner" id="boxingBanner">${ICONS.glove} Try live Boxing Mode →</div>
      ` : ''}
      <div class="section-label">Body Parts</div>
      <div class="chip-row wrap">
        ${bodyParts.map(b => `<button class="chip ${ex.bodyPartFilter===b?'on':''}" data-bp="${b}">${b}</button>`).join('')}
      </div>
      <div class="section-label">Equipment</div>
      <div class="chip-row wrap">
        ${['Bodyweight','Dumbbell'].map(eq => `<button class="chip ${ex.equipFilter===eq?'on':''}" data-eq="${eq}">${eq}</button>`).join('')}
      </div>
      <div class="section-label">${list.length} Exercises</div>
      <div class="excard-grid">${list.map(exerciseCardHTML).join('') || '<div class="empty">No exercises match those filters.</div>'}</div>
    </div>`;

  root().innerHTML = shellHTML(content, 'explore');
  bindShellNav();
  bindExerciseCards();
  document.getElementById('searchInput').addEventListener('input', (e) => { state.explore.query = e.target.value; renderExplore(); document.getElementById('searchInput').focus(); });
  root().querySelectorAll('[data-goal]').forEach(c => c.addEventListener('click', () => { ex.goalFilter = ex.goalFilter===c.dataset.goal?null:c.dataset.goal; renderExplore(); }));
  root().querySelectorAll('[data-bp]').forEach(c => c.addEventListener('click', () => { ex.bodyPartFilter = ex.bodyPartFilter===c.dataset.bp?null:c.dataset.bp; renderExplore(); }));
  root().querySelectorAll('[data-eq]').forEach(c => c.addEventListener('click', () => { ex.equipFilter = ex.equipFilter===c.dataset.eq?null:c.dataset.eq; renderExplore(); }));
  const banner = document.getElementById('boxingBanner');
  if (banner) banner.addEventListener('click', startBoxing);
}

/* ============ EXERCISE DETAIL ============ */
function renderExerciseDetail(){
  disposeViewer();
  const e = getExercise(state.currentExerciseId);
  const fav = state.favorites.has(e.id);
  root().innerHTML = `
    <div class="detail">
      <div class="detail-top">
        <button class="iconbtn" id="backBtn">${ICONS.back}</button>
        <button class="iconbtn ${fav?'fav-on':''}" id="favBtn">${ICONS.heart(fav)}</button>
      </div>
      <div class="viewer-wrap">
        <div class="viewer" id="viewerHost"></div>
        <div class="viewer-hint">${ICONS.drag} Drag to rotate</div>
        <div class="viewer-views">
          <button class="chip small" data-view="front">Front</button>
          <button class="chip small" data-view="side">Side</button>
          <button class="chip small" data-view="back">Back</button>
        </div>
      </div>
      <div class="detail-body">
        <h1>${e.name}</h1>
        <div class="muscle-row">
          <div class="muscle-badge primary">${ICONS.target} ${MUSCLE_LABELS[e.primary]}</div>
          ${(e.secondary||[]).map(m=>`<div class="muscle-badge secondary">${MUSCLE_LABELS[m]}</div>`).join('')}
        </div>
        <div class="detail-stats">
          <div><span class="stat-label">Equipment</span><span class="stat-val">${e.equipment.join(', ')}</span></div>
          <div><span class="stat-label">Difficulty</span><span class="stat-val">${e.difficulty}</span></div>
          <div><span class="stat-label">${e.timed?'Duration':'Sets × Reps'}</span><span class="stat-val">${e.timed ? e.workSec+'s' : e.sets+' × '+e.reps}</span></div>
        </div>
        <p class="instructions">${e.instructions}</p>
        <div class="detail-actions">
          <button class="btn ghost full" id="addToWorkout">Add to Workout</button>
          <button class="btn primary full" id="startSolo">${ICONS.play} Start This Exercise</button>
        </div>
      </div>
    </div>`;

  document.getElementById('backBtn').addEventListener('click', closeExercise);
  document.getElementById('favBtn').addEventListener('click', () => {
    if (state.favorites.has(e.id)) state.favorites.delete(e.id); else state.favorites.add(e.id);
    renderExerciseDetail();
  });
  document.getElementById('addToWorkout').addEventListener('click', (ev) => {
    state.customWorkout.push(e.id);
    ev.target.textContent = 'Added ✓';
    setTimeout(() => { if (document.getElementById('addToWorkout')) document.getElementById('addToWorkout').textContent = 'Add to Workout'; }, 1200);
  });
  document.getElementById('startSolo').addEventListener('click', () => {
    startPlayer({ name: e.name, level: e.difficulty, time: Math.round((e.workSec+e.restSec)/60)||1, items: [{...e, phase:'Main'}] });
  });

  const host = document.getElementById('viewerHost');
  state.viewerCleanup && state.viewerCleanup();
  const v = createViewer(host, e);
  state.viewerCleanup = v.cleanup;
  root().querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => v.setView(b.dataset.view)));
}

/* ============ WORKOUT TAB ============ */
function renderWorkoutTab(){
  disposeViewer();
  const wk = state.todaysWorkout || generateWorkout(state.profile);
  state.todaysWorkout = wk;
  const custom = state.customWorkout.map(getExercise).filter(Boolean);

  const content = `
    <div class="workout-tab">
      <button class="ai-banner" id="openAI">${ICONS.sparkle} Ask AI for a Workout <span class="ai-banner-sub">"20 min arms, no equipment"</span></button>

      <div class="section-label">Today's Plan</div>
      <div class="today-card small">
        <div class="today-name">${wk.name}</div>
        <div class="today-meta">${wk.time} min · ${wk.level} · ${wk.items.length} exercises</div>
        <button class="btn primary full" id="startTodayTab">${ICONS.play} Start Workout</button>
      </div>
      <div class="plan-list">
        ${wk.items.map((it,i) => `
          <div class="plan-item" data-id="${it.id}">
            <span class="plan-index">${i+1}</span>
            <div class="plan-info">
              <div class="plan-name">${it.name}</div>
              <div class="plan-meta">${it.phase} · ${it.timed ? it.workSec+'s' : it.sets+'×'+it.reps}</div>
            </div>
          </div>`).join('')}
      </div>

      ${custom.length ? `
        <div class="section-label">My Custom Workout (${custom.length})</div>
        <div class="excard-grid">${custom.map(exerciseCardHTML).join('')}</div>
        <button class="btn ghost full" id="startCustom">${ICONS.play} Start Custom Workout</button>
      ` : ''}
    </div>`;

  root().innerHTML = shellHTML(content, 'workoutTab');
  bindShellNav();
  document.getElementById('openAI').addEventListener('click', () => { state.view = 'aiGenerator'; render(); });
  root().querySelectorAll('.plan-item').forEach(p => p.addEventListener('click', () => openExercise(p.dataset.id)));
  document.getElementById('startTodayTab').addEventListener('click', () => startPlayer(wk));
  const startCustomBtn = document.getElementById('startCustom');
  if (startCustomBtn) startCustomBtn.addEventListener('click', () => {
    startPlayer({ name: 'My Custom Workout', level: state.profile.level||'Beginner', time: Math.round(custom.reduce((s,e)=>s+e.workSec+e.restSec,0)/60), items: custom.map(e=>({...e, phase:'Main'})) });
  });
  if (custom.length) {
    root().querySelectorAll('.excard').forEach(c => c.addEventListener('click', () => openExercise(c.dataset.id)));
  }
}

/* ============ WORKOUT PLAYER ============ */
function startPlayer(workout){
  disposeViewer();
  state.player = { workout, index: 0, phase: 'work', secondsLeft: workout.items[0].workSec, paused: false, timerId: null };
  state.view = 'player';
  renderPlayer();
  runPlayerTimer();
}

function currentPlayerItem(){ return state.player.workout.items[state.player.index]; }

function renderPlayer(){
  disposeViewer();
  const pl = state.player;
  const item = currentPlayerItem();
  const total = pl.workout.items.length;
  const isRest = pl.phase === 'rest';
  const nextItem = pl.workout.items[pl.index+1];

  root().innerHTML = `
    <div class="player ${isRest?'is-rest':''}">
      <div class="player-top">
        <button class="iconbtn" id="closePlayer">${ICONS.close}</button>
        <div class="player-progress-label">${pl.index+1} / ${total}</div>
        <span class="iconbtn spacer"></span>
      </div>

      ${isRest ? `
        <div class="rest-screen">
          <div class="rest-label">REST</div>
          <div class="rest-timer" id="timerText">${fmtTime(pl.secondsLeft)}</div>
          ${nextItem ? `<div class="rest-next">Next: <strong>${nextItem.name}</strong></div>` : ''}
        </div>
      ` : `
        <div class="viewer-wrap player-viewer">
          <div class="viewer" id="viewerHost"></div>
        </div>
        <div class="player-info">
          <div class="player-phase">${item.phase}</div>
          <div class="player-name">${item.name}</div>
          <div class="player-timer" id="timerText">${item.timed ? fmtTime(pl.secondsLeft) : item.sets+' × '+item.reps}</div>
          <div class="progressbar"><div class="progressbar-fill" id="barFill" style="width:${100*(1-pl.secondsLeft/item.workSec)}%"></div></div>
          ${nextItem ? `<div class="player-next">Next: ${nextItem.name}</div>` : '<div class="player-next">Last exercise</div>'}
        </div>
      `}

      <div class="player-controls">
        <button class="btn ghost" id="pauseBtn">${pl.paused ? ICONS.play+' Resume' : ICONS.pause+' Pause'}</button>
        <button class="btn primary" id="skipMain">${ICONS.skip} Skip</button>
      </div>
    </div>`;

  document.getElementById('closePlayer').addEventListener('click', () => { stopPlayerTimer(); disposeViewer(); goTab(state.tab); });
  document.getElementById('skipMain').addEventListener('click', () => { stopPlayerTimer(); advancePlayerPhase(); });
  document.getElementById('pauseBtn').addEventListener('click', togglePause);

  if (!isRest) {
    const host = document.getElementById('viewerHost');
    const v = createViewer(host, item);
    state.viewerCleanup = v.cleanup;
  }
}

function togglePause(){
  const pl = state.player;
  pl.paused = !pl.paused;
  if (pl.paused) stopPlayerTimer(); else runPlayerTimer();
  const btn = document.getElementById('pauseBtn');
  if (btn) btn.innerHTML = pl.paused ? ICONS.play+' Resume' : ICONS.pause+' Pause';
}

function runPlayerTimer(){
  stopPlayerTimer();
  const pl = state.player;
  pl.timerId = setInterval(() => {
    pl.secondsLeft -= 1;
    updatePlayerTick();
    if (pl.secondsLeft <= 0) { stopPlayerTimer(); advancePlayerPhase(); }
  }, 1000);
}

function updatePlayerTick(){
  const pl = state.player;
  const item = currentPlayerItem();
  const timerEl = document.getElementById('timerText');
  if (timerEl && (pl.phase === 'rest' || item.timed)) timerEl.textContent = fmtTime(Math.max(0,pl.secondsLeft));
  const bar = document.getElementById('barFill');
  if (bar) {
    const denom = pl.phase === 'rest' ? item.restSec : item.workSec;
    bar.style.width = (100 * (1 - Math.max(0,pl.secondsLeft) / denom)) + '%';
  }
}

function advancePlayerPhase(){
  const pl = state.player;
  const item = currentPlayerItem();
  if (pl.phase === 'work') {
    if (pl.index >= pl.workout.items.length - 1) { finishWorkout(); return; }
    if (item.restSec > 0) {
      pl.phase = 'rest';
      pl.secondsLeft = item.restSec;
      renderPlayer();
      runPlayerTimer();
      return;
    }
    pl.index += 1;
    pl.phase = 'work';
    pl.secondsLeft = currentPlayerItem().workSec;
    renderPlayer();
    runPlayerTimer();
  } else {
    pl.index += 1;
    if (pl.index >= pl.workout.items.length) { finishWorkout(); return; }
    pl.phase = 'work';
    pl.secondsLeft = currentPlayerItem().workSec;
    renderPlayer();
    runPlayerTimer();
  }
}

function finishWorkout(){
  disposeViewer();
  const wk = state.player.workout;
  const summary = workoutSummary(wk);
  state.progress.workouts += 1;
  state.progress.minutes += summary.minutes;
  state.progress.exercises += summary.exercises;
  state.progress.streak += 1;
  state.lastSummary = { name: wk.name, ...summary };
  state.player = null;
  state.view = 'summary';
  API.logWorkout({ name: wk.name, type: 'workout', goal: state.profile.goal || null, ...summary });
  renderSummary();
}

/* ============ SUMMARY ============ */
function renderSummary(){
  disposeViewer();
  const s = state.lastSummary;
  root().innerHTML = `
    <div class="summary">
      <div class="summary-check">${ICONS.check}</div>
      <h1>Workout Complete</h1>
      <div class="summary-name">${s.name}</div>
      <div class="summary-stats">
        <div><div class="stat-big">${s.minutes}</div><div class="stat-label">Minutes</div></div>
        <div><div class="stat-big">${s.exercises}</div><div class="stat-label">Exercises</div></div>
        <div><div class="stat-big">${s.calories}</div><div class="stat-label">Calories</div></div>
      </div>
      <button class="btn primary full" id="doneBtn">Done</button>
    </div>`;
  document.getElementById('doneBtn').addEventListener('click', () => goTab('home'));
}

/* ============ AI WORKOUT GENERATOR ============ */
const AI_EXAMPLES = [
  "20 min arms, no equipment",
  "quick abs workout",
  "beginner fat loss, 15 minutes",
  "advanced chest with dumbbells",
];

function renderAIGenerator(){
  disposeViewer();
  const ai = state.aiResult || null;

  root().innerHTML = `
    <div class="ai-screen">
      <div class="admin-top">
        <button class="iconbtn" id="aiBack">${ICONS.back}</button>
        <div class="admin-title">${ICONS.sparkle} AI Workout Generator</div>
        <span class="iconbtn spacer"></span>
      </div>

      <div class="ai-body">
        <p class="ai-intro">Describe what you want in plain language. The AI only picks from our validated exercise database — it never invents exercises.</p>
        <textarea class="field-input ai-input" id="aiInput" rows="2" placeholder="e.g. I have 20 minutes and want to train arms">${escAttr(state.aiQuery||'')}</textarea>
        <div class="chip-row wrap ai-examples">
          ${AI_EXAMPLES.map(ex => `<button class="chip small" data-example="${escAttr(ex)}">${ex}</button>`).join('')}
        </div>
        <button class="btn primary full" id="aiGenerateBtn">${ICONS.sparkle} Generate Workout</button>

        ${ai ? `
          <div class="ai-result">
            <div class="ai-result-head">
              <div class="ai-result-title">${WORKOUT_NAMES[ai.effGoal] || ai.name}</div>
              <div class="ai-result-meta">${ai.time} min · ${ai.level} · ${ai.items.length} exercises</div>
            </div>
            <div class="plan-list">
              ${ai.items.map((it,i) => `
                <div class="plan-item" data-id="${it.id}">
                  <span class="plan-index">${i+1}</span>
                  <div class="plan-info">
                    <div class="plan-name">${it.name}</div>
                    <div class="plan-meta">${it.phase} · ${it.timed ? it.workSec+'s' : it.sets+'×'+it.reps}</div>
                  </div>
                </div>`).join('')}
            </div>
            <button class="btn primary full" id="aiStartBtn">${ICONS.play} Start This Workout</button>
          </div>
        ` : ''}
      </div>
    </div>`;

  document.getElementById('aiBack').addEventListener('click', () => { state.view = 'workoutTab'; state.tab = 'workoutTab'; render(); });
  root().querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => {
    state.aiQuery = b.dataset.example;
    renderAIGenerator();
  }));
  document.getElementById('aiInput').addEventListener('input', (e) => { state.aiQuery = e.target.value; });
  document.getElementById('aiGenerateBtn').addEventListener('click', () => {
    const text = (document.getElementById('aiInput').value || '').trim();
    if (!text) return;
    state.aiQuery = text;
    state.aiResult = generateAIWorkout(text, state.profile);
    renderAIGenerator();
  });
  root().querySelectorAll('.plan-item').forEach(p => p.addEventListener('click', () => openExercise(p.dataset.id)));
  const startBtn = document.getElementById('aiStartBtn');
  if (startBtn) startBtn.addEventListener('click', () => startPlayer(state.aiResult));
}

/* ============ BOXING MODE ============ */
function startBoxing(){
  disposeViewer();
  state.boxing = { round: 1, totalRounds: 3, phase: 'work', secondsLeft: 30, restSeconds: 15, paused: false, timerId: null, comboTimerId: null, currentCombo: null };
  state.view = 'boxing';
  renderBoxing();
  runBoxingTimer();
  startComboLoop();
}

function stopBoxingTimer(){ if (state.boxing && state.boxing.timerId) { clearInterval(state.boxing.timerId); state.boxing.timerId = null; } }
function stopComboLoop(){ if (state.boxing && state.boxing.comboTimerId) { clearInterval(state.boxing.comboTimerId); state.boxing.comboTimerId = null; } }

function runBoxingTimer(){
  stopBoxingTimer();
  const bx = state.boxing;
  bx.timerId = setInterval(() => {
    bx.secondsLeft -= 1;
    updateBoxingTick();
    if (bx.secondsLeft <= 0) { stopBoxingTimer(); stopComboLoop(); advanceBoxingPhase(); }
  }, 1000);
}

function startComboLoop(){
  stopComboLoop();
  const bx = state.boxing;
  playNextCombo();
  bx.comboTimerId = setInterval(playNextCombo, 2000);
}

function playNextCombo(){
  const bx = state.boxing;
  if (!bx || bx.phase !== 'work') return;
  const combo = randomCombo();
  bx.currentCombo = combo;
  const label = document.getElementById('comboText');
  if (label) {
    label.textContent = comboText(combo);
    label.classList.remove('flash'); void label.offsetWidth; label.classList.add('flash');
  }
  if (state.viewerCleanup && state.boxingViewer) combo.forEach(n => state.boxingViewer.queuePunch(n));
}

function updateBoxingTick(){
  const bx = state.boxing;
  const timerEl = document.getElementById('boxTimer');
  if (timerEl) timerEl.textContent = fmtTime(Math.max(0, bx.secondsLeft));
  const bar = document.getElementById('boxBarFill');
  if (bar) {
    const denom = bx.phase === 'rest' ? bx.restSeconds : 30;
    bar.style.width = (100 * (1 - Math.max(0,bx.secondsLeft) / denom)) + '%';
  }
}

function advanceBoxingPhase(){
  const bx = state.boxing;
  if (bx.phase === 'work') {
    if (bx.round >= bx.totalRounds) { finishBoxing(); return; }
    bx.phase = 'rest';
    bx.secondsLeft = bx.restSeconds;
    renderBoxing();
    runBoxingTimer();
  } else {
    bx.round += 1;
    bx.phase = 'work';
    bx.secondsLeft = 30;
    renderBoxing();
    runBoxingTimer();
    startComboLoop();
  }
}

function toggleBoxingPause(){
  const bx = state.boxing;
  bx.paused = !bx.paused;
  if (bx.paused) { stopBoxingTimer(); stopComboLoop(); }
  else { runBoxingTimer(); if (bx.phase === 'work') startComboLoop(); }
  const btn = document.getElementById('boxPauseBtn');
  if (btn) btn.innerHTML = bx.paused ? ICONS.play+' Resume' : ICONS.pause+' Pause';
}

function finishBoxing(){
  stopBoxingTimer(); stopComboLoop(); disposeViewer();
  const bx = state.boxing;
  const minutes = Math.round(bx.totalRounds * (30 + bx.restSeconds) / 60) || 1;
  state.progress.workouts += 1;
  state.progress.minutes += minutes;
  state.progress.exercises += bx.totalRounds;
  state.progress.streak += 1;
  state.progress.boxingCompleted += 1;
  state.lastSummary = { name: 'Shadow Boxing', minutes, calories: bx.totalRounds * 9, exercises: bx.totalRounds };
  state.boxing = null;
  state.view = 'summary';
  API.logWorkout({ name: 'Shadow Boxing', type: 'boxing', goal: 'Boxing', minutes, calories: bx.totalRounds * 9, exercises: bx.totalRounds });
  renderSummary();
}

function renderBoxing(){
  disposeViewer();
  const bx = state.boxing;
  const isRest = bx.phase === 'rest';

  root().innerHTML = `
    <div class="boxing-screen ${isRest?'is-rest':''}">
      <div class="player-top">
        <button class="iconbtn" id="closeBoxing">${ICONS.close}</button>
        <div class="player-progress-label">ROUND ${bx.round} / ${bx.totalRounds}</div>
        <span class="iconbtn spacer"></span>
      </div>

      ${isRest ? `
        <div class="rest-screen">
          <div class="rest-label">REST</div>
          <div class="rest-timer boxing-accent" id="boxTimer">${fmtTime(bx.secondsLeft)}</div>
          <div class="rest-next">Round <strong>${bx.round+1}</strong> coming up</div>
        </div>
      ` : `
        <div class="viewer-wrap player-viewer boxing-viewer">
          <div class="viewer" id="viewerHost"></div>
        </div>
        <div class="player-info">
          <div class="boxing-timer" id="boxTimer">${fmtTime(bx.secondsLeft)}</div>
          <div class="progressbar"><div class="progressbar-fill boxing-fill" id="boxBarFill" style="width:0%"></div></div>
          <div class="combo-label">CURRENT COMBO</div>
          <div class="combo-text" id="comboText">—</div>
        </div>
      `}

      <div class="player-controls">
        <button class="btn ghost" id="boxPauseBtn">${bx.paused ? ICONS.play+' Resume' : ICONS.pause+' Pause'}</button>
        <button class="btn boxing" id="boxSkip">${ICONS.skip} ${isRest ? 'Skip Rest' : 'End Round'}</button>
      </div>
    </div>`;

  document.getElementById('closeBoxing').addEventListener('click', () => { stopBoxingTimer(); stopComboLoop(); disposeViewer(); state.boxing = null; goTab(state.tab); });
  document.getElementById('boxPauseBtn').addEventListener('click', toggleBoxingPause);
  document.getElementById('boxSkip').addEventListener('click', () => { stopBoxingTimer(); stopComboLoop(); advanceBoxingPhase(); });

  if (!isRest) {
    const host = document.getElementById('viewerHost');
    const v = createViewer(host, getExercise('EX25'));
    state.viewerCleanup = v.cleanup;
    state.boxingViewer = v;
  }
}

/* ============ ME / PROFILE ============ */
function renderMe(){
  disposeViewer();
  const p = state.profile;
  const pr = state.progress;
  const favs = [...state.favorites].map(getExercise).filter(Boolean);
  const isOnline = state.auth.mode === 'online';
  const plan = isOnline && state.auth.user.plan === 'pro' ? PLANS.pro : PLANS.free;

  const content = `
    <div class="me">
      <div class="account-card">
        <div class="account-row">
          <div class="account-who">
            ${ICONS.user}
            <div>
              <div class="account-name">${isOnline ? state.auth.user.name : 'Guest'}</div>
              <div class="account-sub">${isOnline ? state.auth.user.email : (state.backendAvailable ? 'Not signed in' : 'Local-only mode (no backend configured)')}</div>
            </div>
          </div>
          <div class="plan-chip ${plan.id==='pro'?'pro':''}">${plan.id==='pro'?ICONS.crown:''} ${plan.label}</div>
        </div>
        <div class="account-actions">
          ${isOnline
            ? `<button class="btn ghost" id="logoutBtn">${ICONS.logout} Log Out</button>`
            : `<button class="btn ghost" id="loginBtn">${ICONS.user} Log In / Sign Up</button>`}
          ${plan.id==='pro'
            ? `<button class="btn ghost" id="manageBillingBtn">Manage Billing</button>`
            : `<button class="btn primary" id="upgradeBtn">${ICONS.crown} Upgrade to Pro</button>`}
        </div>
      </div>

      <div class="section-label">This Week</div>
      <div class="stat-grid">
        <div class="stat-card">${ICONS.workout}<div class="stat-big">${pr.workouts}</div><div class="stat-label">Workouts</div></div>
        <div class="stat-card">${ICONS.clock}<div class="stat-big">${pr.minutes}</div><div class="stat-label">Minutes</div></div>
        <div class="stat-card">${ICONS.target}<div class="stat-big">${pr.exercises}</div><div class="stat-label">Exercises</div></div>
        <div class="stat-card">${ICONS.flame}<div class="stat-big">${pr.streak}</div><div class="stat-label">Streak</div></div>
      </div>

      <div class="section-label">Level &amp; Badges</div>
      <div class="level-card">
        <div class="level-row">
          <div class="level-badge">${ICONS.star} LEVEL ${getLevel()}</div>
          <div class="level-xp">${getXPIntoLevel()} / 150 XP</div>
        </div>
        <div class="progressbar"><div class="progressbar-fill" style="width:${(getXPIntoLevel()/150*100).toFixed(0)}%"></div></div>
      </div>
      <div class="badge-grid">
        ${getBadges().map(b => `
          <div class="badge-tile ${b.achieved?'earned':''}">
            <div class="badge-tile-icon">${b.icon}</div>
            <div class="badge-tile-label">${b.label}</div>
          </div>`).join('')}
      </div>

      <div class="section-label">Profile</div>
      <div class="profile-card">
        <div class="profile-row"><span>Goal</span><strong>${GOALS.find(g=>g.id===p.goal)?.label||'—'}</strong></div>
        <div class="profile-row"><span>Fitness Level</span><strong>${p.level||'—'}</strong></div>
        <div class="profile-row"><span>Location</span><strong>${p.location||'—'}</strong></div>
        <div class="profile-row"><span>Equipment</span><strong>${(p.equipment||[]).join(', ')||'—'}</strong></div>
        <div class="profile-row"><span>Session Time</span><strong>${p.time||'—'} min</strong></div>
        ${p.weight?`<div class="profile-row"><span>Weight</span><strong>${p.weight} kg</strong></div>`:''}
        ${p.height?`<div class="profile-row"><span>Height</span><strong>${p.height} cm</strong></div>`:''}
        <button class="btn ghost full" id="editProfile">Edit Profile</button>
      </div>

      ${favs.length ? `<div class="section-label">Favorites</div><div class="excard-grid">${favs.map(exerciseCardHTML).join('')}</div>` : ''}

      <div class="section-label">Manage</div>
      <button class="admin-link" id="openAdmin">${ICONS.admin} Admin Panel <span class="admin-link-sub">Manage exercises &amp; content</span></button>
      ${isOnline && state.auth.user.role === 'admin' ? `<a class="admin-link" href="admin.html" target="_blank" rel="noopener" style="margin-top:8px">${ICONS.target} Analytics Dashboard <span class="admin-link-sub">Users, revenue &amp; engagement</span></a>` : ''}
    </div>`;

  root().innerHTML = shellHTML(content, 'me');
  bindShellNav();
  bindExerciseCards();
  document.getElementById('editProfile').addEventListener('click', () => { state.onboardStep = 0; state.view = 'onboarding'; render(); });
  document.getElementById('openAdmin').addEventListener('click', () => { state.view = 'admin'; render(); });
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', () => { state.view = 'auth'; render(); });
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { API.logout(); renderMe(); });
  const upgradeBtn = document.getElementById('upgradeBtn');
  if (upgradeBtn) upgradeBtn.addEventListener('click', () => { state.view = 'pricing'; render(); });
  const manageBillingBtn = document.getElementById('manageBillingBtn');
  if (manageBillingBtn) manageBillingBtn.addEventListener('click', () => { API.billingPortal().catch(err => alert(err.message)); });
}

/* ============ AUTH ============ */
function renderAuth(){
  disposeViewer();
  let mode = 'login';

  function paint(){
    root().innerHTML = `
      <div class="auth-screen">
        <div class="admin-top">
          <button class="iconbtn" id="authBack">${ICONS.back}</button>
          <div class="admin-title">${ICONS.user} ${mode === 'login' ? 'Log In' : 'Sign Up'}</div>
          <span class="iconbtn spacer"></span>
        </div>
        <div class="auth-body">
          ${!state.backendAvailable ? `<div class="auth-note">No backend is configured, so accounts can't be created yet. Set <code>window.FIT3D_API_BASE</code> in index.html and deploy backend/ — see the README.</div>` : ''}
          ${mode === 'signup' ? `<label class="field-label">Name</label><input class="field-input" id="authName" placeholder="Your name"/>` : ''}
          <label class="field-label">Email</label>
          <input class="field-input" id="authEmail" type="email" placeholder="you@example.com"/>
          <label class="field-label">Password</label>
          <input class="field-input" id="authPassword" type="password" placeholder="••••••••"/>
          <div class="auth-error" id="authError"></div>
          <button class="btn primary full" id="authSubmit" ${!state.backendAvailable?'disabled':''}>${mode === 'login' ? 'Log In' : 'Create Account'}</button>
          <button class="btn ghost full" id="authSwitch">${mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}</button>
        </div>
      </div>`;

    document.getElementById('authBack').addEventListener('click', () => goTab('me'));
    document.getElementById('authSwitch').addEventListener('click', () => { mode = mode === 'login' ? 'signup' : 'login'; paint(); });
    document.getElementById('authSubmit').addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const errEl = document.getElementById('authError');
      errEl.textContent = '';
      try {
        if (mode === 'signup') {
          const name = document.getElementById('authName').value.trim();
          if (!name || !email || !password) throw new Error('Please fill in every field.');
          await API.register(name, email, password);
        } else {
          if (!email || !password) throw new Error('Please fill in every field.');
          await API.login(email, password);
        }
        goTab('me');
      } catch (e) {
        errEl.textContent = e.message || 'Something went wrong.';
      }
    });
  }
  paint();
}

/* ============ PRICING ============ */
function renderPricing(){
  disposeViewer();
  const isPro = state.auth.mode === 'online' && state.auth.user.plan === 'pro';

  root().innerHTML = `
    <div class="pricing-screen">
      <div class="admin-top">
        <button class="iconbtn" id="pricingBack">${ICONS.back}</button>
        <div class="admin-title">${ICONS.crown} Upgrade</div>
        <span class="iconbtn spacer"></span>
      </div>
      <div class="pricing-body">
        <div class="plan-grid">
          ${Object.values(PLANS).map(pl => `
            <div class="plan-card ${pl.id==='pro'?'pro':''}">
              <div class="plan-card-name">${pl.id==='pro'?ICONS.crown:''} ${pl.label}</div>
              <div class="plan-card-price">${pl.price}<span>${pl.period}</span></div>
              <ul class="plan-card-features">
                ${pl.features.map(f => `<li>${ICONS.check} ${f}</li>`).join('')}
              </ul>
              ${pl.id === 'pro'
                ? (isPro ? `<button class="btn ghost full" disabled>Current Plan</button>` : `<button class="btn primary full" id="checkoutBtn">Upgrade to Pro</button>`)
                : `<button class="btn ghost full" disabled>${isPro ? 'Included' : 'Current Plan'}</button>`}
            </div>`).join('')}
        </div>
        <p class="pricing-note">Payments are processed by Stripe in test mode via the backend in this repo. No card is charged unless you deploy backend/ with real Stripe keys.</p>
      </div>
    </div>`;

  document.getElementById('pricingBack').addEventListener('click', () => goTab('me'));
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', async () => {
    if (state.auth.mode !== 'online') { state.view = 'auth'; render(); return; }
    try { await API.createCheckoutSession('pro'); }
    catch (e) { alert(e.message); }
  });
}

/* ============ ADMIN PANEL ============ */
const ADMIN_BODYPARTS = ['Full Body','Core','Arms','Chest','Back','Shoulders','Legs'];
const ADMIN_EQUIPMENT = ['Bodyweight','Dumbbell','Barbell','Band'];

function renderAdmin(){
  disposeViewer();
  const goalCounts = {};
  GOALS.forEach(g => goalCounts[g.id] = EXERCISES.filter(e => e.goal.includes(g.id)).length);
  const topGoal = Object.keys(goalCounts).sort((a,b)=>goalCounts[b]-goalCounts[a])[0];

  root().innerHTML = `
    <div class="admin">
      <div class="admin-top">
        <button class="iconbtn" id="adminBack">${ICONS.back}</button>
        <div class="admin-title">${ICONS.admin} Admin Panel</div>
        <span class="iconbtn spacer"></span>
      </div>

      <div class="stat-grid admin-stats">
        <div class="stat-card"><div class="stat-big">${EXERCISES.length}</div><div class="stat-label">Exercises</div></div>
        <div class="stat-card"><div class="stat-big">${GOALS.length}</div><div class="stat-label">Goals</div></div>
        <div class="stat-card"><div class="stat-big">${Object.keys(MUSCLE_LABELS).length}</div><div class="stat-label">Muscles</div></div>
        <div class="stat-card"><div class="stat-big" style="font-size:16px">${GOALS.find(g=>g.id===topGoal)?.label||'—'}</div><div class="stat-label">Top Goal</div></div>
      </div>

      <div class="admin-section-head">
        <div class="section-label" style="margin:0;padding:0">Exercises</div>
        <button class="btn primary small" id="addExerciseBtn">${ICONS.plus} Add Exercise</button>
      </div>

      <div class="admin-list">
        ${EXERCISES.map(e => `
          <div class="admin-row">
            <div class="admin-row-info">
              <div class="admin-row-name">${e.name}</div>
              <div class="admin-row-meta">${e.id} · ${MUSCLE_LABELS[e.primary]} · ${e.difficulty} · ${e.equipment.join('/')}</div>
            </div>
            <div class="admin-row-actions">
              <button class="iconbtn small" data-edit="${e.id}">${ICONS.edit}</button>
              <button class="iconbtn small danger" data-del="${e.id}">${ICONS.trash}</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  document.getElementById('adminBack').addEventListener('click', () => goTab('me'));
  document.getElementById('addExerciseBtn').addEventListener('click', () => { state.adminEditId = null; state.view = 'adminForm'; render(); });
  root().querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => { state.adminEditId = b.dataset.edit; state.view = 'adminForm'; render(); }));
  root().querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (confirm('Delete this exercise? This cannot be undone.')) {
      deleteExercise(b.dataset.del);
      API.syncExercise('delete', { id: b.dataset.del });
      state.favorites.delete(b.dataset.del);
      state.customWorkout = state.customWorkout.filter(id => id !== b.dataset.del);
      renderAdmin();
    }
  }));
}

function renderAdminForm(){
  disposeViewer();
  const editing = state.adminEditId ? getExercise(state.adminEditId) : null;
  const d = editing || { name:'', goal:[], bodyPart:'Full Body', primary:'chest', secondary:[], equipment:['Bodyweight'], difficulty:'Beginner', timed:false, workSec:30, restSec:30, sets:3, reps:10, calories:5, instructions:'' };

  root().innerHTML = `
    <div class="admin">
      <div class="admin-top">
        <button class="iconbtn" id="formBack">${ICONS.back}</button>
        <div class="admin-title">${editing ? 'Edit Exercise' : 'Add Exercise'}</div>
        <span class="iconbtn spacer"></span>
      </div>

      <div class="admin-form">
        <label class="field-label">Exercise Name</label>
        <input class="field-input" id="fName" value="${escAttr(d.name)}" placeholder="e.g. Incline Dumbbell Curl"/>

        <label class="field-label">Goal (select any)</label>
        <div class="chip-row wrap">
          ${GOALS.map(g => `<button class="chip ${d.goal.includes(g.id)?'on':''}" data-fgoal="${g.id}">${g.icon} ${g.label}</button>`).join('')}
        </div>

        <label class="field-label">Body Part</label>
        <select class="field-input" id="fBodyPart">
          ${ADMIN_BODYPARTS.map(b => `<option value="${b}" ${d.bodyPart===b?'selected':''}>${b}</option>`).join('')}
        </select>

        <label class="field-label">Primary Muscle</label>
        <select class="field-input" id="fPrimary">
          ${Object.keys(MUSCLE_LABELS).map(m => `<option value="${m}" ${d.primary===m?'selected':''}>${MUSCLE_LABELS[m]}</option>`).join('')}
        </select>

        <label class="field-label">Secondary Muscles</label>
        <div class="chip-row wrap">
          ${Object.keys(MUSCLE_LABELS).map(m => `<button class="chip small ${d.secondary.includes(m)?'on':''}" data-fsec="${m}">${MUSCLE_LABELS[m]}</button>`).join('')}
        </div>

        <label class="field-label">Equipment</label>
        <div class="chip-row wrap">
          ${ADMIN_EQUIPMENT.map(eq => `<button class="chip ${d.equipment.includes(eq)?'on':''}" data-feq="${eq}">${eq}</button>`).join('')}
        </div>

        <label class="field-label">Difficulty</label>
        <select class="field-input" id="fDifficulty">
          ${['Beginner','Intermediate','Advanced'].map(x => `<option value="${x}" ${d.difficulty===x?'selected':''}>${x}</option>`).join('')}
        </select>

        <label class="field-label toggle-row"><input type="checkbox" id="fTimed" ${d.timed?'checked':''}/> Timed exercise (e.g. plank, boxing round)</label>

        <div class="field-row" id="repFields" style="${d.timed?'display:none':''}">
          <div><label class="field-label">Sets</label><input class="field-input" type="number" id="fSets" value="${d.sets||3}" min="1"/></div>
          <div><label class="field-label">Reps</label><input class="field-input" type="number" id="fReps" value="${d.reps||10}" min="1"/></div>
        </div>
        <div class="field-row" id="timeFields" style="${d.timed?'':'display:none'}">
          <div><label class="field-label">Work (sec)</label><input class="field-input" type="number" id="fWorkSec" value="${d.workSec||30}" min="5"/></div>
        </div>
        <div class="field-row">
          <div><label class="field-label">Rest (sec)</label><input class="field-input" type="number" id="fRestSec" value="${d.restSec||30}" min="0"/></div>
          <div><label class="field-label">Calories (est.)</label><input class="field-input" type="number" id="fCalories" value="${d.calories||5}" min="1"/></div>
        </div>

        <label class="field-label">Instructions</label>
        <textarea class="field-input" id="fInstructions" rows="3" placeholder="Short cue on how to perform the movement...">${d.instructions}</textarea>

        <label class="field-label">3D Model / Animation / Thumbnail</label>
        <div class="upload-row">
          <div class="upload-slot">${ICONS.admin}<span>model.glb</span></div>
          <div class="upload-slot">${ICONS.admin}<span>animation.glb</span></div>
          <div class="upload-slot">${ICONS.admin}<span>thumbnail.webp</span></div>
        </div>
        <div class="upload-note">This demo highlights new exercises on the shared procedural 3D model automatically via the primary/secondary muscle mapping above — real GLB/animation uploads plug in here later without changing this form.</div>

        <button class="btn primary full" id="publishBtn">${ICONS.check} ${editing ? 'Save Changes' : 'Publish'}</button>
      </div>
    </div>`;

  const formState = { goal: [...d.goal], secondary: [...d.secondary], equipment: [...d.equipment] };

  document.getElementById('formBack').addEventListener('click', () => { state.view = 'admin'; render(); });
  root().querySelectorAll('[data-fgoal]').forEach(b => b.addEventListener('click', () => {
    const g = b.dataset.fgoal; const i = formState.goal.indexOf(g);
    if (i>=0) formState.goal.splice(i,1); else formState.goal.push(g);
    b.classList.toggle('on');
  }));
  root().querySelectorAll('[data-fsec]').forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.fsec; const i = formState.secondary.indexOf(m);
    if (i>=0) formState.secondary.splice(i,1); else formState.secondary.push(m);
    b.classList.toggle('on');
  }));
  root().querySelectorAll('[data-feq]').forEach(b => b.addEventListener('click', () => {
    const eq = b.dataset.feq; const i = formState.equipment.indexOf(eq);
    if (i>=0) formState.equipment.splice(i,1); else formState.equipment.push(eq);
    b.classList.toggle('on');
  }));
  document.getElementById('fTimed').addEventListener('change', (e) => {
    document.getElementById('repFields').style.display = e.target.checked ? 'none' : '';
    document.getElementById('timeFields').style.display = e.target.checked ? '' : 'none';
  });

  document.getElementById('publishBtn').addEventListener('click', () => {
    const name = document.getElementById('fName').value.trim();
    if (!name) { document.getElementById('fName').focus(); return; }
    const payload = {
      name,
      goal: formState.goal.length ? formState.goal : ['FatLoss'],
      bodyPart: document.getElementById('fBodyPart').value,
      primary: document.getElementById('fPrimary').value,
      secondary: formState.secondary,
      equipment: formState.equipment,
      difficulty: document.getElementById('fDifficulty').value,
      timed: document.getElementById('fTimed').checked,
      workSec: Number(document.getElementById('fWorkSec').value) || null,
      restSec: Number(document.getElementById('fRestSec').value) || 30,
      sets: Number(document.getElementById('fSets').value) || 3,
      reps: Number(document.getElementById('fReps').value) || 10,
      calories: Number(document.getElementById('fCalories').value) || 5,
      instructions: document.getElementById('fInstructions').value.trim(),
    };
    if (editing) { updateExercise(editing.id, payload); API.syncExercise('update', getExercise(editing.id)); }
    else { const created = addExercise(payload); API.syncExercise('create', created); }
    state.view = 'admin';
    render();
  });
}

/* ============ INIT ============ */
async function init(){
     root().innerHTML = `<div class="boot-screen">${ICONS.target}<div class="boot-name">FIT3D</div><div class="boot-msg">Loading...</div></div>`;
  try { await API.init(); } catch (e) { /* fall back to fully local/offline mode */ }
  render();
}
