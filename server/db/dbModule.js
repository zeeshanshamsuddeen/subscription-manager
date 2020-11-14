const Sequelize = require('sequelize');

const config = require('../config');

const { DATABASE } = config.appDefaults;
const {
  NAME, USERNAME, PASSWORD, HOST,
} = DATABASE;

const sequelize = new Sequelize(
  NAME,
  USERNAME,
  PASSWORD,
  {
    host: HOST,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

sequelize.sync();

module.exports = {
};
