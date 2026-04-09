const mongoose = require("mongoose");

const HomeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: "home" },
    heroImage: { type: String, default: "/images/home.jpg" },
    heroOverlayOpacity: { type: Number, default: 0.6 },
    aboutText: {
      type: String,
      default:
        "NeXs was established as part of the Mini Tech Park initiative to provide a structured, collaborative environment where students can explore ideas, build projects, and gain practical industry-aligned experience.\n\nUnlike classroom-only learning, NeXs emphasizes hands-on development, teamwork, and applied problem-solving. Students contribute to real projects, participate in skill-building sessions, and work with emerging technologies in a delivery-focused setting.",
    },
    aboutImageMain: { type: String, default: "/images/NCA07661.jpg" },
    aboutImageOne: { type: String, default: "/images/NCA07619.JPG" },
    aboutImageTwo: { type: String, default: "/images/NCA07634.JPG" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSettings", HomeSettingsSchema);

