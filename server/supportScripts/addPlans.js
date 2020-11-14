/* eslint-disable no-await-in-loop */
require('../initiateEnv');
const db = require('../db/dbModule');

const plansToConfigure = [
  {
    planID: 'FREE', validity: null, cost: 0, currency: 'USD',
  },
  {
    planID: 'TRIAL', validity: 7, cost: 0, currency: 'USD',
  },
  {
    planID: 'LITE_1M', validity: 30, cost: 100, currency: 'USD',
  },
  {
    planID: 'PRO_1M', validity: 30, cost: 200, currency: 'USD',
  },
  {
    planID: 'LITE_6M', validity: 180, cost: 500, currency: 'USD',
  },
  {
    planID: 'PRO_6M', validity: 180, cost: 900, currency: 'USD',
  },
];

(async () => {
  try {
    for (let i = 0; i < plansToConfigure.length; i += 1) {
      const { planID } = plansToConfigure[i];
      const planFromDB = await db.plans.findOne({ where: { planID } });
      if (!planFromDB) {
        await db.plans.create(plansToConfigure[i]);
      }
    }
    console.log('Plans added');
  } catch (error) {
    console.log('error: ', error);
  }
})();
