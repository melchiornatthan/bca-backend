const Sequelize = require('sequelize');

// Configure Sequelize for connecting to the 'bca' database on localhost
const sequelize = new Sequelize('postgres', 'postgres', 'bca123123123', {
  host: 'db', // Change this to your database host
  port: 5432, // Change this to your database port
  dialect: 'postgres', // Use 'mysql' for MySQL, 'sqlite' for SQLite, etc.
  logging: false, // Should be set to false for production
});

// Export the Sequelize instance for use in other parts of your application
module.exports = sequelize;