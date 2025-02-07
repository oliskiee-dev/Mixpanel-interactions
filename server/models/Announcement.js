const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: String,
})


const announcementModel = mongoose.model("Item",announcementSchema)
module.exports = announcementModel