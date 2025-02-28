const express = require('express')
const connectDB = require('./db.js')
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const userModel = require('./models/user.js')

const homepageModel = require('./models/Homepage.js')
const announcementModel = require('./models/Announcement.js')
const calendarModel = require('./models/Calendar.js')
const preRegistrationModel = require('./models/PreRegistration.js')

dotenv.config(); 
const cors = require('cors')

const app = express()
const router = express.Router();

app.use(express.json())
app.use(cors())

connectDB()


// Image Upload Setup
// Multer Storage Setup
const storageHomepage = multer.diskStorage({
    destination: "./homepage/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const storageAnnouncement = multer.diskStorage({
    destination: "./announcement/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage : storageHomepage});
  

// Upload Image
app.post("/upload-image", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const newImage = new homepageModel({
            image_url: req.file.filename, // Save only filename
            created_at: new Date(),
        });

        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (error) {
        console.error("Error saving image:", error);
        res.status(500).json({ message: "Error saving image to database" });
    }
});

// Delete Image
app.delete("/delete-image/:filename", async (req, res) => {
    try {
        const { filename } = req.params;

        // Find and delete from MongoDB
        const deletedImage = await homepageModel.findOneAndDelete({ image_url: filename });

        if (!deletedImage) {
            return res.status(404).json({ message: "Image not found in database" });
        }

        // Delete from server storage
        const filePath = path.join(__dirname, "homepage", filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: "Failed to delete file from server" });
            }
            res.json({ message: "Image deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ message: "Error deleting image" });
    }
});

//==========VIEWER CODE==============
// Get all images
router.get("/images", async (req, res) => {
    try {
      const images = await homepageModel.find();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving images" });
    }
  });

//Get all Announcements
app.get('/announcement', async (req,res) =>{
    const response = await announcementModel.find();
    return res.json({announcement : response});
})

// // POST - Add a new Announcement
// app.post('/addAnnouncement', async (req, res) => {
//     const { title, description, image_url } = req.body;

//     // Basic validation for required fields
//     if (!title || !description || !image_url) {
//         return res.status(400).json({ error: 'Missing required fields: title, description, or image_url' });
//     }

//     try {
//         // Create new announcement with the current time as created_at
//         const newAnnouncement = new announcementModel({
//             title,
//             description,
//             image_url,
//             created_at: new Date()  // Automatically set created_at to now
//         });

//         // Save the announcement to the database
//         const savedAnnouncement = await newAnnouncement.save();
//         res.status(201).json({ message: 'Announcement added successfully', announcement: savedAnnouncement });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// //This would required add a specific id in "":id"
// // PUT - Edit an existing Announcement
// app.put('/editAnnouncement/:id', async (req, res) => {
//     let { id } = req.params; // Extract ID from URL
//     id = id.trim(); // Remove spaces and newline characters

//     // Validate if ID is a proper MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid announcement ID format' });
//     }

//     const { title, description, image_url } = req.body; // Get updated data

//     try {
//         // Check if the announcement exists
//         const existingAnnouncement = await announcementModel.findById(id);
//         if (!existingAnnouncement) {
//             return res.status(404).json({ error: 'Announcement not found' });
//         }

//         // Update announcement details
//         const updatedAnnouncement = await announcementModel.findByIdAndUpdate(
//             id,
//             { title, description, image_url, updated_at: new Date() }, // Fields to update
//             { new: true } // Return the updated document
//         );

//         res.status(200).json({ message: 'Announcement updated successfully', announcement: updatedAnnouncement });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// //This would required add a specific id in "":id"
// // DELETE - Remove an Announcement by ID
// app.delete('/deleteAnnouncement/:id', async (req, res) => {
//     let { id } = req.params;
//     id = id.trim(); // Remove spaces or newline characters

//     // Validate ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid announcement ID format' });
//     }

//     try {
//         // Find and delete the announcement
//         const deletedAnnouncement = await announcementModel.findByIdAndDelete(id);

//         if (!deletedAnnouncement) {
//             return res.status(404).json({ error: 'Announcement not found' });
//         }

//         res.status(200).json({ message: 'Announcement deleted successfully', deletedAnnouncement });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

//Get all Calendar
app.get('/calendar', async (req,res) =>{
    const response = await calendarModel.find();
    return res.json({calendar : response});
})

//Add a new Calendar Event
app.post('/addCalendar', async (req, res) => {
    const { title, date, description, type } = req.body;

    // Basic validation for required fields
    if (!title || !date || !description || !type) {
        return res.status(400).json({ error: 'Missing required fields: title, date, description, or type' });
    }

    // Validate that the type is either "event" or "holiday"
    if (!['event', 'holiday'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. It should be either "event" or "holiday".' });
    }

    try {
        // Create new calendar entry with the current time as created_at
        const newEntry = new calendarModel({
            title,
            date,
            created_at: new Date(),  // Automatically set created_at to now
            type,  // Set the type ("event" or "holiday")
        });

        // Save the entry to the database
        const savedEntry = await newEntry.save();
        res.status(201).json({ message: 'Calendar entry added successfully', entry: savedEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



//Get all Pre-Registration
// Get paginated Pre-Registration records
app.get('/preregistration', async (req, res) => {
    try {
        // Get page and limit from query params (default: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch records with pagination
        const records = await preRegistrationModel.find()
            .skip(skip)
            .limit(limit);

        // Count total records for pagination info
        const totalRecords = await preRegistrationModel.countDocuments();

        res.json({
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            preregistration: records,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// POST - Add a new Pre-Registration
app.post('/addPreRegistration', async (req, res) => {
    let { 
        name, 
        phone_number, 
        age, 
        strand, // Optional
        grade_level, // Required
        email, 
        status, 
        appointment_date, 
        nationality, 
        parent_guardian_name, 
        parent_guardian_number, 
        preferred_time, 
        purpose_of_visit,
        isNewStudent // ✅ Required (new/old)
    } = req.body;

    // Check if grade_level and isNewStudent are missing
    if (!grade_level) {
        return res.status(400).json({ error: "Grade level is required." });
    }
    if (!isNewStudent || !['new', 'old'].includes(isNewStudent.toLowerCase())) {
        return res.status(400).json({ error: "isNewStudent must be 'new' or 'old'." });
    }

    // Convert status to lowercase if provided
    if (status) {
        status = status.toLowerCase();
    }

    // Validate status against allowed values
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` });
    }

    try {
        // Check if a pre-registration with the same email already exists
        const existingPreRegistration = await preRegistrationModel.findOne({ email });
        
        let preRegistrationData;
        if (existingPreRegistration) {
            // If entry exists, update the existing pre-registration
            preRegistrationData = await preRegistrationModel.findOneAndUpdate(
                { email }, // Find the document by email
                { 
                    name,
                    phone_number,
                    age,
                    strand: strand || null, // Optional
                    grade_level, // Required
                    nationality,
                    parent_guardian_name,
                    parent_guardian_number,
                    isNewStudent: isNewStudent.toLowerCase(), // Ensure lowercase for consistency
                    status: status || 'pending', // Default to 'pending' if not provided
                    appointment_date: appointment_date || null, // Optional
                    preferred_time: preferred_time || null, // Optional
                    purpose_of_visit: purpose_of_visit || null // Optional
                },
                { new: true } // Return the updated document
            );
        } else {
            // If no existing entry, create a new one
            preRegistrationData = new preRegistrationModel({
                name,
                phone_number,
                age,
                strand: strand || null, // Optional
                grade_level, // Required
                email,
                nationality,
                parent_guardian_name,
                parent_guardian_number,
                isNewStudent: isNewStudent.toLowerCase(), // Ensure lowercase for consistency
                status: status || 'pending', // Default to 'pending' if not provided
                appointment_date: appointment_date || null, // Optional
                preferred_time: preferred_time || null, // Optional
                purpose_of_visit: purpose_of_visit || null // Optional
            });

            // Save the new entry
            await preRegistrationData.save();
        }

        res.status(201).json({ message: "Pre-registration processed successfully", preregistration: preRegistrationData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});





// POST - Add a Booking
app.post('/addBooking', async (req, res) => {
    const { email, appointment_date, preferred_time, purpose_of_visit } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required to update the booking." });
    }

    try {
        const user = await preRegistrationModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found. Please register first." });
        }

        // Update appointment details
        user.appointment_date = appointment_date || user.appointment_date;
        user.preferred_time = preferred_time || user.preferred_time;
        user.purpose_of_visit = purpose_of_visit || user.purpose_of_visit;

        await user.save();
        res.status(200).json({ message: "Appointment updated successfully", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});



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


// POST - Add new announcement with image
router.post("/addAnnouncement", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const { title, description } = req.body;
        const image_url = req.file.filename; // Store only the filename

        const newAnnouncement = new Announcement({ title, description, image_url });
        await newAnnouncement.save();

        res.status(201).json({
            message: "Announcement added successfully",
            announcement: newAnnouncement,
        });
    } catch (error) {
        console.error("Error adding announcement:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// PUT - Edit an existing announcement (image optional)
router.put("/editAnnouncement/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Find existing announcement
        const existingAnnouncement = await Announcement.findById(id);
        if (!existingAnnouncement) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        // Update fields
        let image_url = existingAnnouncement.image_url; // Keep existing image if none is uploaded
        if (req.file) {
            image_url = req.file.filename;

            // Delete old image from server
            const oldImagePath = path.join(__dirname, "../homepage", existingAnnouncement.image_url);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }

        // Update database record
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { title, description, image_url },
            { new: true }
        );

        res.status(200).json({
            message: "Announcement updated successfully",
            announcement: updatedAnnouncement,
        });
    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE - Remove an announcement and its image
router.delete("/deleteAnnouncement/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the announcement
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        // Delete image file from server
        const imagePath = path.join(__dirname, "../announcement", announcement.image_url);
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        // Remove from database
        await Announcement.findByIdAndDelete(id);

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
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

app.use("/homepage", router);
app.use("/homepage", express.static(path.join(__dirname, "homepage")));

// app.use("/announcement", router);
// app.use("/announcement", express.static(path.join(__dirname, "announcement")));


app.listen(3000,() => {
    console.log("app is running");
})
