// backend/controllers/property.controller.js
const db = require("../models");
const Property = db.property;
const User = db.user; // Needed for including host information

// Create a new property
exports.createProperty = async (req, res) => {
  // Assume req.userId is set by auth middleware later
  // For now, if testing without auth, expect host_id in req.body
  const hostId = req.userId || req.body.host_id;

  if (!hostId) {
    return res.status(400).send({ message: "Host ID is required to create a property." });
  }

  const {
    title, description, price_per_night, address, city, country,
    max_guests, bedrooms, beds, bathrooms, amenities, image_urls,
    property_type, latitude, longitude
  } = req.body;

  // Basic validation
  if (!title || !description || !price_per_night || !address || !city || !country || !max_guests || !bedrooms || !beds || !bathrooms) {
    return res.status(400).send({ message: "Missing required property fields." });
  }

  try {
    const property = await Property.create({
      title,
      description,
      price_per_night,
      address,
      city,
      country,
      max_guests,
      bedrooms,
      beds,
      bathrooms,
      amenities: amenities || [],
      image_urls: image_urls || [],
      host_id: hostId,
      property_type,
      latitude,
      longitude
    });
    res.status(201).send(property);
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while creating the property." });
  }
};

// Get all properties / Search properties
exports.getAllProperties = async (req, res) => {
  const { Op, literal } = db.Sequelize;
  const whereClause = {};

  // Filtering
  if (req.query.city) {
    whereClause.city = { [Op.iLike]: `%${req.query.city}%` };
  }
  if (req.query.country) {
    whereClause.country = { [Op.iLike]: `%${req.query.country}%` };
  }
  if (req.query.property_type) {
    whereClause.property_type = { [Op.iLike]: `%${req.query.property_type}%` };
  }
  if (req.query.max_guests) {
    whereClause.max_guests = { [Op.gte]: parseInt(req.query.max_guests, 10) };
  }
  if (req.query.min_price) {
    whereClause.price_per_night = { [Op.gte]: parseFloat(req.query.min_price) };
  }
  if (req.query.max_price) {
    if (whereClause.price_per_night) {
      whereClause.price_per_night[Op.lte] = parseFloat(req.query.max_price);
    } else {
      whereClause.price_per_night = { [Op.lte]: parseFloat(req.query.max_price) };
    }
  }
  if (req.query.min_bedrooms) {
    whereClause.bedrooms = { [Op.gte]: parseInt(req.query.min_bedrooms, 10) };
  }
  if (req.query.min_beds) {
    whereClause.beds = { [Op.gte]: parseInt(req.query.min_beds, 10) };
  }
  if (req.query.min_bathrooms) {
    whereClause.bathrooms = { [Op.gte]: parseInt(req.query.min_bathrooms, 10) };
  }
  if (req.query.amenities) {
    const amenitiesArray = req.query.amenities.split(',').map(a => a.trim()).filter(a => a);
    if (amenitiesArray.length > 0) {
      // Op.contains expects the DB field to be an array and all elements in amenitiesArray to be present.
      whereClause.amenities = { [Op.contains]: amenitiesArray };
    }
  }

  // Availability Check
  if (req.query.check_in_date && req.query.check_out_date) {
    const checkIn = req.query.check_in_date; // Expecting 'YYYY-MM-DD'
    const checkOut = req.query.check_out_date; // Expecting 'YYYY-MM-DD'

    // Validate date format (basic)
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(checkIn) || !dateFormat.test(checkOut)) {
        return res.status(400).send({ message: "Invalid date format. Please use YYYY-MM-DD." });
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
        return res.status(400).send({ message: "Check-out date must be after check-in date." });
    }

    const bookedPropertyIdsSubQuery = `
      SELECT DISTINCT "property_id"
      FROM "bookings"
      WHERE "status" NOT IN ('cancelled', 'rejected')
      AND (
        "check_in_date" < '${checkOut}' AND "check_out_date" > '${checkIn}'
      )
    `;
    whereClause.id = {
      [Op.notIn]: literal(`(${bookedPropertyIdsSubQuery})`)
    };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  // Sorting
  let order = [['createdAt', 'DESC']]; // Default sort
  if (req.query.sort_by) {
    const parts = req.query.sort_by.split('_');
    const field = parts[0];
    const direction = parts[1] ? parts[1].toUpperCase() : 'ASC';

    const allowedSortFields = {
        price: 'price_per_night',
        rating: 'rating', // Assuming you add a rating field later
        createdAt: 'createdAt'
    };

    if (allowedSortFields[field] && (direction === 'ASC' || direction === 'DESC')) {
      order = [[allowedSortFields[field], direction]];
    }
  }

  try {
    const properties = await Property.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'host',
        attributes: ['id', 'username', 'email']
      }],
      limit: limit,
      offset: offset,
      order: order,
      distinct: true // Important for counts when using includes
    });
    res.status(200).json({
      data: properties.rows,
      totalItems: properties.count,
      totalPages: Math.ceil(properties.count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).send({ message: error.message || "Some error occurred while retrieving properties." });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  const id = req.params.id;
  try {
    const property = await Property.findByPk(id, {
      include: [{
        model: User,
        as: 'host',
        attributes: ['id', 'username', 'email']
      }]
    });
    if (property) {
      res.status(200).send(property);
    } else {
      res.status(404).send({ message: `Cannot find Property with id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: "Error retrieving Property with id=" + id });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  const id = req.params.id;
  // Assume req.userId is set by auth middleware
  const hostIdFromToken = req.userId;

  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).send({ message: `Cannot find Property with id=${id}.` });
    }

    // Authorization check: Ensure the user updating is the host
    // If testing without auth middleware, this check might rely on req.body.host_id
    // or be temporarily bypassed. For production, req.userId must be used.
    if (hostIdFromToken && property.host_id !== hostIdFromToken) {
      return res.status(403).send({ message: "Unauthorized: You are not the host of this property." });
    }
    // If hostIdFromToken is not available (e.g. auth middleware not yet implemented/used for this route)
    // this check is skipped. For security, ensure auth middleware is in place.


    const [num] = await Property.update(req.body, {
      where: { id: id }
    });

    if (num === 1) { // Sequelize update returns an array with one element: the number of affected rows
      res.send({ message: "Property was updated successfully." });
    } else {
      res.send({ message: `Cannot update Property with id=${id}. Maybe Property was not found or req.body is empty!` });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating Property with id=" + id });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  const id = req.params.id;
  // Assume req.userId is set by auth middleware
  const hostIdFromToken = req.userId;

  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).send({ message: `Cannot find Property with id=${id}.` });
    }

    // Authorization check
    if (hostIdFromToken && property.host_id !== hostIdFromToken) {
      return res.status(403).send({ message: "Unauthorized: You are not the host of this property." });
    }
    // Similar to update, this check is crucial and relies on auth middleware.

    const num = await Property.destroy({
      where: { id: id }
    });

    if (num === 1) { // Sequelize destroy returns the number of deleted rows
      res.send({ message: "Property was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Property with id=${id}. Maybe Property was not found!` });
    }
  } catch (error) {
    res.status(500).send({ message: "Could not delete Property with id=" + id });
  }
};
