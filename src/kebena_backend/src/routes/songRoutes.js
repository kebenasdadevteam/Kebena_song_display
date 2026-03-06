const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

/**
 * @route   GET /api/songs
 * @desc    Get all songs (with optional filters)
 * @query   category - Filter by category (hymnal/local)
 * @query   search - Search by number or title
 * @query   limit - Limit number of results
 * @query   offset - Offset for pagination
 * @access  Public (but tracks user if logged in)
 */
router.get('/', optionalAuth, songController.getAllSongs);

/**
 * @route   GET /api/songs/stats
 * @desc    Get song statistics
 * @access  Private (Admin only)
 */
router.get('/stats', verifyToken, isAdmin, songController.getStats);

/**
 * @route   GET /api/songs/scan-uploads
 * @desc    Scan uploads folder for unprocessed files
 * @access  Private (Admin only)
 */
router.get('/scan-uploads', verifyToken, isAdmin, songController.scanUploads);

/**
 * @route   POST /api/songs/process-upload
 * @desc    Process a file from uploads directory
 * @access  Private (Admin only)
 */
router.post('/process-upload', verifyToken, isAdmin, songController.processUploadedFile);

/**
 * @route   GET /api/songs/:id
 * @desc    Get single song by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, songController.getSongById);

/**
 * @route   POST /api/songs
 * @desc    Create new song manually
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, isAdmin, songController.createSong);

/**
 * @route   POST /api/songs/upload
 * @desc    Upload and process song file (PDF/PPT)
 * @access  Private (Admin only)
 */
router.post(
  '/upload',
  verifyToken,
  isAdmin,
  upload.single('file'),
  handleUploadError,
  songController.uploadSongFile
);

/**
 * @route   POST /api/songs/background-image
 * @desc    Upload display background image and persist active background setting
 * @access  Private (Admin only)
 */
router.post(
  '/background-image',
  verifyToken,
  isAdmin,
  upload.single('file'),
  handleUploadError,
  songController.uploadBackgroundImage
);

/**
 * @route   POST /api/songs/from-file
 * @desc    Create song from previously uploaded file
 * @access  Private (Admin only)
 */
router.post('/from-file', verifyToken, isAdmin, songController.createSongFromFile);

/**
 * @route   PUT /api/songs/:id
 * @desc    Update song
 * @access  Private (Admin only)
 */
router.put('/:id', verifyToken, isAdmin, songController.updateSong);

/**
 * @route   DELETE /api/songs/:id
 * @desc    Delete song
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, isAdmin, songController.deleteSong);

module.exports = router;