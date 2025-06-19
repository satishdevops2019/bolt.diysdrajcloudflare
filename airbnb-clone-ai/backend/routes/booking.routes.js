// backend/routes/booking.routes.js
const controller = require("../controllers/booking.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // All booking routes require authentication
  app.use("/api/bookings", authJwt.verifyToken);
  // Note: This applies verifyToken to all routes defined below this line for /api/bookings

  // Create a new booking
  app.post("/api/bookings", controller.createBooking);

  // Get bookings for the logged-in user (guest)
  app.get("/api/bookings/user", controller.getUserBookings);

  // Get bookings for properties of the logged-in user (host)
  app.get("/api/bookings/host", controller.getHostBookings);

  // Get a specific booking by ID
  app.get("/api/bookings/:id", controller.getBookingById);

  // Update a booking's status (e.g., host confirms/cancels)
  app.put("/api/bookings/:id/status", controller.updateBookingStatus);

  // Optional: Cancel a booking (specific route for cancellation)
  app.put("/api/bookings/:id/cancel", controller.cancelBooking);
};
