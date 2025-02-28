const mongoose = require('mongoose')

const homepageSchema = new mongoose.Schema({
    image_url:String,
    created_at: Date,
})


const homepageModel = mongoose.model("homepage",homepageSchema)
module.exports = homepageModel