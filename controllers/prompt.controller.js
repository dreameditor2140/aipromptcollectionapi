const Prompt = require('../models/prompt.model');
const Category = require('../models/category.model');
const Image = require('../models/image.model');
const AnonUser = require('../models/anonUser.model');
const { uploadImage } = require('../services/cloudinary.service');

/**
 * Generate image from prompt
 * Note: This is a placeholder. In production, you would integrate with an AI image generation API
 */
const generatePrompt = async (req, res, next) => {
  try {
    const { promptText, categoryId, count = 1, size = '1024x1024', imageIds } = req.body;
    const { tokenId } = req.user;

    if (!promptText) {
      return res.status(400).json({
        success: false,
        message: 'promptText is required'
      });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Validate image IDs if provided
    let validImageIds = [];
    if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
      // Verify all images exist
      const images = await Image.find({ _id: { $in: imageIds } });
      if (images.length !== imageIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more image IDs are invalid'
        });
      }
      validImageIds = imageIds;
    }

    // Create prompt with queued status
    const prompt = await Prompt.create({
      promptText,
      category: categoryId || null,
      images: validImageIds,
      createdBy: tokenId,
      status: validImageIds.length > 0 ? 'done' : 'queued' // If images provided, mark as done
    });

    // In a real implementation, you would:
    // 1. Queue the image generation job
    // 2. Process it asynchronously
    // 3. Update the prompt status and add images when done
    
    // For now, we'll simulate the process
    // TODO: Integrate with actual AI image generation service (e.g., OpenAI DALL-E, Stable Diffusion, etc.)
    
    // Simulate async processing
    setTimeout(async () => {
      try {
        await Prompt.findByIdAndUpdate(prompt._id, { status: 'generating' });
        
        // Placeholder: In production, call your AI image generation API here
        // const generatedImages = await aiImageService.generate(promptText, count, size);
        // 
        // For each generated image:
        // const uploadResult = await uploadImage(imageBuffer);
        // const image = await Image.create({
        //   url: uploadResult.secure_url,
        //   publicId: uploadResult.public_id
        // });
        // await Prompt.findByIdAndUpdate(prompt._id, {
        //   $push: { images: image._id },
        //   status: 'done'
        // });
        
        // For demo purposes, we'll just mark it as done without actual images
        await Prompt.findByIdAndUpdate(prompt._id, { status: 'done' });
      } catch (error) {
        await Prompt.findByIdAndUpdate(prompt._id, { status: 'failed' });
        console.error('Image generation error:', error);
      }
    }, 1000);

    // Populate images if they exist
    if (validImageIds.length > 0) {
      await prompt.populate('images', 'url publicId');
    }

    res.json({
      success: true,
      message: 'Prompt generation request accepted',
      data: {
        _id: prompt._id,
        promptText: prompt.promptText,
        images: prompt.images || [],
        status: prompt.status,
        createdAt: prompt.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List prompts (public)
 */
const listPrompts = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const prompts = await Prompt.find(query)
      .populate('category', 'name description')
      .populate('images', 'url publicId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      success: true,
      data: prompts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prompt detail
 */
const getPrompt = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prompt = await Prompt.findById(id)
      .populate('category', 'name description')
      .populate('images', 'url publicId');

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all prompts (admin only)
 */
const listAllPrompts = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const prompts = await Prompt.find(query)
      .populate('category', 'name description')
      .populate('images', 'url publicId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      success: true,
      data: prompts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete prompt (admin only)
 */
const deletePrompt = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prompt = await Prompt.findById(id).populate('images');
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    // Delete associated images from Cloudinary and database
    // Note: In production, you should also delete from Cloudinary
    // const { deleteImage } = require('../services/cloudinary.service');
    // for (const image of prompt.images) {
    //   await deleteImage(image.publicId);
    //   await Image.findByIdAndDelete(image._id);
    // }

    await Prompt.findByIdAndDelete(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get user favorites
 */
const getFavorites = async (req, res, next) => {
  try {
    const { tokenId } = req.user;

    const anonUser = await AnonUser.findOne({ tokenId })
      .populate({
        path: 'favorites',
        populate: [
          { path: 'category', select: 'name description' },
          { path: 'images', select: 'url publicId' }
        ]
      });

    if (!anonUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: anonUser.favorites || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add prompt to favorites
 */
const addFavorite = async (req, res, next) => {
  try {
    const { promptId } = req.body;
    const { tokenId } = req.user;

    if (!promptId) {
      return res.status(400).json({
        success: false,
        message: 'promptId is required'
      });
    }

    // Verify prompt exists
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    const anonUser = await AnonUser.findOne({ tokenId });
    if (!anonUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already favorited
    if (anonUser.favorites.includes(promptId)) {
      return res.json({
        success: true,
        message: 'Already in favorites',
        data: anonUser.favorites
      });
    }

    anonUser.favorites.push(promptId);
    await anonUser.save();

    res.json({
      success: true,
      message: 'Added to favorites',
      data: anonUser.favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove prompt from favorites
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { promptId } = req.body;
    const { tokenId } = req.user;

    if (!promptId) {
      return res.status(400).json({
        success: false,
        message: 'promptId is required'
      });
    }

    const anonUser = await AnonUser.findOne({ tokenId });
    if (!anonUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    anonUser.favorites = anonUser.favorites.filter(
      fav => fav.toString() !== promptId
    );
    await anonUser.save();

    res.json({
      success: true,
      message: 'Removed from favorites',
      data: anonUser.favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create prompt (admin only)
 */
const createPrompt = async (req, res, next) => {
  try {
    const { promptText, categoryId, status = 'done', imageUrls } = req.body;
    const { adminId } = req.user;

    if (!promptText) {
      return res.status(400).json({
        success: false,
        message: 'promptText is required'
      });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Validate status
    const validStatuses = ['queued', 'generating', 'done', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Process images if provided
    const imageIds = [];
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        // Create image record (assuming URL is already uploaded)
        // If you need to upload to Cloudinary, you can add that logic here
        const image = await Image.create({
          url: imageUrl,
          publicId: `admin-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
        imageIds.push(image._id);
      }
    }

    // Create prompt with admin identifier
    const prompt = await Prompt.create({
      promptText,
      category: categoryId || null,
      images: imageIds,
      status: status,
      createdBy: `admin:${adminId}`
    });

    // Populate category and images for response
    await prompt.populate('category', 'name description');
    await prompt.populate('images', 'url publicId');

    res.status(201).json({
      success: true,
      message: 'Prompt created successfully',
      data: prompt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePrompt,
  listPrompts,
  getPrompt,
  listAllPrompts,
  deletePrompt,
  createPrompt,
  getFavorites,
  addFavorite,
  removeFavorite
};

