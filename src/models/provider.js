const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

// Define the Provider model for the "providers" table
const Provider = sequelize.define('providers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

module.exports = Provider;
