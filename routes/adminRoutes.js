const router = require("express").Router();
const Member = require("../models/Member");
const Announcement = require("../models/Announcement");

router.post("/add-member", async(req,res)=>{

    const member = new Member({
        name:req.body.name,
        role:req.body.role,
        department:req.body.department,
        linkedin:req.body.linkedin
    });

    await member.save();

    res.json({message:"Member added"});
});

router.post("/add-announcement", async(req,res)=>{

    const announcement = new Announcement({
        title:req.body.title,
        description:req.body.description
    });

    await announcement.save();

    res.json({message:"Announcement added"});
});

module.exports = router;