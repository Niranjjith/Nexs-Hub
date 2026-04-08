const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    name:String,
    role:String,
    department:String,
    linkedin:String
}, { timestamps: true });

module.exports = mongoose.model("Member",MemberSchema);