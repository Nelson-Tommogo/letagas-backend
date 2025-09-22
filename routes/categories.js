import { Router } from 'express';
import { find } from '../models/Category';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const categories = await find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching categories',
      error: error.message 
    });
  }
});

export default router;