const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/prompt.controller');
const { authenticateAnon } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/user/favorites
 * @desc    List favorite prompts for this anonymous user
 * @access  Private (Anonymous User)
 */
router.get('/favorites', authenticateAnon, getFavorites);

/**
 * @route   POST /api/user/favorites/add
 * @desc    Add a prompt to favorites
 * @access  Private (Anonymous User)
 */
router.post('/favorites/add', authenticateAnon, addFavorite);

/**
 * @route   POST /api/user/favorites/remove
 * @desc    Remove a prompt from favorites
 * @access  Private (Anonymous User)
 */
router.post('/favorites/remove', authenticateAnon, removeFavorite);

module.exports = router;

