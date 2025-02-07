const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    img_url: String,
    created_at: {
        type: Date, // Change this from String to Date
        default: Date.now, // Optional: Set a default value as the current date
    },
});

const announcementModel = mongoose.model("Announcement", announcementSchema);

module.exports = announcementModel;