'use strict';

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tech_stack: {
    type: [String],
    default: [],
  },
  demo_url: {
    type: String,
  },
  repo_url: {
    type: String,
  },
  image_url: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
