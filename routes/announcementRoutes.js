const router = require("express").Router();
const Announcement = require("../models/Announcement");

router.get("/", async(req,res)=>{
    const data = await Announcement.find();
    res.json(data);
});

module.exports = router;