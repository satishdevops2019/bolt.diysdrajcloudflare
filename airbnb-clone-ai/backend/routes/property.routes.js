// backend/routes/property.routes.js
const controller = require("../controllers/property.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new property - Protected
  app.post("/api/properties",
    [authJwt.verifyToken],
    controller.createProperty
  );

  // Get all properties - Public
  app.get("/api/properties", controller.getAllProperties);

  // Get a single property by ID - Public
  app.get("/api/properties/:id", controller.getPropertyById);

  // Update a property - Protected
  app.put("/api/properties/:id",
    [authJwt.verifyToken],
    controller.updateProperty
  );

  // Delete a property - Protected
  app.delete("/api/properties/:id",
    [authJwt.verifyToken],
    controller.deleteProperty
  );
};
