# NExs (Next eXperience Space)

Student-driven innovation community website + admin dashboard for content management.

## Features

- Public site
  - Premium UI with Light/Dark themes
  - Gallery (images + video) with lightbox
  - About + Mission/Vision sections
  - Team profiles (modal)
- Admin panel
  - Admin login page (`/admin/login`)
  - Dashboard (`/admin/dashboard`)
  - CRUD for:
    - Gallery media (image/video)
    - Team members (bio, projects, links)
    - Join requests (new joiners)
    - Members
    - Announcements
  - File uploads (images/videos) stored under `public/uploads`

## Tech stack

- Node.js + Express
- MongoDB (Mongoose)
- Sessions: `express-session`
- Uploads: `multer`

## Setup

### 1) Install

```bash
npm install
```

### 1.5) Seed current content into Admin (optional)

This imports your **current gallery + team** (from the existing hardcoded site) into MongoDB so it shows up inside the admin dashboard.

```bash
npm run seed
```

### 2) Configure environment (recommended)

Create a `.env` (optional but recommended):

- `MONGODB_URI`: your MongoDB connection string
- `SESSION_SECRET`: long random string for sessions

Example:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/nexsDB"
SESSION_SECRET="change_me_to_a_long_random_value"
```

> If you do not set these, the app will use the connection string inside `server.js` and a dev session secret.

### 3) Run

```bash
npm start
```

Open:

- Site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Admin credentials

Default credentials (as requested):

- **username**: `admin`
- **password**: `admin123`

## Using the admin dashboard

### Media (Gallery)

- Add image/video items
- Upload files (stored under `public/uploads`)
- Set:
  - `type`: `image` or `video`
  - `src`: path like `/uploads/<filename>` (auto-filled on upload)
  - `title`, `alt`
  - `order` and `active`

### Meet our team

You can add/edit:

- `slug` (unique key)
- `name`, `role`, `image`, `bio`
- `meta` tags (comma-separated)
- `projects` as JSON array:

```json
[
  { "name": "AI Security Lab", "desc": "Mentored pipeline and evaluation metrics." }
]
```

- `social` as JSON array:

```json
[
  { "label": "LinkedIn", "href": "https://www.linkedin.com/in/..." },
  { "label": "Email", "href": "mailto:someone@example.com" }
]
```

### Members / Announcements

Basic add/edit/delete with inline dialogs.

### Join Requests (new joiners)

Users can submit the Join form on `/join`. Submissions are stored in MongoDB and appear under the **Join Requests** tab in the admin dashboard.

## API endpoints

Public:

- `GET /api/members`
- `GET /api/announcements`
- `GET /api/team`
- `GET /api/media`

Admin (requires login session):

- `POST /admin/login`
- `POST /admin/logout`
- `POST /admin/api/upload`
- CRUD:
  - `/admin/api/members`
  - `/admin/api/announcements`
  - `/admin/api/team`
  - `/admin/api/media`

## Notes / security

- For a real deployment, **change** `SESSION_SECRET` and replace the hardcoded admin credentials with environment variables or a proper user system.
- Uploaded files are served publicly from `/uploads`.

