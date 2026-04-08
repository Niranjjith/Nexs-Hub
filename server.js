const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/NExsDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"views/index.html"));
});

app.get("/gallery", (req,res)=>{
    res.sendFile(path.join(__dirname,"views/gallery.html"));
});

app.get("/join", (req,res)=>{
    res.sendFile(path.join(__dirname,"views/join.html"));
});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
});