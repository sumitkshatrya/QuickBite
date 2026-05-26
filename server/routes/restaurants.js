import express from 'express';
import { getRestaurants } from '../controllers/restaurantController.js';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(getRestaurants));
// router.get('/:id', asyncHandler(getRestaurantById));
// Restaurant admin endpoints removed because restaurantController does not export them yet.
// router.post('/', protect, isAdmin, asyncHandler(createRestaurant));
// router.put('/:id', protect, isAdmin, asyncHandler(updateRestaurant));
// router.delete('/:id', protect, isAdmin, asyncHandler(deleteRestaurant));

export default router;
