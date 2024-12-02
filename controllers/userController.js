const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const jwt = require('jsonwebtoken'); // For JWT token generation
const nodemailer = require('nodemailer'); // For sending emails
const crypto = require('crypto'); // For generating OTPs

const transporter = require('../config/mailer'); // Import the mailer configuration

// In-memory store for OTPs (for simplicity, you can use a database for production)
const otpStore = {};

// Function to generate OTP
const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit hex OTP
};

// Function to handle user registration
const registerUser = async (req, res) => {
  const { email, phone, aadhar, address, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { aadhar }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or Aadhaar already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      phone,
      aadhar,
      address,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send welcome email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Constitution-1',
      text: `Hello ${email},\n\nThank you for registering at Constitution.\n\nBest regards,\nTitas Majumder`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: { email, phone, aadhar, address },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, phone: user.phone, aadhar: user.aadhar, address: user.address },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOtp();
    otpStore[email] = otp;

    // Send OTP email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP' });
      } else {
        console.log('OTP email sent:', info.response);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to verify OTP and log in user
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP is valid
    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Remove OTP from store
    delete otpStore[email];

    // Generate JWT token
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, phone: user.phone, aadhar: user.aadhar, address: user.address },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser, sendOtp, verifyOtp };

