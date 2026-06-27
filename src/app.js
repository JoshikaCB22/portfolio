'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');

const app = express();

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
