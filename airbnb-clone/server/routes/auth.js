const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config({ path: '../.env' }); // Ensure .env from server directory is loaded

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert the new user
    const newUserQuery = `
      INSERT INTO Users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at, updated_at
    `;
    const newUserResult = await pool.query(newUserQuery, [email, password_hash, first_name, last_name]);
    const newUser = newUserResult.rows[0];

    // Generate a JWT
    const payload = {
      userId: newUser.id,
      email: newUser.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Return JWT and user info (excluding password_hash)
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    });

  } catch (error) {
    console.error('Error during registration:', error);
    // Check for specific database errors if necessary, e.g., unique constraint violation
    if (error.code === '23505' && error.constraint === 'users_email_key') {
        // This is an extra check, the one above should catch it first.
        return res.status(400).json({ message: 'User with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
    }

    const user = userResult.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Passwords don't match
    }

    // Generate a JWT
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Return JWT and user info (excluding password_hash)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
