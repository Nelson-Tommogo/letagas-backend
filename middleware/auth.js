import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    
    req.user = await findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Not authorized, user not found' 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Not authorized, token failed' 
    });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        message: `User role ${req.user.userType} is not authorized to access this route` 
      });
    }
    next();
  };
}