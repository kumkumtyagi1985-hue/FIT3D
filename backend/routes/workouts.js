const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { generateWorkout } = require('../utils/workoutGenerator');

const router = express.Router();

router.post('/generate', (req, res) => {
  const profile = req.body || {};
  const workout = generateWorkout(db.listExercises(), profile, { time: profile.time });
  res.json(workout);
});

router.post('/log', requireAuth, (req, res) => {
  const { name, type, minutes, calories, exercises, goal } = req.body || {};
  if (!name || minutes == null) return res.status(400).json({ error: 'name and minutes are required' });
  const entry = db.logWorkout(req.user.id, { name, type: type || 'workout', minutes, calories: calories || 0, exercises: exercises || 0, goal: goal || null });
  res.status(201).json(entry);
});

router.get('/history', requireAuth, (req, res) => {
  res.json(db.listWorkoutsForUser(req.user.id));
});

module.exports = router;
