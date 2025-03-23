const express = require('express')
const connectDB = require('./db.js')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const userModel = require('./models/user.js')

// const homepageModel = require('./models/Homepage.js')
const homepageRoutes = require("./routes/homepageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const preRegistrationRoutes = require("./routes/preRegistrationRoutes");

// const announcementModel = require('./models/Announcement.js')
//const calendarModel = require('./models/Calendar.js');
//const preRegistrationModel = require('./models/PreRegistration.js');
const bookModel = require("./models/Book.js");

const { sendApprovalEmail } = require('./service/emailService.js');

dotenv.config(); 
const cors = require('cors')

const app = express()
const router = express.Router();

app.use(express.json())
app.use(cors())

connectDB()


app.use("/homepage", express.static(path.join(__dirname, "homepage")));
app.use("/homepage", homepageRoutes);

app.use("/announcement", announcementRoutes);
app.use("/announcement", express.static(path.join(__dirname, "announcement")));

app.use("/calendar", calendarRoutes); 
app.use('/preregistration', preRegistrationRoutes);

//Get all Calendar
app.get('/calendar', async (req,res) =>{
    const response = await calendarModel.find();
    return res.json({calendar : response});
})

//Get all Pre-Registration
// Get paginated Pre-Registration records
// app.get('/preregistration', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // Build filter query
//         let filterQuery = {};
        
//         // Add search filter for name (case-insensitive)
//         if (req.query.search) {
//             filterQuery.name = { $regex: req.query.search, $options: 'i' };
//         }
        
//         // Add grade filter
//         if (req.query.grade) {
//             filterQuery.grade_level = req.query.grade;
//         }
        
//         // Add strand filter
//         if (req.query.strand) {
//             filterQuery.strand = req.query.strand;
//         }
        
//         // Add type filter
//         if (req.query.type) {
//             filterQuery.isNewStudent = req.query.type;
//         }

//         // Determine how to sort based on active filters
//         let sortObject = { createdAt: -1 }; // Default sort by most recent
        
//         if (req.query.search) {
//             // If searching by name, prioritize name matching
//             sortObject = { name: 1 };
//         } else if (req.query.grade) {
//             // If filtering by grade, use special handling below
//             sortObject = { grade_level: 1, name: 1 };
//         } else if (req.query.strand) {
//             // If filtering by strand, sort by strand then name
//             sortObject = { strand: 1, name: 1 };
//         } else if (req.query.type) {
//             // If filtering by student type, sort by type then name
//             sortObject = { isNewStudent: 1, name: 1 };
//         }

//         // Use aggregation for proper grade level sorting
//         if (req.query.grade || (Object.keys(sortObject).includes('grade_level'))) {
//             const aggregationPipeline = [
//                 { $match: filterQuery },
//                 {
//                     $addFields: {
//                         gradeOrder: {
//                             $switch: {
//                                 branches: [
//                                     { case: { $eq: ["$grade_level", "Nursery"] }, then: -3 },
//                                     { case: { $eq: ["$grade_level", "Kinder 1"] }, then: -2 },
//                                     { case: { $eq: ["$grade_level", "Kinder 2"] }, then: -1 },
//                                     { case: { $eq: ["$grade_level", "1"] }, then: 1 },
//                                     { case: { $eq: ["$grade_level", "2"] }, then: 2 },
//                                     { case: { $eq: ["$grade_level", "3"] }, then: 3 },
//                                     { case: { $eq: ["$grade_level", "4"] }, then: 4 },
//                                     { case: { $eq: ["$grade_level", "5"] }, then: 5 },
//                                     { case: { $eq: ["$grade_level", "6"] }, then: 6 },
//                                     { case: { $eq: ["$grade_level", "7"] }, then: 7 },
//                                     { case: { $eq: ["$grade_level", "8"] }, then: 8 },
//                                     { case: { $eq: ["$grade_level", "9"] }, then: 9 },
//                                     { case: { $eq: ["$grade_level", "10"] }, then: 10 },
//                                     { case: { $eq: ["$grade_level", "11"] }, then: 11 },
//                                     { case: { $eq: ["$grade_level", "12"] }, then: 12 },
//                                 ],
//                                 default: 100 // Put unknown grades at the end
//                             }
//                         }
//                     }
//                 },
//                 { $sort: { gradeOrder: 1, name: 1 } },
//                 { $skip: skip },
//                 { $limit: limit }
//             ];

//             const records = await preRegistrationModel.aggregate(aggregationPipeline);
//             const totalRecords = await preRegistrationModel.countDocuments(filterQuery);

//             return res.json({
//                 totalRecords,
//                 totalPages: Math.ceil(totalRecords / limit),
//                 currentPage: page,
//                 preregistration: records,
//             });
//         }

//         // Execute query with filters and sort for non-grade related sorts
//         const records = await preRegistrationModel.find(filterQuery)
//             .sort(sortObject)
//             .skip(skip)
//             .limit(limit);

//         const totalRecords = await preRegistrationModel.countDocuments(filterQuery);

//         res.json({
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / limit),
//             currentPage: page,
//             preregistration: records,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });



