const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/top-days', statsController.getTop3Days);
router.get('/monthly-change', statsController.getMonthlyChange);
router.get('/prediction', statsController.getPrediction);

module.exports = router;
