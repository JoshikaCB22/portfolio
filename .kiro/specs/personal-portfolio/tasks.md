# Implementation Plan: Personal Portfolio

## Overview

Incremental build of a full-stack portfolio site: static HTML/CSS/JS frontend on Vercel, Express/MongoDB backend on Render. Tasks are ordered so each step integrates with the previous, ending with deployment configuration.

## Tasks

- [x] 1. Project scaffolding and environment setup
  - Create root directory structure: `src/`, `frontend/`, `tests/unit/`, `tests/integration/`, `tests/property/`
  - Initialize `package.json` with dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `nodemailer`, `dotenv`, `cors`
  - Add dev dependencies: `jest`, `fast-check`, `supertest`, `mongodb-memory-server`
  - Create `.env.example` with all required env vars: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - Configure Jest in `package.json` (testEnvironment node, `--runInBand` for integration)
  - Create `src/config/env.js` to validate required environment variables at startup; throw if any are missing
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Database connection and Mongoose models
  - [x] 2.1 Implement `src/config/db.js` — Mongoose connect with error logging and `process.exit(1)` on failure
    - _Requirements: 8.4_
  - [x] 2.2 Implement `src/models/Project.js` schema with fields: title (required), description (required), tech_stack ([String]), demo_url, repo_url, image_url, created_at (default Date.now)
    - _Requirements: 3.1_
  - [x] 2.3 Implement `src/models/Skill.js` schema with fields: name (required), category (required), proficiency (required)
    - _Requirements: 4.2_
  - [x] 2.4 Implement `src/models/Admin.js` schema with fields: email (required, unique), password_hash (required)
    - _Requirements: 6.5_
  - [ ]* 2.5 Write unit test for DB connection failure
    - Mock `mongoose.connect` to reject; assert `process.exit(1)` is called with a logged error message
    - _Requirements: 8.4_

- [x] 3. Auth middleware and admin seed script
  - [x] 3.1 Implement `src/middleware/auth.js` — verify `Authorization: Bearer <token>` using `jsonwebtoken`; return 401 on missing, expired, or tampered token
    - _Requirements: 6.3, 6.4_
  - [x] 3.2 Implement `src/middleware/validate.js` — helper that checks required body fields and returns 400 with `{ "error": "<field> is required" }` on failure
    - _Requirements: 3.3_
  - [x] 3.3 Create `scripts/seedAdmin.js` — accepts email + plaintext password via env vars, hashes with bcrypt, upserts Admin document
    - _Requirements: 6.5_
  - [ ]* 3.4 Write property test for JWT middleware (Property 10)
    - `// Feature: personal-portfolio, Property 10: JWT auth middleware enforces access`
    - Generate valid tokens, expired tokens, and tampered tokens; assert 2xx vs 401 responses on a protected route
    - `fc.string()` for secret mutation, fixed valid payload
    - **Property 10: JWT auth middleware enforces access**
    - **Validates: Requirements 6.3, 6.4**
  - [ ]* 3.5 Write property test for password hashing (Property 11)
    - `// Feature: personal-portfolio, Property 11: Passwords stored as hashes`
    - For arbitrary passwords (`fc.string({minLength:8})`), assert stored `password_hash` !== plaintext and `bcrypt.compare` returns true
    - **Property 11: Passwords stored as hashes**
    - **Validates: Requirements 6.5**

- [x] 4. Auth route
  - [x] 4.1 Implement `src/routes/auth.js` — `POST /api/auth/login`: find Admin by email, compare bcrypt hash, return signed JWT on match or 401 on mismatch
    - _Requirements: 6.1, 6.2_
  - [ ]* 4.2 Write property test for valid login returning JWT (Property 8)
    - `// Feature: personal-portfolio, Property 8: Valid credentials return a signed JWT`
    - Seed admin with known hash; generate arbitrary email/password pairs that match; assert 200 + `token` field is a verifiable JWT
    - `fc.emailAddress()` + `fc.string({minLength:8})`
    - **Property 8: Valid credentials return a signed JWT**
    - **Validates: Requirements 6.1**
  - [ ]* 4.3 Write property test for invalid login returning 401 (Property 9)
    - `// Feature: personal-portfolio, Property 9: Invalid credentials return 401 and no token`
    - Generate credential pairs that do not match seeded admin; assert 401 and no `token` in body
    - **Property 9: Invalid credentials return 401 and no token**
    - **Validates: Requirements 6.2**

