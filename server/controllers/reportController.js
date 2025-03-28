const reportModel = require('../models/Report');

// Get all reports
const viewReports = async (req, res) => {
    try {
        const reports = await reportModel.find({});
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a new report
const addReport = async (req, res) => {
    try {
        const { username, activityLog } = req.body;
        
        if (!username || !activityLog) {
            return res.status(400).json({ error: 'Username and activityLog are required' });
        }
        
        const newReport = new reportModel({ username, activityLog });
        await newReport.save();
        
        res.status(201).json({ message: 'Report added successfully', report: newReport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete all reports
const deleteReports = async (req, res) => {
    try {
        await reportModel.deleteMany({});
        res.status(200).json({ message: 'All reports deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    viewReports,
    addReport,
    deleteReports
};
