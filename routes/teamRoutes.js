const router = require("express").Router();
const TeamMember = require("../models/TeamMember");

router.get("/", async (req, res) => {
  const data = await TeamMember.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json(data);
});

module.exports = router;

