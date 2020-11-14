const utils = require('../shared/utils');
const db = require('../db/dbModule');
const { httpStatus } = require('../constants');
const { time } = require('../shared/utils');
const config = require('../config');

const requiredFieldsForAccount = ['username'];

const validateAuthFields = (updatedValues = {}) => {
  const updateObject = {};
  let success = true;
  let error;

  for (let i = 0; i < requiredFieldsForAccount.length; i += 1) {
    const field = requiredFieldsForAccount[i];
    if (utils.common.checkObjectHasKey(updatedValues, field)) {
      updateObject[field] = updatedValues[field];
    } else {
      error = `${field} missing`;
      success = false;
      break;
    }
  }
  return { success, updateObject, error };
};

const register = async (updatedValues) => {
  const validationResult = validateAuthFields(updatedValues);
  const { success, updateObject, error } = validationResult;
  if (!success) {
    return { success: false, error, code: httpStatus.badRequest };
  }
  const { username } = updatedValues;
  const userFromDB = await db.users.findOne({ where: { username } });
  if (userFromDB) {
    return { success: false, error: 'Username already exists', code: httpStatus.alreadyExists };
  }
  await db.users.create(updateObject);
  return { success: true };
};

const get = async (username) => {
  const userFromDB = await db.users.findOne({ where: { username } });
  if (!userFromDB) {
    return { success: false, error: 'User not found', code: httpStatus.notFound };
  }
  const { createdAt } = userFromDB;
  const user = {
    user_name: username,
    created_at: time.getTime(createdAt, config.timeFormats.users),
  };
  return { success: true, user };
};

module.exports = {
  register,
  get,
};
