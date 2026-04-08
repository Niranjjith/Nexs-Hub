const router = require("express").Router();
const JoinRequest = require("../models/JoinRequest");

// Public: create join request
router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    department,
    yearOfStudy,
    registerNumber,
    preferredDomain,
    skills,
    skillLevel,
    motivation,
    github,
    portfolio,
    hoursPerWeek,
    commitment,
    stream,
    message,
  } = req.body || {};
  if (!name || !email) return res.status(400).json({ message: "Name and email are required" });

  const doc = await JoinRequest.create({
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : "",
    department: department ? String(department).trim() : "",
    yearOfStudy: yearOfStudy ? String(yearOfStudy).trim() : "",
    registerNumber: registerNumber ? String(registerNumber).trim() : "",

    preferredDomain: preferredDomain ? String(preferredDomain).trim() : "",

    skills: skills ? String(skills).trim() : "",
    skillLevel: skillLevel ? String(skillLevel).trim() : "",

    motivation: motivation ? String(motivation).trim() : "",

    github: github ? String(github).trim() : "",
    portfolio: portfolio ? String(portfolio).trim() : "",

    hoursPerWeek: hoursPerWeek ? String(hoursPerWeek).trim() : "",
    commitment: commitment === true || commitment === "true" || commitment === "on",

    stream: stream ? String(stream).trim() : "",
    message: message ? String(message).trim() : "",
    status: "new",
  });

  res.json({ ok: true, id: doc._id });
});

module.exports = router;

