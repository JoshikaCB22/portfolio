'use strict';

/**
 * projects.js
 * Fetches and renders project cards from the backend API.
 */

const API_BASE = 'http://localhost:5000';

/**
 * Creates and returns a project card DOM element.
 *
 * @param {Object} project
 * @param {string}   project.title
 * @param {string}   project.description
 * @param {string[]} [project.tech_stack]
 * @param {string}   [project.image_url]
 * @param {string}   [project.demo_url]
 * @param {string}   [project.repo_url]
 * @returns {HTMLElement}
 */
function renderProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card fade-in';
  card.setAttribute('aria-label', `Project: ${project.title}`);

  /* ── Image ── */
  const img = document.createElement('img');
  img.className = 'project-card__image';
  img.alt = `Screenshot of ${project.title}`;
  img.loading = 'lazy';

  if (project.image_url) {
    img.src = project.image_url;
    img.onerror = function () {
      this.src = 'assets/placeholder.png';
      this.alt = 'Project image unavailable';
    };
  } else {
    img.src = 'assets/placeholder.png';
    img.alt = 'Project image unavailable';
  }

  card.appendChild(img);

  /* ── Body ── */
  const body = document.createElement('div');
  body.className = 'project-card__body';

  /* Title */
  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title;
  body.appendChild(title);

  /* Description */
  const desc = document.createElement('p');
  desc.className = 'project-card__description';
  desc.textContent = project.description;
  body.appendChild(desc);

  /* Tech stack tags */
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  if (techStack.length > 0) {
    const techContainer = document.createElement('div');
    techContainer.className = 'project-card__tech';
    techContainer.setAttribute('aria-label', 'Technologies used');

    techStack.forEach(function (tech) {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    body.appendChild(techContainer);
  }

  /* Links */
  const links = document.createElement('div');
  links.className = 'project-card__links';

  if (project.repo_url) {
    const repoBtn = document.createElement('a');
    repoBtn.href = project.repo_url;
    repoBtn.target = '_blank';
    repoBtn.rel = 'noopener noreferrer';
    repoBtn.className = 'btn btn--outline btn--sm';
    repoBtn.setAttribute('aria-label', `View GitHub repository for ${project.title}`);
    repoBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GitHub';
    links.appendChild(repoBtn);
  }

  if (project.demo_url) {
    const demoBtn = document.createElement('a');
    demoBtn.href = project.demo_url;
    demoBtn.target = '_blank';
    demoBtn.rel = 'noopener noreferrer';
    demoBtn.className = 'btn btn--primary btn--sm';
    demoBtn.setAttribute('aria-label', `View live demo of ${project.title}`);
    demoBtn.textContent = 'Live Demo';
    links.appendChild(demoBtn);
  }

  if (links.children.length > 0) {
    body.appendChild(links);
  }

  card.appendChild(body);

  return card;
}

/* ── Static fallback data ── */
const STATIC_PROJECTS = [
  {
    title: 'Intelligent Speech Therapy Platform',
    description: 'AI-powered speech therapy platform that helps users improve pronunciation through adaptive speech exercises and personalized progress tracking. Backend built with Spring Boot with integrated speech analysis for real-time feedback.',
    tech_stack: ['Spring Boot', 'Java', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'AI', 'Speech Recognition'],
    repo_url: 'https://github.com/JoshikaCB22/speechhh',
    demo_url: '',
    image_url: ''
  },
  {
    title: 'Gate Pass Management System',
    description: 'Web-based gate pass management system that automates student outpass approval workflow. Supports multiple user roles — students, HODs, counselors, and wardens — with secure authentication and role-based approvals.',
    tech_stack: ['Node.js', 'Express.js', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'EJS'],
    repo_url: 'https://github.com/JoshikaCB22/Gate-pass-Management-System',
    demo_url: '',
    image_url: ''
  },
  {
    title: 'PrepMaster',
    description: 'Placement preparation platform providing aptitude practice, coding questions, interview preparation resources, and learning materials through an organized dashboard.',
    tech_stack: ['Spring Boot', 'Java', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    repo_url: 'https://github.com/JoshikaCB22/Prepmaster',
    demo_url: '',
    image_url: ''
  },
  {
    title: 'Shopping Cart System',
    description: 'Shopping cart application demonstrating core OOP principles — encapsulation, inheritance, abstraction, and polymorphism — managing products, customers, and orders.',
    tech_stack: ['Java', 'OOP Concepts'],
    repo_url: 'https://github.com/JoshikaCB22/Shopping-cart-system',
    demo_url: '',
    image_url: ''
  },
  {
    title: 'Recipe Management REST API',
    description: 'RESTful API built with Spring Boot for creating, updating, retrieving, and deleting recipes. Implements full CRUD operations with MySQL database integration following REST architecture principles.',
    tech_stack: ['Spring Boot', 'Java', 'REST API', 'MySQL'],
    repo_url: 'https://github.com/JoshikaCB22/Recipes',
    demo_url: '',
    image_url: ''
  }
];

/* ── Render immediately on DOMContentLoaded, then try API ── */
document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const loadingEl = document.getElementById('projects-loading');
  if (loadingEl) loadingEl.remove();

  // Render static data right away — no waiting
  const fragment = document.createDocumentFragment();
  STATIC_PROJECTS.forEach(function (p) { fragment.appendChild(renderProjectCard(p)); });
  grid.appendChild(fragment);

  // Silently refresh from API if backend is running
  fetch(API_BASE + '/api/projects')
    .then(function (response) {
      if (!response.ok) throw new Error('Not OK');
      return response.json();
    })
    .then(function (projects) {
      if (Array.isArray(projects) && projects.length) {
        grid.innerHTML = '';
        const f = document.createDocumentFragment();
        projects.forEach(function (p) { f.appendChild(renderProjectCard(p)); });
        grid.appendChild(f);
      }
    })
    .catch(function () { /* backend not running — static data already shown */ });
});

/* Export for unit/property testing in Node environments */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderProjectCard };
}
