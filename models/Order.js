const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1 
  },
  price: { 
    type: Number, 
    required: true 
  }
});

const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderNumber: { 
    type: String, 
    unique: true,
    required: true 
  },
  items: [OrderItemSchema],
  gasOrder: {
    cylinderSize: String,
    deliveryAddress: {
      label: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String
    },
    status: { 
      type: String, 
      enum: ['pending', 'assigned', 'on-the-way', 'delivered', 'cancelled'],
      default: 'pending'
    },
    assignedVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'wallet', 'cash'], 
    default: 'cash' 
  },
  deliveryAddress: {
    label: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { 
  timestamps: true 
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);