const router = require("express").Router();
const Member = require("../models/Member");

router.get("/", async(req,res)=>{
    const data = await Member.find();
    res.json(data);
});

module.exports = router;