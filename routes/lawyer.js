const express = require('express');
const { registerLawyer, loginLawyer } = require('../controllers/lawyerController');

const router = express.Router();

// Lawyer registration route
router.post('/register', registerLawyer);

// Lawyer login route
router.post('/login', loginLawyer);

module.exports = router;
