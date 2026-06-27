'use strict';

/**
 * Returns Express middleware that validates the presence of
 * the specified fields in req.body.
 *
 * If any field is missing or an empty string, responds with
 * 400 { "error": "<fieldname> is required" } for the first
 * missing field found.
 *
 * @param {...string} fields - Field names required in req.body
 * @returns {Function} Express middleware function
 */
function requireFields(...fields) {
  return function (req, res, next) {
    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === '') {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    next();
  };
}

module.exports = { requireFields };
