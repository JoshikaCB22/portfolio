# Requirements Document

## Introduction

A full-stack personal portfolio website that showcases projects and skills. The system consists of a frontend UI, a backend REST API, and a database for persisting project and profile data. The site will be deployed to a public hosting platform and serve as a live, professional presence for the developer.

## Glossary

- **Portfolio_Site**: The complete full-stack web application being built.
- **Frontend**: The client-side application rendered in the browser (HTML/CSS/JS or React).
- **API**: The backend REST API server built with Node.js/Express or Django/Flask.
- **Database**: The persistent data store (MySQL, MongoDB, or PostgreSQL) for projects and profile data.
- **Project**: A portfolio item with a title, description, tech stack, links, and optional image.
- **Visitor**: An unauthenticated user browsing the portfolio.
- **Admin**: The portfolio owner, authenticated to manage content.
- **Contact_Form**: The form on the site allowing visitors to send messages to the Admin.

---

## Requirements

### Requirement 1: Display Portfolio Home Page

**User Story:** As a Visitor, I want to see a home page with a brief introduction and navigation, so that I can quickly understand who the developer is and explore the site.

#### Acceptance Criteria

1. THE Frontend SHALL render a home page containing the developer's name, a short bio, and a profile photo.
2. THE Frontend SHALL provide navigation links to the Projects, Skills, and Contact sections.
3. WHEN the Visitor loads the home page, THE Frontend SHALL display the page within 3 seconds on a standard broadband connection.

---

### Requirement 2: Display Projects

**User Story:** As a Visitor, I want to browse a list of projects with details, so that I can evaluate the developer's work.

#### Acceptance Criteria

1. WHEN the Visitor navigates to the Projects section, THE Frontend SHALL fetch and display all projects from the API.
2. THE API SHALL return a list of Project objects, each containing: title, description, tech stack, live demo URL, repository URL, and an optional image URL.
3. WHEN a project has no image URL, THE Frontend SHALL display a placeholder image.
4. THE Frontend SHALL display each project in a card layout with the title, description, tech stack tags, and links.

---

### Requirement 3: Project Data Persistence

**User Story:** As an Admin, I want project data stored in a database, so that projects can be managed without modifying source code.

#### Acceptance Criteria

1. THE Database SHALL store each Project with the fields: id, title, description, tech_stack, demo_url, repo_url, image_url, and created_at.
2. THE API SHALL support CREATE, READ, UPDATE, and DELETE operations for Project records.
3. WHEN the API receives a request to create a Project with a missing required field (title or description), THE API SHALL return a 400 status code with a descriptive error message.
4. WHEN the API receives a request to read, update, or delete a Project with a non-existent id, THE API SHALL return a 404 status code.

---

### Requirement 4: Display Skills

**User Story:** As a Visitor, I want to see the developer's skills organized by category, so that I can assess technical expertise at a glance.

#### Acceptance Criteria

1. WHEN the Visitor navigates to the Skills section, THE Frontend SHALL display skills grouped by category (e.g., Frontend, Backend, DevOps).
2. THE API SHALL provide an endpoint that returns all skills, each containing: name, category, and proficiency level.
3. THE Frontend SHALL visually distinguish skill categories using labels or grouping.

---

### Requirement 5: Contact Form

**User Story:** As a Visitor, I want to send a message to the developer via a contact form, so that I can reach out for opportunities or inquiries.

#### Acceptance Criteria

1. THE Frontend SHALL render a Contact_Form with fields: name, email address, and message body.
2. WHEN the Visitor submits the Contact_Form with all required fields populated and a valid email address format, THE API SHALL accept the submission and return a 200 status code.
3. IF the Visitor submits the Contact_Form with a missing required field or an invalid email format, THEN THE Frontend SHALL display a descriptive inline validation error without submitting to the API.
4. WHEN the API successfully processes a Contact_Form submission, THE API SHALL send an email notification to the Admin's configured email address.

---

### Requirement 6: Admin Authentication

**User Story:** As an Admin, I want to authenticate before managing content, so that only I can add, edit, or delete projects and skills.

#### Acceptance Criteria

1. THE API SHALL provide a login endpoint that accepts an email and password and returns a signed JWT on success.
2. WHEN the Admin provides incorrect credentials, THE API SHALL return a 401 status code and SHALL NOT return a JWT.
3. WHILE the Admin is authenticated, THE API SHALL accept the JWT in the Authorization header to authorize write operations on Projects and Skills.
4. WHEN a request to a protected endpoint is made without a valid JWT, THE API SHALL return a 401 status code.
5. THE API SHALL store Admin passwords as salted hashes and SHALL NOT store plaintext passwords.

---

### Requirement 7: Responsive Design

**User Story:** As a Visitor, I want the portfolio to be usable on mobile, tablet, and desktop screens, so that I can view it from any device.

#### Acceptance Criteria

1. THE Frontend SHALL render all pages using a responsive layout that adapts to viewport widths from 320px to 2560px.
2. THE Frontend SHALL pass WCAG 2.1 Level AA contrast requirements for all text and interactive elements.
3. WHEN the viewport width is below 768px, THE Frontend SHALL collapse the navigation into a mobile-friendly menu.

---

### Requirement 8: Deployment

**User Story:** As an Admin, I want the portfolio deployed to a public hosting platform, so that visitors can access it via a public URL.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL be deployed such that the Frontend is accessible via a public HTTPS URL.
2. THE API SHALL be deployed to a hosting platform (Heroku, Render, or similar) and reachable by the Frontend over HTTPS.
3. THE Database SHALL be provisioned as a managed cloud service and accessible only by the API.
4. WHEN the API fails to connect to the Database at startup, THE API SHALL log a descriptive error message and exit with a non-zero status code.
