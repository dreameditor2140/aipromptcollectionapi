const express = require('express');
const router = express.Router();
const {
  generatePrompt,
  listPrompts,
  getPrompt
} = require('../controllers/prompt.controller');
const { authenticateAnon } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/prompts/generate
 * @desc    Generate image from prompt
 * @access  Private (Anonymous User)
 */
router.post('/generate', authenticateAnon, generatePrompt);

/**
 * @route   GET /api/prompts
 * @desc    List prompts
 * @access  Private (Anonymous User)
 */
router.get('/', authenticateAnon, listPrompts);

/**
 * @route   GET /api/prompts/:id
 * @desc    Get prompt detail
 * @access  Private (Anonymous User)
 */
router.get('/:id', authenticateAnon, getPrompt);

module.exports = router;
