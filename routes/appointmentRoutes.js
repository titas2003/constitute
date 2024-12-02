const express = require('express');
const { bookAppointment } = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Book appointment route
router.post('/book', authenticate, bookAppointment);

module.exports = router;