// // POST - Add a new Pre-Registration
// app.post('/addPreRegistration', async (req, res) => {
//     let { 
//         name, 
//         phone_number, 
//         age, 
//         gender,
//         birthdate,
//         strand, // Optional
//         grade_level, // Required
//         email, 
//         status, 
//         appointment_date, 
//         nationality, 
//         parent_guardian_name, 
//         parent_guardian_number, 
//         preferred_time, 
//         purpose_of_visit,
//         isNewStudent // ✅ Required (new/old)
//     } = req.body;

//     // Check if required fields are missing
//     if (!grade_level) {
//         return res.status(400).json({ error: "Grade level is required." });
//     }
//     if (!isNewStudent || !['new', 'old'].includes(isNewStudent)) {
//         return res.status(400).json({ error: "isNewStudent must be 'new' or 'old'." });
//     }
//     if (!gender || !['Male', 'Female'].includes(gender)) {
//         return res.status(400).json({ error: "Gender must be 'Male' or 'Female'." });
//     }
//     if (!birthdate || isNaN(Date.parse(birthdate))) {
//         return res.status(400).json({ error: "Invalid birthdate format." });
//     }

//     // Validate status against allowed values
//     const validStatuses = ['pending', 'approved', 'rejected'];
//     if (status && !validStatuses.includes(status.toLowerCase())) {
//         return res.status(400).json({ error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` });
//     }

//     try {
//         // Check if a pre-registration with the same email already exists
//         const existingPreRegistration = await preRegistrationModel.findOne({ email });
        
//         let preRegistrationData;
//         if (existingPreRegistration) {
//             // If entry exists, update the existing pre-registration
//             preRegistrationData = await preRegistrationModel.findOneAndUpdate(
//                 { email }, // Find the document by email
//                 { 
//                     name,
//                     phone_number,
//                     age,
//                     gender,
//                     birthdate: new Date(birthdate), // Store as Date
//                     strand: strand || null, // Optional
//                     grade_level, // Required
//                     nationality,
//                     parent_guardian_name,
//                     parent_guardian_number,
//                     isNewStudent, // Already validated
//                     status: status ? status.toLowerCase() : 'pending', // Default to 'pending' if not provided
//                     appointment_date: appointment_date || null, // Optional
//                     preferred_time: preferred_time || null, // Optional
//                     purpose_of_visit: purpose_of_visit || null // Optional
//                 },
//                 { new: true } // Return the updated document
//             );
//         } else {
//             // If no existing entry, create a new one
//             preRegistrationData = new preRegistrationModel({
//                 name,
//                 phone_number,
//                 age,
//                 gender,
//                 birthdate: new Date(birthdate), // Store as Date
//                 strand: strand || null, // Optional
//                 grade_level, // Required
//                 email,
//                 nationality,
//                 parent_guardian_name,
//                 parent_guardian_number,
//                 isNewStudent, // Already validated
//                 status: status ? status.toLowerCase() : 'pending', // Default to 'pending' if not provided
//                 appointment_date: appointment_date || null, // Optional
//                 preferred_time: preferred_time || null, // Optional
//                 purpose_of_visit: purpose_of_visit || null // Optional
//             });

