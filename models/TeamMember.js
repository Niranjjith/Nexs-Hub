const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    label: String,
    href: String,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    desc: String,
  },
  { _id: false }
);

const TeamMemberSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: String, // URL (eg /uploads/.. or /images/..)
    bio: String,
    meta: [String],
    projects: [ProjectSchema],
    social: [LinkSchema],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", TeamMemberSchema);

