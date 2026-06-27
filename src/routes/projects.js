'use strict';

const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/projects
 * Returns all projects sorted by created_at descending.
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/projects/:id
 * Returns a single project by ID, or 404 if not found.
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(project);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/projects
 * Protected: requires JWT.
 * Creates a new project. Requires title and description.
 */
router.post(
  '/',
  authMiddleware,
  requireFields('title', 'description'),
  async (req, res) => {
    try {
      const { title, description, tech_stack, demo_url, repo_url, image_url } =
        req.body;

      const project = await Project.create({
        title,
        description,
        tech_stack: tech_stack || [],
        demo_url: demo_url || '',
        repo_url: repo_url || '',
        image_url: image_url || '',
      });

      return res.status(201).json(project);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * PUT /api/projects/:id
 * Protected: requires JWT.
 * Updates an existing project by ID, or 404 if not found.
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(project);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/projects/:id
 * Protected: requires JWT.
 * Deletes a project by ID, or 404 if not found.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
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
