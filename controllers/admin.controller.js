const Admin = require('../models/admin.model');
const Prompt = require('../models/prompt.model');
const Category = require('../models/category.model');
const AnonUser = require('../models/anonUser.model');
const { generateAdminToken } = require('../utils/generateToken');

/**
 * Admin login
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateAdminToken(admin._id);

    res.json({
      success: true,
      message: 'Admin authenticated',
      data: {
        token,
        admin: {
          _id: admin._id,
          username: admin.username,
          role: admin.role,
          createdAt: admin.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get admin statistics
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalPrompts,
      totalCategories,
      totalAnonUsers,
      promptsByStatus,
      recentPrompts
    ] = await Promise.all([
      Prompt.countDocuments(),
      Category.countDocuments(),
      AnonUser.countDocuments(),
      Prompt.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Prompt.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    const statusCounts = {};
    promptsByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        totalPrompts,
        totalCategories,
        totalAnonUsers,
        promptsByStatus: statusCounts,
        recentPrompts: recentPrompts // Prompts created in last 7 days
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new admin (super admin only)
 */
const createAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new admin (default role is 'admin')
    const newAdmin = await Admin.create({
      username,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        _id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all admins (super admin only)
 */
const listAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getStats,
  createAdmin,
  listAdmins
};

