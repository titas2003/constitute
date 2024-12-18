const Lawyer = require('../models/Lawyer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to handle lawyer registration
const registerLawyer = async (req, res) => {
  const { name, email, phone, qualificationDetail, chamberName, chamberLocation, availability, password, regNo, speciality } = req.body;

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
      speciality,
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

// Function to get lawyers by speciality
const getLawyersBySpeciality = async (req, res) => {
  const { speciality } = req.body;

  try {
    const lawyers = await Lawyer.find({ speciality });

    // Map the lawyers to their regNo and email
    const lawyerDetails = lawyers.map(lawyer => ({
      regNo: lawyer.regNo,
      email: lawyer.email,
    }));

    res.json({ lawyerDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get lawyer by registration number
const getLawyerByRegNo = async (req, res) => {
  const { regNo } = req.params;

  try {
    const lawyer = await Lawyer.findOne({ regNo });

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    res.json({
      name: lawyer.name,
      email: lawyer.email,
      phone: lawyer.phone,
      qualificationDetail: lawyer.qualificationDetail,
      chamberName: lawyer.chamberName,
      chamberLocation: lawyer.chamberLocation,
      availability: lawyer.availability,
      speciality: lawyer.speciality,
      regNo: lawyer.regNo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerLawyer, loginLawyer, getLawyersBySpeciality, getLawyerByRegNo };
