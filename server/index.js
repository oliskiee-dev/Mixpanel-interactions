const express = require('express')
const connectDB = require('./db.js')

const itemModel = require('./models/item.js')// For debugging
const userModel = require('./models/user.js')
const announcementModel = require("./models/Annoucement.js")


const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

connectDB()

//==========VIEWER CODE==============
// Get all Items (Debugging)
app.get('/', async (req,res) =>{
    const response = await itemModel.find()
    return res.json({items : response})
})

//Get all Announcements
app.get('/', async (req,res) =>{
    const response = await announcementModel.find()
    return res.json({items : response})
})

//==========ADMIN CODE==============
app.post('/login',(req,res) =>{
    const {username,password} = req.body;
    userModel.findOne({username: username})
    .then(user =>{
        if(user){
            if(user.password === password){
                res.json("Success");
            }else{
                res.json("The password is incorrect")
            }
        } else {
            res.json("Incorrect Credentials")
        }
    })
})

app.listen(3000,() => {
    console.log("app is running");
})