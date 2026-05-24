import express from 'express';
import { getFoods } from '../controllers/foodController.js';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';
import { createFood, createFoodsBulk, getFoodById, updateFood, deleteFood } from '../controllers/foodController.js';

const router = express.Router();

router.get('/', asyncHandler(getFoods));
router.post('/bulk', protect, isAdmin, asyncHandler(createFoodsBulk));
router.get('/:id', asyncHandler(getFoodById));
router.post('/', protect, isAdmin, asyncHandler(createFood));
router.put('/:id', protect, isAdmin, asyncHandler(updateFood));
router.delete('/:id', protect, isAdmin, asyncHandler(deleteFood));

export default router;
