import { sign } from 'jsonwebtoken';

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default generateToken;