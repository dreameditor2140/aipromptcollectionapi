const express = require('express');
const router = express.Router();
const { createAnonymousToken } = require('../controllers/auth.controller');

/**
 * @route   POST /api/auth/anonymous
 * @desc    Create anonymous user token
 * @access  Public
 */
router.post('/anonymous', createAnonymousToken);

module.exports = router;

