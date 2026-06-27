'use strict';

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tech_stack: {
    type: [String],
    default: [],
  },
  demo_url: {
    type: String,
    default: '',
  },
  repo_url: {
    type: String,
    default: '',
  },
  image_url: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
