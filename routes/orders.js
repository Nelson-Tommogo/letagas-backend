import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);

export default router;