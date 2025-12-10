const crypto = require('crypto');
const AnonUser = require('../models/anonUser.model');
const { generateAnonToken } = require('../utils/generateToken');

/**
 * Create anonymous user token
 */
const createAnonymousToken = async (req, res, next) => {
  try {
    // Generate unique tokenId
    const tokenId = crypto.randomBytes(32).toString('hex');
    
    // Create anonymous user
    const anonUser = await AnonUser.create({ tokenId });
    
    // Generate JWT token
    const token = generateAnonToken(tokenId);
    
    res.status(201).json({
      success: true,
      message: 'Anonymous token created',
      data: {
        token,
        tokenId: anonUser.tokenId,
        createdAt: anonUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnonymousToken
};

