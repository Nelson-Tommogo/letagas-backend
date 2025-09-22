const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: { 
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: { 
    type: String, 
    enum: ['cylinder', 'regulator', 'hose', 'burner', 'cooker', 'accessory'], 
    required: true 
  },
  images: [String],
  stock: { 
    type: Number, 
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  specifications: {
    brand: String,
    size: String,
    material: String,
    weight: String
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', ProductSchema);