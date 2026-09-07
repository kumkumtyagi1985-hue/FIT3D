const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.listExercises());
});

router.get('/:id', (req, res) => {
  const ex = db.listExercises().find(e => e.id === req.params.id);
  if (!ex) return res.status(404).json({ error: 'Exercise not found' });
  res.json(ex);
});

router.post('/', requireAuth, requireAdmin, (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.primary) return res.status(400).json({ error: 'name and primary muscle are required' });
  const nums = db.listExercises().map(e => parseInt((e.id.match(/\d+/) || ['0'])[0], 10)).filter(n => !isNaN(n));
  const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
  const id = body.id || ('EX' + String(nextNum).padStart(2, '0'));
  const created = db.createExercise(Object.assign({}, body, { id }));
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const updated = db.updateExercise(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Exercise not found' });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.deleteExercise(req.params.id);
  res.status(204).end();
});

module.exports = router;
