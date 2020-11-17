const { users } = require('../services');
const { httpStatus } = require('../constants');

const get = async (req, res) => {
  const { username } = req.params;
  const { success, error, user, code } = await users.get(username);
  if (!success) {
    return res.status(code).send({ error });
  }
  return res.json(user);
};

const register = async (req, res) => {
  const { username } = req.params;
  const { success, error, code } = await users.register({ username });
  if (!success) {
    return res.status(code).send({ error });
  }
  return res.json({ success: true });
};

module.exports = {
  get,
  register,
};
