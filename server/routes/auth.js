import express from 'express';
import {
	registerUser,
	loginUser,
	getCurrentUser,
	updateCurrentUser,
	registerAdmin,
	loginAdmin,
	logoutUser,
} from '../controllers/authController.js';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// User auth
router.post('/register-user', asyncHandler(registerUser));
router.post('/login-user', asyncHandler(loginUser));

// Admin auth (requires ADMIN_SECRET for registration)
router.post('/register-admin', asyncHandler(registerAdmin));
router.post('/login-admin', asyncHandler(loginAdmin));

router.get('/current-user', protect, asyncHandler(getCurrentUser));
router.post('/logout', asyncHandler(logoutUser));
router.put('/me', protect, asyncHandler(updateCurrentUser));

export default router;
