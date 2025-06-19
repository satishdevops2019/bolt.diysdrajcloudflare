const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Ensure .env variables are loaded from server directory

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database. Current time from DB:', res.rows[0].now);
  }
});

module.exports = pool;
