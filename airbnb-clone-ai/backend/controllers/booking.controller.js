// backend/controllers/booking.controller.js
const db = require("../models");
const Booking = db.booking;
const Property = db.property;
const User = db.user;
const { Op } = db.Sequelize;

// Create a new booking
exports.createBooking = async (req, res) => {
  const { property_id, check_in_date, check_out_date, number_of_guests } = req.body;
  const guest_id = req.userId; // Assuming authJwt middleware sets this

  if (!property_id || !check_in_date || !check_out_date || !number_of_guests) {
    return res.status(400).send({ message: "Missing required booking fields." });
  }

  if (!guest_id) {
    return res.status(403).send({ message: "User not authenticated." });
  }

  // Validate input dates
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).send({ message: "Invalid date format." });
  }

  if (checkOut <= checkIn) {
    return res.status(400).send({ message: "Check-out date must be after check-in date." });
  }

  try {
    // Fetch property details to calculate price and check max_guests
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).send({ message: "Property not found." });
    }

    if (parseInt(number_of_guests) > property.max_guests) {
      return res.status(400).send({ message: `Number of guests exceeds the maximum allowed for this property (${property.max_guests}).` });
    }

    // Conflict Check
    const conflictingBooking = await Booking.findOne({
      where: {
        property_id: property_id,
        status: { [Op.notIn]: ['cancelled', 'rejected'] }, // Ignore cancelled or rejected bookings
        check_in_date: { [Op.lt]: check_out_date },
        check_out_date: { [Op.gt]: check_in_date }
      }
    });

    if (conflictingBooking) {
      return res.status(409).send({ message: "Property is not available for the selected dates due to a conflict." });
    }

    // Calculate total price
    const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
    const total_price = parseFloat(property.price_per_night) * nights;

    // Create booking
    const booking = await Booking.create({
      property_id,
      guest_id,
      check_in_date,
      check_out_date,
      number_of_guests: parseInt(number_of_guests),
      total_price,
      status: 'pending', // Default status
      payment_status: 'unpaid' // Default payment status
    });

    res.status(201).send(booking);
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while creating the booking." });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.userId; // From auth middleware

  try {
    const booking = await Booking.findByPk(booking_id, {
      include: [
        { model: Property, as: 'property', include: [{ model: User, as: 'host', attributes: ['id', 'username'] }] },
        { model: User, as: 'guest', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!booking) {
      return res.status(404).send({ message: `Booking with id=${booking_id} not found.` });
    }

    // Authorization: User must be guest or host of the property
    if (booking.guest_id !== user_id && (booking.property && booking.property.host_id !== user_id)) {
      return res.status(403).send({ message: "Unauthorized to view this booking." });
    }

    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving booking." });
  }
};

// Get bookings for the logged-in user (guest)
exports.getUserBookings = async (req, res) => {
  const guest_id = req.userId;
  const { status } = req.query; // Optional filter by status

  let whereClause = { guest_id: guest_id };
  if (status) {
    whereClause.status = status;
  }

  try {
    const bookings = await Booking.findAll({
      where: whereClause,
      include: [{ model: Property, as: 'property', attributes: ['id', 'title', 'city', 'image_urls'] }],
      order: [['check_in_date', 'DESC']]
    });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving user bookings." });
  }
};

// Get bookings for properties owned by the logged-in user (host)
exports.getHostBookings = async (req, res) => {
  const host_id = req.userId;
  const { status } = req.query; // Optional filter by status

  let bookingWhereClause = {};
  if (status) {
    bookingWhereClause.status = status;
  }

  try {
    const bookings = await Booking.findAll({
      where: bookingWhereClause,
      include: [
        {
          model: Property,
          as: 'property',
          where: { host_id: host_id }, // Filter by host_id on the Property model
          attributes: ['id', 'title', 'city']
        },
        {
          model: User,
          as: 'guest',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['check_in_date', 'DESC']]
    });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving host bookings." });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.userId;
  const { status } = req.body; // e.g., 'confirmed', 'cancelled', 'completed'

  if (!status) {
    return res.status(400).send({ message: "Status is required." });
  }
  // Add more validation for allowed status transitions if necessary

  try {
    const booking = await Booking.findByPk(booking_id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).send({ message: `Booking with id=${booking_id} not found.` });
    }

    // Authorization:
    // Host can confirm or cancel.
    // Guest can cancel (if status is 'pending' or 'confirmed' - add more specific rules if needed).
    // System might mark as 'completed'.

    const isHost = booking.property && booking.property.host_id === user_id;
    const isGuest = booking.guest_id === user_id;

    if (isHost) {
      if (status === 'confirmed' && booking.status === 'pending') {
        // Host confirms
      } else if (status === 'cancelled') {
        // Host cancels
      } else if (status === 'completed' && booking.status === 'confirmed') {
        // Host or system marks as completed (e.g. after checkout date)
      }
      else {
        // return res.status(403).send({ message: `Host unauthorized to change status to ${status} or invalid transition.` });
      }
    } else if (isGuest) {
      if (status === 'cancelled' && (booking.status === 'pending' || booking.status === 'confirmed')) {
        // Guest cancels
      } else {
        return res.status(403).send({ message: `Guest unauthorized to change status to ${status} or invalid transition.` });
      }
    } else {
      return res.status(403).send({ message: "User not authorized to update this booking's status." });
    }

    // If no specific authorization block returned an error, proceed with update
    // This simplified logic allows host to set any status, and guest to cancel.
    // More complex state machine logic might be needed for a real app.

    booking.status = status;
    // Potentially update payment_status as well, e.g., if cancelling a paid booking -> 'refund_pending'
    await booking.save();
    res.status(200).send({ message: "Booking status updated successfully.", booking });

  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating booking status." });
  }
};

// Optional: Cancel Booking (more specific than general status update)
exports.cancelBooking = async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.userId;

  try {
    const booking = await Booking.findByPk(booking_id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).send({ message: `Booking with id=${booking_id} not found.` });
    }

    const isHost = booking.property && booking.property.host_id === user_id;
    const isGuest = booking.guest_id === user_id;

    // Allow cancellation if status is 'pending' or 'confirmed'
    // Add more specific rules for cancellation window, fees, etc. later
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).send({ message: "Booking cannot be cancelled at its current status." });
    }

    if (!isHost && !isGuest) {
      return res.status(403).send({ message: "User not authorized to cancel this booking." });
    }

    booking.status = 'cancelled';
    // If booking was 'paid', set payment_status to 'refund_pending' or similar.
    // This would trigger a separate refund process.
    if (booking.payment_status === 'paid') {
        booking.payment_status = 'refund_pending';
    }

    await booking.save();
    res.status(200).send({ message: "Booking cancelled successfully.", booking });

  } catch (error) {
    res.status(500).send({ message: error.message || "Error cancelling booking." });
  }
};
