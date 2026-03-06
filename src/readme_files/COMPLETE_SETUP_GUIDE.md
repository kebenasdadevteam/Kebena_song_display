# Kebena Church Song Display - Complete Setup Guide

This guide will help you set up and run the Kebena Church Song Display Web Application on your local machine or server.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Detailed Installation](#detailed-installation)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Required Software
- **Node.js** - Version 14.x or higher ([Download](https://nodejs.org/))
- **MySQL** - Version 5.7 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** - For cloning repository ([Download](https://git-scm.com/))

### Operating Systems
- Windows 10/11
- macOS 10.14+
- Linux (Ubuntu 18.04+, CentOS 7+)

### Hardware Requirements
- **Minimum:** 2GB RAM, 500MB disk space
- **Recommended:** 4GB RAM, 2GB disk space

---

## 🚀 Quick Start

### For Windows Users

1. **Extract the project** to a folder (e.g., `C:\kebena-church-app`)

2. **Open Command Prompt** and navigate to the project folder:
   ```cmd
   cd C:\kebena-church-app
   ```

3. **Run the setup script:**
   ```cmd
   setup-windows.bat
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### For Mac/Linux Users

1. **Extract the project** to a folder (e.g., `~/kebena-church-app`)

2. **Open Terminal** and navigate to the project folder:
   ```bash
   cd ~/kebena-church-app
   ```

3. **Make scripts executable:**
   ```bash
   chmod +x setup.sh start.sh
   ```

4. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📦 Detailed Installation

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install MySQL

#### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run installer and choose "Developer Default"
3. Set root password during installation (remember this!)
4. Complete installation

#### Mac (using Homebrew)
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Step 3: Configure MySQL

1. **Log into MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE kebena_church_db;
   EXIT;
   ```

### Step 4: Install Backend Dependencies

```bash
cd kebena_backend
npm install
```

### Step 5: Configure Environment Variables

1. **Open** `kebena_backend/.env` file
2. **Update** database password:
   ```env
   DB_PASSWORD=your_mysql_root_password
   ```

### Step 6: Initialize Database

```bash
cd kebena_backend
npm run init-db
```

This creates all tables and adds a default admin user:
- **Username:** admin
- **Password:** admin123

⚠️ **Change this password after first login!**

---

## 🗄️ Database Setup

### Manual Database Setup

If the automatic setup fails, run these SQL commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS kebena_church_db;
USE kebena_church_db;

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create songs table
CREATE TABLE songs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number VARCHAR(10) NOT NULL,
  category ENUM('hymnal', 'local') NOT NULL,
  title_amharic VARCHAR(255) NOT NULL,
  title_english VARCHAR(255) NOT NULL,
  lyrics JSON NOT NULL,
  source_file VARCHAR(255),
  file_type VARCHAR(50),
  creator_id INT,
  uploader_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  last_viewed TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (uploader_id) REFERENCES users(id),
  INDEX idx_number (number),
  INDEX idx_category (category),
  INDEX idx_title_english (title_english),
  INDEX idx_title_amharic (title_amharic)
);

-- Create files table
CREATE TABLE files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  song_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create activity logs table
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Create settings table
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', '$2a$10$xQp5PqhY8K8d9L4FLGBqK.k3p2h3bEYmYrCvN5h6F3L8TqGCjKy6G', 'Administrator', 'admin');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('presentation_background', '#1a1a2e'),
('auto_advance_time', '5000'),
('app_name', 'Kebena Church Song Display');
```

---

## ▶️ Running the Application

### Option 1: Using Start Scripts (Recommended)

#### Windows
```cmd
start.bat
```

#### Mac/Linux
```bash
./start.sh
```

This will:
- Start the backend server on port 5000
- Start the frontend on port 5173
- Open your default browser automatically

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd kebena_backend
npm start
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### Default Login Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change this password immediately after first login!

---

## 🌐 Deployment

### Production Build

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Update environment variables:**
   - Edit `kebena_backend/.env`
   - Set `NODE_ENV=production`
   - Change `JWT_SECRET` to a strong secret
   - Update `FRONTEND_URL` to your domain

3. **Run backend in production:**
   ```bash
   cd kebena_backend
   npm start
   ```

### Deploy to Cloud

#### Heroku
```bash
# Install Heroku CLI
heroku create kebena-church-app
heroku addons:create jawsdb:kitefin
heroku config:set JWT_SECRET=your_production_secret
git push heroku main
```

#### DigitalOcean/AWS
1. Create a Droplet/EC2 instance
2. Install Node.js and MySQL
3. Clone repository
4. Run setup scripts
5. Configure nginx as reverse proxy
6. Set up SSL with Let's Encrypt

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd kebena_backend
pm2 start src/server.js --name kebena-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
1. Check MySQL is running:
   ```bash
   # Windows
   services.msc
   # Look for MySQL service
   
   # Mac/Linux
   mysql.server status
   brew services list
   ```
2. Start MySQL if stopped
3. Verify credentials in `.env` file

---

**Problem:** `Error: ER_ACCESS_DENIED_ERROR`

**Solution:**
1. Check MySQL password in `.env`
2. Reset MySQL root password if needed
3. Grant permissions:
   ```sql
   GRANT ALL PRIVILEGES ON kebena_church_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### File Upload Not Working

**Problem:** Files not uploading or processing fails

**Solution:**
1. **Check uploads folder exists:**
   ```bash
   mkdir -p kebena_backend/uploads
   ```

2. **Set folder permissions:**
   ```bash
   # Mac/Linux
   chmod 755 kebena_backend/uploads
   
   # Windows - Right click folder > Properties > Security > Edit
   # Give "Users" group write permissions
   ```

3. **Verify backend is running:**
   - Open http://localhost:5000/api/health
   - Should see: `{"status": "OK"}`

4. **Check file size:**
   - Max size: 10MB (default)
   - Change in `.env`: `MAX_FILE_SIZE=20971520` (20MB)

5. **Check file type:**
   - Supported: .pdf, .ppt, .pptx only
   - File must not be corrupted

6. **Check browser console:**
   - Press F12 in browser
   - Look for error messages
   - Common: CORS errors or network errors

---

### Frontend Not Connecting to Backend

**Problem:** `Cannot connect to backend server`

**Solution:**
1. Verify backend is running on port 5000
2. Check `services/api.ts` - should have `http://localhost:5000`
3. Check CORS settings in backend
4. Disable browser extensions (ad blockers, etc.)

---

### Database Connection Issues

**Problem:** `Error: Database connection failed`

**Solution:**
1. **Test MySQL connection:**
   ```bash
   mysql -u root -p
   ```

2. **Check MySQL is listening:**
   ```bash
   netstat -an | grep 3306
   ```

3. **Verify database exists:**
   ```sql
   SHOW DATABASES;
   ```

4. **Check user permissions:**
   ```sql
   SHOW GRANTS FOR 'root'@'localhost';
   ```

---

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

Or change port in `.env`:
```env
PORT=5001
```

---

### Cannot Login

**Problem:** Login fails with correct credentials

**Solution:**
1. **Reset admin password:**
   ```bash
   cd kebena_backend
   npm run init-db
   ```

2. **Check database:**
   ```sql
   USE kebena_church_db;
   SELECT * FROM users WHERE username='admin';
   ```

3. **Clear browser cache and cookies**

4. **Check browser console for errors**

---

## 📞 Support

### Common Issues Documentation
- See `/TROUBLESHOOTING.md` for more issues
- See `/API_TESTING_GUIDE.md` for API testing

### Contact
- Email: support@kebenachurch.org
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

## 📝 Additional Resources

- [Backend API Documentation](/kebena_backend/README.md)
- [Database Schema](/DATABASE_SETUP.md)
- [New Features Guide](/NEW_FEATURES_IMPLEMENTED.md)
- [Admin Quick Reference](/ADMIN_QUICK_REFERENCE.md)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MySQL is running
- [ ] Database `kebena_church_db` exists
- [ ] Backend starts without errors (http://localhost:5000)
- [ ] Frontend loads (http://localhost:5173)
- [ ] Can login with admin/admin123
- [ ] Can see Hymnal and Local Songs sections
- [ ] Admin Panel opens (for admin users)
- [ ] Can add a song manually
- [ ] Can upload a PPTX/PDF file
- [ ] File processing works
- [ ] Presentation mode opens (Monitor button)

---

## 🎉 You're All Set!

The application is now ready to use. Enjoy managing your church songs!
