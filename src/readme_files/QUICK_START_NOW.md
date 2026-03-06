# 🚀 QUICK START - Get Running in 5 Minutes!

## ✅ Everything is Now Fixed!

Your frontend will now load songs from the database, and all PPT/PDF uploads will be saved properly!

---

## 🏃 Start the Application

### Step 1: Start XAMPP MySQL (if not running)
1. Open XAMPP Control Panel
2. Click **Start** next to MySQL
3. MySQL status should show **Running**

### Step 2: Start Backend Server

Open Terminal/Command Prompt:

```bash
cd kebena_backend
npm start
```

**You should see:**
```
✅ MySQL Database connected successfully!
   Database: kebena_church_db
   Host: localhost:3306
🚀 Server running on port 5000
```

### Step 3: Start Frontend (if not running)

Open another Terminal/Command Prompt:

```bash
npm run dev
```

Frontend opens at: **http://localhost:5173**

---

## 🎯 Login and Test

1. **Login with:**
   - Username: `admin`
   - Password: `admin123`

2. **You should see:**
   - Toast: "Songs loaded from database"
   - Your songs appear in the lists

3. **Test Adding a Song:**
   - Click "Admin Panel"
   - Go to "Upload" tab
   - Upload a PPT or PDF file
   - **Preview appears** - edit slides if needed
   - Fill in song details
   - Click "Add Song"
   - ✅ Song is now in database!

---

## 📋 What Changed?

### ✅ Frontend Now:
- Loads songs from database on login
- Saves all songs to database via API
- Shows loading states
- Has offline fallback mode

### ✅ Database Integration:
- All add/edit/delete operations save to MySQL
- Songs persist across sessions
- Real-time updates

### ✅ File Upload:
- PPT/PDF files are processed
- Slides are extracted and shown as **preview**
- You can edit slides before saving
- Files are saved to backend uploads folder

### ✅ Configuration:
- Created `.env` file with XAMPP settings
- Backend properly configured
- CORS set up for frontend

---

## ❓ Not Working?

### Problem: "Cannot connect to backend"
**Solution:** Make sure backend is running (`npm start` in kebena_backend folder)

### Problem: "No songs showing"  
**Solution:** Check if database exists. Run: `npm run init-db` in kebena_backend folder

### Problem: "File upload failed"
**Solution:** Verify backend is running and `/kebena_backend/uploads` folder exists

---

## 📖 Full Documentation

See `FIXED_DATABASE_CONNECTION.md` for complete details on:
- How everything works
- Preview feature explanation
- Troubleshooting guide
- Database verification steps
- Configuration details

---

## 🎉 You're Ready!

Everything is now working:
- ✅ Songs load from database
- ✅ Songs save to database
- ✅ PPT/PDF upload with preview
- ✅ Edit slides before saving
- ✅ Complete CRUD operations

**Enjoy your church song display system!** 🙏

---

## Need Help?

1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify MySQL is running in XAMPP
4. Test API: http://localhost:5000/health
5. Check songs: http://localhost:5000/api/songs
