const { Op } = require('sequelize');

module.exports = {
  gte: Op.gte,
  gt: Op.gt,
  lte: Op.lte,
  lt: Op.lt,
  or: Op.or,
  and: Op.and,
};
