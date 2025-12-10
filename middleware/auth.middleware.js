const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const AnonUser = require('../models/anonUser.model');

/**
 * Middleware to authenticate anonymous user token
 */
const authenticateAnon = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided or invalid format' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'anon') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token type' 
        });
      }

      // Verify tokenId exists in database
      const anonUser = await AnonUser.findOne({ tokenId: decoded.tokenId });
      if (!anonUser) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }

      req.user = {
        tokenId: decoded.tokenId,
        type: 'anon'
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authenticate admin token
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided or invalid format' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token type' 
        });
      }

      // Verify admin exists
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }

      req.user = {
        adminId: decoded.adminId,
        type: 'admin',
        role: admin.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authenticate super admin only
 */
const authenticateSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided or invalid format' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'admin') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token type' 
        });
      }

      // Verify admin exists and is super admin
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }

      // Check if user is super admin
      if (admin.role !== 'superAdmin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Super admin privileges required.'
        });
      }

      req.user = {
        adminId: decoded.adminId,
        type: 'admin',
        role: admin.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateAnon,
  authenticateAdmin,
  authenticateSuperAdmin
};

