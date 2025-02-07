const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: String,
})


const announcementModel = mongoose.model("Announcement",announcementSchema)
module.exports = announcementModel