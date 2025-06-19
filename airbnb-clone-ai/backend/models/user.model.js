// backend/models/user.model.js
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", { // 'users' will be the table name
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Add other KYC related fields later e.g., kycStatus, documentType etc.
    // For now, keeping it simple for auth.
  });
  return User;
};
