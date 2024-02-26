const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

// Define the Installation model for the "installations" table
const Atm = sequelize.define('atm', {
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
  branch_pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM( 'pending', 'active', 'dismantled'),
    defaultValue: 'active',
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
  },
  provider_id: {
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

module.exports = Atm;
