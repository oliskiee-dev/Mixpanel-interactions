const express = require('express');
const { 
    getPreRegistrations, 
    addPreRegistration, 
    updatePreRegistrationStatus 
} = require('../controllers/preRegistrationController');

const router = express.Router();

router.get('/preregistration', getPreRegistrations);
router.post('/addPreRegistration', addPreRegistration);
router.put('/preRegistrationStatus/:id', updatePreRegistrationStatus);

module.exports = router;
