const express = require('express');
const router = express.Router();

const notFoundController = require('../controllers/404Controller');

router.get('/', notFoundController.notFound);

module.exports = router;