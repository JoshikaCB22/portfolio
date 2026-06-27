'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../src/models/Admin');

const SALT_ROUNDS = 10;

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.error(
      'Error: ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in environment.'
    );
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI must be set in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), password_hash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin upserted successfully: ${admin.email}`);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
