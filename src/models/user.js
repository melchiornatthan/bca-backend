const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

// Define the User model for the "users" table
const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
}, {
  timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = User;
