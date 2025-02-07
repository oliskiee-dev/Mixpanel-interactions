const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    image_url:String,
    created_at: Date,
})


const announcementModel = mongoose.model("announcement",announcementSchema)
module.exports = announcementModel