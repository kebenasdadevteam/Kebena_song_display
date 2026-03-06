# Kebena Church Song Display - Backend API

Complete backend API for the Kebena Seventh-Day Adventist Church Song Display System with MySQL database integration.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- ✅ RESTful API with Express.js
- ✅ MySQL database integration
- ✅ User authentication with JWT
- ✅ Role-based access control (Admin/User)
- ✅ File upload support (PDF/PPT/PPTX)
- ✅ Automatic text extraction from files
- ✅ CRUD operations for songs
- ✅ Activity logging
- ✅ Rate limiting & security
- ✅ CORS enabled
- ✅ Error handling & validation

## 🛠 Technology Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **PDF Processing:** pdf-parse
- **Office Processing:** officeparser
- **Security:** Helmet, CORS, Rate Limiting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **MySQL** (via XAMPP or standalone)
   - Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
   - Start MySQL service
   - Default port: 3306

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

## 🚀 Installation

### Step 1: Extract/Clone the Project

```bash
cd kebena_backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mysql2
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- multer
- pdf-parse
- officeparser
- helmet
- express-rate-limit
- morgan

### Step 3: Create Environment File

Copy the example environment file:

```bash
copy .env.example .env
```

Or on Mac/Linux:

```bash
cp .env.example .env
```

## ⚙️ Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave empty if no password
DB_NAME=kebena_church_db
DB_PORT=3306

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# File Upload Settings
MAX_FILE_SIZE=10485760
```

### Important Settings:

