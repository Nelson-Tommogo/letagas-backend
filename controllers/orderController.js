const Order = require('../models/Order');


exports.createOrder = async (req, res) => {
  try {
    const { items, gasOrder, paymentMethod, deliveryAddress } = req.body;

    let totalAmount = 0;
    
    if (items && items.length > 0) {
      items.forEach(item => {
        totalAmount += item.price * item.quantity;
      });
    }

    if (gasOrder) {
      totalAmount += gasOrder.cylinderSize === '12.5kg' ? 3500 : 2500;
    }

    const order = new Order({
      user: req.user.id,
      items,
      gasOrder,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });

    const createdOrder = await order.save();
    await createdOrder.populate('user', 'name email phone');
    await createdOrder.populate('items.product');

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product')
      .populate('gasOrder.assignedVendor', 'name phone');

    if (order) {
      // Check if user owns the order or is admin/vendor
      if (order.user._id.toString() !== req.user.id && 
          req.user.userType !== 'admin' && 
          req.user.userType !== 'vendor') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching order',
      error: error.message 
    });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      
      if (status === 'delivered') {
        order.paymentStatus = 'paid';
      }

      const updatedOrder = await order.save();
      await updatedOrder.populate('user', 'name email phone');
      await updatedOrder.populate('items.product');

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating order status',
      error: error.message 
    });
  }
};