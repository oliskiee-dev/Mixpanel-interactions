const mongoose = require('mongoose');

const preRegistrationSchema = new mongoose.Schema({
    name: String,
    phone_number: Number,
    age: Number,
    course: String,
    email: {
        type: String,
        unique: true,
    },
    nationality: String,
    parent_guardian_name: String,
    parent_guardian_number: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    appointment_date: {
        type: Date,
    },
    preferred_time: String, // Added preferred time
    purpose_of_visit: String // Added purpose of visit
}, { timestamps: true });

const preRegistrationModel = mongoose.model('preRegistration', preRegistrationSchema);
module.exports = preRegistrationModel;