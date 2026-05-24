import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';
import upload from '../utils/multerConfig.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/image', protect, isAdmin, upload.single('image'), asyncHandler(uploadImage));

export default router;
