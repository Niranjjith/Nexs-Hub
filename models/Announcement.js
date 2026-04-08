const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    title:String,
    description:String,
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Announcement",AnnouncementSchema);