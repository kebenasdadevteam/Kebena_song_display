const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'kebena_church_db';

// SQL Schema for all tables
const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number VARCHAR(10) NOT NULL,
  category ENUM('hymnal', 'local') NOT NULL,
  title_amharic VARCHAR(200) NOT NULL,
  title_english VARCHAR(200) NOT NULL,
  lyrics JSON NOT NULL COMMENT 'Array of slide content',
  source_file VARCHAR(255),
  file_type ENUM('manual', 'pdf', 'ppt', 'pptx'),
  creator_id INT,
  uploader_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  last_viewed TIMESTAMP NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_number (number),
  INDEX idx_category (category),
  INDEX idx_title_amharic (title_amharic),
  INDEX idx_title_english (title_english),
  FULLTEXT idx_search (title_amharic, title_english)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Files table (for uploaded PPT/PDF storage)
CREATE TABLE IF NOT EXISTS files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  song_id INT,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_song_id (song_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table (for app configuration)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Default admin user (password: admin123)
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 Initializing database...\n');
    
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${DB_NAME}' created/verified`);

    // Use the database
    await connection.query(`USE ${DB_NAME}`);
    console.log(`✅ Using database '${DB_NAME}'`);

    // Create tables
    await connection.query(createTablesSQL);
    console.log('✅ All tables created successfully\n');

    // Check if admin user exists
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    
    if (existingUsers[0].count === 0) {
      console.log('👤 Creating default admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        'INSERT INTO users (username, password, full_name, role, email) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'System Administrator', 'admin', 'admin@kebenachurch.org']
      );
      
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  IMPORTANT: Change this password in production!\n');
    } else {
      console.log('ℹ️  Admin user already exists\n');
    }

    // Insert default settings
    const defaultSettings = [
      ['default_background', '#1a1a2e', 'Default presentation background color'],
      ['app_name', 'Kebena Church Song Display', 'Application name'],
      ['church_name', 'Kebena Seventh-Day Adventist Church', 'Church full name'],
      ['max_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)']
    ];

    for (const [key, value, description] of defaultSettings) {
      await connection.query(
        'INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
        [key, value, description]
      );
    }
    console.log('✅ Default settings configured\n');

    // Create sample songs for testing
    console.log('📝 Creating sample songs...');
    
    const sampleSongs = [
      {
        number: '001',
        category: 'hymnal',
        title_amharic: 'እግዚአብሔር መስተዳድሩ',
        title_english: 'God Our Refuge',
        lyrics: JSON.stringify([
          'እግዚአብሔር መስተዳድሩ ወበደኀሪትነ፡\nእግዚአብሔር መሐላ ጸጋ ወኑኃ መንፈሳዊ፡',
          'በዘመነ ሕይወት ወበዘመነ ሞት፡\nእግዚአብሔር ድንጋይ ድኅነት ነው።',
          'እግዚአብሔር አምላክነ መሐላ ነው፡\nእግዚአብሔር አምላክነ ጸጋ ነው።'
        ]),
        file_type: 'manual'
      },
      {
        number: '002',
        category: 'hymnal',
        title_amharic: 'ምስጋና ለእግዚአብሔር',
        title_english: 'Praise to the Lord',
        lyrics: JSON.stringify([
          'ምስጋና ለእግዚአብሔር፡\nምስጋና ለእግዚአብሔር አምላክነ።',
          'እርሱ በጸጋው፡\nእርሱ በምሕረቱ፡\nመድኀኒትነ ነው።'
        ]),
        file_type: 'manual'
      },
      {
        number: '001',
        category: 'local',
        title_amharic: 'ሃሌሉያ አምሳ ለእግዚአብሔር',
        title_english: 'Hallelujah Praise the Lord',
        lyrics: JSON.stringify([
          'ሃሌሉያ አምሳ ለእግዚአብሔር፡\nሃሌሉያ አምሳ ለእግዚአብሔር።',
          'በጸጋው መድኀኒትነ ሆኖልን፡\nበደሙ ንጹሐን አድርጎናል።',
          'ሃሌሉያ ሃሌሉያ፡\nሃሌሉያ አምሳ ለእግዚአብሔር።'
        ]),
        file_type: 'manual'
      }
    ];

    for (const song of sampleSongs) {
      await connection.query(
        `INSERT INTO songs (number, category, title_amharic, title_english, lyrics, file_type, creator_id, uploader_id) 
         VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
        [song.number, song.category, song.title_amharic, song.title_english, song.lyrics, song.file_type]
      );
    }
    
    console.log(`✅ ${sampleSongs.length} sample songs created\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Database initialization completed successfully!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('📊 Summary:');
    console.log(`   Database: ${DB_NAME}`);
    console.log('   Tables: users, songs, files, settings, activity_logs');
    console.log('   Sample data: Created');
    console.log('   Default admin: admin / admin123\n');
    console.log('🚀 You can now start the server with: npm start\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL/XAMPP is running');
    console.error('   2. Check your .env file configuration');
    console.error('   3. Verify database credentials');
    console.error('   4. Ensure MySQL port 3306 is not blocked\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
