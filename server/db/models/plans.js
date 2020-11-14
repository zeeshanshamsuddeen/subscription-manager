const model = (sequelize, type) => sequelize.define('plans', {
  planID: {
    type: type.STRING,
    primaryKey: true,
  },
  validity: type.INTEGER,
  cost: type.INTEGER,
  currency: type.STRING,
});

module.exports = model;
