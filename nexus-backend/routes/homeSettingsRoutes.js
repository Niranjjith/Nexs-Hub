const router = require("express").Router();
const HomeSettings = require("../models/HomeSettings");

async function getOrInitHomeSettings() {
  const existing = await HomeSettings.findOne({ key: "home" });
  if (existing) return existing;
  return await HomeSettings.create({
    key: "home",
    heroImage: "/images/home.jpg",
    heroOverlayOpacity: 0.6,
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
    aboutImageMain: s.aboutImageMain,
    aboutImageOne: s.aboutImageOne,
    aboutImageTwo: s.aboutImageTwo,
  });
});

module.exports = router;

