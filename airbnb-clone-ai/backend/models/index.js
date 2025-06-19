// backend/models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0, // 0 instead of false for Sequelize v5+
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Placeholder for User model - will be defined in user.model.js
db.user = require("./user.model.js")(sequelize, Sequelize);
db.property = require("./property.model.js")(sequelize, Sequelize);

// User (Host) to Property: One-to-Many
db.user.hasMany(db.property, { as: "properties", foreignKey: "host_id" });
db.property.belongsTo(db.user, {
  foreignKey: "host_id",
  as: "host", // This alias allows you to include host details when fetching a property
});

db.booking = require("./booking.model.js")(sequelize, Sequelize);

// User (Guest) to Booking: One-to-Many
db.user.hasMany(db.booking, { as: "guestBookings", foreignKey: "guest_id" });
db.booking.belongsTo(db.user, {
  foreignKey: "guest_id",
  as: "guest",
});

// Property to Booking: One-to-Many
db.property.hasMany(db.booking, { as: "propertyBookings", foreignKey: "property_id" });
db.booking.belongsTo(db.property, {
  foreignKey: "property_id",
  as: "property",
});

module.exports = db;
