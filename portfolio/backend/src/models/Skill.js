'use strict';

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Expert'],
  },
});

module.exports = mongoose.model('Skill', skillSchema);
