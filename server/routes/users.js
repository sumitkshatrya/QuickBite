import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';
import {
  getUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, isAdmin, asyncHandler(getUsers));
router.get('/profile', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, asyncHandler(updateUserProfile));
router.get('/:id', protect, isAdmin, asyncHandler(getUserById));
router.put('/:id', protect, isAdmin, asyncHandler(updateUser));
router.delete('/:id', protect, isAdmin, asyncHandler(deleteUser));

export default router;
