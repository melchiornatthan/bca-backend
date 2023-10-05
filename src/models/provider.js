const sequelize = require('../database/connection');
const Sequelize = require('sequelize');


const Provider = sequelize.define('providers', {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: false,
    }},{
        timestamps: false,
    });

    
    module.exports = Provider;