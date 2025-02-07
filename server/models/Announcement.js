const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    name: String,
    description: String
})


const announcementModel = mongoose.model("Item",announcementSchema)
module.exports = announcementModel