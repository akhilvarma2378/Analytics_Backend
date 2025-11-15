const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.register);

router.get('/api-key', authController.getApiKey);

router.post('/revoke', authController.revokeKey);

router.post('/regenerate', authController.regenerateKey);

module.exports = router;
