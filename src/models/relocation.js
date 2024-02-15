const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Installation = require('./installations');

// Define the Installation model for the "installations" table
const Relocation = sequelize.define('relocations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  old_location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  new_location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  old_address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  new_address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  old_area: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  new_area: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  old_communication: {
    type: Sequelize.ENUM('VSAT', 'M2M'),
    defaultValue: 'VSAT',
    allowNull: false,
  },
  new_communication: {
    type: Sequelize.ENUM('VSAT', 'M2M'),
    defaultValue: 'VSAT',
    allowNull: false,
  },
  old_area_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  new_area_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
  old_branch_pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  new_branch_pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  batchid: {
    type: Sequelize.BIGINT,
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

Relocation.belongsTo(Installation, { foreignKey: 'installation_id' });

module.exports = Relocation;
