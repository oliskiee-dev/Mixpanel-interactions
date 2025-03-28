const express = require('express')
const connectDB = require('./db.js')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const userModel = require('./models/User.js')
//const reportModel = require('./models/Report.js');

const homepageRoutes = require("./routes/homepageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const preRegistrationRoutes = require("./routes/preRegistrationRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reportRoutes = require('./routes/reportRoutes');

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
app.use('/report', reportRoutes);

// router.get('/view-report', async (req, res) => {
//     try {
//         const reports = await reportModel.find({});
//         res.status(200).json(reports);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// router.post('/add-report', async (req, res) => {
//     try {
//         const { username, activityLog } = req.body;
        
//         if (!username || !activityLog) {
//             return res.status(400).json({ error: 'Username and activityLog are required' });
//         }
        
//         const newReport = new reportModel({ username, activityLog });
//         await newReport.save();
        
//         res.status(201).json({ message: 'Report added successfully', report: newReport });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// router.delete('/delete-reports', async (req, res) => {
//     try {
//         await reportModel.deleteMany({});
//         res.status(200).json({ message: 'All reports deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });


//==========ADMIN CODE==============
//Add bycrpt and hash if register will be included in the future
// Update your login endpoint in server.js
const authenticate = require('./middleware/authMiddleware'); // Import middleware
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
// Updated reset-password endpoint for server.js
app.post('/reset-password', async (req, res) => {
    const { password, token } = req.body;

    try {
        let userId;

        // Check if we have a token in the request body (password reset flow)
        if (token) {
            // Verify the reset token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } 
        // Check if user is authenticated (logged in user changing password)
        else {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Authentication required or reset token needed' });
            }
            
            // Extract token from header
            const authToken = authHeader.split(' ')[1];
            
            // Verify the auth token
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            userId = decoded.id;
        }

        if (!userId) {
            return res.status(401).json({ error: 'User identification failed' });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user's password
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(500).json({ error: "Server error" });
    }
});


app.post('/edit-password', async (req, res) => {
    const { password, targetUserId } = req.body;

    try {
        // Ensure the requester is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the target user's password
        const updatedUser = await userModel.findByIdAndUpdate(targetUserId, { password: hashedPassword });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/update-user-info', async (req, res) => {
    const { targetUserId, username, email, password } = req.body;

    try {
        // Validate the token and get the authenticated user
        // Ensure the requester is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        // Prepare update object
        const updateData = {};

        // Check username update
        if (username) {
            // Check if username is already taken
            const existingUsername = await userModel.findOne({ username });
            if (existingUsername && existingUsername._id.toString() !== targetUserId) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            updateData.username = username;
        }

        // Check email update
        if (email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if email is already taken
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== targetUserId) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            updateData.email = email;
        }

        // Check password update
        if (password) {
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        // Permissions check
        // Head admin can update any user
        // Regular admin can only update their own account or other admin accounts
        // Users can only update their own account
        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        // Perform the update
        const updatedUser = await userModel.findByIdAndUpdate(
            targetUserId, 
            { $set: updateData }, 
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ 
            message: "User information updated successfully",
            user: updatedUser 
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
        res.status(500).json({ error: "Server error" });
    }
});


app.get('/admin-homepage', authenticate, (req, res) => {
    res.json({ message: "Welcome to the Admin Homepage!" });
});

// Endpoint to delete user account
app.delete('/delete-account', authenticate, async (req, res) => {
    const { targetUserId } = req.body;

    try {
        // Get current user details
        const currentUser = await userModel.findById(req.user.id);
        
        // Prevent deleting the only head admin
        if (currentUser.role === 'head_admin') {
            const headAdminCount = await userModel.countDocuments({ role: 'head_admin' });
            if (headAdminCount <= 1 && currentUser._id.toString() === targetUserId) {
                return res.status(400).json({ error: 'Cannot delete the last head admin account' });
            }
        }
        
        // Find and delete the user
        const deletedUser = await userModel.findByIdAndDelete(targetUserId);
        
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
// Endpoint to get current user's information
app.get('/current-user', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find the requesting user's details
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'head_admin') {
            // Fetch all admins, sorting to ensure the Head Admin appears first
            const admins = await userModel.find({ role: { $in: ['head_admin', 'admin'] } })
                .sort({ role: -1 }) // Ensures 'head_admin' comes first
                .select('-password');

            return res.status(200).json({ user, admins });
        }

        // If normal admin, return only their own data
        return res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


//REGISTER TEMP CODE
// Updated register endpoint that includes email
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check if the email already exists
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user with username, email, and hashed password
        const newUser = new userModel({ 
            username, 
            email,
            password: hashedPassword 
        });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.use("/", router); 

app.listen(3000,() => {
    console.log("app is running");
})
