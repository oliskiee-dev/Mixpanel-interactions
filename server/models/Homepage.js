const mongoose = require('mongoose')

const homepageSchema = new mongoose.Schema({
    image_url: String,
    created_at: { type: Date, default: Date.now },
});


const homepageModel = mongoose.model("homepage",homepageSchema)
module.exports = homepageModel