const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" }, // /images/... or /uploads/... or remote URL
    github: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    languages: [{ type: String }],
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["ongoing", "completed", "sold", "paused"],
      default: "ongoing",
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);

