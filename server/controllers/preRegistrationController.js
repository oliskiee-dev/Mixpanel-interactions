const preRegistrationModel = require('../models/PreRegistration');
const { sendApprovalEmail } = require('../service/emailService');

// Get all Pre-Registrations with filtering, pagination, and sorting
const getPreRegistrations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let filterQuery = {};
        
        if (req.query.search) filterQuery.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.grade) filterQuery.grade_level = req.query.grade;
        if (req.query.strand) filterQuery.strand = req.query.strand;
        if (req.query.type) filterQuery.isNewStudent = req.query.type;

        let sortObject = { createdAt: -1 };
        if (req.query.search) sortObject = { name: 1 };
        else if (req.query.grade) sortObject = { grade_level: 1, name: 1 };
        else if (req.query.strand) sortObject = { strand: 1, name: 1 };
        else if (req.query.type) sortObject = { isNewStudent: 1, name: 1 };

        const records = await preRegistrationModel.find(filterQuery)
            .sort(sortObject)
            .skip(skip)
            .limit(limit);

        const totalRecords = await preRegistrationModel.countDocuments(filterQuery);

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
};

// Add a new Pre-Registration
const addPreRegistration = async (req, res) => {
    try {
        const {
            name, phone_number, age, gender, birthdate, strand, grade_level, email, status, 
            appointment_date, nationality, parent_guardian_name, parent_guardian_number, 
            preferred_time, purpose_of_visit, isNewStudent
        } = req.body;

        if (!grade_level) return res.status(400).json({ error: "Grade level is required." });
        if (!isNewStudent || !['new', 'old'].includes(isNewStudent)) return res.status(400).json({ error: "isNewStudent must be 'new' or 'old'." });
        if (!gender || !['Male', 'Female'].includes(gender)) return res.status(400).json({ error: "Gender must be 'Male' or 'Female'." });
        if (!birthdate || isNaN(Date.parse(birthdate))) return res.status(400).json({ error: "Invalid birthdate format." });

        const validStatuses = ['pending', 'approved', 'rejected'];
        if (status && !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` });
        }

        const existingPreRegistration = await preRegistrationModel.findOne({ email });

        let preRegistrationData;
        if (existingPreRegistration) {
            preRegistrationData = await preRegistrationModel.findOneAndUpdate(
                { email },
                { name, phone_number, age, gender, birthdate: new Date(birthdate), strand, grade_level, nationality,
                  parent_guardian_name, parent_guardian_number, isNewStudent, status: status?.toLowerCase() || 'pending',
                  appointment_date, preferred_time, purpose_of_visit },
                { new: true }
            );
        } else {
            preRegistrationData = new preRegistrationModel({
                name, phone_number, age, gender, birthdate: new Date(birthdate), strand, grade_level, email, nationality,
                parent_guardian_name, parent_guardian_number, isNewStudent, status: status?.toLowerCase() || 'pending',
                appointment_date, preferred_time, purpose_of_visit
            });

            await preRegistrationData.save();
        }

        res.status(201).json({ message: "Pre-registration processed successfully", preregistration: preRegistrationData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update Pre-Registration status
const updatePreRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.status) {
            const validStatuses = ['pending', 'approved', 'rejected'];
            if (!validStatuses.includes(updateData.status.toLowerCase())) {
                return res.status(400).json({ error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` });
            }
            updateData.status = updateData.status.toLowerCase();
        }

        const updatedRecord = await preRegistrationModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedRecord) return res.status(404).json({ error: "Pre-registration record not found" });

        if (updateData.status === 'approved') {
            try {
                await sendApprovalEmail(updatedRecord);
                console.log(`Approval email sent to ${updatedRecord.email}`);
            } catch (emailError) {
                console.error('Failed to send approval email:', emailError);
            }
        }

        res.json({
            message: "Pre-registration updated successfully",
            emailSent: updateData.status === 'approved',
            preregistration: updatedRecord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getPreRegistrations,
    addPreRegistration,
    updatePreRegistrationStatus
};
