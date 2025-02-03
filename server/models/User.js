const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: String,
    password: String
})


const userModel = mongoose.model("User",userSchema)
module.exports = userModel