const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct);

module.exports = router;