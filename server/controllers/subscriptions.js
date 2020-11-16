const { subscriptions } = require('../services');
const { httpStatus, keywords } = require('../constants');

const create = async (req, res) => {
  const { success, amount, error, code } = await subscriptions.create(req.body);
  if (!success) {
    return res.status(code).send({ status: keywords.FAILURE, error });
  }
  return res.json({ status: keywords.SUCCESS, amount });
};

const get = async (req, res) => {
  const { username, date } = req.params;
  const { success, error, code, data } = await subscriptions.get(username, date);
  if (!success) {
    return res.status(code).send({ status: keywords.FAILURE, error });
  }
  return res.json(data);
};

module.exports = {
  create,
  get,
};
