const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Airbnb Clone API" });
});

// API Routers
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const listingRoutes = require('./routes/listings');
app.use('/api/listings', listingRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Global Error Handler - Must be last
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is not set

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
