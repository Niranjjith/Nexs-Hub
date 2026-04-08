const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

const app = express();

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
  })
);

const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://niranjjithbathery_db_user:WG9L9JRa7eiSv78y@cluster0.24uzbdb.mongodb.net/?appName=Cluster0";

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
app.use("/api/join-requests", require("./routes/joinRequestRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views/gallery.html"));
});

app.get("/join", (req, res) => {
  res.sendFile(path.join(__dirname, "views/join.html"));
});

app.get("/members", (req, res) => {
  res.sendFile(path.join(__dirname, "views/members.html"));
});

module.exports = app;

