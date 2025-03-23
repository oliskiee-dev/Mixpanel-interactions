const express = require('express')
const connectDB = require('./db.js')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const userModel = require('./models/user.js')

const homepageRoutes = require("./routes/homepageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const preRegistrationRoutes = require("./routes/preRegistrationRoutes");

const bookModel = require("./models/Book.js");

const { sendApprovalEmail } = require('./service/emailService.js'); //Just in case for future use

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
