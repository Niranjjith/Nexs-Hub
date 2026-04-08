const router = require("express").Router();
const path = require("path");
const multer = require("multer");

const Member = require("../models/Member");
const Announcement = require("../models/Announcement");
const TeamMember = require("../models/TeamMember");
const Media = require("../models/Media");

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// Pages
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "admin", "login.html"));
});

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", (req, res) => {
  if (!(req.session && req.session.isAdmin)) {
    return res.redirect("/admin/login");
  }
  res.sendFile(path.join(__dirname, "..", "views", "admin", "dashboard.html"));
});

// Auth
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === "admin" && password === "admin123") {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

router.post("/logout", (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => res.json({ ok: true }));
});

// Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
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

module.exports = router;