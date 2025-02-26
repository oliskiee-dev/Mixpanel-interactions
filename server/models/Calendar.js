const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    created_at: Date,
})


const calendarModel = mongoose.model("calendar",calendarSchema)
module.exports = calendarModel