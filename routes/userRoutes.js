const express = require('express');
const { registerUser, loginUser, sendOtp, verifyOtp } = require('../controllers/userController');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Send OTP route
router.post('/send-otp', sendOtp);

// Verify OTP route
router.post('/verify-otp', verifyOtp);

module.exports = router;
