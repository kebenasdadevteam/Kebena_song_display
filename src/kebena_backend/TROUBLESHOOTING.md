# Backend Troubleshooting Guide

## Common Issues and Solutions

### 1. PPT/PPTX File Upload Not Working

#### Symptoms:
- Error when uploading PowerPoint files
- "Failed to process file" message
- Empty or incorrect slide extraction

#### Solutions:

**A. Install Dependencies**
```bash
cd kebena_backend
npm install
```

**B. Verify File Format**
- Ensure file is .ppt or .pptx format
- File should not be password-protected
- File size should be under 10MB

**C. Check Backend Logs**
When you upload a file, check the console output for:
```
📤 Processing uploaded file: [filename]
📁 File path: [path]
📊 File size: [size] bytes
📋 MIME type: [type]
📄 Processing PowerPoint file: [filename]
```

**D. Manual Content Editing**
Even if extraction fails, you can:
1. Upload the file
2. Edit the extracted slides manually
3. Click "Add Song" to save

---

### 2. Backend Server Won't Start

#### Check Database Connection:
```bash
# Test MySQL connection
mysql -u root -p
```

Update `.env` file with correct credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=kebena_church_db
```

#### Initialize Database:
```bash
cd kebena_backend
npm run init-db
```

---

### 3. File Upload Directory Errors

The backend automatically creates upload directories, but if you get permission errors:

```bash
cd kebena_backend
mkdir -p uploads/pdfs uploads/ppts uploads/images
chmod 755 uploads uploads/pdfs uploads/ppts uploads/images
```

---

### 4. CORS Errors

If frontend can't connect to backend:

1. Check `.env` file:
```env
CORS_ORIGIN=http://localhost:5173
```

2. Ensure frontend is running on port 5173
3. Restart backend server

---

### 5. "Cannot connect to backend server" Error

**Check if backend is running:**
```bash
# In kebena_backend directory
npm start
```

Should see:
```
🚀 Server running on port 5000
✅ Database connected successfully
```

**Test backend manually:**
```bash
curl http://localhost:5000/api/auth/test
```

---

### 6. PowerPoint Extraction Returns Empty Slides

This can happen if:
- PowerPoint has only images, no text
- Text is in text boxes that aren't extracted
- File is corrupted

**Solutions:**
1. Use the "Add Manually" tab instead
2. Copy text from PowerPoint and paste manually
3. Export PowerPoint as PDF and try uploading PDF

---

### 7. Database Errors

**Error: "Table doesn't exist"**
```bash
npm run init-db
```

**Error: "Access denied"**
Update password in `.env` file

**Error: "Connection refused"**
Start MySQL service:
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo service mysql start
```

---

## Debug Mode

Enable detailed logging:

1. Edit `/kebena_backend/src/server.js`
2. Add at the top:
```javascript
process.env.DEBUG = 'true';
```

3. Restart server

---

## Testing File Upload

Test upload endpoint directly:

```bash
curl -X POST http://localhost:5000/api/songs/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/file.pptx"
```

---

## Performance Tips

1. **Large files**: Keep presentations under 5MB for best performance
2. **Many slides**: Split large presentations into multiple songs
3. **Complex formatting**: Simple text extracts better than complex layouts

---

## Getting Help

If issues persist:
1. Check backend console logs
2. Check browser console (F12)
3. Verify all dependencies are installed
4. Try restarting both frontend and backend
5. Check that MySQL is running

---

## Quick Diagnostic Checklist

- [ ] MySQL service is running
- [ ] Backend server is running on port 5000
- [ ] Frontend can access http://localhost:5000
- [ ] `.env` file exists with correct credentials
- [ ] Database tables are created (run init-db)
- [ ] User is logged in as admin
- [ ] File is correct format (.ppt, .pptx, or .pdf)
- [ ] File size is under 10MB
- [ ] Upload directories exist and are writable
