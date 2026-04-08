const router = require("express").Router();
const Member = require("../models/Member");

router.get("/", async(req,res)=>{
    const data = await Member.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(data);
});

module.exports = router;