const mongoose = require('mongoose');

const preRegistrationSchema = new mongoose.Schema({
    name: String,
    phone_number: Number, // Using Number type
    age: Number, // Using Number type
    course: String,
    email: {
        type: String,
        unique: true, // Ensures email is unique
    },
    nationality: String, // Added nationality
    parent_guardian_name: String, // Added parent/guardian name
    parent_guardian_number: Number, // Added parent/guardian contact number
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    appointment_date: {
        type: Date,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const preRegistrationModel = mongoose.model('preRegistration', preRegistrationSchema);
module.exports = preRegistrationModel;