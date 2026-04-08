const mongoose = require("mongoose");

const JoinRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    department: String,
    yearOfStudy: String,
    registerNumber: String,

    preferredDomain: String,

    skills: String,
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced", ""], default: "" },

    motivation: String,

    github: String,
    portfolio: String,

    hoursPerWeek: String,
    commitment: { type: Boolean, default: false },

    stream: String,
    message: String,

    adminNotes: String,
    status: { type: String, enum: ["new", "contacted", "accepted", "rejected"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JoinRequest", JoinRequestSchema);

