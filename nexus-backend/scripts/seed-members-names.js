const mongoose = require("mongoose");
const path = require("path");

// Load `nexus-backend/.env` (same as server) for local seeding.
if (!process.env.VERCEL) {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const Member = require(path.join(__dirname, "..", "models", "Member"));

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in nexus-backend/.env");

  const names = [
    "Nida Sawad",
    "Riya Riyas",
    "Risvana Thesni",
    "Hiba Fathima",
    "Neha Nesrin",
    "Lulu Fathima",
    "Fathima Sarosh",
    "Fawas",
    "Shadhil",
    "Suhail",
    "Rishal",
    "Surur",
    "Fida",
    "Shareefa",
    "Afna",
    "Shinas",
    "Yousaf",
    "Abhinand",
    "Jagan",
    "Manikandan",
    "Sooryan",
    "Amith pr",
  ];

  await mongoose.connect(MONGODB_URI);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    await Member.findOneAndUpdate(
      { name },
      {
        name,
        role: "",
        department: "Multimedia",
        bio: "",
        image: "",
        linkedin: "",
        github: "",
        order: (i + 1) * 10,
        active: true,
      },
      { upsert: true, new: true }
    );
  }

  console.log("Seeded members:", names.length);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

