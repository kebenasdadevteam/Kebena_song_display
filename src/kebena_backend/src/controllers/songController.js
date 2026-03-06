const db = require('../config/database');
const { processUploadedFile, deleteFile } = require('../utils/fileProcessor');
const path = require('path');

/**
 * Get all songs
 * GET /api/songs
 */
exports.getAllSongs = async (req, res) => {
  try {
    const { category, search, limit, offset } = req.query;

    let query = `
      SELECT 
        s.*,
        u1.username as creator_username,
        u2.username as uploader_username
      FROM songs s
      LEFT JOIN users u1 ON s.creator_id = u1.id
      LEFT JOIN users u2 ON s.uploader_id = u2.id
      WHERE s.is_active = TRUE
    `;
    
    const params = [];

    // Filter by category
    if (category && ['hymnal', 'local'].includes(category)) {
      query += ' AND s.category = ?';
      params.push(category);
    }

    // Search by number or title
    if (search) {
      query += ' AND (s.number LIKE ? OR s.title_amharic LIKE ? OR s.title_english LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY s.number ASC, s.created_at DESC';

    // Pagination
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [songs] = await db.query(query, params);

    // Parse JSON lyrics
    const formattedSongs = songs.map(song => ({
      id: song.id,
      number: song.number,
      category: song.category,
      titleAmharic: song.title_amharic,
      titleEnglish: song.title_english,
      lyrics: JSON.parse(song.lyrics),
      metadata: {
        creator: song.creator_username,
        uploader: song.uploader_username,
        sourceFile: song.source_file,
        fileType: song.file_type,
        updatedDate: song.updated_at,
        viewCount: song.view_count,
        lastViewed: song.last_viewed
      }
    }));

    res.json({
      success: true,
      count: formattedSongs.length,
      songs: formattedSongs
    });

  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get single song by ID
 * GET /api/songs/:id
 */
exports.getSongById = async (req, res) => {
  try {
    const songId = req.params.id;

    const [songs] = await db.query(
      `SELECT 
        s.*,
        u1.username as creator_username,
        u1.full_name as creator_full_name,
        u2.username as uploader_username,
        u2.full_name as uploader_full_name
      FROM songs s
      LEFT JOIN users u1 ON s.creator_id = u1.id
      LEFT JOIN users u2 ON s.uploader_id = u2.id
      WHERE s.id = ? AND s.is_active = TRUE`,
      [songId]
    );

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    const song = songs[0];

    // Update view count
    await db.query(
      'UPDATE songs SET view_count = view_count + 1, last_viewed = NOW() WHERE id = ?',
      [songId]
    );

    // Get associated files
    const [files] = await db.query(
      'SELECT * FROM files WHERE song_id = ?',
      [songId]
    );

    res.json({
      success: true,
      song: {
        id: song.id,
        number: song.number,
        category: song.category,
        titleAmharic: song.title_amharic,
        titleEnglish: song.title_english,
        lyrics: JSON.parse(song.lyrics),
        metadata: {
          creator: song.creator_username,
          creatorFullName: song.creator_full_name,
          uploader: song.uploader_username,
          uploaderFullName: song.uploader_full_name,
          sourceFile: song.source_file,
          fileType: song.file_type,
          createdAt: song.created_at,
          updatedDate: song.updated_at,
          viewCount: song.view_count + 1,
          lastViewed: song.last_viewed
        },
        files: files
      }
    });

  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create new song (Admin only)
 * POST /api/songs
 */
exports.createSong = async (req, res) => {
  try {
    const { number, category, titleAmharic, titleEnglish, lyrics, fileType } = req.body;

    // Validate input
    if (!number || !category || !titleAmharic || !titleEnglish || !lyrics) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: number, category, titleAmharic, titleEnglish, lyrics'
      });
    }

    // Validate category
    if (!['hymnal', 'local'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Category must be either "hymnal" or "local"'
      });
    }

    // Validate lyrics is an array
    if (!Array.isArray(lyrics) || lyrics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lyrics must be a non-empty array of slides'
      });
    }

    // Insert song
    const [result] = await db.query(
      `INSERT INTO songs 
       (number, category, title_amharic, title_english, lyrics, file_type, creator_id, uploader_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        number,
        category,
        titleAmharic,
        titleEnglish,
        JSON.stringify(lyrics),
        fileType || 'manual',
        req.user.id,
        req.user.id
      ]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'SONG_CREATED', 'song', result.insertId, `Created song: ${titleEnglish}`]
    );

    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      songId: result.insertId
    });

  } catch (error) {
    console.error('Create song error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Upload song file and extract content (Admin only)
 * POST /api/songs/upload
 */
exports.uploadSongFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const filePath = file.path;
    const fileType = path.extname(file.originalname).toLowerCase().substring(1); // Remove dot

    console.log('═══════════════════════════════════════════');
    console.log('📤 FILE UPLOAD STARTED');
    console.log('═══════════════════════════════════════════');
    console.log(`📄 Original filename: ${file.originalname}`);
    console.log(`📁 Saved to: ${filePath}`);
    console.log(`📊 File size: ${file.size} bytes`);
    console.log(`📋 MIME type: ${file.mimetype}`);
    console.log(`🏷️  File type: ${fileType}`);
    console.log('═══════════════════════════════════════════');

    // Validate file type
    if (!['pdf', 'ppt', 'pptx'].includes(fileType)) {
      console.error('❌ Invalid file type:', fileType);
      await deleteFile(filePath);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, PPT, and PPTX files are supported.'
      });
    }

    // Extract content from file
    console.log('🔄 Starting file processing...');
    const extractionResult = await processUploadedFile(filePath, fileType);
    
    console.log('═══════════════════════════════════════════');
    console.log('📊 EXTRACTION RESULT:');
    console.log(`   Success: ${extractionResult.success}`);
    console.log(`   Slides found: ${extractionResult.slideCount || 0}`);
    if (extractionResult.error) {
      console.log(`   Error: ${extractionResult.error}`);
    }
    console.log('═══════════════════════════════════════════');

    // Always return a success response with the extraction results
    // Even if extraction had issues, we return slides for manual editing
    const responseData = {
      success: true,
      message: extractionResult.success 
        ? 'File uploaded and processed successfully' 
        : 'File uploaded but extraction had issues. You can edit slides manually.',
      file: {
        filename: file.filename,
        originalFilename: file.originalname,
        filePath: filePath,
        fileType: fileType,
        fileSize: file.size,
        mimeType: file.mimetype
      },
      extraction: {
        slides: extractionResult.slides || ['Please add slide content manually'],
        slideCount: extractionResult.slideCount || 1,
        extractionSuccess: extractionResult.success
      }
    };

    // Add warning if extraction failed
    if (!extractionResult.success && extractionResult.error) {
      responseData.warning = extractionResult.error;
    }

    console.log('✅ Sending response to frontend');
    console.log(`   Slides to send: ${responseData.extraction.slideCount}`);
    console.log('═══════════════════════════════════════════\n');

    res.json(responseData);

  } catch (error) {
    console.error('═══════════════════════════════════════════');
    console.error('❌ UPLOAD FILE ERROR (CONTROLLER)');
    console.error('═══════════════════════════════════════════');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════\n');
    
    // Clean up uploaded file on error
    if (req.file) {
      await deleteFile(req.file.path);
    }

    // Always return a consistent structure, even on error
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: error.message,
      extraction: {
        slides: ['Error processing file. Please try again or add slides manually.'],
        slideCount: 1,
        extractionSuccess: false
      }
    });
  }
};

/**
 * Upload display background image and persist active URL
 * POST /api/songs/background-image
 */
exports.uploadBackgroundImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const fileType = path.extname(file.originalname).toLowerCase();
    const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedImageTypes.includes(fileType)) {
      await deleteFile(file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid image type. Allowed: JPG, PNG, GIF, WEBP'
      });
    }

    // Keep a stable public URL under /uploads for projector background usage.
    const normalizedPath = file.path.replace(/\\/g, '/');
    const publicPath = normalizedPath.startsWith('uploads/')
      ? normalizedPath.substring('uploads/'.length)
      : normalizedPath;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${publicPath}`;

    // Persist active background URL; this remains until admin changes it.
    await db.query(
      `INSERT INTO settings (setting_key, setting_value, description, updated_by)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         setting_value = VALUES(setting_value),
         description = VALUES(description),
         updated_by = VALUES(updated_by),
         updated_at = CURRENT_TIMESTAMP`,
      [
        'display_background_image',
        imageUrl,
        'Active display background image URL',
        req.user.id
      ]
    );

    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [req.user.id, 'BACKGROUND_IMAGE_UPDATED', 'setting', `Updated display background image: ${file.originalname}`]
    );

    res.json({
      success: true,
      message: 'Background image uploaded successfully',
      url: imageUrl,
      file: {
        filename: file.filename,
        originalFilename: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload background image error:', error);
    if (req.file) {
      await deleteFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error while uploading background image',
      error: error.message
    });
  }
};

/**
 * Create song from uploaded file (Admin only)
 * POST /api/songs/from-file
 */
exports.createSongFromFile = async (req, res) => {
  try {
    const { 
      number, 
      category, 
      titleAmharic, 
      titleEnglish, 
      lyrics, 
      fileData 
    } = req.body;

    // Validate input
    if (!number || !category || !titleAmharic || !titleEnglish || !lyrics) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!Array.isArray(lyrics) || lyrics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lyrics must be a non-empty array'
      });
    }

    // Insert song
    const [songResult] = await db.query(
      `INSERT INTO songs 
       (number, category, title_amharic, title_english, lyrics, source_file, file_type, creator_id, uploader_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        number,
        category,
        titleAmharic,
        titleEnglish,
        JSON.stringify(lyrics),
        fileData?.originalFilename || null,
        fileData?.fileType || 'manual',
        req.user.id,
        req.user.id
      ]
    );

    const songId = songResult.insertId;

    // If file data is provided, save file record
    if (fileData && fileData.filePath) {
      await db.query(
        `INSERT INTO files 
         (song_id, filename, original_filename, file_path, file_type, file_size, mime_type, uploaded_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          songId,
          fileData.filename,
          fileData.originalFilename,
          fileData.filePath,
          fileData.fileType,
          fileData.fileSize,
          fileData.mimeType,
          req.user.id
        ]
      );
    }

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'SONG_CREATED', 'song', songId, `Created song from file: ${titleEnglish}`]
    );

    res.status(201).json({
      success: true,
      message: 'Song created successfully from uploaded file',
      songId: songId
    });

  } catch (error) {
    console.error('Create song from file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update song (Admin only)
 * PUT /api/songs/:id
 */
exports.updateSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const { number, category, titleAmharic, titleEnglish, lyrics } = req.body;

    // Check if song exists
    const [existingSongs] = await db.query(
      'SELECT id, title_english FROM songs WHERE id = ?',
      [songId]
    );

    if (existingSongs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    const updates = [];
    const values = [];

    if (number !== undefined) {
      updates.push('number = ?');
      values.push(number);
    }
    if (category !== undefined) {
      if (!['hymnal', 'local'].includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
      updates.push('category = ?');
      values.push(category);
    }
    if (titleAmharic !== undefined) {
      updates.push('title_amharic = ?');
      values.push(titleAmharic);
    }
    if (titleEnglish !== undefined) {
      updates.push('title_english = ?');
      values.push(titleEnglish);
    }
    if (lyrics !== undefined) {
      if (!Array.isArray(lyrics)) {
        return res.status(400).json({
          success: false,
          message: 'Lyrics must be an array'
        });
      }
      updates.push('lyrics = ?');
      values.push(JSON.stringify(lyrics));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(songId);

    await db.query(
      `UPDATE songs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'SONG_UPDATED', 'song', songId, `Updated song: ${existingSongs[0].title_english}`]
    );

    res.json({
      success: true,
      message: 'Song updated successfully'
    });

  } catch (error) {
    console.error('Update song error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete song (Admin only)
 * DELETE /api/songs/:id
 */
exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;

    // Check if song exists
    const [songs] = await db.query(
      'SELECT id, title_english FROM songs WHERE id = ?',
      [songId]
    );

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Soft delete (set is_active to FALSE)
    await db.query(
      'UPDATE songs SET is_active = FALSE WHERE id = ?',
      [songId]
    );

    // Or hard delete (uncomment if you want permanent deletion)
    // await db.query('DELETE FROM songs WHERE id = ?', [songId]);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'SONG_DELETED', 'song', songId, `Deleted song: ${songs[0].title_english}`]
    );

    res.json({
      success: true,
      message: 'Song deleted successfully'
    });

  } catch (error) {
    console.error('Delete song error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get song statistics
 * GET /api/songs/stats
 */
exports.getStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_songs,
        SUM(CASE WHEN category = 'hymnal' THEN 1 ELSE 0 END) as hymnal_count,
        SUM(CASE WHEN category = 'local' THEN 1 ELSE 0 END) as local_count,
        SUM(view_count) as total_views,
        MAX(view_count) as max_views
      FROM songs 
      WHERE is_active = TRUE
    `);

    const [recentSongs] = await db.query(`
      SELECT id, number, title_english, category, created_at
      FROM songs 
      WHERE is_active = TRUE
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const [popularSongs] = await db.query(`
      SELECT id, number, title_english, category, view_count
      FROM songs 
      WHERE is_active = TRUE
      ORDER BY view_count DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: stats[0],
      recentSongs,
      popularSongs
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Scan uploads folder for unprocessed files (Admin only)
 * GET /api/songs/scan-uploads
 */
exports.scanUploads = async (req, res) => {
  try {
    const fs = require('fs').promises;
    const uploadsDir = path.join(__dirname, '../../uploads');

    // Ensure uploads directory exists
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      return res.json({
        success: true,
        files: [],
        message: 'Uploads directory not found or is empty'
      });
    }

    // Read all files in uploads directory
    const allFiles = await fs.readdir(uploadsDir);
    
    // Filter for PPT, PPTX, and PDF files
    const songFiles = allFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.pdf', '.ppt', '.pptx'].includes(ext);
    });

    // Get file stats for each
    const fileDetails = await Promise.all(
      songFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stats = await fs.stat(filePath);
        const ext = path.extname(filename).toLowerCase().substring(1);
        
        return {
          filename,
          filePath,
          fileType: ext,
          fileSize: stats.size,
          uploadedAt: stats.mtime,
          relativePath: `uploads/${filename}`
        };
      })
    );

    // Sort by upload date (newest first)
    fileDetails.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    res.json({
      success: true,
      count: fileDetails.length,
      files: fileDetails
    });

  } catch (error) {
    console.error('Scan uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scanning uploads',
      error: error.message
    });
  }
};

