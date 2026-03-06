# Database Setup Guide for Kebena Church Song Display

## Overview
This application currently uses mock data stored in browser memory. To enable persistent storage and file processing capabilities, you'll need to connect it to a MySQL database via XAMPP.

## Current Features (Frontend Only)
✅ User authentication with role-based access
✅ Song search and display
✅ PPT-style presentation viewer
✅ File upload interface (PDF/PPT)
✅ Admin panel for song management

## Features Requiring Database Connection
- ⏳ Persistent song storage
- ⏳ PDF/PPT file content extraction
- ⏳ User account management
- ⏳ Background image uploads
- ⏳ Song usage statistics

## MySQL/XAMPP Setup Instructions

### 1. Install XAMPP
- Download XAMPP from https://www.apachefriends.org/
- Install with MySQL and PHP enabled

### 2. Create Database Structure

```sql
-- Create Database
CREATE DATABASE kebena_church_songs;
USE kebena_church_songs;

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Songs Table
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(20) NOT NULL,
    category ENUM('hymnal', 'local') NOT NULL,
    title_amharic VARCHAR(255) NOT NULL,
    title_english VARCHAR(255) NOT NULL,
    creator VARCHAR(100),
    uploader VARCHAR(100),
    source_file VARCHAR(255),
    file_type ENUM('manual', 'pdf', 'ppt'),
    updated_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_number (number),
    INDEX idx_category (category)
);

-- Song Lyrics Table (for slides)
CREATE TABLE song_lyrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    slide_number INT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    INDEX idx_song_id (song_id)
);

-- Uploaded Files Table
CREATE TABLE uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- Settings Table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Admin User
INSERT INTO users (id, username, password_hash, name, role) VALUES
('1', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');
-- Note: This is a hashed version of "admin123" - you should change this in production
```

### 3. Backend API Setup

You'll need to create a PHP backend to connect your frontend to MySQL. Here's the recommended structure:

```
backend/
├── config/
│   └── database.php          # Database connection
├── api/
│   ├── auth/
│   │   ├── login.php         # User login
│   │   └── logout.php        # User logout
│   ├── songs/
│   │   ├── list.php          # Get all songs
│   │   ├── create.php        # Add new song
│   │   ├── update.php        # Update song
│   │   ├── delete.php        # Delete song
│   │   └── upload.php        # Handle file uploads
│   └── settings/
│       └── background.php    # Save/load background settings
└── uploads/                   # Folder for uploaded files
    ├── songs/
    └── backgrounds/
```

### 4. Example PHP Connection (database.php)

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "kebena_church_songs";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

### 5. PDF/PPT Processing

For extracting content from uploaded PDF/PPT files, you can use:

**For PDF:**
```bash
# Install FPDF or TCPDF library via Composer
composer require setasign/fpdf
```

**For PPT:**
```bash
# Install PHPPresentation library via Composer
composer require phpoffice/phppresentation
```

### 6. Frontend API Integration

Once your backend is ready, update the frontend to call your API endpoints instead of using mock data. You'll need to modify:

- `/components/LoginScreen.tsx` - Call `/api/auth/login.php`
- `/App.tsx` - Fetch songs from `/api/songs/list.php`
- `/components/AdminPanel.tsx` - Post new songs to `/api/songs/create.php`

## Security Considerations

⚠️ **Important Security Notes:**
- Always use HTTPS in production
- Hash passwords using bcrypt or similar
- Implement CSRF protection
- Sanitize all user inputs
- Use prepared statements for SQL queries
- Limit file upload sizes
- Validate file types on server-side
- Store uploaded files outside web root

## Current Branding Colors

The app uses these brand colors:
- **Church Brown:** #865014
- **Church Gold:** #E0AE3F
- **Church Cream:** #F6EBD8

## Support

This is a frontend-only implementation. Database integration requires backend development expertise. Consider hiring a PHP developer if you need help with the backend implementation.

## License

This project is for Kebena Church internal use only.
