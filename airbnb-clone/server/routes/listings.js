const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/listings/ - Create a new listing (Protected Route)
router.post('/', authenticateToken, async (req, res) => {
  const {
    title, description, address, city, state, country,
    price_per_night, max_guests, num_bedrooms, num_beds, num_bathrooms,
    amenities, property_type, latitude, longitude
  } = req.body;
  const user_id = req.user.userId; // From authenticateToken middleware

  // Basic Validation
  if (!title || !description || !address || !city || !country || !price_per_night || !max_guests || !num_bedrooms || !num_beds || !num_bathrooms) {
    return res.status(400).json({ message: 'Please provide all required listing details.' });
  }
  if (price_per_night <= 0) {
    return res.status(400).json({ message: 'Price per night must be positive.' });
  }
  // Ensure amenities is an array if provided, or default to empty array
  const amenitiesArray = Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []);


  try {
    const query = `
      INSERT INTO Listings (
        user_id, title, description, address, city, state, country,
        latitude, longitude, price_per_night, max_guests, num_bedrooms,
        num_beds, num_bathrooms, amenities, property_type
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *;
    `;
    const values = [
      user_id, title, description, address, city, state, country,
      latitude, longitude, price_per_night, max_guests, num_bedrooms,
      num_beds, num_bathrooms, amenitiesArray, property_type
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error while creating listing.' });
  }
});

// GET /api/listings/:id - Get a single listing (Public Route)
router.get('/:id', async (req, res, next) => { // Added 'next' here
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM Listings WHERE id = $1;';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching single listing:', error);
    if (error.code === '22P02') { // Invalid input syntax for type integer
        const customError = new Error('Invalid listing ID format.');
        customError.statusCode = 400;
        return next(customError);
    }
    // For other errors, pass them to the global error handler
    next(error);
  }
});