/**
 * Process a file from uploads directory (Admin only)
 * POST /api/songs/process-upload
 */
exports.processUploadedFile = async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    const fileType = path.extname(filename).toLowerCase().substring(1);

    // Check if file exists
    const fs = require('fs').promises;
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found in uploads directory'
      });
    }

    console.log(`📤 Processing file from uploads: ${filename}`);

    // Extract content from file
    const extractionResult = await processUploadedFile(filePath, fileType);

    if (!extractionResult.success) {
      console.warn('⚠️ Extraction failed, but returning slides for manual editing');
      return res.json({
        success: true,
        message: 'File found but extraction had issues. You can edit slides manually.',
        warning: extractionResult.error,
        file: {
          filename,
          filePath,
          fileType
        },
        extraction: {
          slides: extractionResult.slides || ['Please add slide content manually'],
          slideCount: extractionResult.slides ? extractionResult.slides.length : 1
        }
      });
    }

    console.log(`✅ Successfully processed file with ${extractionResult.slideCount} slides`);

    res.json({
      success: true,
      message: 'File processed successfully',
      file: {
        filename,
        filePath,
        fileType
      },
      extraction: {
        slides: extractionResult.slides,
        slideCount: extractionResult.slideCount
      }
    });

  } catch (error) {
    console.error('❌ Process upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file processing',
      error: error.message
    });
  }
};