const router = require("express").Router();
const Media = require("../models/Media");

router.get("/", async (req, res) => {
  const data = await Media.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json(data);
});

module.exports = router;

