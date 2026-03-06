const db = require('../config/database');

/**
 * Get all settings
 * GET /api/settings
 */
exports.getSettings = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT setting_key, setting_value, description, updated_at
       FROM settings`
    );

    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json({
      success: true,
      settings,
      items: rows,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while loading settings',
      error: error.message,
    });
  }
};

/**
 * Upsert a setting (admin)
 * PUT /api/settings
 */
exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || typeof value === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Both key and value are required',
      });
    }

    await db.query(
      `INSERT INTO settings (setting_key, setting_value, updated_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         setting_value = VALUES(setting_value),
         updated_by = VALUES(updated_by),
         updated_at = CURRENT_TIMESTAMP`,
      [key, String(value), req.user.id]
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      key,
      value: String(value),
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating setting',
      error: error.message,
    });
  }
};
