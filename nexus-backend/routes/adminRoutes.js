const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const Member = require("../models/Member");
const Announcement = require("../models/Announcement");
const TeamMember = require("../models/TeamMember");
const Media = require("../models/Media");
const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");
const AdminSettings = require("../models/AdminSettings");

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

const frontendRoot = path.resolve(__dirname, "..", "..", "nexus-frontend");

async function getOrInitAdminSettings() {
  const existing = await AdminSettings.findOne({ key: "admin" });
  if (existing) return existing;

  const defaultUsername = process.env.ADMIN_USERNAME || "admin";
  const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  return await AdminSettings.create({
    key: "admin",
    username: defaultUsername,
    passwordHash,
  });
}

// Pages
router.get("/login", (req, res) => {
  res.sendFile(path.join(frontendRoot, "admin", "login.html"));
});

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", (req, res) => {
  if (!(req.session && req.session.isAdmin)) {
    return res.redirect("/admin/login");
  }
  res.sendFile(path.join(frontendRoot, "admin", "dashboard.html"));
});

// Auth
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  const settings = await getOrInitAdminSettings();
  const okUser = String(username || "") === String(settings.username || "");
  const okPass = await bcrypt.compare(String(password || ""), settings.passwordHash);
  if (okUser && okPass) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

router.post("/logout", (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => res.json({ ok: true }));
});

// Admin settings (username/password)
router.get("/api/settings", requireAdmin, async (req, res) => {
  const s = await getOrInitAdminSettings();
  res.json({ username: s.username });
});

router.put("/api/settings", requireAdmin, async (req, res) => {
  const { username, password } = req.body || {};
  const nextUsername = String(username || "").trim();
  const nextPassword = String(password || "");

  if (!nextUsername) return res.status(400).json({ message: "Username is required" });
  if (nextPassword && nextPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const s = await getOrInitAdminSettings();
  s.username = nextUsername;
  if (nextPassword) {
    s.passwordHash = await bcrypt.hash(nextPassword, 10);
  }
  s.updatedAt = new Date();
  await s.save();
  res.json({ ok: true, username: s.username });
});

// Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(frontendRoot, "uploads"));
  },
  filename: function (req, file, cb) {
    const safe = (file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, Date.now() + "_" + safe);
  },
});

const upload = multer({ storage });

router.post("/api/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ src: "/uploads/" + req.file.filename });
});

// List local images/videos under public/images (for picking existing assets)
router.get("/api/image-library", requireAdmin, async (req, res) => {
  const root = path.join(frontendRoot, "images");
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4"]);

  function walk(dir) {
    let out = [];
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return out;
    }

    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        // Skip logo assets (not gallery moments)
        if (ent.name.toLowerCase() === "logo") continue;
        out = out.concat(walk(full));
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (!allowed.has(ext)) continue;
        const rel = full.slice(root.length).replace(/\\/g, "/");
        out.push("/images" + rel);
      }
    }
    return out;
  }

  const files = walk(root).sort((a, b) => a.localeCompare(b));
  res.json(files);
});

// Admin APIs (CRUD)
router.get("/api/members", requireAdmin, async (req, res) => {
  res.json(await Member.find().sort({ createdAt: -1 }));
});
router.post("/api/members", requireAdmin, async (req, res) => {
  const doc = await Member.create(req.body);
  res.json(doc);
});
router.put("/api/members/:id", requireAdmin, async (req, res) => {
  const doc = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/members/:id", requireAdmin, async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get("/api/announcements", requireAdmin, async (req, res) => {
  res.json(await Announcement.find().sort({ date: -1, createdAt: -1 }));
});
router.post("/api/announcements", requireAdmin, async (req, res) => {
  const doc = await Announcement.create(req.body);
  res.json(doc);
});
router.put("/api/announcements/:id", requireAdmin, async (req, res) => {
  const doc = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/announcements/:id", requireAdmin, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get("/api/team", requireAdmin, async (req, res) => {
  res.json(await TeamMember.find().sort({ order: 1, createdAt: 1 }));
});
router.post("/api/team", requireAdmin, async (req, res) => {
  const doc = await TeamMember.create(req.body);
  res.json(doc);
});
router.put("/api/team/:id", requireAdmin, async (req, res) => {
  const doc = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/team/:id", requireAdmin, async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get("/api/media", requireAdmin, async (req, res) => {
  res.json(await Media.find().sort({ order: 1, createdAt: 1 }));
});
router.post("/api/media", requireAdmin, async (req, res) => {
  const doc = await Media.create(req.body);
  res.json(doc);
});
router.put("/api/media/:id", requireAdmin, async (req, res) => {
  const doc = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/media/:id", requireAdmin, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get("/api/join-requests", requireAdmin, async (req, res) => {
  res.json(await JoinRequest.find().sort({ createdAt: -1 }));
});
router.put("/api/join-requests/:id", requireAdmin, async (req, res) => {
  const doc = await JoinRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/join-requests/:id", requireAdmin, async (req, res) => {
  await JoinRequest.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Projects (CRUD)
router.get("/api/projects", requireAdmin, async (req, res) => {
  res.json(await Project.find().sort({ order: 1, createdAt: 1 }));
});
router.post("/api/projects", requireAdmin, async (req, res) => {
  const doc = await Project.create(req.body);
  res.json(doc);
});
router.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
router.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;