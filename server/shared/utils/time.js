const moment = require('moment');

const getTime = (time, format) => moment(time).format(format);

module.exports = {
  getTime,
};
