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

// Start server first (even if MongoDB fails, server will still run for testing)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-api')
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('⚠️  MongoDB connection error:', error.message);
        console.log('⚠️  Server is running but database features will not work');
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

module.exports = app;

