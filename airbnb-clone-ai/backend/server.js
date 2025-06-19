// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Further imports for database, routes will be added later

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Airbnb Clone Backend API!' });
});

// Database connection and models setup (will be expanded later)
const db = require('./models'); // Assuming models will be in a 'models' directory
// Sync database
// In development, you might want to use { force: true } to drop and re-sync db
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });
db.sequelize.sync().then(() => {
   console.log('Database synced.');
}).catch((err) => {
   console.error('Failed to sync db: ' + err.message);
});

// Auth routes (will be created in a separate file/router)
require('./routes/auth.routes')(app);
// Property routes
require('./routes/property.routes')(app);
// Booking routes
require('./routes/booking.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
