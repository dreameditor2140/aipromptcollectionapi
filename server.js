require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');
const promptRoutes = require('./routes/prompt.routes');
const userRoutes = require('./routes/user.routes');
const imageRoutes = require('./routes/image.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        data: {
            server: 'AI Prompt API',
            version: '1.0.0',
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/user', userRoutes);
app.use('/api/images', imageRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
});

// Connect to MongoDB first, then start server
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-api';
        
        // Log connection attempt (mask password for security)
        const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
        console.log('🔄 Attempting to connect to MongoDB...');
        console.log('📍 Connection string:', maskedUri);
        
        // Connection options to prevent buffering timeout
        const options = {
            serverSelectionTimeoutMS: 30000, // 30 seconds to select server
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
        };

        await mongoose.connect(mongoUri, options);
        
        // Verify connection is actually established
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB connection established successfully');
            console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
            
            // Start server only after MongoDB connection is established
            app.listen(PORT, () => {
                console.log(`🚀 Server is running on port ${PORT}`);
                console.log(`🌐 API available at http://localhost:${PORT}/api`);
                console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
            });
        } else {
            throw new Error('Connection established but readyState is not 1');
        }
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('💡 Tip: Check if MongoDB server is running and the hostname is correct');
        } else if (error.message.includes('authentication failed')) {
            console.error('💡 Tip: Check your MongoDB username and password');
            console.error('💡 Tip: URL-encode special characters in password (e.g., @ → %40, # → %23)');
        } else if (error.message.includes('timeout')) {
            console.error('💡 Tip: Check your network connection and MongoDB server status');
            console.error('💡 Tip: If using MongoDB Atlas, verify your IP is whitelisted');
        } else if (!process.env.MONGODB_URI) {
            console.error('💡 Tip: MONGODB_URI environment variable is not set');
            console.error('💡 Tip: Create a .env file with: MONGODB_URI=your_connection_string');
        }
        
        console.error('⚠️  Server will not start without database connection');
        process.exit(1);
    }
};

// Initialize database connection
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

module.exports = app;

