const express = require('express');
const {
    getPreRegistrations,
    addPreRegistration,
    updatePreRegistrationStatus,
    addBooking
} = require('../controllers/preRegistrationController');

const router = express.Router();

router.get('/', getPreRegistrations);
router.post('/add', addPreRegistration);
router.put('/status/:id', updatePreRegistrationStatus);
router.post('/addBooking', addBooking);
router.delete('/deleteAll', deletePreRegistration); 

module.exports = router;
