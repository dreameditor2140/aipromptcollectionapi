const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  promptText: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  status: {
    type: String,
    enum: ['queued', 'generating', 'done', 'failed'],
    default: 'queued'
  },
  createdBy: {
    type: String, // tokenId for anonymous users
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prompt', promptSchema);

