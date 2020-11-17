const axios = require('axios');
const utils = require('../shared/utils');
const db = require('../db/dbModule');
const { httpStatus, keywords } = require('../constants');
const { time } = require('../shared/utils');
const config = require('../config');
const dbOps = require('../db/dbOperations');

const requiredFieldsForAccount = ['user_name', 'plan_id', 'start_date'];

const validateFields = (updatedValues = {}) => {
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

const validateUserAndPlan = async (initValues) => {
  const { user_name: username, plan_id: planID, start_date: startDate } = initValues;
  const today = time.getTime();
  const dayDifference = time.getDayDifference(startDate, today);
  if (dayDifference < 0) {
    return { success: false, error: 'Subscription for past dates not allowed' };
  }
  const userFromDb = await db.users.findOne({ username });
  const planFromDB = await db.plans.findOne({ where: { planID } });
  if (!userFromDb || !planFromDB) {
    return { success: false, error: 'Invalid username/plan' };
  }
  return { success: true };
};

/**
 Fetch subscriptions which overlaps with the new subscription
 */
const getOverlappingSubscriptions = async (initValues) => {
  const { username, startDate: newSubStartDate, endDate: newSubEndDate } = initValues;
  const overlappingSubscriptions = await db.subscriptions.findAll({
    where: {
      username,
      isActive: true,
      [dbOps.or]: [
        {
          startDate: { [dbOps.lte]: time.getTime(newSubStartDate) },
          endDate: { [dbOps.gte]: time.getTime(newSubStartDate) },
        },
        {
          startDate: {
            [dbOps.and]: [
              { [dbOps.gte]: time.getTime(newSubStartDate) },
              { [dbOps.lte]: time.getTime(newSubEndDate) },
            ],
          },
        },
      ],
    },
  });
  const returnList = overlappingSubscriptions.map((sub) => sub.dataValues);
  return returnList;
};

/**
 Calculate the Amount to be credited to the user
 for the subscriptions to be cancelled
 */
const calculateAmountToCredit = async (overlappingSubscriptions) => {
  const today = time.getTime();
  let amountToCredit = 0;
  for (let i = 0; i < overlappingSubscriptions.length; i += 1) {
    const { startDate, endDate, planID } = overlappingSubscriptions[i];
    const { cost, validity } = await db.plans.findOne({ where: { planID } });
    if (time.isBetween(today, startDate, endDate)) {
      const dayDifference = time.getDayDifference(endDate, today);
      const subAmountToCredit = (cost / validity) * dayDifference;
      amountToCredit += subAmountToCredit;
    } else {
      amountToCredit += cost;
    }
  }
  return amountToCredit;
};

const makePayment = async (username, amount) => {
  const paymentType = amount < 0 ? 'CREDIT' : 'DEBIT';
  const amountToSend = amount < 0 ? amount * -1 : amount;
  const body = {
    user_name: username,
    payment_type: paymentType,
    amount: amountToSend,
  };
  try {
    const paymentResponse = await axios.post(config.paymentAPI.url, body);
    const { status, payment_id: paymentID } = paymentResponse.data;
    if (status === keywords.SUCCESS) {
      return { success: true, paymentID };
    }
  } catch (error) {
    console.log('error: ', error.response.data);
  }
  return { success: false };
};

const deactivateOverlappingSubscriptions = async (overlappingSubscriptions) => {
  const subIDs = overlappingSubscriptions.map((sub) => sub.subscriptionID);
  await db.subscriptions.update({ isActive: false }, { where: { subscriptionID: subIDs } });
};

const createNewSubscription = async (subDetails, paymentID) => {
  const { planID, username, startDate, endDate } = subDetails;
  const subObject = {
    username,
    planID,
    startDate: time.getTime(startDate),
    endDate,
    paymentID,
    isActive: true,
  };
  await db.subscriptions.create(subObject);
  return { success: true };
};

const create = async (initValues) => {
  const validationResult = validateFields(initValues);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error, code: httpStatus.badRequest };
  }
  const userValidationResponse = await validateUserAndPlan(initValues);
  if (!userValidationResponse.success) {
    return { success: false, error: userValidationResponse.error, code: httpStatus.badRequest };
  }

  const { user_name: username, plan_id: planID, start_date: startDate } = initValues;
  const { validity, cost: debitAmount } = await db.plans.findOne({ where: { planID } });
  const endDate = time.addTime(startDate, { value: validity, units: 'd' });
  const subDetails = { username, planID, startDate, endDate };

  const overlappingSubscriptions = await getOverlappingSubscriptions(subDetails);
  const creditAmount = await calculateAmountToCredit(overlappingSubscriptions);
  const totalAmount = Number((debitAmount - creditAmount).toFixed(0));
  const paymentResponse = await makePayment(username, totalAmount);

  if (paymentResponse.success) {
    await deactivateOverlappingSubscriptions(overlappingSubscriptions);
    await createNewSubscription(subDetails, paymentResponse.paymentID);
    return { success: true, amount: totalAmount * -1 };
  }
  return { success: false, code: httpStatus.error, error: 'Internal Server Error' };
};

const getSubscriptionForDate = async (username, date) => {
  const subscriptionFromDB = await db.subscriptions.findOne({
    where: {
      username,
      isActive: true,
      startDate: { [dbOps.lte]: time.getTime(date) },
      endDate: { [dbOps.gte]: time.getTime(date) },
    },
  });
  if (!subscriptionFromDB) {
    return { success: false, error: 'Subscription not found', code: httpStatus.notFound };
  }
  const { planID, endDate } = subscriptionFromDB;
  const dayDifference = time.getDayDifference(endDate, date);
  const data = {
    plan_id: planID,
    days_left: dayDifference,
  };
  return { success: true, data };
};

const getSubscriptions = async (username) => {
  const subscriptionsFromDB = await db.subscriptions.findAll({ where: { username } });
  const data = subscriptionsFromDB.map((sub) => {
    const { planID, startDate, endDate } = sub;
    return {
      plan_id: planID,
      start_date: time.getTime(startDate, config.timeFormats.subscriptions),
      valid_till: time.getTime(endDate, config.timeFormats.subscriptions),
    };
  });
  return { success: true, data };
};

const get = async (username, date) => {
  if (date) {
    return getSubscriptionForDate(username, date);
  }
  return getSubscriptions(username);
};

module.exports = {
  create,
  get,
};
