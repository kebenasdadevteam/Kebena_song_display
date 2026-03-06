# Start Backend Server - Quick Guide

## Prerequisites

Before starting the backend, ensure:

1. **MySQL is installed and running**
   - Windows: Check Services → MySQL80 should be "Running"
   - Mac: `mysql.server status`
   - Linux: `sudo systemctl status mysql`

2. **Node.js is installed** (version 14 or higher)
   ```bash
   node --version
   ```

---

## First Time Setup

### Step 1: Configure Database

1. Open `/kebena_backend/.env` file
2. Update these lines with your MySQL credentials:
   ```env
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=kebena_church_db
   ```

### Step 2: Install Dependencies

```bash
cd kebena_backend
npm install
```

This installs:
- express (web server)
- mysql2 (database)
- multer (file uploads)
- pdf-parse (PDF extraction)
- officeparser (PowerPoint extraction)
- And other dependencies...

### Step 3: Initialize Database

```bash
npm run init-db
```

This creates:
- Database: `kebena_church_db`
- Tables: users, songs, files, activity_logs, settings
- Default admin user: username `admin`, password `admin123`

**IMPORTANT**: Change the admin password after first login!

---

## Starting the Backend

### Option 1: Windows (Double-click)
```
Double-click: start-backend.bat
```

### Option 2: Mac/Linux (Terminal)
```bash
cd kebena_backend
chmod +x ../start-backend.sh
../start-backend.sh
```

### Option 3: Manual Start
```bash
cd kebena_backend
npm start
```

---

## Verify Backend is Running

You should see:
```
🚀 Server running on port 5000
🌍 Environment: development
✅ Database connected successfully
📁 Upload directories ready
```

**Test the server:**
Open browser and go to: http://localhost:5000

You should see:
```json
{"message":"Kebena Church Song Display API","version":"1.0.0"}
```

---

## Common Startup Errors

### Error: "Cannot find module"
**Solution:**
```bash
cd kebena_backend
npm install
```

### Error: "Access denied for user"
**Solution:**
1. Open `.env` file
2. Update `DB_PASSWORD=your_correct_password`
3. Restart server

### Error: "Database does not exist"
**Solution:**
```bash
npm run init-db
```

### Error: "Port 5000 already in use"
**Solution:**
1. Find what's using port 5000
2. Kill that process, or
3. Change port in `.env`: `PORT=5001`

---

## Next Steps

Once backend is running:

1. **Start Frontend**: In another terminal
   ```bash
   npm run dev
   ```

2. **Open Application**: http://localhost:5173

3. **Login**:
   - Username: `admin`
   - Password: `admin123`

4. **Test File Upload**:
   - Click Admin Panel (gear icon)
   - Go to "Add from File" tab
   - Upload a .pptx file
   - Check console for extraction logs

---

## Stopping the Backend

Press `Ctrl + C` in the terminal where server is running

---

## File Upload Testing

### Test with Sample Files

The backend accepts:
- **PDF**: .pdf files (up to 10MB)
- **PowerPoint**: .ppt, .pptx files (up to 10MB)

### What Gets Extracted

The system attempts to extract text from each slide/page:
- PowerPoint: Extracts text from slides
- PDF: Extracts text from pages

### If Extraction Fails

Don't worry! You can:
1. Upload the file anyway
2. Edit the extracted content manually
3. Add your own slide text
4. Click "Add Song" to save

---

## Monitoring Logs

Watch the backend console for:
- `📤` Upload notifications
- `📄` File processing status
- `✅` Success messages
- `⚠️` Warnings
- `❌` Errors

---

## Production Deployment

Before deploying to production:

1. Update `.env`:
   ```env
   NODE_ENV=production
   JWT_SECRET=change_this_to_secure_random_string
   ```

2. Use process manager:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name kebena-backend
   ```

3. Set up reverse proxy (nginx/apache)

4. Enable HTTPS

---

## Maintenance

### Backup Database
```bash
mysqldump -u root -p kebena_church_db > backup.sql
```

### View Logs
```bash
# If using pm2
pm2 logs kebena-backend
```

### Restart Server
```bash
# If using pm2
pm2 restart kebena-backend
```

---

## Support

For issues:
1. Check `/kebena_backend/TROUBLESHOOTING.md`
2. Check console logs
3. Verify all prerequisites
4. Check database connection
