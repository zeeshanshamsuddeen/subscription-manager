const model = (sequelize, type) => sequelize.define('subscriptions', {
  subscriptionID: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: type.STRING,
  planID: type.STRING,
  startDate: type.DATE,
  endDate: type.DATE,
  paymentID: type.STRING,
  isActive: type.BOOLEAN,
});

module.exports = model;
