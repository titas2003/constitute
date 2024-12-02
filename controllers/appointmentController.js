const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Function to handle booking an appointment
const bookAppointment = async (req, res) => {
  const { name, address, lawyer, date, time, issueType, issue } = req.body;
  const userId = req.user.userId; // Assuming user ID is stored in req.user

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check for existing appointment with the same lawyer at the same date and time
    const existingAppointment = await Appointment.findOne({
      lawyer,
      date,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment already booked for this time slot with the same lawyer' });
    }

    // Create a new appointment
    const appointment = new Appointment({
      user: userId,
      name,
      address,
      lawyer,
      date,
      time,
      issueType,
      issue,
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { bookAppointment };
