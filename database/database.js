const Sequelize = require('sequelize');
require("dotenv").config();

const connection = new Sequelize(process.env.tableName, process.env.user, process.env.password, {
    host: process.env.yourHost,
    dialect: process.env.yourDialect
});

module.exports = connection;