// PUT /api/listings/:id - Update a listing (Protected Route)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;
  const updates = req.body; // e.g., { title, description, price_per_night, ... }

  // Remove id and user_id from updates object if present, as they should not be updated directly
  delete updates.id;
  delete updates.user_id;
  // Ensure amenities is an array if provided
  if (updates.amenities && !Array.isArray(updates.amenities)) {
    updates.amenities = [updates.amenities];
  }


  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No update fields provided.' });
  }

  try {
    // First, verify the listing exists and belongs to the user
    const checkQuery = 'SELECT user_id FROM Listings WHERE id = $1;';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden. You can only update your own listings.' });
    }

    // Dynamically construct the SET part of the UPDATE query
    const setClauses = [];
    const values = [];
    let valueCount = 1;

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        setClauses.push(`${key} = $${valueCount++}`);
        values.push(updates[key]);
      }
    }
    values.push(id); // For the WHERE id = $n clause

    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'No valid update fields provided.' });
    }

    const updateQuery = `
      UPDATE Listings
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${valueCount}
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
        // This case should ideally be caught by the initial check, but as a safeguard:
        return res.status(404).json({ message: 'Listing not found after attempting update.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating listing:', error);
    if (error.code === '22P02') { // Invalid input syntax for type integer for id
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    // Add more specific error handling if needed, e.g., for data type mismatches in update fields
    res.status(500).json({ message: 'Server error while updating listing.' });
  }
});

// DELETE /api/listings/:id - Delete a listing (Protected Route)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    // First, verify the listing exists and belongs to the user
    const checkQuery = 'SELECT user_id FROM Listings WHERE id = $1;';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden. You can only delete your own listings.' });
    }

    // Delete the listing
    const deleteQuery = 'DELETE FROM Listings WHERE id = $1 RETURNING id;'; // RETURNING id to confirm deletion
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) { // Should be caught by the check above, but good for safety
      return res.status(404).json({ message: 'Listing not found, nothing deleted.' });
    }

    res.status(200).json({ message: 'Listing deleted successfully.' });
    // Or use res.status(204).send(); for No Content response
  } catch (error) {
    console.error('Error deleting listing:', error);
    if (error.code === '22P02') { // Invalid input syntax for type integer
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    res.status(500).json({ message: 'Server error while deleting listing.' });
  }
});

// GET /api/listings/ - Get all listings (Public Route) with filtering
router.get('/', async (req, res, next) => { // Added next for global error handling
  try {
    let baseQuery = 'SELECT * FROM Listings';
    const conditions = [];
    const queryParams = [];
    let paramIndex = 1;

    const {
      minPrice, maxPrice, propertyType,
      numBedrooms, numBathrooms, numBeds, amenities
    } = req.query;

    if (minPrice) {
      const price = parseFloat(minPrice);
      if (!isNaN(price)) {
        conditions.push(`price_per_night >= $${paramIndex++}`);
        queryParams.push(price);
      } else {
        return res.status(400).json({ message: 'Invalid minPrice format.' });
      }
    }
    if (maxPrice) {
      const price = parseFloat(maxPrice);
      if (!isNaN(price)) {
        conditions.push(`price_per_night <= $${paramIndex++}`);
        queryParams.push(price);
      } else {
        return res.status(400).json({ message: 'Invalid maxPrice format.' });
      }
    }
    if (propertyType) {
      conditions.push(`LOWER(property_type) = LOWER($${paramIndex++})`); // Case-insensitive
      queryParams.push(propertyType);
    }
    if (numBedrooms) {
      const bedrooms = parseInt(numBedrooms, 10);
      if(!isNaN(bedrooms)) {
        conditions.push(`num_bedrooms >= $${paramIndex++}`);
        queryParams.push(bedrooms);
      } else {
        return res.status(400).json({ message: 'Invalid numBedrooms format.' });
      }
    }
    if (numBathrooms) {
      const bathrooms = parseFloat(numBathrooms);
       if(!isNaN(bathrooms)) {
        conditions.push(`num_bathrooms >= $${paramIndex++}`);
        queryParams.push(bathrooms);
      } else {
        return res.status(400).json({ message: 'Invalid numBathrooms format.' });
      }
    }
    if (numBeds) {
      const beds = parseInt(numBeds, 10);
      if(!isNaN(beds)) {
        conditions.push(`num_beds >= $${paramIndex++}`);
        queryParams.push(beds);
      } else {
        return res.status(400).json({ message: 'Invalid numBeds format.' });
      }
    }
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim().toLowerCase()).filter(a => a); // Normalize to lowercase
      if (amenitiesArray.length > 0) {
        // To check if the stored TEXT[] amenities contains all specified amenities,
        // we need to ensure each element of amenitiesArray is present in the DB array.
        // PostgreSQL's TEXT[] @> TEXT[] checks if the left array contains all elements of the right array.
        // We also convert DB amenities to lowercase for case-insensitive comparison if needed,
        // or ensure data is stored consistently. For this example, assume consistent casing or handle it at insertion.
        // If amenities in DB are 'WiFi', 'Kitchen' and query is 'wifi,kitchen', direct @> might fail.
        // A more robust way for case-insensitive array containment might involve unnesting or specific functions
        // or ensuring all amenities are stored in a canonical form (e.g. lowercase).
        // For simplicity here, we'll use @> and assume client sends amenities in canonical (lowercase) form matching DB.
        // Or, more practically, ensure your DB stores amenities in a consistent case (e.g., all lowercase).
        // Let's assume for now that the client will send amenities in the exact case as stored or we handle it at insertion.
        // A common approach is to lowercase all amenities before storing and before querying.
        // For the query itself:
        conditions.push(`amenities @> $${paramIndex++}`); // Assumes amenities in DB and query are consistently cased.
        queryParams.push(amenitiesArray);
      }
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY created_at DESC;';

    const result = await pool.query(baseQuery, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching listings with filters:', error);
    next(error); // Pass to global error handler
  }
});

// GET /api/listings/:listingId/reviews - Get all reviews for a specific listing (Public Route)
router.get('/:listingId/reviews', async (req, res) => {
  const { listingId } = req.params;

  try {
    // Validate listingId is a number before querying
    // (though pool.query might also catch this, explicit check is good)
    if (isNaN(parseInt(listingId, 10))) {
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }

    const query = `
      SELECT
        r.id AS review_id,
        r.rating,
        r.comment,
        r.created_at AS review_created_at,
        u.id AS user_id,
        u.first_name AS user_first_name,
        u.profile_picture_url AS user_profile_picture_url
      FROM Reviews r
      JOIN Users u ON r.user_id = u.id
      WHERE r.listing_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(query, [listingId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews for listing:', error);
     if (error.code === '22P02') { // Invalid input syntax for type integer (if not caught by parseInt)
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    res.status(500).json({ message: 'Server error while fetching reviews.' });
  }
});


module.exports = router;
