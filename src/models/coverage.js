const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Location = require('./locations');
const Provider = require('./provider');

// Define the Coverage model for the "coverage" table
const Coverage = sequelize.define('coverage', {
  id_loc: {
    type: Sequelize.INTEGER,
    references: {
      model: Location,
      key: 'id',
    },
  },
  id_prov: {
    type: Sequelize.INTEGER,
    references: {
      model: Provider,
      key: 'id',
    },
  },
  avail: {
    type: Sequelize.BOOLEAN,
  }
}, {
  timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

// Define associations between Coverage and Location/Provider
Coverage.belongsTo(Location, { foreignKey: 'id_loc' });
Coverage.belongsTo(Provider, { foreignKey: 'id_prov' });

module.exports = Coverage;
