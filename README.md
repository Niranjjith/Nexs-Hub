# NExs (Next eXperience Space)

Student-driven innovation community website + admin dashboard for managing content (gallery, team, join requests, members).

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

- Node.js + Express
- MongoDB + Mongoose
- Sessions: `express-session`
- Uploads: `multer`

## Folder structure

```text
Nexus/
  api/
    index.js                 # Vercel serverless entry (exports Express app)
  models/                    # Mongoose schemas
    Announcement.js
    JoinRequest.js
    Media.js
    Member.js
    TeamMember.js
  public/
    css/
      style.css              # Public site styles (themes, animations, pages)
      admin.css              # Admin UI styles
    js/
      main.js                # Public site JS (theme toggle, lightbox, dynamic renders)
      admin.js               # Admin dashboard JS (CRUD UI)
    images/                  # Local images + fff.mp4 used by gallery/pages
    uploads/                 # Admin uploads (local dev only)
  routes/
    adminRoutes.js           # Admin pages + CRUD APIs + image-library API
    announcementRoutes.js    # Public announcements API
    joinRequestRoutes.js     # Public join request submit API
    mediaRoutes.js           # Public media API (gallery)
    memberRoutes.js          # Public members API
    teamRoutes.js            # Public team API
  scripts/
    seed-admin-data.js       # Seed initial gallery + team into MongoDB
  views/
    index.html               # Home page
    gallery.html             # Full gallery page
    join.html                # Join page + form
    members.html             # Members page
    admin/
      login.html             # Admin login
      dashboard.html         # Admin dashboard shell
  app.js                     # Express app (no listen)
  server.js                  # Local dev entry (starts app on :3000)
  vercel.json                # Vercel rewrite -> /api/index.js
  package.json
  README.md
```

## Setup (Local)

### 1) Install

```bash
npm install
```

### 2) Environment variables (recommended)

Create `.env` in the project root:

- `MONGODB_URI`: your MongoDB connection string
- `SESSION_SECRET`: long random string for sessions

Example:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/nexsDB"
SESSION_SECRET="change_me_to_a_long_random_value"
```

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

This project uses:

- `api/index.js` as the Vercel serverless entry (Express app export)
- `vercel.json` rewrites all routes to `/api/index.js`

### Static assets note

- Your images/videos in `public/images` are static assets and should be served by Vercel as static files.
- The Express app disables `express.static("public")` on Vercel (to avoid bundling large folders into the function).

### Uploads note (important)

Admin uploads to `public/uploads` work on **local dev**.
On Vercel serverless, filesystem is **not persistent**, so uploaded files may disappear between deployments/requests.
For production uploads, use external storage (e.g. Vercel Blob / S3 / Cloudinary).

## Security notes

- Change `SESSION_SECRET` for production
- Replace the hardcoded admin credentials with environment variables or a proper auth system for real deployments

