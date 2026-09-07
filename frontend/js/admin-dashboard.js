/* ============================================================
   admin-dashboard.js — standalone analytics page logic.
   Deliberately independent from js/ui.js so this page has no
   dependency on the SPA's render loop. Shares the same
   FIT3D_API_BASE config and localStorage token as the main app.
   ============================================================ */

const DASH_BASE = (window.FIT3D_API_BASE || '').replace(/\/$/, '');
const DASH_TOKEN_KEY = 'fit3d_token';
const ACCENT = '#5EEAD4';
const BOXING = '#A78BFA';
const CORAL = '#FF5D5D';
const GRID = 'rgba(255,255,255,0.06)';
const TEXT_DIM = '#8A93A6';

Chart.defaults.color = TEXT_DIM;
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = GRID;

async function dashFetch(path){
  if (!DASH_BASE) throw new Error('no-backend');
  const token = localStorage.getItem(DASH_TOKEN_KEY);
  const headers = token ? { Authorization: 'Bearer ' + token } : {};
  const res = await fetch(DASH_BASE + path, { headers });
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res.json();
}

function banner(msg){
  const el = document.getElementById('dashBanner');
  el.textContent = msg;
  el.style.display = 'block';
}

function demoStats(){
  const days = [...Array(14)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });
  return {
    kpis: { totalUsers: 1284, totalWorkouts: 9531, mrr: 1823, activeSubs: 228 },
    workoutsByDay: { labels: days, values: [42,55,48,61,58,70,64,59,66,72,68,75,80,77] },
    goalPopularity: { labels: ['Fat Loss','Abs','Arms','Chest','Back','Shoulders','Legs','Boxing','Mobility'], values: [312,201,178,165,140,120,190,160,110] },
    planSplit: { free: 1056, pro: 228 },
    revenueByMonth: { labels: ['Mar','Apr','May','Jun','Jul','Aug'], values: [980,1140,1350,1500,1690,1823] },
    recentUsers: [
      { name: 'Sahil Verma', email: 'sahil@example.com', plan: 'pro', joined: '2026-08-02', workouts: 34 },
      { name: 'Priya Nair', email: 'priya@example.com', plan: 'free', joined: '2026-08-10', workouts: 12 },
      { name: 'Marcus Lee', email: 'marcus@example.com', plan: 'pro', joined: '2026-07-28', workouts: 61 },
      { name: 'Ana Torres', email: 'ana@example.com', plan: 'free', joined: '2026-08-18', workouts: 5 },
      { name: 'Devon Clarke', email: 'devon@example.com', plan: 'free', joined: '2026-08-21', workouts: 2 },
    ],
    topExercises: [
      { name: 'Bodyweight Squat', goal: 'Legs', count: 812 },
      { name: 'Push Up', goal: 'Chest', count: 764 },
      { name: 'Plank', goal: 'Abs', count: 701 },
      { name: 'Jumping Jacks', goal: 'Fat Loss', count: 655 },
      { name: 'Dumbbell Bicep Curl', goal: 'Arms', count: 588 },
    ],
    isDemo: true,
  };
}

function renderKPIs(k){
  const cards = [
    { label: 'Total Users', value: k.totalUsers.toLocaleString() },
    { label: 'Workouts Completed', value: k.totalWorkouts.toLocaleString() },
    { label: 'MRR (est.)', value: '$' + k.mrr.toLocaleString() },
    { label: 'Active Subscriptions', value: k.activeSubs.toLocaleString() },
  ];
  document.getElementById('kpiGrid').innerHTML = cards.map(c => `
    <div class="kpi-card"><div class="kpi-value">${c.value}</div><div class="kpi-label">${c.label}</div></div>
  `).join('');
}

function renderCharts(d){
  new Chart(document.getElementById('workoutsChart'), {
    type: 'line',
    data: { labels: d.workoutsByDay.labels, datasets: [{ data: d.workoutsByDay.values, borderColor: ACCENT, backgroundColor: 'rgba(94,234,212,0.12)', fill: true, tension: 0.35, pointRadius: 0, borderWidth: 2 }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID }, beginAtZero: true } } },
  });

  new Chart(document.getElementById('goalsChart'), {
    type: 'bar',
    data: { labels: d.goalPopularity.labels, datasets: [{ data: d.goalPopularity.values, backgroundColor: ACCENT, borderRadius: 6, maxBarThickness: 26 }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 60, minRotation: 40 } }, y: { grid: { color: GRID }, beginAtZero: true } } },
  });

  new Chart(document.getElementById('planChart'), {
    type: 'doughnut',
    data: { labels: ['Free', 'Pro'], datasets: [{ data: [d.planSplit.free, d.planSplit.pro], backgroundColor: ['#1B2233', BOXING], borderColor: '#0B0E14', borderWidth: 3 }] },
    options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 16 } } }, cutout: '68%' },
  });

  new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: { labels: d.revenueByMonth.labels, datasets: [{ data: d.revenueByMonth.values, backgroundColor: CORAL, borderRadius: 6, maxBarThickness: 34 }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: GRID }, beginAtZero: true, ticks: { callback: v => '$' + v } } } },
  });
}

function renderTables(d){
  document.getElementById('usersTbody').innerHTML = d.recentUsers.map(u => `
    <tr>
      <td>${u.name}</td>
      <td class="dim">${u.email}</td>
      <td><span class="plan-tag ${u.plan}">${u.plan}</span></td>
      <td class="dim">${u.joined}</td>
      <td>${u.workouts}</td>
    </tr>`).join('');

  document.getElementById('exercisesTbody').innerHTML = d.topExercises.map((e, i) => `
    <tr><td class="dim">${i + 1}</td><td>${e.name}</td><td class="dim">${e.goal}</td><td>${e.count.toLocaleString()}</td></tr>
  `).join('');
}

async function boot(){
  let data;
  try {
    data = await dashFetch('/admin/stats');
  } catch (e) {
    data = demoStats();
    if (!DASH_BASE) {
      banner('No backend configured — showing demo data. Set window.FIT3D_API_BASE and deploy backend/ to see live analytics.');
    } else {
      banner('Could not load live data (not signed in as an admin, or the backend is unreachable) — showing demo data.');
    }
  }
  renderKPIs(data.kpis);
  renderCharts(data);
  renderTables(data);
}

boot();
