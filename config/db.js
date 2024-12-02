const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      // No need for useNewUrlParser and useUnifiedTopology anymore
      dbName: process.env.DB_NAME,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
