const express = require('express');

const router = express.Router();

const { asyncRoute } = require('../middlewares');
const { subscriptions } = require('../controllers');

router.post('/', asyncRoute(subscriptions.create));
router.get('/:username/:date?', asyncRoute(subscriptions.get));

module.exports = router;
