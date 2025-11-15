const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const createRateLimiter = require('../middleware/rateLimiter');

const collectLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 200 }); // per-key limit

router.post('/collect', apiKeyAuth, collectLimiter, analyticsController.collectEvent);
router.get('/event-summary', analyticsController.eventSummary);
router.get('/user-stats', analyticsController.userStats);

module.exports = router;