- **DB_PASSWORD**: Leave empty if your MySQL root user has no password (default XAMPP)
- **JWT_SECRET**: Change this to a random secure string in production
- **CORS_ORIGIN**: Set to your frontend URL (http://localhost:3000 for development)

## 💾 Database Setup

### Option 1: Automatic Setup (Recommended)

Run the database initialization script:

```bash
npm run init-db
```

This will:
- Create the database
- Create all tables
- Insert sample data
- Create default admin user

### Option 2: Manual Setup

1. **Start MySQL** (via XAMPP Control Panel or service)

2. **Open MySQL Command Line** or phpMyAdmin

3. **Create Database:**
```sql
CREATE DATABASE kebena_church_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **Run the initialization script:**
```bash
npm run init-db
```

### Default Admin Credentials

After initialization, you can login with:

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately in production!

## 🏃 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Verify Server is Running

Visit: http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Kebena Church API is running",
  "timestamp": "2024-12-03T10:30:00.000Z",
  "environment": "development"
}
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require a JWT token. Include it in the request header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### 🔐 Authentication Endpoints

**POST /api/auth/login**
- Description: Login user
- Access: Public
- Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "admin",
    "email": "admin@kebenachurch.org"
  }
}
```

**GET /api/auth/me**
- Description: Get current user profile
- Access: Private (requires token)
- Headers: `Authorization: Bearer TOKEN`

**PUT /api/auth/change-password**
- Description: Change password
- Access: Private
- Body:
```json
{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**POST /api/auth/register** (Admin only)
- Description: Register new user
- Access: Admin only
- Body:
```json
{
  "username": "newuser",
  "password": "password123",
  "fullName": "John Doe",
  "role": "user",
  "email": "john@example.com"
}
```

**GET /api/auth/users** (Admin only)
- Description: Get all users
- Access: Admin only

**PUT /api/auth/users/:id** (Admin only)
- Description: Update user
- Access: Admin only

**DELETE /api/auth/users/:id** (Admin only)
- Description: Delete user
- Access: Admin only

---

#### 🎵 Song Endpoints

**GET /api/songs**
- Description: Get all songs
- Access: Public
- Query Parameters:
  - `category` - Filter by hymnal or local
  - `search` - Search by number or title
  - `limit` - Number of results
  - `offset` - Pagination offset
- Example: `/api/songs?category=hymnal&search=001&limit=10`

**GET /api/songs/:id**
- Description: Get single song
- Access: Public
- Example: `/api/songs/1`

**POST /api/songs** (Admin only)
- Description: Create new song manually
- Access: Admin only
- Body:
```json
{
  "number": "001",
  "category": "hymnal",
  "titleAmharic": "እግዚአብሔር መስተዳድሩ",
  "titleEnglish": "God Our Refuge",
  "lyrics": [
    "First slide content here",
    "Second slide content here",
    "Third slide content here"
  ],
  "fileType": "manual"
}
```

**POST /api/songs/upload** (Admin only)
- Description: Upload PDF/PPT file
- Access: Admin only
- Content-Type: multipart/form-data
- Field: `file` (PDF/PPT/PPTX file)
- Response: Returns extracted slides

**POST /api/songs/from-file** (Admin only)
- Description: Create song from uploaded file
- Access: Admin only
- Body:
```json
{
  "number": "002",
  "category": "hymnal",
  "titleAmharic": "ምስጋና ለእግዚአብሔር",
  "titleEnglish": "Praise to the Lord",
  "lyrics": ["Slide 1", "Slide 2"],
  "fileData": {
    "filename": "uploaded-file.pptx",
    "originalFilename": "praise-song.pptx",
    "filePath": "uploads/ppts/...",
    "fileType": "pptx",
    "fileSize": 12345,
    "mimeType": "application/vnd.openxmlformats..."
  }
}
```

**PUT /api/songs/:id** (Admin only)
- Description: Update song
- Access: Admin only

**DELETE /api/songs/:id** (Admin only)
- Description: Delete song (soft delete)
- Access: Admin only

**GET /api/songs/stats** (Admin only)
- Description: Get song statistics
- Access: Admin only

## 📁 Project Structure

```
kebena_backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   └── initDatabase.js      # Database initialization
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── songController.js    # Song CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── songRoutes.js        # Song endpoints
│   ├── utils/
│   │   └── fileProcessor.js     # PDF/PPT processing
│   └── server.js                # Main server file
├── uploads/                     # Uploaded files (auto-created)
│   ├── images/
│   ├── pdfs/
│   └── ppts/
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔧 Development

### Running with Nodemon (Auto-restart)

```bash
npm run dev
```

### Testing API with Postman/Thunder Client

1. **Import the API endpoints** into your API testing tool
2. **Login first** to get JWT token
3. **Use token** in subsequent requests

Example Postman request:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Database Tables

The system creates these tables:

1. **users** - User accounts and authentication
2. **songs** - Song content and metadata
3. **files** - Uploaded file references
4. **settings** - Application settings
5. **activity_logs** - User activity tracking

### Viewing Database

**Option 1: phpMyAdmin** (XAMPP)
- URL: http://localhost/phpmyadmin
- Select `kebena_church_db` database

**Option 2: MySQL Workbench**
- Download from mysql.com
- Connect to localhost:3306

**Option 3: Command Line**
```bash
mysql -u root -p
USE kebena_church_db;
SHOW TABLES;
SELECT * FROM songs;
```

## 🚀 Deployment

### Prerequisites for Production

1. **Linux Server** (Ubuntu/CentOS recommended)
2. **MySQL Server** (not XAMPP)
3. **Node.js** installed
4. **PM2** for process management
5. **Nginx** as reverse proxy (optional)

### Deployment Steps

1. **Upload files to server**
2. **Install dependencies:**
```bash
npm install --production
```

3. **Update .env file** with production settings
4. **Initialize database:**
```bash
npm run init-db
```

5. **Start with PM2:**
```bash
npm install -g pm2
pm2 start src/server.js --name kebena-api
pm2 save
pm2 startup
```

6. **Configure Nginx** (optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### Issue: "Error connecting to MySQL database"

**Solutions:**
1. Make sure MySQL is running (check XAMPP Control Panel)
2. Verify DB credentials in `.env` file
3. Check MySQL port (default 3306)
4. Test connection: `mysql -u root -p`

### Issue: "Database does not exist"

**Solution:**
```bash
npm run init-db
```

### Issue: "Port 5000 already in use"

**Solutions:**
1. Change PORT in `.env` file to different number (e.g., 5001)
2. Or kill process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "File upload not working"

**Solutions:**
1. Check `uploads/` folder exists and is writable
2. Verify MAX_FILE_SIZE in `.env`
3. Check file type is allowed (PDF/PPT/PPTX)

### Issue: "CORS error from frontend"

**Solution:**
Update CORS_ORIGIN in `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

### Issue: "JWT token expired"

**Solution:**
Login again to get new token. Adjust JWT_EXPIRE in `.env` if needed:
```env
JWT_EXPIRE=7d    # 7 days
JWT_EXPIRE=30d   # 30 days
```

## 📄 License

This software is proprietary to Kebena Seventh-Day Adventist Church.
For internal use only.

## 👥 Support

For technical support:
- Contact church IT administrator
- Check logs in console
- Review error messages

## 🔄 Updates

### Version 1.0.0 (Current)
- Initial release
- Full CRUD operations
- File upload support
- JWT authentication
- MySQL integration

---

**Developed for Kebena Seventh-Day Adventist Church**  
**Last Updated:** December 2024
