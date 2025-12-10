require('dotenv').config();
const mongoose = require('mongoose');

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@') : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-api');
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Tips to fix authentication:');
      console.log('1. Check your username and password in MongoDB Atlas');
      console.log('2. URL-encode special characters in password (e.g., @ → %40, # → %23)');
      console.log('3. Verify your IP is whitelisted in Atlas Network Access');
      console.log('4. Make sure the database user has proper permissions');
    }
    
    process.exit(1);
  }
};

testConnection();

