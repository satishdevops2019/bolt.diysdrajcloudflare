// backend/models/booking.model.js
module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define("bookings", { // 'bookings' will be the table name
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'properties', // Name of the properties table
        key: 'id'
      }
    },
    guest_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Name of the users table
        key: 'id'
      }
    },
    check_in_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    check_out_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    total_price: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    number_of_guests: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending' // e.g., 'pending', 'confirmed', 'cancelled', 'completed', 'rejected'
    },
    payment_status: {
      type: Sequelize.STRING,
      defaultValue: 'unpaid' // e.g., 'unpaid', 'paid', 'refunded'
    }
  });

  return Booking;
};
