const mongoose = require("mongoose");

const HomeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: "home" },
    heroImage: { type: String, default: "/images/home.jpg" },
    heroOverlayOpacity: { type: Number, default: 0.6 },
    aboutImageMain: { type: String, default: "/images/NCA07661.jpg" },
    aboutImageOne: { type: String, default: "/images/NCA07619.JPG" },
    aboutImageTwo: { type: String, default: "/images/NCA07634.JPG" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSettings", HomeSettingsSchema);

