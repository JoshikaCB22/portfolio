'use strict';

/**
 * admin-dashboard.js
 * Admin dashboard: fetch/render/create/delete projects and skills
 * with JWT-authenticated API requests.
 */

const API_BASE = 'http://localhost:5000';
const TOKEN_KEY = 'portfolio_admin_token';

/* ── Auth guard — redirect to login if token absent ── */
const token = localStorage.getItem(TOKEN_KEY);
if (!token) {
  window.location.href = 'login.html';
}

/* ── Helpers ── */

/**
 * Returns the stored JWT token.
 * @returns {string}
 */
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

/**
 * Builds the Authorization header object.
 * @returns {Object}
 */
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken(),
  };
}

/**
 * Shows a status message in a feedback element.
 *
 * @param {string}              elementId
 * @param {string}              text
 * @param {'success'|'error'}   type
 */
function showStatus(elementId, text, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className = 'form-feedback form-feedback--' + type;
  el.hidden = false;
  /* Auto-clear success messages after 4 s */
  if (type === 'success') {
    setTimeout(function () {
      el.hidden = true;
    }, 4000);
  }
}

/** Escapes text so it is safe to insert as HTML content. */
function esc(str) {
  const div = document.createElement('div');
  div.textContent = String(str == null ? '' : str);
  return div.innerHTML;
}

/* ══════════════════════════════════════════════
   PROJECTS
   ══════════════════════════════════════════════ */

/**
 * Fetches all projects and renders them in a table.
 */
function loadProjects() {
  const wrapper = document.getElementById('projects-table-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '<p class="loading-text">Loading projects…</p>';

  fetch(API_BASE + '/api/projects')
    .then(function (res) { return res.json(); })
    .then(function (projects) {
      if (!Array.isArray(projects) || projects.length === 0) {
        wrapper.innerHTML = '<p class="loading-text">No projects yet. Add one below.</p>';
        return;
      }

      const table = document.createElement('table');
      table.className = 'data-table';
      table.setAttribute('aria-label', 'Projects list');

      table.innerHTML =
        '<thead>' +
          '<tr>' +
            '<th scope="col">Title</th>' +
            '<th scope="col">Description</th>' +
            '<th scope="col">Tech Stack</th>' +
            '<th scope="col">Repo</th>' +
            '<th scope="col">Demo</th>' +
            '<th scope="col">Actions</th>' +
          '</tr>' +
        '</thead>';

      const tbody = document.createElement('tbody');

      projects.forEach(function (project) {
        const row = document.createElement('tr');

        const techDisplay = Array.isArray(project.tech_stack)
          ? project.tech_stack.join(', ')
          : (project.tech_stack || '');

        row.innerHTML =
          '<td>' + esc(project.title) + '</td>' +
          '<td style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="' + esc(project.description) + '">' + esc(project.description) + '</td>' +
          '<td>' + esc(techDisplay) + '</td>' +
          '<td>' + (project.repo_url ? '<a href="' + esc(project.repo_url) + '" target="_blank" rel="noopener noreferrer" class="nav-link" style="color:var(--color-primary)">Link</a>' : '—') + '</td>' +
          '<td>' + (project.demo_url ? '<a href="' + esc(project.demo_url) + '" target="_blank" rel="noopener noreferrer" class="nav-link" style="color:var(--color-primary)">Link</a>' : '—') + '</td>' +
          '<td></td>';

        /* Delete button */
        const id = project._id || project.id;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn--outline btn--sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', 'Delete project: ' + project.title);
        deleteBtn.addEventListener('click', function () {
          deleteProject(id, project.title);
        });

        row.querySelector('td:last-child').appendChild(deleteBtn);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      wrapper.innerHTML = '';
      wrapper.appendChild(table);
    })
    .catch(function () {
      wrapper.innerHTML = '<p class="error-text">Could not load projects.</p>';
    });
}

/**
 * Deletes a project by ID.
 *
 * @param {string} id
 * @param {string} title — used for confirmation prompt
 */
function deleteProject(id, title) {
  if (!confirm('Delete project "' + title + '"? This cannot be undone.')) return;

  fetch(API_BASE + '/api/projects/' + id, {
    method: 'DELETE',
    headers: authHeaders(),
  })
    .then(function (res) {
      if (res.ok) {
        showStatus('dashboard-status', 'Project deleted successfully.', 'success');
        loadProjects();
      } else {
        return res.json().then(function (body) {
          showStatus('dashboard-status', body.error || 'Failed to delete project.', 'error');
        });
      }
    })
    .catch(function () {
      showStatus('dashboard-status', 'Network error. Could not delete project.', 'error');
    });
}

/** Handles Add Project form submission. */
function setupAddProjectForm() {
  const form = document.getElementById('add-project-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Adding…'; }

    const techRaw = form.elements['tech_stack'].value.trim();
    const techArr = techRaw
      ? techRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
      : [];

    const payload = {
      title:       form.elements['title'].value.trim(),
      description: form.elements['description'].value.trim(),
      tech_stack:  techArr,
      repo_url:    form.elements['repo_url'].value.trim() || undefined,
      demo_url:    form.elements['demo_url'].value.trim() || undefined,
      image_url:   form.elements['image_url'].value.trim() || undefined,
    };

    fetch(API_BASE + '/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { status: res.status, body: body };
        });
      })
      .then(function (result) {
        if (result.status === 201 || result.status === 200) {
          showStatus('project-form-status', 'Project added successfully!', 'success');
          form.reset();
          loadProjects();
        } else {
          const msg = (result.body && (result.body.error || result.body.message)) || 'Failed to add project.';
          showStatus('project-form-status', msg, 'error');
        }
      })
      .catch(function () {
        showStatus('project-form-status', 'Network error. Could not add project.', 'error');
      })
      .finally(function () {
        if (addBtn) { addBtn.disabled = false; addBtn.textContent = 'Add Project'; }
      });
  });
}

