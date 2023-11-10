const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Location = require('./locations');
const Provider = require('./provider');
const Coverage = require('./coverage');
const Sla = require('./sla');

// Define the Price model for the "prices" table
const Price = sequelize.define('prices', {
  id_price: {
    type: Sequelize.INTEGER,
  },
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
  price: {
    type: Sequelize.INTEGER,
  }
}, {
  timestamps: false, // Disable timestamps (createdAt and updatedAt columns)
});

// Define associations between Price and Location/Provider
Price.belongsTo(Location, { foreignKey: 'id_loc' });
Price.belongsTo(Provider, { foreignKey: 'id_prov' });

module.exports = Price;
