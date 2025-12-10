const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|String} imageData - Image buffer or URL
 * @param {String} folder - Folder path in Cloudinary
 * @returns {Promise<Object>} Upload result with url and public_id
 */
const uploadImage = async (imageData, folder = 'ai-prompts') => {
  try {
    // If imageData is a URL or base64 string, use direct upload
    if (typeof imageData === 'string') {
      return await cloudinary.uploader.upload(imageData, {
        folder: folder
      });
    }

    // If imageData is a buffer, use stream upload
    if (Buffer.isBuffer(imageData)) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        Readable.from(imageData).pipe(uploadStream);
      });
    }

    throw new Error('Invalid image data type. Expected Buffer or String.');
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage
};

