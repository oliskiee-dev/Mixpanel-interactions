const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    img_url: String,
    created_at: Date,
});


const announcementModel = mongoose.model("Announcement",announcementSchema)
module.exports = announcementModel