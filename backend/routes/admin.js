const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const PRO_PRICE = 7.99;
const GOAL_LABELS = { FatLoss: 'Fat Loss', Abs: 'Abs', Arms: 'Arms', Chest: 'Chest', Back: 'Back', Shoulders: 'Shoulders', Legs: 'Legs', Boxing: 'Boxing', Mobility: 'Mobility' };

router.get('/stats', requireAuth, requireAdmin, (req, res) => {
  const users = db.listUsers();
  const logs = db.listAllWorkouts();
  const exercises = db.listExercises();

  const proUsers = users.filter(u => u.plan === 'pro');
  const kpis = {
    totalUsers: users.length,
    totalWorkouts: logs.length,
    mrr: Math.round(proUsers.length * PRO_PRICE),
    activeSubs: proUsers.length,
  };

  // Workouts logged per day, last 14 days.
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const perDay = {};
  days.forEach(d => { perDay[d] = 0; });
  logs.forEach(l => { const day = (l.createdAt || '').slice(0, 10); if (day in perDay) perDay[day]++; });
  const workoutsByDay = {
    labels: days.map(d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    values: days.map(d => perDay[d]),
  };

  // Goal popularity — based on the optional `goal` tag clients send with each logged workout.
  const goalCounts = {};
  logs.forEach(l => { const g = l.goal || 'FatLoss'; goalCounts[g] = (goalCounts[g] || 0) + 1; });
  const goalPopularity = {
    labels: Object.keys(GOAL_LABELS).map(g => GOAL_LABELS[g]),
    values: Object.keys(GOAL_LABELS).map(g => goalCounts[g] || 0),
  };

  const planSplit = { free: users.length - proUsers.length, pro: proUsers.length };

  // Revenue estimate: cumulative Pro sign-ups by month × plan price. An approximation —
  // a real deployment would sum actual Stripe invoice totals instead.
  const monthsBack = 6;
  const monthKeys = [], monthLabels = [];
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
    monthLabels.push(d.toLocaleDateString(undefined, { month: 'short' }));
  }
  const revenueByMonth = {
    labels: monthLabels,
    values: monthKeys.map(mk => {
      const cutoff = new Date(mk + '-28');
      const count = proUsers.filter(u => new Date(u.createdAt) <= cutoff).length;
      return Math.round(count * PRO_PRICE);
    }),
  };

  const recentUsers = users.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map(u => ({
      name: u.name, email: u.email, plan: u.plan,
      joined: (u.createdAt || '').slice(0, 10),
      workouts: logs.filter(l => l.userId === u.id).length,
    }));

  // Exercise popularity proxied through the goal(s) of workouts logged against it —
  // per-exercise logging isn't tracked at this MVP data granularity (see README).
  const topExercises = exercises.map(e => ({
    name: e.name,
    goal: GOAL_LABELS[e.goal[0]] || e.goal[0],
    count: e.goal.reduce((sum, g) => sum + (goalCounts[g] || 0), 0),
  })).sort((a, b) => b.count - a.count).slice(0, 8);

  res.json({ kpis, workoutsByDay, goalPopularity, planSplit, revenueByMonth, recentUsers, topExercises, isDemo: false });
});

router.get('/users', requireAuth, requireAdmin, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = 20;
  const users = db.listUsers().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const start = (page - 1) * pageSize;
  res.json({
    page, pageSize, total: users.length,
    users: users.slice(start, start + pageSize).map(u => ({ id: u.id, name: u.name, email: u.email, plan: u.plan, role: u.role, createdAt: u.createdAt })),
  });
});

router.patch('/users/:id', requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const patch = {};
  if (req.body.role) patch.role = req.body.role;
  if (req.body.plan) patch.plan = req.body.plan;
  const updated = db.updateUser(id, patch);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ id: updated.id, name: updated.name, email: updated.email, plan: updated.plan, role: updated.role });
});

module.exports = router;
