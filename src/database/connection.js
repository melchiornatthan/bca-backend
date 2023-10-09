const Sequelize = require('sequelize');

// Configure Sequelize for connecting to the 'bca' database on localhost
const sequelize = new Sequelize('bca', 'melchiornatthan', '', {
  host: 'localhost', // Change this to your database host
  dialect: 'postgres', // Use 'mysql' for MySQL, 'sqlite' for SQLite, etc.
});

// Export the Sequelize instance for use in other parts of your application
module.exports = sequelize;
