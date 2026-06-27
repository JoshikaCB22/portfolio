/**
 * Property-based tests for the contact form client-side validation (Property 6).
 *
 * // Feature: personal-portfolio, Property 6: Contact form rejects invalid input client-side
 */

'use strict';

const fc = require('fast-check');
const { validateContactForm } = require('../../frontend/js/contact');

// ─── Property 6: Contact form rejects invalid input client-side ───────────────
// For any submission where at least one of name, email, or message is empty,
// or email is in an invalid format, validateContactForm returns a non-empty
// errors array.
//
// Validates: Requirements 5.3

describe('Property 6 — Contact form client-side validation', () => {

  test(
    'returns errors when name is empty',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            name:    fc.constant(''),
            email:   fc.emailAddress(),
            message: fc.string({ minLength: 1 }),
          }),
          function (data) {
            const errors = validateContactForm(data);
            expect(errors.length).toBeGreaterThan(0);
            const nameErr = errors.find(e => e.field === 'name');
            expect(nameErr).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'returns errors when email is empty',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            name:    fc.string({ minLength: 1 }),
            email:   fc.constant(''),
            message: fc.string({ minLength: 1 }),
          }),
          function (data) {
            const errors = validateContactForm(data);
            expect(errors.length).toBeGreaterThan(0);
            const emailErr = errors.find(e => e.field === 'email');
            expect(emailErr).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'returns errors when message is empty',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            name:    fc.string({ minLength: 1 }),
            email:   fc.emailAddress(),
            message: fc.constant(''),
          }),
          function (data) {
            const errors = validateContactForm(data);
            expect(errors.length).toBeGreaterThan(0);
            const msgErr = errors.find(e => e.field === 'message');
            expect(msgErr).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'returns email error when email format is invalid',
    () => {
      // Generate clearly malformed email strings (no @, no domain, etc.)
      fc.assert(
        fc.property(
          fc.record({
            name:    fc.string({ minLength: 1 }),
            // Strings that have no '@' are always invalid
            email:   fc.string({ minLength: 1 }).filter(s => !s.includes('@')),
            message: fc.string({ minLength: 1 }),
          }),
          function (data) {
            const errors = validateContactForm(data);
            expect(errors.length).toBeGreaterThan(0);
            const emailErr = errors.find(e => e.field === 'email');
            expect(emailErr).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'returns empty errors array for fully valid input',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            name:    fc.string({ minLength: 1 }),
            email:   fc.emailAddress(),
            message: fc.string({ minLength: 1 }),
          }),
          function (data) {
            const errors = validateContactForm(data);
            expect(errors).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
