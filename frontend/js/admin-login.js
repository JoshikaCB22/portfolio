'use strict';

/**
 * admin-login.js
 * Handles admin authentication — POSTs credentials to the API,
 * stores the JWT on success, and redirects to the dashboard.
 */

const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function () {
  /* If already authenticated, skip login page */
  if (localStorage.getItem('portfolio_admin_token')) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form    = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    /* Hide any previous error */
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }

    const email    = form.elements['email'].value.trim();
    const password = form.elements['password'].value;

    /* Basic client-side guard */
    if (!email || !password) {
      showError('Email and password are required.');
      return;
    }

    /* Disable button while submitting */
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in…';
    }

    fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(function (response) {
        return response.json().then(function (body) {
          return { status: response.status, body: body };
        });
      })
      .then(function (result) {
        if (result.status === 200 && result.body.token) {
          localStorage.setItem('portfolio_admin_token', result.body.token);
          window.location.href = 'dashboard.html';
        } else {
          const msg =
            (result.body && (result.body.error || result.body.message)) ||
            'Invalid credentials. Please try again.';
          showError(msg);
        }
      })
      .catch(function () {
        showError('Could not reach the server. Please try again later.');
      })
      .finally(function () {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Login';
        }
      });
  });

  /**
   * Displays an error message in the error banner.
   * @param {string} message
   */
  function showError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  }
});
