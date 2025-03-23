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
const bookRoutes = require("./routes/bookRoutes");

//const bookModel = require("./models/Book.js");

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
app.use("/booking", bookRoutes);

//==========ADMIN CODE==============
//Add bycrpt and hash if register will be included in the future
// Update your login endpoint in server.js
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

        // Generate JWT token - make sure the payload structure matches what your middleware expects
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Success", 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email || 'No email provided'
            }
        });
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
app.post('/reset-password', authenticate, async (req, res) => {
    const { password } = req.body;

    try {
        // User is already authenticated via middleware
        const userId = req.user.id;
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user's password
        await userModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword }
        );
        
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


const authenticate = require('./middleware/authMiddleware'); // Import middleware

app.get('/admin-homepage', authenticate, (req, res) => {
    res.json({ message: "Welcome to the Admin Homepage!" });
});

// Endpoint to delete user account
app.delete('/delete-account', authenticate, async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const userId = req.user.id;
        
        // Find and delete the user
        const deletedUser = await userModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Endpoint to get current user's information
app.get('/current-user', authenticate, async (req, res) => {
    try {
        // The authenticate middleware already verified the token
        // and added the user ID to req.user
        const userId = req.user.id;
        
        // Find the user in the database (excluding password)
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
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

app.listen(3000,() => {
    console.log("app is running");
})
