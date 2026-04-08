const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    title:String,
    description:String,
    date:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Announcement",AnnouncementSchema);