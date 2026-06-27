'use strict';

/**
 * Validates that all required environment variables are set.
 * Throws a descriptive error at startup if any are missing.
 */

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
        'Please copy .env.example to .env and fill in all values.'
    );
  }
}

module.exports = { validateEnv, REQUIRED_VARS };
