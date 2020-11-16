const moment = require('moment');

const getTime = (time, format = '') => {
  return moment.utc(time).format(format);
}

const addTime = (date, timeToAdd) => moment.utc(date).add(timeToAdd.value, timeToAdd.units).format();

const isBetween = (date, from, to) => moment(date).isBetween(moment(from), moment(to));

const getDayDifference = (date1, date2) => moment.utc(date1).diff(moment.utc(date2), 'days');

module.exports = {
  getTime,
  addTime,
  isBetween,
  getDayDifference,
};
