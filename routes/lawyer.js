const express = require('express');
const { registerLawyer, loginLawyer, getLawyersBySpeciality } = require('../controllers/lawyerController');

const router = express.Router();

// Lawyer registration route
router.post('/register', registerLawyer);

// Lawyer login route
router.post('/login', loginLawyer);

// Get lawyers by speciality
router.post('/by-speciality', getLawyersBySpeciality);

module.exports = router;
