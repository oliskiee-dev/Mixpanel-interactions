const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    img_url: String,
})

const announcementModel = mongoose.model("Announcement", announcementSchema);

module.exports = announcementModel;