//             // Save the new entry
//             await preRegistrationData.save();
//         }

//         res.status(201).json({ message: "Pre-registration processed successfully", preregistration: preRegistrationData });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// // Add this route to your server file
// // PUT - Update a pre-registration record (status or other fields)
// app.put('/preRegistrationStatus/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;
        
//         // Validate status if it's being updated
//         if (updateData.status) {
//             const validStatuses = ['pending', 'approved', 'rejected'];
//             if (!validStatuses.includes(updateData.status.toLowerCase())) {
//                 return res.status(400).json({ 
//                     error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` 
//                 });
//             }
//             // Ensure status is lowercase in the database
//             updateData.status = updateData.status.toLowerCase();
//         }
        
//         // Find and update the pre-registration record
//         const updatedRecord = await preRegistrationModel.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true } // Return the updated document
//         );
        
//         if (!updatedRecord) {
//             return res.status(404).json({ error: "Pre-registration record not found" });
//         }
        
//         // Send approval email if status is changed to approved
//         if (updateData.status === 'approved') {
//             try {
//                 await sendApprovalEmail(updatedRecord);
//                 console.log(`Approval email sent to ${updatedRecord.email}`);
//             } catch (emailError) {
//                 console.error('Failed to send approval email:', emailError);
//                 // Continue with the response even if email fails
//             }
//         }
        
//         res.json({
//             message: "Pre-registration updated successfully",
//             emailSent: updateData.status === 'approved',
//             preregistration: updatedRecord
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });



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
        // Find the user by username
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Incorrect Credentials" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Success", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint to verify email/username for password reset
app.post('/forgot-password', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if user exists by username or email
        const user = await userModel.findOne({ 
            $or: [
                { email: username }
            ] 
        });

        if (!user) {
            return res.status(404).json({ error: "No account found with that email" });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        
        // In a real application, you would send this token via email
        // For this implementation, we'll just return it
        res.status(200).json({ 
            message: "User verified successfully", 
            resetToken,
            userId: user._id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint to reset password
app.post('/reset-password', async (req, res) => {
    const { password, token } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user's password
        await userModel.findByIdAndUpdate(
            decoded.id,
            { password: hashedPassword }
        );
        
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(500).json({ error: "Server error" });
    }
});



const authenticate = require('./middleware/authMiddleware'); // Import middleware

app.get('/admin-homepage', authenticate, (req, res) => {
    res.json({ message: "Welcome to the Admin Homepage!" });
});


//REGISTER TEMP CODE
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password (even if it's the same, the hash will be different)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user with a unique username but possibly the same password
        const newUser = new userModel({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//ADD BOOKING AVAILABILITY
app.get("/bookingAvailability", async (req, res) => {
    try {
        const availabilityData = await bookModel.find();
        res.json(availabilityData);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/addBookingAvailability", async (req, res) => {
    try {
        const { availability } = req.body;

        const newAvailability = new bookModel({ availability });
        await newAvailability.save();

        res.status(201).json({ message: "Availability added", data: newAvailability });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//This is considered delete too no need to add delete
app.put("/editBookingAvailability/:id", async (req, res) => {
    try {
        const { availability } = req.body;
        const updatedAvailability = await bookModel.findByIdAndUpdate(req.params.id, { availability }, { new: true });

        if (!updatedAvailability) {
            return res.status(404).json({ error: "Availability not found" });
        }

        res.json({ message: "Availability updated", data: updatedAvailability });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


// app.use("/announcement", router);
// app.use("/announcement", express.static(path.join(__dirname, "announcement")));


app.listen(3000,() => {
    console.log("app is running");
})
