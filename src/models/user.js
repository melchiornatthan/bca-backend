const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

const User = sequelize.define('users', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    }},{
        timestamps: false,
    }
  );


module.exports = User;
