const mongoose = require('mongoose');

const preRegistrationSchema = new mongoose.Schema({
    name: String,
    phone_number: Number,
    age: Number,
    course: String,
    strand: { type: String, default: null }, // Added strand (optional)
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
        default: null
    },
    preferred_time: {
        type: String,
        default: null
    },
    purpose_of_visit: {
        type: String,
        default: null
    }
}, { timestamps: true });

const preRegistrationModel = mongoose.model('preRegistration', preRegistrationSchema);
module.exports = preRegistrationModel;
