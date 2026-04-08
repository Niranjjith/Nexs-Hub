# NExs Hub (Next eXperience Space)

Static frontend + Node/Express backend (MongoDB) for a student-driven innovation community website and admin dashboard.

## Features

### Public site

- Light + Dark themes
- Home, Gallery, Join, Members pages
- Gallery “Moments from the hub” preview + full gallery page
- Lightbox for images + video (prev/next + smooth transitions)
- Team section with profile modal (bio + projects + links)
- Join form that stores new joiners into MongoDB (admin can review)

### Admin panel

- Admin login (`/admin/login`)
- Admin dashboard (`/admin/dashboard`)
- Full CRUD for:
  - Gallery Media (images/videos)
  - Team members
  - Join requests (new joiners)
  - Members
  - Announcements
- Upload support (saves to `public/uploads`)
- Media editor can **pick existing assets from `public/images`** (no upload required)

## Tech stack

- Frontend: static HTML/CSS/JS (`nexus-frontend/`)
- Backend: Node.js + Express (`nexus-backend/`)
- MongoDB + Mongoose
- Sessions: `express-session`
- Uploads: `multer`

## Folder structure

```text
Nexs-Hub/
  api/
    index.js                 # Vercel serverless entry -> `nexus-backend/app.js`
  nexus-backend/
    app.js                   # Express app (exported; no listen)
    server.js                # Local dev entry (starts app on :3000)
    models/                  # Mongoose schemas
    routes/                  # API routes (public + admin)
    scripts/                 # Seed scripts
  nexus-frontend/
    index.html               # Home page
    gallery.html             # Full gallery page
    join.html                # Join page + form
    members.html             # Members page
    admin/                   # Admin UI pages
    css/ js/ images/ uploads/
  vercel.json                # Routes: static frontend + `/api/*` backend
  package.json               # Root deps for Vercel + local `npm start`
  README.md
```

## Setup (Local)

### 1) Install

```bash
npm install
```

### 2) Environment variables (recommended)

Create a `.env` file (recommended) and set:

- `MONGODB_URI`: your MongoDB connection string
- `SESSION_SECRET`: long random string for sessions
- `CORS_ORIGIN`: comma-separated allowed frontend origins (recommended)

Example:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/nexsDB"
SESSION_SECRET="change_me_to_a_long_random_value"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

### Important mistake beginners make: CORS

If you forget to enable CORS in the backend, the frontend will fail in the browser.

This repo already enables it in `nexus-backend/app.js`:

```js
const cors = require("cors");
app.use(cors());
```

In production, prefer using `CORS_ORIGIN` so you don’t open your API to every origin.

### 3) Seed initial data (optional)

This imports your current **team + gallery media** into MongoDB:

```bash
npm run seed
```

### 4) Run

```bash
npm start
```

Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Admin credentials

Default (as requested):

- **username**: `admin`
- **password**: `admin123`

## Using the Admin dashboard

### Gallery Media (Moments + Gallery page)

- **Add / Edit / Delete** images and videos
- Choose media source in 3 ways:
  - **Pick from `/public/images`** (recommended for local assets)
  - Upload file (stored in `public/uploads`)
  - Paste a URL path (e.g. `/uploads/...` or `/images/...`)
- Control display:
  - `order` (sorting)
  - `active` (show/hide)

### Meet Our Team

- Add/edit team members:
  - `slug`, `name`, `role`, `image`, `bio`, `meta`, `order`, `active`
- Projects and Social links are edited with a **normal form UI** (no JSON).
  - Social links auto-fix:
    - Email → `mailto:...`
    - Bare domains → `https://...`

### Join Requests (new joiners)

- All join form submissions from `/join` appear here
- Update status: `new`, `contacted`, `accepted`, `rejected`
- Add internal notes (Admin Notes)

### Members

- Add/edit members shown on `/members`
- Supports: image + short bio + LinkedIn + GitHub + ordering + active toggle

## API endpoints

### Public

- `GET /api/members`
- `GET /api/announcements`
- `GET /api/team`
- `GET /api/media`
- `POST /api/join-requests`

### Admin (requires login session)

- `POST /admin/login`
- `POST /admin/logout`
- `POST /admin/api/upload`
- `GET /admin/api/image-library`
- CRUD:
  - `/admin/api/members`
  - `/admin/api/announcements`
  - `/admin/api/team`
  - `/admin/api/media`
  - `/admin/api/join-requests`

## Deploy (Vercel)

This repo is Vercel-ready:

- `api/index.js` as the Vercel serverless entry (Express app export)
- `vercel.json` serves the static frontend from `nexus-frontend/`
- `vercel.json` routes `/api/*` to the serverless backend

### Backend environment variables on Vercel

Set these in the Vercel Project → Settings → Environment Variables:

- `MONGODB_URI`
- `SESSION_SECRET`
- `CORS_ORIGIN` (your frontend’s deployed URL, e.g. `https://your-site.vercel.app`)

### Uploads note (important)

Admin uploads to `public/uploads` style folders work on **local dev**.
On Vercel serverless, filesystem is **not persistent**, so uploaded files may disappear between deployments/requests.
For production uploads, use external storage (e.g. Vercel Blob / S3 / Cloudinary).

## Security notes

- Change `SESSION_SECRET` for production
- Do not hardcode database credentials in code. Use `MONGODB_URI` via environment variables.
- Replace the hardcoded admin credentials with environment variables or a proper auth system for real deployments

