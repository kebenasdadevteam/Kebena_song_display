const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/settings
 * @desc    Get app settings
 * @access  Public (optional auth)
 */
router.get('/', optionalAuth, settingsController.getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update app setting
 * @access  Private (Admin only)
 */
router.put('/', verifyToken, isAdmin, settingsController.updateSetting);

module.exports = router;
