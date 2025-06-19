const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/bookings/ - Create a new booking (Protected Route)
router.post('/', authenticateToken, async (req, res) => {
  const { listing_id, check_in_date, check_out_date, num_guests, total_price } = req.body;
  const user_id = req.user.userId; // From authenticateToken middleware

  // Basic Validation
  if (!listing_id || !check_in_date || !check_out_date || !num_guests || total_price === undefined) {
    return res.status(400).json({ message: 'Please provide all required booking details: listing_id, check_in_date, check_out_date, num_guests, total_price.' });
  }

  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize today's date to midnight for comparison

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return res.status(400).json({ message: 'Invalid date format.' });
  }
  if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past.' });
  }
  if (checkOut <= checkIn) {
    return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
  }
  if (num_guests <= 0) {
    return res.status(400).json({ message: 'Number of guests must be positive.' });
  }
  if (total_price < 0) {
    return res.status(400).json({ message: 'Total price cannot be negative.' });
  }

  // In a real app, you'd verify listing_id exists, check for availability,
  // and calculate total_price based on price_per_night from Listings table.
  // For now, we trust total_price from client and assume listing exists.

  try {
    const query = `
      INSERT INTO Bookings (user_id, listing_id, check_in_date, check_out_date, num_guests, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    // Default status to 'confirmed' for simplicity here, could be 'pending'
    const values = [user_id, listing_id, check_in_date, check_out_date, num_guests, total_price, 'confirmed'];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.code === '23503' && error.constraint === 'bookings_listing_id_fkey') {
        return res.status(404).json({ message: 'Listing not found or does not exist.' });
    }
    if (error.code === '23502') { // not_null_violation
        return res.status(400).json({ message: 'Missing required field for booking.' });
    }
    if (error.code === '22007' || error.code === '22008') { // invalid_datetime_format or datetime_field_overflow
        return res.status(400).json({ message: 'Invalid date format or value for check-in/check-out dates.'});
    }
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
});

// GET /api/bookings/mybookings - Get all bookings for the authenticated user (Protected Route)
router.get('/mybookings', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const query = `
      SELECT
        b.id AS booking_id,
        b.check_in_date,
        b.check_out_date,
        b.num_guests,
        b.total_price,
        b.status AS booking_status,
        b.created_at AS booking_created_at,
        l.id AS listing_id,
        l.title AS listing_title,
        l.city AS listing_city,
        l.country AS listing_country,
        l.price_per_night AS listing_price_per_night
      FROM Bookings b
      JOIN Listings l ON b.listing_id = l.id
      WHERE b.user_id = $1
      ORDER BY b.check_in_date DESC;
    `;
    const result = await pool.query(query, [user_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error while fetching your bookings.' });
  }
});

module.exports = router;
