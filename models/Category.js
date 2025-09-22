const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  description: String,
  image: String,
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Category', CategorySchema);