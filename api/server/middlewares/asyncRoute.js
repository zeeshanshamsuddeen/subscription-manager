const asyncRoute = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = asyncRoute;
