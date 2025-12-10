require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/admin.model');

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-api');
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ username: 'vishrut' });
    
    if (existingAdmin) {
      // Update to super admin if not already
      if (existingAdmin.role !== 'superAdmin') {
        existingAdmin.role = 'superAdmin';
        existingAdmin.password = '2140'; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('✅ Updated existing admin to super admin');
      } else {
        // Update password if needed
        existingAdmin.password = '2140'; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('✅ Super admin already exists, password updated');
      }
    } else {
      // Create new super admin
      const superAdmin = await Admin.create({
        username: 'vishrut',
        password: '2140',
        role: 'superAdmin'
      });
      console.log('✅ Super admin created successfully');
      console.log('   Username: vishrut');
      console.log('   Password: 2140');
      console.log('   Role: superAdmin');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding super admin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();

