const Lawyer = require('../models/Lawyer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to handle lawyer registration
const registerLawyer = async (req, res) => {
  const { name, email, phone, qualificationDetail, chamberName, chamberLocation, availability, password, regNo } = req.body;

  try {
    // Check if the lawyer already exists
    let lawyer = await Lawyer.findOne({ email });
    if (lawyer) {
      return res.status(400).json({ message: 'Lawyer already exists' });
    }

    // Check if regNo already exists
    lawyer = await Lawyer.findOne({ regNo });
    if (lawyer) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }

    // Create a new lawyer
    lawyer = new Lawyer({
      name,
      email,
      phone,
      qualificationDetail,
      chamberName,
      chamberLocation,
      availability,
      password,
      regNo,
    });

    await lawyer.save();

    // Create JWT token
    const payload = {
      lawyerId: lawyer._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Lawyer registered successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to handle lawyer login
const loginLawyer = async (req, res) => {
  const { regNo, password } = req.body;

  try {
    // Check if the lawyer exists
    const lawyer = await Lawyer.findOne({ regNo });
    if (!lawyer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      lawyerId: lawyer._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerLawyer, loginLawyer };
