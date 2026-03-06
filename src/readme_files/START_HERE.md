# 🚀 START HERE - Quick Launch Guide

Follow these steps **in order** to start your church song display system.

## 📋 Before You Start

Make sure you have:
- ✅ Node.js installed
- ✅ XAMPP installed
- ✅ Ran `npm install` in both folders

## 🎯 3-Step Startup

### STEP 1: Start MySQL (30 seconds)

1. Open **XAMPP Control Panel**
2. Click **"Start"** next to MySQL
3. Wait for it to show **green "Running"**

![MySQL Running](https://via.placeholder.com/300x100/22c55e/ffffff?text=MySQL+Running)

---

### STEP 2: Start Backend (1 minute)

Open **Terminal/Command Prompt #1**:

```bash
cd kebena_backend
npm start
```

**Wait for this message:**
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

**✅ Verify:** Open http://localhost:5000/health in browser
- Should show: `{"success": true, "message": "Kebena Church API is running"}`

**❌ If you see error:** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**🔴 KEEP THIS TERMINAL OPEN!** (Don't close it)

---

### STEP 3: Start Frontend (30 seconds)

Open **Terminal/Command Prompt #2** (new one!):

```bash
# Make sure you're in the MAIN project folder (not kebena_backend)
npm start
```

**Wait for browser to open automatically**
- Or manually go to: http://localhost:3000

---

## 🎉 You're Ready!

Your system is now running!

### ✅ Quick Test

1. **Login**
   - Username: `admin`
   - Password: `admin123`

2. **Click "Admin Panel"**

3. **Go to "Add from File" tab**

4. **Upload a PPTX file** (if you have one)
   - Watch it extract slides automatically!

5. **Or try "Add Manually" tab**
   - Add a test song

---

## 📱 What's Running?

You should have **3 things** running:

1. **XAMPP MySQL** (green in control panel)
2. **Backend** (Terminal 1 - showing "Server running")
3. **Frontend** (Terminal 2 - showing React app)

---

## 🛑 How to Stop

When you're done:

1. **Close browser** (or just the tab)
2. **Stop Frontend:** Go to Terminal 2, press `Ctrl+C`
3. **Stop Backend:** Go to Terminal 1, press `Ctrl+C`
4. **Stop MySQL:** XAMPP Control Panel → Click "Stop" next to MySQL

---

## 🔄 Next Time You Start

Just repeat the 3 steps:
1. Start MySQL in XAMPP
2. `cd kebena_backend && npm start`
3. `npm start` (in main folder)

---

## ❌ Common Issues

### "Failed to fetch" error

**Problem:** Backend not running

**Solution:** 
- Check Terminal 1 - Is backend still running?
- Go to http://localhost:5000/health - Does it work?
- If not, restart backend (Step 2)

### "Cannot connect to database"

**Problem:** MySQL not running

**Solution:**
- Check XAMPP - Is MySQL green?
- Click "Start" if not running
- Restart backend after MySQL starts

### "Port 5000 already in use"

**Problem:** Another app using port 5000

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -i :5000
kill <PID>
```

### More Issues?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for complete guide.

---

## 📚 More Information

- **Backend Setup:** [kebena_backend/QUICK_START.md](./kebena_backend/QUICK_START.md)
- **Full Documentation:** [kebena_backend/README.md](./kebena_backend/README.md)
- **API Testing:** [kebena_backend/API_TESTING_GUIDE.md](./kebena_backend/API_TESTING_GUIDE.md)
- **Integration Guide:** [BACKEND_INTEGRATION_COMPLETE.md](./BACKEND_INTEGRATION_COMPLETE.md)

---

## 🎓 Understanding the System

```
┌─────────────────┐
│   Browser       │ ← You interact here
│  (Frontend)     │   http://localhost:3000
└────────┬────────┘
         │
         │ API Calls
         ↓
┌─────────────────┐
│   Node.js       │ ← Backend processing
│   (Backend)     │   http://localhost:5000
└────────┬────────┘
         │
         │ SQL Queries
         ↓
┌─────────────────┐
│    MySQL        │ ← Database storage
│  (XAMPP)        │   Port 3306
└─────────────────┘
```

**All three must be running!**

---

## 🎊 First Time Setup

If this is your **first time**:

1. **Initialize Database**
   ```bash
   cd kebena_backend
   npm run init-db
   ```
   
   This creates the database and default admin user.

2. **Then follow the 3-Step Startup above**

---

## 💡 Pro Tips

### Use Two Terminals Side-by-Side

**Terminal 1 (Left):** Backend
```bash
cd kebena_backend
npm start
```

**Terminal 2 (Right):** Frontend
```bash
npm start
```

Keep both visible so you can see logs and errors!

### Check Backend Health

Bookmark this: http://localhost:5000/health

Quick way to check if backend is running!

### View Database

Bookmark this: http://localhost/phpmyadmin

- Database: `kebena_church_db`
- See all songs, users, etc.

---

## ✨ You're All Set!

The system is now running and ready to use for your worship services!

**Remember:**
- 🟢 Keep both terminals open
- 🟢 Keep MySQL running in XAMPP
- 🟢 Don't close the backend terminal

**Enjoy!** 🙏

---

**Questions?** Check the documentation files or TROUBLESHOOTING.md
