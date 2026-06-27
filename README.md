# Joshika S — Personal Portfolio

Aspiring Full Stack Developer | Backend Developer | Spring Boot Developer | AI Enthusiast

A full-stack personal portfolio website built with Node.js/Express backend, MongoDB database, and a vanilla HTML/CSS/JS frontend.

---

## Project Structure

```
├── src/                    # Backend source
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Project.js
│   │   └── Skill.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── projects.js
│   │   └── skills.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   └── services/
│       └── email.js
├── frontend/               # Static frontend
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   ├── admin/
│   └── vercel.json
├── scripts/
│   ├── seedAdmin.js        # Create admin account
│   └── seedData.js         # Seed projects & skills
├── tests/
├── .env.example
├── render.yaml
└── package.json
```

---

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`:

| Variable       | Description                              |
|----------------|------------------------------------------|
| `MONGO_URI`    | MongoDB Atlas connection string          |
| `JWT_SECRET`   | Secret key for signing JWTs (random string) |
| `ADMIN_EMAIL`  | Your email address (receives contact messages) |
| `SMTP_HOST`    | SMTP server host (e.g. smtp.gmail.com)   |
| `SMTP_PORT`    | SMTP port (587 for TLS, 465 for SSL)     |
| `SMTP_USER`    | SMTP username / email                    |
| `SMTP_PASS`    | SMTP password or app password            |
| `PORT`         | Server port (default: 5000)              |

### 3. Seed the database

```bash
# Create admin account
ADMIN_SEED_EMAIL=your@email.com ADMIN_SEED_PASSWORD=yourpassword node scripts/seedAdmin.js

# Seed projects and skills
node scripts/seedData.js
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Open the frontend

Open `frontend/index.html` in your browser, or serve it with a static server:

```bash
npx serve frontend
```

---

## API Endpoints

| Method | Endpoint              | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| POST   | /api/auth/login       | —    | Admin login → JWT     |
| GET    | /api/projects         | —    | List all projects     |
| POST   | /api/projects         | JWT  | Create project        |
| PUT    | /api/projects/:id     | JWT  | Update project        |
| DELETE | /api/projects/:id     | JWT  | Delete project        |
| GET    | /api/skills           | —    | List all skills       |
| POST   | /api/skills           | JWT  | Create skill          |
| PUT    | /api/skills/:id       | JWT  | Update skill          |
| DELETE | /api/skills/:id       | JWT  | Delete skill          |
| POST   | /api/contact          | —    | Send contact message  |

---

## Deployment

### Backend → Render

1. Push this repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Render will use `render.yaml` automatically
5. Set all environment variables in the Render dashboard (Settings → Environment)

### Frontend → Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repo
2. Set the **Root Directory** to `frontend`
3. Vercel will use `frontend/vercel.json` automatically
4. After backend is deployed, update `API_BASE` in all `frontend/js/*.js` files to your Render URL

### Update API_BASE for production

In each JS file (`projects.js`, `skills.js`, `contact.js`, `admin-login.js`, `admin-dashboard.js`), change:

```js
const API_BASE = 'http://localhost:5000';
```

to your live Render URL:

```js
const API_BASE = 'https://your-app-name.onrender.com';
```

---

## Running Tests

```bash
npm test
```

---

## GitHub

[github.com/JoshikaCB22](https://github.com/JoshikaCB22)