/* ══════════════════════════════════════════════
   SKILLS
   ══════════════════════════════════════════════ */

/**
 * Fetches all skills and renders them in a table.
 */
function loadSkills() {
  const wrapper = document.getElementById('skills-table-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '<p class="loading-text">Loading skills…</p>';

  fetch(API_BASE + '/api/skills')
    .then(function (res) { return res.json(); })
    .then(function (skills) {
      if (!Array.isArray(skills) || skills.length === 0) {
        wrapper.innerHTML = '<p class="loading-text">No skills yet. Add one below.</p>';
        return;
      }

      const table = document.createElement('table');
      table.className = 'data-table';
      table.setAttribute('aria-label', 'Skills list');

      table.innerHTML =
        '<thead>' +
          '<tr>' +
            '<th scope="col">Name</th>' +
            '<th scope="col">Category</th>' +
            '<th scope="col">Proficiency</th>' +
            '<th scope="col">Actions</th>' +
          '</tr>' +
        '</thead>';

      const tbody = document.createElement('tbody');

      skills.forEach(function (skill) {
        const row = document.createElement('tr');
        row.innerHTML =
          '<td>' + esc(skill.name) + '</td>' +
          '<td>' + esc(skill.category) + '</td>' +
          '<td>' + esc(skill.proficiency) + '</td>' +
          '<td></td>';

        const id = skill._id || skill.id;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn--outline btn--sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', 'Delete skill: ' + skill.name);
        deleteBtn.addEventListener('click', function () {
          deleteSkill(id, skill.name);
        });

        row.querySelector('td:last-child').appendChild(deleteBtn);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      wrapper.innerHTML = '';
      wrapper.appendChild(table);
    })
    .catch(function () {
      wrapper.innerHTML = '<p class="error-text">Could not load skills.</p>';
    });
}

/**
 * Deletes a skill by ID.
 *
 * @param {string} id
 * @param {string} name
 */
function deleteSkill(id, name) {
  if (!confirm('Delete skill "' + name + '"? This cannot be undone.')) return;

  fetch(API_BASE + '/api/skills/' + id, {
    method: 'DELETE',
    headers: authHeaders(),
  })
    .then(function (res) {
      if (res.ok) {
        showStatus('dashboard-status', 'Skill deleted successfully.', 'success');
        loadSkills();
      } else {
        return res.json().then(function (body) {
          showStatus('dashboard-status', body.error || 'Failed to delete skill.', 'error');
        });
      }
    })
    .catch(function () {
      showStatus('dashboard-status', 'Network error. Could not delete skill.', 'error');
    });
}

/** Handles Add Skill form submission. */
function setupAddSkillForm() {
  const form = document.getElementById('add-skill-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const addBtn = document.getElementById('add-skill-btn');
    if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Adding…'; }

    const payload = {
      name:        form.elements['name'].value.trim(),
      category:    form.elements['category'].value.trim(),
      proficiency: form.elements['proficiency'].value,
    };

    fetch(API_BASE + '/api/skills', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { status: res.status, body: body };
        });
      })
      .then(function (result) {
        if (result.status === 201 || result.status === 200) {
          showStatus('skill-form-status', 'Skill added successfully!', 'success');
          form.reset();
          loadSkills();
        } else {
          const msg = (result.body && (result.body.error || result.body.message)) || 'Failed to add skill.';
          showStatus('skill-form-status', msg, 'error');
        }
      })
      .catch(function () {
        showStatus('skill-form-status', 'Network error. Could not add skill.', 'error');
      })
      .finally(function () {
        if (addBtn) { addBtn.disabled = false; addBtn.textContent = 'Add Skill'; }
      });
  });
}

/* ── Logout ── */
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'login.html';
  });
}

/* ── Bootstrap on DOM ready ── */
document.addEventListener('DOMContentLoaded', function () {
  loadProjects();
  loadSkills();
  setupAddProjectForm();
  setupAddSkillForm();
  setupLogout();
});
