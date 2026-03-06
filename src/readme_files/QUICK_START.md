# Quick Start Guide - Kebena Church Song Display

Get up and running in 5 minutes!

## 🚀 Super Quick Setup

### Windows Users

1. **Extract** the project folder to your computer
2. **Double-click** `setup-windows.bat`
3. Wait for installation (2-3 minutes)
4. **Double-click** `start.bat`
5. **Browser opens automatically** at http://localhost:5173
6. **Login:** Username: `admin` / Password: `admin123`

✅ **Done! You're ready to go!**

---

### Mac/Linux Users

1. **Extract** the project folder
2. **Open Terminal** in the project folder
3. **Run setup:**
   ```bash
   chmod +x setup.sh start.sh
   ./setup.sh
   ```
4. **Start application:**
   ```bash
   ./start.sh
   ```
5. **Open browser:** http://localhost:5173
6. **Login:** Username: `admin` / Password: `admin123`

✅ **Done! You're ready to go!**

---

## 📝 First-Time Setup Notes

### MySQL Password

The setup assumes MySQL has **no password** (default). If you have a MySQL password:

1. **Open** `kebena_backend/.env`
2. **Find** `DB_PASSWORD=`
3. **Add your password:** `DB_PASSWORD=your_password`
4. **Save** and run setup again

---

## 🎯 Your First Song

### Add a Song Manually (Easiest)

1. **Login** as admin
2. **Click** "Admin Panel" (Settings icon in top right)
3. **Go to** "Manual" tab
4. **Fill in:**
   - Song Number: `001`
   - Category: Choose "Hymnal" or "Local"
   - Amharic Title: `ዘማሪ`
   - English Title: `Singer`
   - Lyrics: Type verse, press Enter twice, type next verse
5. **Click** "Add Song"

✅ **Your first song is added!**

### Upload a PowerPoint Song

1. **Have** a PPTX file ready (song lyrics in slides)
2. **Click** "Admin Panel"
3. **Go to** "Upload" tab
4. **Click** upload area and select your PPTX file
5. **Wait** for processing
6. **Fill in** song number and titles
7. **Review** extracted slides (edit if needed)
8. **Click** "Add Song"

✅ **Song imported from PowerPoint!**

---

## 🖥️ Present a Song

### Basic Presentation

1. **Click** any song from the list
2. **Song opens** in full screen
3. **Use arrows** (← →) to navigate slides
4. **Press Esc** to close

### Projector Mode (For Worship Service)

1. **Open** any song
2. **Press** `P` key or click Monitor icon
3. **New window opens** (this is for projector)
4. **Drag** new window to second screen/projector
5. **Press F11** in projector window for full screen
6. **Navigate** from main window - projector updates automatically

✅ **Perfect for live worship!**

---

## 🎨 Customize Background

1. **Click** "Admin Panel"
2. **Go to** "Settings" tab
3. **Choose** a preset color or
4. **Use** color picker for custom color
5. **Background changes** instantly

---

## 🔑 Change Admin Password (Important!)

1. **Login** as admin
2. **Click** your name (top right)
3. **Select** "Change Password"
4. **Enter:**
   - Current password: `admin123`
   - New password: (your secure password)
   - Confirm password
5. **Save**

⚠️ **Do this immediately after first login!**

---

## 📁 Batch Import Songs (Advanced)

If you have many PPTX/PDF files:

1. **Copy** all files to `kebena_backend/uploads/` folder
2. **Open** Admin Panel → "Auto-Detect" tab
3. **Click** "Scan Folder"
4. **System finds** all files
5. **Click "Process"** for each file
6. **Add** song details
7. **Repeat** for all files

✅ **Import dozens of songs quickly!**

---

## ❓ Troubleshooting

### Backend Won't Start

**Problem:** Error about database connection

**Quick Fix:**
1. Make sure MySQL is installed and running
2. Check `kebena_backend/.env` file - verify password
3. Open MySQL: `mysql -u root -p`
4. Create database: `CREATE DATABASE kebena_church_db;`

---

### File Upload Not Working

**Problem:** Files won't upload or process

**Quick Fix:**
1. Check `kebena_backend/uploads/` folder exists
2. **Windows:** Right-click → Properties → Security → Give "Users" write access
3. **Mac/Linux:** `chmod 755 kebena_backend/uploads`
4. Make sure backend is running (check http://localhost:5000/health)

---

### Can't Login

**Quick Fix:**
```bash
cd kebena_backend
npm run init-db
```
This resets the database. Login: `admin` / `admin123`

---

### Port Already in Use

**Problem:** Port 5000 or 5173 already in use

**Quick Fix:**

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID [NUMBER] /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 [PID]
```

Or change port in `kebena_backend/.env`:
```env
PORT=5001
```

---

## ⌨️ Keyboard Shortcuts

**In Song Viewer:**
- `←` Previous slide
- `→` Next slide
- `Space` Play/Pause auto-advance
- `P` Open presentation/projector mode
- `Esc` Close viewer

**General:**
- `Ctrl + K` Quick search (if implemented)
- `F11` Full screen browser

---

## 📊 Quick Reference

### Default Credentials
- **Username:** admin
- **Password:** admin123
- **Database:** kebena_church_db
- **Backend Port:** 5000
- **Frontend Port:** 5173

### File Locations
- **Backend:** `kebena_backend/`
- **Uploads:** `kebena_backend/uploads/`
- **Database Config:** `kebena_backend/.env`
- **Components:** `components/`

### Supported Files
- **Upload:** .pptx, .pdf
- **Max Size:** 10MB (default)

---

## 🎓 Next Steps

1. ✅ **Change admin password**
2. ✅ **Add 5-10 sample songs**
3. ✅ **Test presentation mode**
4. ✅ **Test with projector**
5. ✅ **Train worship team**
6. ✅ **Create user accounts** (if needed)

---

## 📚 More Help

- **Full Setup:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Features:** See [NEW_FEATURES_IMPLEMENTED.md](NEW_FEATURES_IMPLEMENTED.md)
- **Admin Guide:** See [ADMIN_QUICK_REFERENCE.md](ADMIN_QUICK_REFERENCE.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 💡 Pro Tips

1. **Organize song numbers** - Use 001, 002, 003 format
2. **Test uploads first** - Try with one file before batch import
3. **Use presentation mode** - Much better than main viewer for projection
4. **Backup regularly** - Export your database weekly
5. **Keep files** - Don't delete original PPTX/PDF files

---

## 🎉 You're All Set!

Everything should be working now. If you have issues, check the troubleshooting section or refer to the complete setup guide.

**Enjoy your worship services! 🙌**
