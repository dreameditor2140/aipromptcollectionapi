const Image = require('../models/image.model');
const { uploadImage, deleteImage } = require('../services/cloudinary.service');

/**
 * Upload image to Cloudinary and store in database
 */
const uploadImageToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(req.file.buffer, 'ai-prompts/user-uploads');

    // Store in database
    const image = await Image.create({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        _id: image._id,
        url: image.url,
        publicId: image.publicId,
        createdAt: image.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple images
 */
const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = [];

    // Upload each image
    for (const file of req.files) {
      try {
        // Upload to Cloudinary
        const uploadResult = await uploadImage(file.buffer, 'ai-prompts/user-uploads');

        // Store in database
        const image = await Image.create({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });

        uploadedImages.push({
          _id: image._id,
          url: image.url,
          publicId: image.publicId,
          createdAt: image.createdAt
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        // Continue with other images even if one fails
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload any images'
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete image from Cloudinary and database
 */
const deleteImageFromCloudinary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    try {
      await deleteImage(image.publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      // Continue to delete from database even if Cloudinary deletion fails
    }

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get image by ID
 */
const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  getImage
};

