'use strict';

const jwt = require('jsonwebtoken');

/**
 * JWT verification middleware.
 * Reads Authorization header, extracts Bearer token,
 * verifies with JWT_SECRET. Returns 401 if missing,
 * expired, or invalid. Attaches decoded payload to req.user.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
