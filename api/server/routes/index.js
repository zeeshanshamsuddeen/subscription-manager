const express = require('express');

const users = require('./users');
const subscriptions = require('./subscriptions');

const router = express.Router();

router.use('/user', users);
router.use('/subscription', subscriptions);

module.exports = router;
