# Quick Start Checklist - PPT Upload Fix

## ✅ Pre-Flight Checklist

### 1. MySQL Setup
- [ ] MySQL is installed
- [ ] MySQL service is running
- [ ] You know your MySQL root password

**Check MySQL**:
```bash
# Windows
net start | findstr MySQL

# Mac/Linux
mysql --version
```

---

### 2. Update Configuration File

- [ ] Open `/kebena_backend/.env`
- [ ] Update this line with YOUR password:
  ```env
  DB_PASSWORD=your_actual_mysql_password_here
  ```
- [ ] Save the file

**Example**:
```env
DB_PASSWORD=MySecretPassword123
```

---

### 3. Install Dependencies

- [ ] Open terminal in `kebena_backend` folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (may take 1-2 minutes)

```bash
cd kebena_backend
npm install
```

**You should see**:
```
added 150+ packages
```

---

### 4. Initialize Database

- [ ] Run: `npm run init-db`
- [ ] Verify success message

```bash
npm run init-db
```

**You should see**:
```
✅ Database 'kebena_church_db' created
✅ Table 'users' created
✅ Table 'songs' created
✅ Default admin user created
```

---

### 5. Start Backend Server

- [ ] Run: `npm start`
- [ ] Verify server is running

```bash
npm start
```

**You should see**:
```
🚀 Server running on port 5000
✅ Database connected successfully
📁 Directory exists: uploads
📁 Directory exists: uploads/ppts
```

**Leave this terminal open!** Backend needs to keep running.

---

### 6. Start Frontend

- [ ] Open NEW terminal
- [ ] Go to project root (not kebena_backend)
- [ ] Run: `npm run dev`

```bash
# In project root directory
npm run dev
```

**You should see**:
```
VITE ready in 500ms
Local: http://localhost:5173
```

---

### 7. Test the Application

- [ ] Open browser: http://localhost:5173
- [ ] Login with:
  - Username: `admin`
  - Password: `admin123`
- [ ] You should see the song display interface

---

### 8. Test PPT Upload

- [ ] Click Admin Panel (⚙️ gear icon)
- [ ] Click "Add from File" tab
- [ ] Click "Choose File" and select a .pptx file
- [ ] Watch for upload progress
- [ ] Verify slides are extracted and shown
- [ ] Edit slides if needed
- [ ] Fill in:
  - [ ] Song Number
  - [ ] Category (Hymnal or Local)
  - [ ] Title (Amharic)
  - [ ] Title (English)
- [ ] Click "Add Song"
- [ ] Verify success message

---

## 🔍 Verification Steps

### Backend is Running Correctly ✅
Check backend terminal shows:
```
🚀 Server running on port 5000
✅ Database connected successfully
```

### Frontend is Running Correctly ✅
Check frontend terminal shows:
```
Local: http://localhost:5173
```

### Can Access Application ✅
Browser shows login screen at http://localhost:5173

### Can Login as Admin ✅
Login successful with admin/admin123

### Can Upload PPT ✅
When you upload a PPT file, backend terminal shows:
```
📤 Processing uploaded file: YourFile.pptx
📄 Processing PowerPoint file: YourFile.pptx
✅ Successfully extracted X slides
```

---

## ❌ Common Issues

### MySQL not running
**Error**: `connect ECONNREFUSED`
**Fix**: Start MySQL service

### Wrong password in .env
**Error**: `Access denied for user 'root'@'localhost'`
**Fix**: Update `DB_PASSWORD` in `.env` file

### Dependencies not installed
**Error**: `Cannot find module`
**Fix**: Run `npm install` in kebena_backend folder

### Database not initialized
**Error**: `Table 'users' doesn't exist`
**Fix**: Run `npm run init-db`

### Port already in use
**Error**: `Port 5000 already in use`
**Fix**: 
1. Change port in `.env`: `PORT=5001`
2. Or kill process using port 5000

---

## 📊 What Should Happen During PPT Upload

### Step 1: File Selection
- You click "Choose File"
- Select a .pptx file
- File name appears

### Step 2: Upload Starts
- Progress indicator shows
- Frontend shows: "Uploading file..."

### Step 3: Backend Processing
Backend terminal shows:
```
📤 Processing uploaded file: MyPresentation.pptx
📁 File path: uploads/ppts/MyPresentation-1234567890.pptx
📊 File size: 35840 bytes
📋 MIME type: application/vnd.openxmlformats...
📄 Processing PowerPoint file: MyPresentation.pptx (35840 bytes)
📝 Extracted text length: 2048 characters
📄 First 200 characters: [preview of content]
✅ Strategy 1: Found 8 slides by newline breaks
✅ Successfully extracted 8 slides from PowerPoint
```

### Step 4: Slides Display
- Frontend shows success message
- Each slide appears in a numbered box
- All slides are editable

### Step 5: Review and Edit
- You can edit any slide content
- Add or remove text as needed
- Format is preserved

### Step 6: Save
- Fill in song metadata
- Click "Add Song"
- Success message appears
- Form resets

---

## 🎯 Success Criteria

You've successfully set up the system when:

✅ Backend starts without errors  
✅ Frontend starts without errors  
✅ Can login as admin  
✅ Can access Admin Panel  
✅ Can upload PPT file  
✅ Slides are extracted and displayed  
✅ Can edit slides  
✅ Can save song to database  
✅ Song appears in song list  

---

## 📚 Additional Resources

- **Backend Issues**: See `/kebena_backend/TROUBLESHOOTING.md`
- **Startup Help**: See `/START_BACKEND.md`
- **What Was Fixed**: See `/PPT_UPLOAD_FIX.md`
- **API Testing**: See `/kebena_backend/API_TESTING_GUIDE.md`

---

## 🆘 Still Having Issues?

1. **Check both terminals** (backend and frontend)
2. **Look for error messages** (red text)
3. **Check browser console** (F12)
4. **Verify MySQL is running**
5. **Verify .env file is updated**
6. **Try restarting both servers**

---

## 📝 Notes

- Keep both terminals open while using the app
- Backend must be running for uploads to work
- Large files (>5MB) may take longer to process
- If extraction fails, you can still manually add content
- Change admin password after first login (for security)

---

## 🎉 You're Ready!

Once all checkboxes are ✅, your system is fully operational and ready to:
- Upload PowerPoint presentations
- Extract song lyrics automatically
- Add songs manually
- Display songs in presentation mode
- Manage your church song library

**Happy song managing!** 🎵
