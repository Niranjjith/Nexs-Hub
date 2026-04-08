const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    department: String,
    bio: String,
    image: String,
    linkedin: String,
    github: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member",MemberSchema);