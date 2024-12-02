const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import the DB connection function
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Create the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to the database
connectDB();

// Use user routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
