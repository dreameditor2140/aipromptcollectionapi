const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (to upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Allowed image MIME types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware for single image upload
const uploadSingle = upload.single('image');

// Middleware for multiple image uploads
const uploadMultiple = upload.array('images', 10); // Max 10 images

module.exports = {
  uploadSingle,
  uploadMultiple
};