- [x] 5. Projects API routes
  - [x] 5.1 Implement `src/routes/projects.js` with all five endpoints: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects` (JWT), `PUT /api/projects/:id` (JWT), `DELETE /api/projects/:id` (JWT)
    - Use `validate.js` middleware on POST/PUT to enforce title and description
    - Return 404 `{ "error": "Not found" }` for unknown IDs on GET/PUT/DELETE
    - _Requirements: 2.2, 3.2, 3.3, 3.4_
  - [ ]* 5.2 Write property test for Project CRUD round-trip (Property 2)
    - `// Feature: personal-portfolio, Property 2: Project CRUD round-trip`
    - For arbitrary valid payloads (`fc.record({ title: fc.string({minLength:1}), description: fc.string({minLength:1}), ... })`), POST then GET by returned id; assert field equality
    - **Property 2: Project CRUD round-trip**
    - **Validates: Requirements 2.2, 3.1, 3.2**
  - [ ]* 5.3 Write property test for missing required field returns 400 (Property 3)
    - `// Feature: personal-portfolio, Property 3: Missing required field returns 400`
    - Generate payloads with title or description absent/empty; assert 400 + non-empty error string
    - **Property 3: Missing required field returns 400**
    - **Validates: Requirements 3.3**
  - [ ]* 5.4 Write property test for non-existent project ID returns 404 (Property 4)
    - `// Feature: personal-portfolio, Property 4: Non-existent project ID returns 404`
    - Generate random 24-char hex strings unlikely to exist; assert GET/PUT/DELETE all return 404
    - `fc.hexaString({minLength:24, maxLength:24})`
    - **Property 4: Non-existent project ID returns 404**
    - **Validates: Requirements 3.4**

- [x] 6. Skills API routes
  - [x] 6.1 Implement `src/routes/skills.js` with: `GET /api/skills` (public), `POST /api/skills` (JWT), `PUT /api/skills/:id` (JWT), `DELETE /api/skills/:id` (JWT)
    - _Requirements: 4.2_
  - [ ]* 6.2 Write property test for skills grouping and field completeness — API side (Property 5 — API half)
    - `// Feature: personal-portfolio, Property 5: Skills grouping and field completeness`
    - Seed arbitrary skill arrays; assert every skill in GET response has non-empty name, category, proficiency
    - `fc.array(fc.record({ name: fc.string({minLength:1}), category: fc.string({minLength:1}), proficiency: fc.string({minLength:1}) }))`
    - **Property 5: Skills grouping and field completeness**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 7. Contact API route and email service
  - [x] 7.1 Implement `src/services/email.js` — Nodemailer transporter configured from env vars; export a `sendContactEmail(payload)` function; return 500 `{ "error": "Email could not be sent" }` on transport failure
    - _Requirements: 5.4_
  - [x] 7.2 Implement `src/routes/contact.js` — `POST /api/contact`: validate name, email (regex), message; call `sendContactEmail`; return 200 on success
    - _Requirements: 5.2, 5.4_
  - [ ]* 7.3 Write property test for valid contact submission (Property 7)
    - `// Feature: personal-portfolio, Property 7: Valid contact submission succeeds and triggers email`
    - Mock Nodemailer transport; for arbitrary valid payloads (`fc.record({ name: fc.string({minLength:1}), email: fc.emailAddress(), message: fc.string({minLength:1}) })`), assert 200 and transport send called once with admin address
    - **Property 7: Valid contact submission succeeds and triggers email**
    - **Validates: Requirements 5.2, 5.4**

- [x] 8. Express app wiring
  - Implement `src/app.js` — mount CORS, JSON body parser, all four route modules under `/api`; add global 500 error handler returning `{ "error": "Internal server error" }`
  - Implement `src/server.js` — import `app.js`, call `db.js` connect, start HTTP server; exit on DB failure
  - _Requirements: 8.2, 8.4_

- [x] 9. Checkpoint — backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Frontend — core structure and home page
  - Create `frontend/index.html` with semantic HTML: header (name, bio, profile photo placeholder), nav links to `#projects`, `#skills`, `#contact` sections, and link to `admin/login.html`
  - Create `frontend/css/style.css` with responsive layout (CSS Grid/Flexbox), mobile nav collapse below 768px, and WCAG 2.1 AA contrast ratios for all text and interactive elements
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2, 7.3_

