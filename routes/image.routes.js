const express = require('express');
const router = express.Router();
const {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  getImage
} = require('../controllers/image.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');

/**
 * @route   POST /api/images/upload
 * @desc    Upload single image to Cloudinary
 * @access  Private (Anonymous User)
 */
router.post('/upload', authenticateAdmin, uploadSingle, uploadImageToCloudinary);

/**
 * @route   POST /api/images/upload-multiple
 * @desc    Upload multiple images to Cloudinary
 * @access  Private (Anonymous User)
 */
router.post('/upload-multiple', authenticateAdmin, uploadMultiple, uploadMultipleImages);

/**
 * @route   GET /api/images/:id
 * @desc    Get image by ID
 * @access  Public
 */
router.get('/:id', getImage);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete image from Cloudinary and database
 * @access  Private (Anonymous User)
 */
router.delete('/:id', authenticateAdmin, deleteImageFromCloudinary);

module.exports = router;

