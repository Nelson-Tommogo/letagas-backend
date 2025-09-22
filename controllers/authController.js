import { findOne, create, findById } from '../models/User';
import generateToken from '../utils/generateToken';

export async function register(req, res) {
  try {
    const { name, email, phone, password, userType } = req.body;

    const userExists = await findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or phone number' 
      });
    }

    const user = await create({
      name,
      email,
      phone,
      password,
      userType: userType || 'customer'
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        token
      });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Invalid user data',
      error: error.message 
    });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        token
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Login failed',
      error: error.message 
    });
  }
}


export async function getMe(req, res) {
  try {
    const user = await findById(req.user.id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      addresses: user.addresses,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
}