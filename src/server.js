'use strict';

require('dotenv').config();

const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Validate required environment variables before anything else
  validateEnv();

  // Connect to MongoDB
  await connectDB();

  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
