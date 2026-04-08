const app = require("./app");
const path = require("path");
const express = require("express");

// Local dev: serve the static frontend from `nexus-frontend/`.
// On Vercel, `vercel.json` serves these as static routes.
const frontendDir = path.resolve(__dirname, "..", "nexus-frontend");
app.use(express.static(frontendDir));

app.get("/", (req, res) => res.sendFile(path.join(frontendDir, "index.html")));
app.get("/gallery", (req, res) =>
  res.sendFile(path.join(frontendDir, "gallery.html"))
);
app.get("/join", (req, res) => res.sendFile(path.join(frontendDir, "join.html")));
app.get("/members", (req, res) =>
  res.sendFile(path.join(frontendDir, "members.html"))
);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});