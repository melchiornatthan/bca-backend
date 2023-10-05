const Sequelize = require('sequelize');

const sequelize = new Sequelize('bca', 'melchiornatthan', '', {
  host: 'localhost', // Change this to your database host
  dialect: 'postgres', // Use 'mysql' for MySQL, 'sqlite' for SQLite, etc.
});


module.exports = sequelize;