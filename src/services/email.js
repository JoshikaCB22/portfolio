'use strict';

const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using SMTP environment variables.
 * Called lazily so env vars are available at call time.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends a contact form email to the admin.
 *
 * @param {Object} payload
 * @param {string} payload.name    - Sender's name
 * @param {string} payload.email   - Sender's email address
 * @param {string} payload.message - Message body
 * @throws {Error} If the transport fails to send
 */
async function sendContactEmail({ name, email, message }) {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Portfolio Contact from ${name}`,
    text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New Portfolio Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail, createTransporter };
