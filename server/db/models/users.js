const model = (sequelize, type) => sequelize.define('users', {
  username: {
    type: type.STRING,
    primaryKey: true,
  },
});

module.exports = model;
