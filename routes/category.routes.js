const express = require('express');
const router = express.Router();
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { authenticateAdmin, authenticateAnon } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/categories
 * @desc    List all categories
 * @access  Private (Anonymous User)
 */
router.get('/', authenticateAnon, listCategories);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (Admin)
 */
router.post('/', authenticateAdmin, createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Admin)
 */
router.put('/:id', authenticateAdmin, updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
router.delete('/:id', authenticateAdmin, deleteCategory);

module.exports = router;

