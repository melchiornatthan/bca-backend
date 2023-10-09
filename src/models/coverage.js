const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Location = require('./locations');
const Provider = require('./provider');
const Sla = require('./sla');

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
    }},{
        timestamps: false,
    });

    Coverage.belongsTo(Location, { foreignKey: 'id_loc' });
    Coverage.belongsTo(Provider, { foreignKey: 'id_prov' });

    module.exports = Coverage;