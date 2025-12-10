const mongoose = require('mongoose');

const anonUserSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AnonUser', anonUserSchema);

