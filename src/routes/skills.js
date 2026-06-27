'use strict';

const express = require('express');
const Skill = require('../models/Skill');
const authMiddleware = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/skills
 * Returns all skills (public endpoint).
 */
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    return res.status(200).json(skills);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/skills
 * Protected: requires JWT.
 * Creates a new skill. Requires name, category, and proficiency.
 */
router.post(
  '/',
  authMiddleware,
  requireFields('name', 'category', 'proficiency'),
  async (req, res) => {
    try {
      const { name, category, proficiency } = req.body;

      const skill = await Skill.create({ name, category, proficiency });
      return res.status(201).json(skill);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const firstError = Object.values(err.errors)[0];
        return res.status(400).json({ error: firstError.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * PUT /api/skills/:id
 * Protected: requires JWT.
 * Updates an existing skill by ID, or 404 if not found.
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(skill);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/skills/:id
 * Protected: requires JWT.
 * Deletes a skill by ID, or 404 if not found.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
