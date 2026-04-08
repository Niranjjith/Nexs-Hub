const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");

// Load `nexus-backend/.env` for local use (same as server).
// On Vercel, use Project Environment Variables.
if (!process.env.VERCEL) {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const AdminSettings = require(path.join(__dirname, "..", "models", "AdminSettings"));

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI. Set it in nexus-backend/.env");
  }

  await mongoose.connect(MONGODB_URI);

  const username = "admin";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await AdminSettings.findOneAndUpdate(
    { key: "admin" },
    { key: "admin", username, passwordHash, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  console.log("Admin credentials reset.");
  console.log("username:", username);
  console.log("password:", password);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

