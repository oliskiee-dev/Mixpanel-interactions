const express = require('express')
const connectDB = require('./db.js')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const itemModel = require('./models/item.js')// For debugging
const userModel = require('./models/user.js')
const announcementModel = require('./models/Announcement.js')

dotenv.config(); 
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

connectDB()

//==========VIEWER CODE==============
// Get all Items (Debugging)
app.get('/test', async (req,res) =>{
    const response = await itemModel.find();
    return res.json({items : response});
})

//Get all Announcements
app.get('/announcement', async (req,res) =>{
    const response = await itemModel.find();
    return res.json({items : response});
})



//==========ADMIN CODE==============
// app.post('/login',(req,res) =>{
//     const {username,password} = req.body;
//     userModel.findOne({username: username})
//     .then(user =>{
//         if(user){
//             if(user.password === password){
//                 res.json("Success");
//             }else{
//                 res.json("The password is incorrect")
//             }
//         } else {
//             res.json("Incorrect Credentials")
//         }
//     })
// })


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received request:', req.body); // Log the received data

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Incorrect Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "The password is incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Success", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});



const authenticate = require('./middleware/authMiddleware'); // Import middleware
// const { default: Announcement } = require('../teamweb/src/Viewer/Announcement/Announcement.jsx');

app.get('/admin-homepage', authenticate, (req, res) => {
    res.json({ message: "Welcome to the Admin Homepage!" });
});


//REGISTER TEMP CODE
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const existingUser = await userModel.findOne({ username });
//         if (existingUser) return res.status(400).json({ error: "Username already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new userModel({ username, password: hashedPassword });
//         await newUser.save();

//         res.json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// });



app.listen(3000,() => {
    console.log("app is running");
})