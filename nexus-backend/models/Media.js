const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    src: { type: String, required: true }, // URL path (eg /uploads/.. or /images/..)
    title: String,
    description: String,
    alt: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);