- [x] 11. Frontend — Projects section
  - [x] 11.1 Add `#projects` section to `index.html`; implement `frontend/js/projects.js` — `renderProjectCard(project)` function that produces a card with title, description, tech stack tags, demo/repo links, and an `onerror` placeholder image fallback
    - _Requirements: 2.1, 2.3, 2.4_
  - [x] 11.2 On page load, fetch `GET /api/projects` and render cards; display "Could not load projects. Please try again later." on network error
    - _Requirements: 2.1_
  - [-]* 11.3 Write property test for project card render completeness (Property 1)
    - `// Feature: personal-portfolio, Property 1: Project card render completeness`
    - For arbitrary project objects with title, description, tech_stack array, and at least one link, assert rendered HTML contains title text, description text, each tag, and at least one `<a>` element
    - `fc.record({ title: fc.string({minLength:1}), description: fc.string({minLength:1}), tech_stack: fc.array(fc.string()), demo_url: fc.webUrl() })`
    - **Property 1: Project card render completeness**
    - **Validates: Requirements 2.4**
  - [ ]* 11.4 Write unit tests for `renderProjectCard`
    - Test: project with all fields renders placeholder img when image_url absent
    - Test: empty tech_stack array renders no tags
    - Test: very long description string does not break card structure
    - _Requirements: 2.3, 2.4_

- [x] 12. Frontend — Skills section
  - [x] 12.1 Add `#skills` section to `index.html`; implement `frontend/js/skills.js` — `renderSkillsSection(skills)` function that groups skills by category and renders one container per distinct category with skill entries inside
    - _Requirements: 4.1, 4.3_
  - [x] 12.2 On page load, fetch `GET /api/skills` and render grouped sections
    - _Requirements: 4.1_
  - [ ]* 12.3 Write property test for skills frontend grouping (Property 5 — frontend half)
    - `// Feature: personal-portfolio, Property 5: Skills grouping and field completeness`
    - For arbitrary skill arrays, assert `renderSkillsSection` produces exactly one container per distinct category and each skill appears in the correct group
    - `fc.array(fc.record({ name: fc.string({minLength:1}), category: fc.string({minLength:1}), proficiency: fc.string({minLength:1}) }), {minLength:1})`
    - **Property 5: Skills grouping and field completeness**
    - **Validates: Requirements 4.1, 4.3**

- [x] 13. Frontend — Contact section
  - [x] 13.1 Add `#contact` section to `index.html` with form fields: name, email, message; implement `frontend/js/contact.js` — `validateContactForm(data)` returns an array of error messages (empty = valid); show inline errors without submitting when invalid
    - _Requirements: 5.1, 5.3_
  - [x] 13.2 On valid submission, POST to `/api/contact`; show success message or inline error on API failure without clearing the form
    - _Requirements: 5.2_
  - [ ]* 13.3 Write property test for contact form client-side validation (Property 6)
    - `// Feature: personal-portfolio, Property 6: Contact form rejects invalid input client-side`
    - For inputs with at least one empty field or invalid email, assert `validateContactForm` returns non-empty errors array
    - `fc.record` with at least one empty/invalid field variant
    - **Property 6: Contact form rejects invalid input client-side**
    - **Validates: Requirements 5.3**
  - [ ]* 13.4 Write unit tests for `validateContactForm`
    - Test: all valid fields returns empty errors array
    - Test: missing name returns error mentioning name
    - Test: malformed email returns error mentioning email
    - _Requirements: 5.3_

- [x] 14. Frontend — Admin login and dashboard
  - [x] 14.1 Create `frontend/admin/login.html` + `frontend/js/admin-login.js` — POST credentials to `/api/auth/login`, store returned JWT in `localStorage`, redirect to `dashboard.html`; display API error message on failure
    - _Requirements: 6.1, 6.2_
  - [x] 14.2 Create `frontend/admin/dashboard.html` + `frontend/js/admin-dashboard.js` — on load verify JWT in localStorage (redirect to login if absent); fetch projects and skills; render management UI with create/edit/delete controls that attach `Authorization: Bearer <token>` to all write requests
    - _Requirements: 6.3, 6.4_

- [x] 15. Checkpoint — full stack integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Deployment configuration
  - Create `vercel.json` in `frontend/` to serve static files with correct routes
  - Create `render.yaml` (or `Procfile`) in project root configuring the Express server start command, environment variable placeholders, and health check path
  - Add a `README.md` section documenting required environment variables for both Vercel and Render deployments
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 17. Final checkpoint — all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All property tests use fast-check with `numRuns: 100` minimum and the comment tag `// Feature: personal-portfolio, Property <N>: ...`
- Integration tests use `mongodb-memory-server` and run with Jest `--runInBand`
- Environment variables must never be committed; use `.env.example` as the reference
