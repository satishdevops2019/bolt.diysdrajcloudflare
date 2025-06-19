// backend/models/property.model.js
module.exports = (sequelize, Sequelize) => {
  const Property = sequelize.define("properties", { // 'properties' will be the table name
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    price_per_night: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false
    },
    max_guests: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    bedrooms: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    beds: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    bathrooms: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    amenities: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    image_urls: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    host_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Name of the table, not the model
        key: 'id'
      }
    },
    property_type: {
      type: Sequelize.STRING // e.g., 'Apartment', 'House', 'Villa'
    },
    latitude: {
      type: Sequelize.FLOAT
    },
    longitude: {
      type: Sequelize.FLOAT
    }
  });
  return Property;
};
