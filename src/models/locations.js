const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

const Location = sequelize.define('locations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    }},{
        timestamps: false,
    });

   
    module.exports = Location;