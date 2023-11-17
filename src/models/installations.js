const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

// Define the Installation model for the "installations" table
const Installation = sequelize.define('installations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  batchid: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  branch_pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  days: {
    type: Sequelize.INTEGER,
  },
  status: {
    type: Sequelize.ENUM('pending', 'approved', 'dismantled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
  },
  provider_id: {
    type: Sequelize.INTEGER,
  },
  price: {
    type: Sequelize.INTEGER,
  },
  price_id: {
    type: Sequelize.INTEGER,
  },
  area_id: {
    type: Sequelize.INTEGER,
  },
  communication: {
    type: Sequelize.ENUM('VSAT', 'M2M'),
    defaultValue: 'VSAT',
    allowNull: false,
  },
  area: {
    type: Sequelize.STRING,
  },
  province: {
    type: Sequelize.STRING,
  },
  relocation_status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  dismantle_status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = Installation;
