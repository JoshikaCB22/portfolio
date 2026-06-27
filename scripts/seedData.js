'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const Skill = require('../src/models/Skill');
const Project = require('../src/models/Project');

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SKILLS = [
  // Programming Languages
  { name: 'Java', category: 'Programming Languages', proficiency: 'Expert' },
  { name: 'JavaScript', category: 'Programming Languages', proficiency: 'Intermediate' },
  { name: 'SQL', category: 'Programming Languages', proficiency: 'Intermediate' },

  // Frontend
  { name: 'HTML5', category: 'Frontend', proficiency: 'Expert' },
  { name: 'CSS3', category: 'Frontend', proficiency: 'Expert' },
  { name: 'JavaScript', category: 'Frontend', proficiency: 'Intermediate' },
  { name: 'Responsive Web Design', category: 'Frontend', proficiency: 'Intermediate' },

  // Backend
  { name: 'Spring Boot', category: 'Backend', proficiency: 'Expert' },
  { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' },
  { name: 'Express.js', category: 'Backend', proficiency: 'Intermediate' },
  { name: 'REST API Development', category: 'Backend', proficiency: 'Expert' },

  // Database
  { name: 'MySQL', category: 'Database', proficiency: 'Expert' },

  // AI & Machine Learning
  { name: 'AI Applications', category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Speech Recognition', category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Adaptive Learning Systems', category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Progress Tracking Systems', category: 'AI & Machine Learning', proficiency: 'Intermediate' },

  // Tools & Platforms
  { name: 'Git', category: 'Tools & Platforms', proficiency: 'Expert' },
  { name: 'GitHub', category: 'Tools & Platforms', proficiency: 'Expert' },
  { name: 'VS Code', category: 'Tools & Platforms', proficiency: 'Expert' },
  { name: 'IntelliJ IDEA', category: 'Tools & Platforms', proficiency: 'Expert' },

  // Core Computer Science
  { name: 'Object-Oriented Programming', category: 'Core Computer Science', proficiency: 'Expert' },
  { name: 'Data Structures', category: 'Core Computer Science', proficiency: 'Intermediate' },
  { name: 'DBMS', category: 'Core Computer Science', proficiency: 'Intermediate' },
  { name: 'Problem Solving', category: 'Core Computer Science', proficiency: 'Expert' },
  { name: 'Analytical Thinking', category: 'Core Computer Science', proficiency: 'Expert' },
];

const PROJECTS = [
  {
    title: 'Intelligent Speech Therapy Platform',
    description:
      'AI-powered speech therapy platform that helps users improve pronunciation through adaptive speech exercises and personalized progress tracking. Backend built with Spring Boot with integrated speech analysis for real-time feedback.',
    tech_stack: [
      'Spring Boot',
      'Java',
      'HTML',
      'CSS',
      'JavaScript',
      'MySQL',
      'AI',
      'Speech Recognition',
    ],
    repo_url: 'https://github.com/JoshikaCB22/speechhh',
    demo_url: '',
    image_url: '',
  },
  {
    title: 'Gate Pass Management System',
    description:
      'Web-based gate pass management system that automates student outpass approval workflow. Supports multiple user roles — students, HODs, counselors, and wardens — with secure authentication and role-based approvals.',
    tech_stack: [
      'Node.js',
      'Express.js',
      'MySQL',
      'HTML',
      'CSS',
      'JavaScript',
      'EJS',
    ],
    repo_url: 'https://github.com/JoshikaCB22/Gate-pass-Management-System',
    demo_url: '',
    image_url: '',
  },
  {
    title: 'PrepMaster',
    description:
      'Placement preparation platform providing aptitude practice, coding questions, interview preparation resources, and learning materials through an organized dashboard.',
    tech_stack: ['Spring Boot', 'Java', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    repo_url: 'https://github.com/JoshikaCB22/Prepmaster',
    demo_url: '',
    image_url: '',
  },
  {
    title: 'Shopping Cart System',
    description:
      'Shopping cart application demonstrating core OOP principles — encapsulation, inheritance, abstraction, and polymorphism — managing products, customers, and orders.',
    tech_stack: ['Java', 'OOP Concepts'],
    repo_url: 'https://github.com/JoshikaCB22/Shopping-cart-system',
    demo_url: '',
    image_url: '',
  },
  {
    title: 'Recipe Management REST API',
    description:
      'RESTful API built with Spring Boot for creating, updating, retrieving, and deleting recipes. Implements full CRUD operations with MySQL database integration following REST architecture principles.',
    tech_stack: ['Spring Boot', 'Java', 'REST API', 'MySQL'],
    repo_url: 'https://github.com/JoshikaCB22/Recipes',
    demo_url: '',
    image_url: '',
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function seedData() {
  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI must be set in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await Skill.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing skills and projects.');

    // Insert skills
    const insertedSkills = await Skill.insertMany(SKILLS);
    console.log(`Inserted ${insertedSkills.length} skills.`);

    // Insert projects
    const insertedProjects = await Project.insertMany(PROJECTS);
    console.log(`Inserted ${insertedProjects.length} projects.`);

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedData();
