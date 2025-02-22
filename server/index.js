const express = require('express')
const connectDB = require('./db.js')
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const itemModel = require('./models/item.js')// For debugging
const userModel = require('./models/user.js')

const announcementModel = require('./models/Announcement.js')
const calendarModel = require('./models/Calendar.js')
const preRegistrationModel = require('./models/PreRegistration.js')

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
    const response = await announcementModel.find();
    return res.json({announcement : response});
})

// POST - Add a new Announcement
app.post('/addAnnouncement', async (req, res) => {
    const { title, description, image_url } = req.body;

    // Basic validation for required fields
    if (!title || !description || !image_url) {
        return res.status(400).json({ error: 'Missing required fields: title, description, or image_url' });
    }

    try {
        // Create new announcement with the current time as created_at
        const newAnnouncement = new announcementModel({
            title,
            description,
            image_url,
            created_at: new Date()  // Automatically set created_at to now
        });

        // Save the announcement to the database
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement added successfully', announcement: savedAnnouncement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//This would required add a specific id in "":id"
// PUT - Edit an existing Announcement
app.put('/editAnnouncement/:id', async (req, res) => {
    let { id } = req.params; // Extract ID from URL
    id = id.trim(); // Remove spaces and newline characters

    // Validate if ID is a proper MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid announcement ID format' });
    }

    const { title, description, image_url } = req.body; // Get updated data

    try {
        // Check if the announcement exists
        const existingAnnouncement = await announcementModel.findById(id);
        if (!existingAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        // Update announcement details
        const updatedAnnouncement = await announcementModel.findByIdAndUpdate(
            id,
            { title, description, image_url, updated_at: new Date() }, // Fields to update
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: 'Announcement updated successfully', announcement: updatedAnnouncement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


//Get all Calendar
app.get('/calendar', async (req,res) =>{
    const response = await calendarModel.find();
    return res.json({calendar : response});
})

//Add a new Calendar Event
app.post('/addCalendar', async (req, res) => {
    const { title, date, description } = req.body;

    // Basic validation for required fields
    if (!title || !date || !description) {
        return res.status(400).json({ error: 'Missing required fields: title, date, or description' });
    }

    try {
        // Create new calendar event with the current time as created_at
        const newEvent = new calendarModel({
            title,
            date,
            description,
            created_at: new Date()  // Automatically set created_at to now
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();
        res.status(201).json({ message: 'Event added successfully', event: savedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



//Get all Pre-Registration
app.get('/preregistration', async (req,res) =>{
    const response = await preRegistrationModel.find();
    return res.json({preregistration : response});
})


//==========ADMIN CODE==============
//Add bycrpt and hash if register will be included in the future
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Incorrect Credentials" });
        }

        // Directly compare the plain-text password with the stored password
        if (password !== user.password) {
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