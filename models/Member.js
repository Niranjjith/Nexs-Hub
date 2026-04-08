const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    name:String,
    role:String,
    department:String,
    linkedin:String
});

module.exports = mongoose.model("Member",MemberSchema);