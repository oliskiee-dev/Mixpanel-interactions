// routes/reportRoutes.js
const express = require('express');
const { viewReports, addReport, deleteReports } = require('../controllers/reportController');

const router = express.Router();

// Routes
router.get('/view-report', viewReports);
router.post('/add-report', addReport);
router.delete('/delete-reports', deleteReports);

module.exports = router;