const express = require('express');
const { registerLawyer, loginLawyer, getLawyersBySpeciality, getLawyerByRegNo } = require('../controllers/lawyerController');

const router = express.Router();

// Lawyer registration route
router.post('/register', registerLawyer);

// Lawyer login route
router.post('/login', loginLawyer);

// Get lawyers by speciality
router.post('/by-speciality', getLawyersBySpeciality);

// Get lawyer by registration number
router.get('/by-regno/:regNo', getLawyerByRegNo);

module.exports = router;
