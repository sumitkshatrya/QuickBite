import express from 'express';
import protect from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getUserOrders, getOrderById, createOrder } from '../controllers/orderController.js';
import { updateOrderStatus, getOrderTracking } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, asyncHandler(createOrder));
router.get('/', protect, asyncHandler(getUserOrders));
router.get('/:id', protect, asyncHandler(getOrderById));
router.put('/:id/status', protect, asyncHandler(updateOrderStatus));
router.get('/:id/track', protect, asyncHandler(getOrderTracking));

export default router;
