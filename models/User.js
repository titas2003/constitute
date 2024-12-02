const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  aadhar: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
