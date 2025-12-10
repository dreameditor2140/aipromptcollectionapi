const Category = require('../models/category.model');
const Prompt = require('../models/prompt.model');

/**
 * List all categories
 */
const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new category (admin only)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category (admin only)
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category (admin only)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category is used by any prompts
    const promptCount = await Prompt.countDocuments({ category: id });
    if (promptCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is used by ${promptCount} prompt(s)`
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

