/**
 * Unit tests for validateContactForm.
 */

'use strict';

const { validateContactForm } = require('../../frontend/js/contact');

describe('validateContactForm — unit tests', () => {

  test('all valid fields returns empty errors array', () => {
    const errors = validateContactForm({
      name:    'Joshika S',
      email:   'joshika@example.com',
      message: 'Hello, I would like to connect!',
    });
    expect(errors).toEqual([]);
  });

  test('missing name returns error mentioning name field', () => {
    const errors = validateContactForm({
      name:    '',
      email:   'joshika@example.com',
      message: 'Hello',
    });
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find(e => e.field === 'name');
    expect(nameError).toBeDefined();
    expect(nameError.message.toLowerCase()).toMatch(/name/);
  });

  test('whitespace-only name returns error mentioning name field', () => {
    const errors = validateContactForm({
      name:    '   ',
      email:   'joshika@example.com',
      message: 'Hello',
    });
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find(e => e.field === 'name');
    expect(nameError).toBeDefined();
  });

  test('missing email returns error mentioning email field', () => {
    const errors = validateContactForm({
      name:    'Joshika S',
      email:   '',
      message: 'Hello',
    });
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.message.toLowerCase()).toMatch(/email/);
  });

  test('malformed email returns error mentioning email field', () => {
    const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'no-at-sign'];
    invalidEmails.forEach(function (email) {
      const errors = validateContactForm({ name: 'Test', email, message: 'Hello' });
      const emailError = errors.find(e => e.field === 'email');
      expect(emailError).toBeDefined();
      expect(emailError.message.toLowerCase()).toMatch(/email/);
    });
  });

  test('missing message returns error mentioning message field', () => {
    const errors = validateContactForm({
      name:    'Joshika S',
      email:   'joshika@example.com',
      message: '',
    });
    expect(errors.length).toBeGreaterThan(0);
    const msgError = errors.find(e => e.field === 'message');
    expect(msgError).toBeDefined();
    expect(msgError.message.toLowerCase()).toMatch(/message/);
  });

  test('all fields empty returns three errors', () => {
    const errors = validateContactForm({ name: '', email: '', message: '' });
    expect(errors.length).toBe(3);
  });

  test('valid email addresses pass validation', () => {
    const validEmails = [
      'test@example.com',
      'user.name+tag@domain.co.uk',
      'admin@subdomain.example.org',
    ];
    validEmails.forEach(function (email) {
      const errors = validateContactForm({ name: 'Test', email, message: 'Hello' });
      const emailError = errors.find(e => e.field === 'email');
      expect(emailError).toBeUndefined();
    });
  });
});
