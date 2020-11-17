const express = require('express');

const router = express.Router();

const { asyncRoute } = require('../middlewares');
const { users } = require('../controllers');

router.get('/:username', asyncRoute(users.get));
router.put('/:username', asyncRoute(users.register));

module.exports = router;
