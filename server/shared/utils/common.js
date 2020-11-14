const checkObjectHasKey = (object, key) => key in object;

const runFunctionsInParallel = async (arrayOfFunctions) => Promise.all(arrayOfFunctions)
  .then((results) => ({ success: true, results }))
  .catch((errors) => ({ success: false, errors }));

module.exports = {
  checkObjectHasKey,
  runFunctionsInParallel,
};
