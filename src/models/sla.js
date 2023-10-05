const sequelize = require('../database/connection');
const Sequelize = require('sequelize');
const Location = require('./locations');
const Provider = require('./provider');


const Sla = sequelize.define('slas', {
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
    days: {
      type: Sequelize.INTEGER,
    }},{
        timestamps: false,
    });

    Sla.belongsTo(Location, { foreignKey: 'id_loc' });
    Sla.belongsTo(Provider, { foreignKey: 'id_prov' });
    
    module.exports = Sla;
