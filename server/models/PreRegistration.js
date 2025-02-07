const mongoose = require('mongoose');

const preRegistrationSchema = new mongoose.Schema({
    name: String,
    phone_number: Number, // Using Number type
    age: Number, // Using Number type
    email: {
        type: String,
        unique: true, // Ensures email is unique
    },
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
