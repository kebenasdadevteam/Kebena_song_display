const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, authController.getProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', verifyToken, authController.changePassword);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Private (Admin only)
 */
router.post('/register', verifyToken, isAdmin, authController.register);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/users/:id', verifyToken, isAdmin, authController.updateUser);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

/**
 * @route   PUT /api/auth/users/:id/reset-password
 * @desc    Reset user password
 * @access  Private (Admin only)
 */
router.put('/users/:id/reset-password', verifyToken, isAdmin, authController.resetPassword);

module.exports = router;