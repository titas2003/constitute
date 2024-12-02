const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  qualificationDetail: {
    type: [String], // Array of strings
    required: true,
  },
  chamberName: {
    type: String,
    required: true,
  },
  chamberLocation: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password
lawyerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

module.exports = Lawyer;
