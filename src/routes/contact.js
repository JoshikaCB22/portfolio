'use strict';

const express = require('express');
const { sendContactEmail } = require('../services/email');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Validates name, email, and message, then sends a contact email.
 * Returns 200 on success, 400 on invalid input, 500 on email failure.
 */
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate name
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }

  // Validate email format
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'email is required' });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate message
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Email could not be sent' });
  }
});

module.exports = router;
