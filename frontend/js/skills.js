'use strict';

/**
 * skills.js
 * Fetches and renders skill groups from the backend API.
 */

const API_BASE = 'http://localhost:5000';

/**
 * Maps a proficiency string to a CSS modifier class.
 *
 * @param {string} proficiency
 * @returns {string}
 */
function proficiencyClass(proficiency) {
  switch ((proficiency || '').toLowerCase()) {
    case 'expert':       return 'proficiency-badge--expert';
    case 'intermediate': return 'proficiency-badge--intermediate';
    default:             return 'proficiency-badge--beginner';
  }
}

/**
 * Groups an array of skill objects by their `category` field.
 *
 * @param {Array<{name:string, category:string, proficiency:string}>} skills
 * @returns {Object.<string, Array>}  keys = category names, values = skill arrays
 */
function groupByCategory(skills) {
  return skills.reduce(function (acc, skill) {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

/**
 * Renders all skill categories into #skills-container.
 * Produces one container div per distinct category with flex-wrapped skill tags.
 *
 * @param {Array<{name:string, category:string, proficiency:string}>} skills
 * @returns {void}
 */
function renderSkillsSection(skills) {
  const container = document.getElementById('skills-container');
  if (!container) return;

  /* Clear any previous content (loading text, prior render) */
  container.innerHTML = '';

  if (!Array.isArray(skills) || skills.length === 0) {
    container.innerHTML = '<p class="loading-text">No skills to display yet.</p>';
    return;
  }

  const grouped = groupByCategory(skills);

  Object.keys(grouped).forEach(function (category) {
    const categorySkills = grouped[category];

    /* Category wrapper */
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skills-category fade-in';
    categoryDiv.setAttribute('aria-label', category + ' skills');

    /* Category heading */
    const heading = document.createElement('h3');
    heading.className = 'skills-category-title';
    heading.textContent = category;
    categoryDiv.appendChild(heading);

    /* Skills tag container */
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'skills-tags';
    tagsDiv.setAttribute('role', 'list');

    categorySkills.forEach(function (skill) {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.setAttribute('role', 'listitem');

      /* Skill name */
      const nameSpan = document.createElement('span');
      nameSpan.textContent = skill.name;
      tag.appendChild(nameSpan);

      /* Proficiency badge */
      if (skill.proficiency) {
        const badge = document.createElement('span');
        badge.className = 'proficiency-badge ' + proficiencyClass(skill.proficiency);
        badge.textContent = skill.proficiency;
        badge.setAttribute('aria-label', skill.proficiency + ' proficiency');
        tag.appendChild(badge);
      }

      tagsDiv.appendChild(tag);
    });

    categoryDiv.appendChild(tagsDiv);
    container.appendChild(categoryDiv);
  });
}

/* ── Static fallback data ── */
const STATIC_SKILLS = [
  { name: 'Java',                      category: 'Programming Languages', proficiency: 'Expert' },
  { name: 'JavaScript',                category: 'Programming Languages', proficiency: 'Intermediate' },
  { name: 'SQL',                       category: 'Programming Languages', proficiency: 'Intermediate' },
  { name: 'HTML5',                     category: 'Frontend',              proficiency: 'Expert' },
  { name: 'CSS3',                      category: 'Frontend',              proficiency: 'Expert' },
  { name: 'Responsive Web Design',     category: 'Frontend',              proficiency: 'Intermediate' },
  { name: 'Spring Boot',               category: 'Backend',               proficiency: 'Expert' },
  { name: 'Node.js',                   category: 'Backend',               proficiency: 'Intermediate' },
  { name: 'Express.js',                category: 'Backend',               proficiency: 'Intermediate' },
  { name: 'REST API Development',      category: 'Backend',               proficiency: 'Expert' },
  { name: 'MySQL',                     category: 'Database',              proficiency: 'Expert' },
  { name: 'AI Applications',           category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Speech Recognition',        category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Adaptive Learning Systems', category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Progress Tracking Systems', category: 'AI & Machine Learning', proficiency: 'Intermediate' },
  { name: 'Git',                       category: 'Tools & Platforms',     proficiency: 'Expert' },
  { name: 'GitHub',                    category: 'Tools & Platforms',     proficiency: 'Expert' },
  { name: 'VS Code',                   category: 'Tools & Platforms',     proficiency: 'Expert' },
  { name: 'IntelliJ IDEA',             category: 'Tools & Platforms',     proficiency: 'Expert' },
  { name: 'Object-Oriented Programming', category: 'Core Computer Science', proficiency: 'Expert' },
  { name: 'Data Structures',           category: 'Core Computer Science', proficiency: 'Intermediate' },
  { name: 'DBMS',                      category: 'Core Computer Science', proficiency: 'Intermediate' },
  { name: 'Problem Solving',           category: 'Core Computer Science', proficiency: 'Expert' },
  { name: 'Analytical Thinking',       category: 'Core Computer Science', proficiency: 'Expert' },
];

/* ── Render immediately on DOMContentLoaded, then try API ── */
document.addEventListener('DOMContentLoaded', function () {
  const loadingEl = document.getElementById('skills-loading');
  if (loadingEl) loadingEl.remove();

  // Render static data right away — no waiting
  renderSkillsSection(STATIC_SKILLS);

  // Silently refresh from API if backend is running
  fetch(API_BASE + '/api/skills')
    .then(function (response) {
      if (!response.ok) throw new Error('Not OK');
      return response.json();
    })
    .then(function (skills) {
      if (Array.isArray(skills) && skills.length) {
        renderSkillsSection(skills);
      }
    })
    .catch(function () { /* backend not running — static data already shown */ });
});

/* Export for unit/property testing in Node environments */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderSkillsSection, groupByCategory, proficiencyClass };
}
