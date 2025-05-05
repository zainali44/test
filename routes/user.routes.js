import express from 'express';
import { createUser, loginUser, getUsers, emailVerification, updateUserProfile, updateUserPassword, requestPasswordReset, resetPassword, updateUserImage, validateResetToken } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/verify-email', emailVerification);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/reset-password-validate', validateResetToken);

// Protected routes
router.get('/users', verifyToken, getUsers);
router.put('/profile', verifyToken, updateUserProfile);
router.put('/password', verifyToken, updateUserPassword);
router.put('/profile-image', verifyToken, upload.single('profileImage'), updateUserImage);

export default router; 