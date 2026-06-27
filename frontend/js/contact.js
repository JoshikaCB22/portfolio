'use strict';

/**
 * contact.js
 * Client-side validation and form submission for the Contact section.
 */

const API_BASE = 'http://localhost:5000';

/** Regex for basic email validation */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the contact form data.
 *
 * @param {{ name: string, email: string, message: string }} data
 * @returns {Array<{ field: string, message: string }>}
 *   Empty array means all fields are valid.
 */
function validateContactForm(data) {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!data.email || data.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.message || data.message.trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  }

  return errors;
}

/* ── DOM helpers ── */

/**
 * Shows or clears the inline error for a given field.
 *
 * @param {string} field   - field name: 'name' | 'email' | 'message'
 * @param {string} message - error text; pass '' to clear
 */
function setFieldError(field, message) {
  const errorEl = document.getElementById(field + '-error');
  const inputEl = document.getElementById('contact-' + field);

  if (errorEl) {
    errorEl.textContent = message;
  }

  if (inputEl) {
    if (message) {
      inputEl.classList.add('input--error');
      inputEl.setAttribute('aria-invalid', 'true');
    } else {
      inputEl.classList.remove('input--error');
      inputEl.removeAttribute('aria-invalid');
    }
  }
}

/**
 * Clears all inline field errors.
 */
function clearErrors() {
  ['name', 'email', 'message'].forEach(function (f) {
    setFieldError(f, '');
  });
}

/**
 * Shows a top-level feedback banner (success or error).
 *
 * @param {string}  text
 * @param {'success'|'error'} type
 */
function showFeedback(text, type) {
  const el = document.getElementById('form-feedback');
  if (!el) return;
  el.textContent = text;
  el.className = 'form-feedback form-feedback--' + type;
  el.hidden = false;
}

/**
 * Hides the feedback banner.
 */
function hideFeedback() {
  const el = document.getElementById('form-feedback');
  if (el) {
    el.hidden = true;
    el.textContent = '';
    el.className = 'form-feedback';
  }
}

/* ── Form submit handler (browser only) ── */
if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    hideFeedback();
    clearErrors();

    const data = {
      name:    form.elements['name'].value,
      email:   form.elements['email'].value,
      message: form.elements['message'].value,
    };

    const errors = validateContactForm(data);

    if (errors.length > 0) {
      /* Show inline errors; do NOT call the API */
      errors.forEach(function (err) {
        setFieldError(err.field, err.message);
      });
      /* Focus the first errored field */
      const firstField = document.getElementById('contact-' + errors[0].field);
      if (firstField) firstField.focus();
      return;
    }

    /* Disable button while submitting */
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    fetch(API_BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    data.name.trim(),
        email:   data.email.trim(),
        message: data.message.trim(),
      }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json().then(function () {
            showFeedback(
              'Thanks for your message! I\'ll get back to you soon.',
              'success'
            );
            form.reset();
          });
        }
        /* Non-2xx: show API error without clearing form */
        return response.json().then(function (body) {
          const msg =
            (body && (body.error || body.message)) ||
            'Something went wrong. Please try again.';
          showFeedback(msg, 'error');
        }).catch(function () {
          showFeedback('Something went wrong. Please try again.', 'error');
        });
      })
      .catch(function () {
        /* Network error — do NOT clear the form */
        showFeedback(
          'Could not send your message. Please check your connection and try again.',
          'error'
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      });
  });
}); // DOMContentLoaded
} // typeof document !== 'undefined'

/* Export for unit/property testing in Node environments */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateContactForm };
}
