const express = require('express');
const router = express.Router();
const { login, getStats, createAdmin, listAdmins } = require('../controllers/admin.controller');
const {
  listAllPrompts,
  deletePrompt,
  createPrompt
} = require('../controllers/prompt.controller');
const { authenticateAdmin, authenticateSuperAdmin } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin statistics
 * @access  Private (Admin)
 */
router.get('/stats', authenticateAdmin, getStats);

/**
 * @route   POST /api/admin/prompts
 * @desc    Create a new prompt (admin)
 * @access  Private (Admin)
 */
router.post('/prompts', authenticateAdmin, createPrompt);

/**
 * @route   GET /api/admin/prompts
 * @desc    List all prompts (admin)
 * @access  Private (Admin)
 */
router.get('/prompts', authenticateAdmin, listAllPrompts);

/**
 * @route   DELETE /api/admin/prompts/:id
 * @desc    Delete a prompt (admin)
 * @access  Private (Admin)
 */
router.delete('/prompts/:id', authenticateAdmin, deletePrompt);

/**
 * @route   POST /api/admin/create
 * @desc    Create new admin (super admin only)
 * @access  Private (Super Admin)
 */
router.post('/create', authenticateSuperAdmin, createAdmin);

/**
 * @route   GET /api/admin/list
 * @desc    List all admins (super admin only)
 * @access  Private (Super Admin)
 */
router.get('/list', authenticateSuperAdmin, listAdmins);

module.exports = router;
