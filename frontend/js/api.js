/* ============================================================
   api.js — the bridge between the static frontend and the
   optional backend/ (Express) API.

   Design goal: this app must run perfectly with NO backend at
   all (pure static hosting, e.g. GitHub Pages) using the data
   already loaded from data.js. If a backend IS deployed and
   reachable, this file upgrades the app in place: real
   auth, real payments, server-persisted workout history, and
   admin analytics become available — without any other file
   needing to know which mode it's in.

   Configure the backend URL by editing window.FIT3D_API_BASE
   in index.html, or leave it blank to run fully offline/local.
   ============================================================ */

const API = (() => {
  const BASE = (window.FIT3D_API_BASE || '').replace(/\/$/, '');
  const TOKEN_KEY = 'fit3d_token';

  function getToken(){ return localStorage.getItem(TOKEN_KEY); }
  function setToken(t){ if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); }

  async function request(path, opts = {}){
    if (!BASE) throw new Error('no-backend-configured');
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;
    const res = await fetch(BASE + path, Object.assign({}, opts, { headers }));
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const body = isJson ? await res.json().catch(() => null) : null;
    if (!res.ok) throw new Error((body && body.error) || ('Request failed: ' + res.status));
    return body;
  }

  async function init(){
    if (!BASE) { state.backendAvailable = false; return; }
    try {
      await request('/health');
      state.backendAvailable = true;
    } catch (e) {
      state.backendAvailable = false;
      return;
    }
    // Pull live exercises and swap them into the shared EXERCISES binding in place,
    // so every existing function that reads EXERCISES (generateWorkout, getExercise, ...)
    // picks up live data with zero changes.
    try {
      const remote = await request('/exercises');
      if (Array.isArray(remote) && remote.length) {
        EXERCISES.length = 0;
        remote.forEach(e => EXERCISES.push(e));
      }
    } catch (e) { /* keep local fallback dataset */ }

    // Restore session if a token is already stored.
    const token = getToken();
    if (token) {
      try {
        const me = await request('/auth/me');
        state.auth = { mode: 'online', token, user: me.user };
      } catch (e) {
        setToken(null);
      }
    }
  }

  async function register(name, email, password){
    const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    setToken(data.token);
    state.auth = { mode: 'online', token: data.token, user: data.user };
    return data.user;
  }

  async function login(email, password){
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token);
    state.auth = { mode: 'online', token: data.token, user: data.user };
    return data.user;
  }

  function logout(){
    setToken(null);
    state.auth = { mode: 'guest', token: null, user: null };
  }

  async function createCheckoutSession(planId){
    if (!state.backendAvailable) throw new Error('Payments require the backend to be deployed and configured. See README → Payments.');
    const data = await request('/payments/create-checkout-session', { method: 'POST', body: JSON.stringify({ planId }) });
    if (data && data.url) window.location.href = data.url;
    return data;
  }

  async function billingPortal(){
    const data = await request('/payments/portal', { method: 'POST' });
    if (data && data.url) window.location.href = data.url;
  }

  function logWorkout(summary){
    if (!state.backendAvailable || state.auth.mode !== 'online') return;
    request('/workouts/log', { method: 'POST', body: JSON.stringify(summary) }).catch(() => {});
  }

  function syncExercise(action, payload){
    if (!state.backendAvailable || !state.auth.user || state.auth.user.role !== 'admin') return;
    if (action === 'create') request('/exercises', { method: 'POST', body: JSON.stringify(payload) }).catch(() => {});
    if (action === 'update') request('/exercises/' + payload.id, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => {});
    if (action === 'delete') request('/exercises/' + payload.id, { method: 'DELETE' }).catch(() => {});
  }

  async function getAdminStats(){
    return request('/admin/stats');
  }

  async function getAdminUsers(page = 1){
    return request('/admin/users?page=' + page);
  }

  return { init, register, login, logout, createCheckoutSession, billingPortal, logWorkout, syncExercise, getAdminStats, getAdminUsers, getToken };
})();
