const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: "admin" },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);

