const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

// Define the Location model for the "locations" table
const Location = sequelize.define('locations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  province: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = Location;
