const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const app = express();

// Render/Vercel sit behind proxies; required for secure cookies over HTTPS.
app.set("trust proxy", 1);

// Beginner gotcha: without CORS, a separate frontend will fail in the browser.
// Configure allowed origins via CORS_ORIGIN (comma-separated). Use "*" only for non-cookie APIs.
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// On Vercel, static assets are best served as separate static outputs.
// Keeping express.static there can cause big folders (public/images) to be traced into the function bundle.
if (!process.env.VERCEL) {
  app.use(express.static("public"));
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nexs_dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/NExsDB";

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}

app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/home-settings", require("./routes/homeSettingsRoutes"));
app.use("/api/join-requests", require("./routes/joinRequestRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

// Frontend pages are served separately (e.g. `nexus-frontend/` on Vercel).

module.exports = app;

