const router = require("express").Router();
const HomeSettings = require("../models/HomeSettings");

async function getOrInitHomeSettings() {
  const existing = await HomeSettings.findOne({ key: "home" });
  if (existing) return existing;
  return await HomeSettings.create({
    key: "home",
    heroImage: "/images/home.jpg",
    heroOverlayOpacity: 0.6,
    aboutText:
      "NeXs was established as part of the Mini Tech Park initiative to provide a structured, collaborative environment where students can explore ideas, build projects, and gain practical industry-aligned experience.\n\nUnlike classroom-only learning, NeXs emphasizes hands-on development, teamwork, and applied problem-solving. Students contribute to real projects, participate in skill-building sessions, and work with emerging technologies in a delivery-focused setting.",
    aboutImageMain: "/images/NCA07661.jpg",
    aboutImageOne: "/images/NCA07619.JPG",
    aboutImageTwo: "/images/NCA07634.JPG",
  });
}

router.get("/", async (req, res) => {
  const s = await getOrInitHomeSettings();
  res.json({
    heroImage: s.heroImage,
    heroOverlayOpacity: s.heroOverlayOpacity,
    aboutText: s.aboutText,
    aboutImageMain: s.aboutImageMain,
    aboutImageOne: s.aboutImageOne,
    aboutImageTwo: s.aboutImageTwo,
  });
});

module.exports = router;

