const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile, 
  addAddress 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/address', protect, addAddress);

module.exports = router;