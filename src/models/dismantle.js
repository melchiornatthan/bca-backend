const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Installation = require('./installations');

// Define the Installation model for the "installations" table
const Dismantle = sequelize.define('dismantles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: Sequelize.ENUM('pending', 'approved'),
    defaultValue: 'pending',
    allowNull: false,
  },
  installation_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  batchid: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  provider_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Dismantle.belongsTo(Installation, { foreignKey: 'installation_id' });

module.exports = Dismantle;
