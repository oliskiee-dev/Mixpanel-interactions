const express = require('express')
const connectDB = require('./db.js')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

//const userModel = require('./models/User.js')
//const reportModel = require('./models/Report.js');

const homepageRoutes = require("./routes/homepageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const preRegistrationRoutes = require("./routes/preRegistrationRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const { sendApprovalEmail } = require('./service/emailService.js'); //Just in case for future use

dotenv.config(); 
const cors = require('cors')

const app = express()
const router = express.Router();

app.use(express.json())
app.use(cors())

connectDB()

// Serve frontend from 'teamweb' instead of 'dist'
app.use(express.static(path.join(__dirname, 'teamweb')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'teamweb', 'index.html'));
});



app.use("/homepage", express.static(path.join(__dirname, "homepage")));
app.use("/homepage", homepageRoutes);

app.use("/announcement", announcementRoutes);
app.use("/announcement", express.static(path.join(__dirname, "announcement")));

app.use("/calendar", calendarRoutes); 
app.use('/preregistration', preRegistrationRoutes);
app.use("/booking", bookRoutes);
app.use('/report', reportRoutes);
app.use('/user', userRoutes);

app.use("/", router); 

// app.listen(3000,() => {
//     console.log("app is running");
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
