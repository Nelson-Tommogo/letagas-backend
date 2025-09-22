import { findById } from '../models/User';

export async function getUserProfile(req, res) {
  try {
    const user = await findById(req.user.id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        addresses: user.addresses,
        walletBalance: user.walletBalance
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
}


export async function updateUserProfile(req, res) {
  try {
    const user = await findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        userType: updatedUser.userType,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
}


export async function addAddress(req, res) {
  try {
    const { label, addressLine1, addressLine2, city, state, isDefault } = req.body;
    
    const user = await findById(req.user.id);
    
    if (user) {
      const newAddress = {
        label,
        addressLine1,
        addressLine2,
        city,
        state,
        isDefault: isDefault || false
      };

      if (isDefault) {
        user.addresses.forEach(address => {
          address.isDefault = false;
        });
      }

      user.addresses.push(newAddress);
      await user.save();

      res.status(201).json({ 
        message: 'Address added successfully',
        addresses: user.addresses 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding address',
      error: error.message 
    });
  }
}