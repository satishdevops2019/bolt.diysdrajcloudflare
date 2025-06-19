const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/reviews/ - Create a new review (Protected Route)
router.post('/', authenticateToken, async (req, res) => {
  const { listing_id, booking_id, rating, comment } = req.body;
  const user_id = req.user.userId; // From authenticateToken middleware

  // Basic Validation
  if (listing_id === undefined || booking_id === undefined || rating === undefined) {
    return res.status(400).json({ message: 'listing_id, booking_id, and rating are required.' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }

  try {
    // Validate that the booking exists, belongs to the user, and is for the specified listing
    // And that the booking hasn't been reviewed by this user yet (though DB constraint handles final enforcement)
    const bookingCheckQuery = `
        SELECT b.user_id AS booking_user_id, b.listing_id AS booking_listing_id
        FROM Bookings b
        WHERE b.id = $1;
    `;
    const bookingCheckResult = await pool.query(bookingCheckQuery, [booking_id]);

    if (bookingCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const bookingDetails = bookingCheckResult.rows[0];
    if (bookingDetails.booking_user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden. You can only review your own bookings.' });
    }
    if (bookingDetails.booking_listing_id !== listing_id) {
      return res.status(400).json({ message: 'Booking does not match the provided listing ID.' });
    }

    // Optional: Check if review for this booking_id already exists (application-level check)
    const existingReviewCheck = await pool.query('SELECT id FROM Reviews WHERE booking_id = $1 AND user_id = $2', [booking_id, user_id]);
    if (existingReviewCheck.rows.length > 0) {
        return res.status(409).json({ message: 'You have already reviewed this booking.' });
    }
    // (In a real app, also check if booking is completed, e.g., check_out_date < today)


    const query = `
      INSERT INTO Reviews (user_id, listing_id, booking_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [user_id, listing_id, booking_id, rating, comment];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.code === '23505' && error.constraint === 'reviews_booking_id_key') { // Handles UNIQUE constraint on booking_id
      return res.status(409).json({ message: 'This booking has already been reviewed (database constraint).' });
    }
    if (error.code === '23503') { // Foreign key violation
        if (error.constraint === 'reviews_user_id_fkey') {
            return res.status(400).json({ message: 'User not found for review.' });
        }
        if (error.constraint === 'reviews_listing_id_fkey') {
            return res.status(400).json({ message: 'Listing not found for review.' });
        }
        if (error.constraint === 'reviews_booking_id_fkey') { // Should be caught by booking check above
            return res.status(400).json({ message: 'Booking not found for review.' });
        }
    }
    if (error.code === '23502') { // not_null_violation
        return res.status(400).json({ message: 'Missing required field for review.' });
    }
    res.status(500).json({ message: 'Server error while creating review.' });
  }
});

module.exports = router;
