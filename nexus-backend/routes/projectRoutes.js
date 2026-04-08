const router = require("express").Router();
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  const data = await Project.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json(data);
});

router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug || "").trim();
  if (!slug) return res.status(400).json({ message: "Missing slug" });

  const doc = await Project.findOne({ slug, active: true });
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
});

module.exports = router;

