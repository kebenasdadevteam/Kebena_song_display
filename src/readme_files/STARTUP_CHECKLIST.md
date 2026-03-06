# ✅ Startup Checklist - Follow This Every Time

## 🎯 Before You Start

Print this or keep it visible while starting the system.

---

## 📝 Pre-Flight Check (One-Time Setup)

Run these ONLY THE FIRST TIME:

### ☑️ Step 0A: Install Backend Dependencies
```bash
cd kebena_backend
npm install
```
**Wait for:** "added X packages" ✅

---

### ☑️ Step 0B: Create Database
```bash
# Still in kebena_backend folder
npm run init-db
```
**Wait for:** 
```
✅ Database created successfully
✅ Tables created successfully  
✅ Default admin user created
```

---

## 🚀 Daily Startup (Every Time You Use The App)

Follow these steps IN ORDER:

---

### ☑️ Step 1: Start MySQL (30 seconds)

**XAMPP Users:**
1. [ ] Open XAMPP Control Panel
2. [ ] Find MySQL in the list
3. [ ] Click **"Start"** button next to MySQL
4. [ ] Wait for status to show **green "Running"**

**Verify:**
- [ ] Open http://localhost/phpmyadmin
- [ ] You should see phpMyAdmin interface
- [ ] Database `kebena_church_db` should exist

✅ **If you see phpMyAdmin → MySQL is running!**

---

### ☑️ Step 2: Start Backend (1 minute)

**Open Terminal/Command Prompt #1:**

```bash
# Navigate to backend folder
cd kebena_backend

# Start the server
npm start
```

**Wait for these messages:**
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

**Verify:**
- [ ] Terminal shows "Server running on port 5000"
- [ ] No red error messages
- [ ] Terminal cursor is blinking (server is running)

**Test URL:**
- [ ] Open http://localhost:5000/health in browser
- [ ] Should show: `{"success": true, "message": "Kebena Church API is running"}`

✅ **If you see success message → Backend is running!**

⚠️ **IMPORTANT:** Keep this terminal window OPEN! Don't close it!

---

### ☑️ Step 3: Start Frontend (30 seconds)

**Open Terminal/Command Prompt #2 (NEW WINDOW):**

```bash
# Make sure you're in the MAIN project folder
# NOT in kebena_backend!

npm start
```

**Wait for:**
```
Compiled successfully!
```

**Verify:**
- [ ] Browser opens automatically to http://localhost:3000
- [ ] You see the login page
- [ ] Church logo is visible

✅ **If you see login page → Frontend is running!**

⚠️ **IMPORTANT:** Keep this terminal window OPEN too!

---

## ✅ System Status Check

You should now have:

### Three Things Running:

1. **XAMPP MySQL**
   - [ ] Control Panel shows green "Running"
   - [ ] http://localhost/phpmyadmin works

2. **Backend Server (Terminal 1)**
   - [ ] Shows "Server running on port 5000"
   - [ ] http://localhost:5000/health returns success
   - [ ] Terminal is still open

3. **Frontend App (Terminal 2)**  
   - [ ] Shows "Compiled successfully"
   - [ ] http://localhost:3000 shows login page
   - [ ] Terminal is still open

### Two Terminal Windows Open:

**Terminal 1 (Backend):**
```
kebena_backend> npm start
🚀 Server running on port 5000
✅ Server is ready to accept requests
[cursor blinking here]
```

**Terminal 2 (Frontend):**
```
> npm start
Compiled successfully!
[cursor blinking here]
```

---

## 🧪 Quick Function Test

Now test if everything works:

### Test 1: Login
- [ ] Go to http://localhost:3000
- [ ] Enter username: `admin`
- [ ] Enter password: `admin123`
- [ ] Click Login
- [ ] You should see the main app with two panels

✅ **Pass** if you see the split screen with Hymnal/Local Songs

---

### Test 2: Backend Connection
- [ ] Click **"Admin Panel"** button
- [ ] Admin panel dialog opens
- [ ] No errors in browser console (F12)

✅ **Pass** if Admin Panel opens without errors

---

### Test 3: File Upload
- [ ] In Admin Panel, go to **"Add from File"** tab
- [ ] Click **"Choose File"** button
- [ ] Select a .pptx file (if you have one)
- [ ] Watch for upload message

**Expected messages:**
```
📤 Uploading file...
✅ File processed successfully!
✅ Extracted X slides from filename.pptx
```

✅ **Pass** if you see success messages and slides appear

❌ **Fail** if you see:
```
❌ Cannot connect to backend server
```
→ Go back to Step 2, backend is not running!

---

## 🎊 All Tests Pass?

**Congratulations!** Your system is fully operational! 🎉

You can now:
- ✅ Upload PPTX files
- ✅ Add songs manually
- ✅ View songs in presentation mode
- ✅ Search for songs
- ✅ Manage the song library

---

## 🛑 How to Stop (End of Day)

When you're done using the app:

### Step 1: Close Frontend
- [ ] Go to Terminal 2 (frontend)
- [ ] Press `Ctrl+C`
- [ ] Confirm if asked (Y)

### Step 2: Close Backend
- [ ] Go to Terminal 1 (backend)
- [ ] Press `Ctrl+C`
- [ ] Confirm if asked (Y)

### Step 3: Stop MySQL (Optional)
- [ ] Open XAMPP Control Panel
- [ ] Click "Stop" next to MySQL

**Note:** You can leave MySQL running if you want. It's fine.

---

## 🔄 Next Time You Start

Just repeat the Daily Startup steps (Steps 1-3):
1. Start MySQL
2. Start Backend
3. Start Frontend

The database and songs are saved, so you don't need to run init-db again!

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Starting Frontend Before Backend
**Wrong Order:**
```
1. Start Frontend  ❌
2. Start Backend   ❌
```

**Correct Order:**
```
1. Start MySQL     ✅
2. Start Backend   ✅
3. Start Frontend  ✅
```

---

### ❌ Mistake 2: Closing Backend Terminal
**Problem:** Closing the terminal where backend is running

**Result:** Backend stops, file upload fails

**Solution:** Keep both terminals open!

---

### ❌ Mistake 3: Wrong Folder
**Wrong:**
```bash
# In kebena_backend folder
npm start    # This starts frontend in wrong place!
```

**Correct:**
```bash
# Terminal 1: In kebena_backend folder
cd kebena_backend
npm start    # Starts backend ✅

# Terminal 2: In MAIN project folder
npm start    # Starts frontend ✅
```

---

### ❌ Mistake 4: MySQL Not Running
**Symptom:** Backend shows database connection error

**Check:** XAMPP Control Panel - Is MySQL green?

**Fix:** Click Start next to MySQL

---

## 📱 Mobile Reference (Screenshot This!)

```
═══════════════════════════════════
  DAILY STARTUP SEQUENCE
═══════════════════════════════════

1️⃣ XAMPP → Start MySQL (green)
   Test: http://localhost/phpmyadmin

2️⃣ Terminal 1 → cd kebena_backend
                 npm start
   Test: http://localhost:5000/health

3️⃣ Terminal 2 → npm start
   Test: http://localhost:3000

✅ All three must be running!
═══════════════════════════════════
```

---

## 🎓 Understanding the System

```
┌──────────────┐
│   XAMPP      │  Database storage
│   MySQL      │  Saves all songs
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Backend     │  File processing
│  Terminal 1  │  API endpoints
│  Port 5000   │  PPTX extraction
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Frontend    │  User interface  
│  Terminal 2  │  What you see
│  Port 3000   │  Browser app
└──────────────┘
```

All three work together!

---

## 💡 Pro Tips

### Tip 1: Use Startup Scripts
**Windows:** Double-click `start-backend.bat`

**Mac/Linux:** Run `./start-backend.sh`

Automates Step 2!

---

### Tip 2: Bookmark URLs
Save these as browser bookmarks:
- Backend Health: http://localhost:5000/health
- phpMyAdmin: http://localhost/phpmyadmin  
- Frontend: http://localhost:3000

Quick access!

---

### Tip 3: Side-by-Side Terminals
Arrange your terminals side by side:

```
┌─────────────┬─────────────┐
│ Terminal 1  │ Terminal 2  │
│ (Backend)   │ (Frontend)  │
│             │             │
│ Logs here → │ Logs here → │
└─────────────┴─────────────┘
```

Monitor both at once!

---

### Tip 4: Watch for Errors
Both terminals show helpful messages:

**Backend shows:**
- File uploads
- Database queries
- API requests

**Frontend shows:**
- Compilation status
- Browser connections

Watch for red text = errors!

---

## 🆘 Emergency Troubleshooting

### If File Upload Fails:

**Check in this order:**

1. [ ] Is MySQL green in XAMPP?
2. [ ] Does http://localhost:5000/health work?
3. [ ] Is Terminal 1 still running (showing "Server running")?
4. [ ] Is Terminal 2 still running?
5. [ ] Any red errors in either terminal?

**Quick Fix:**
```bash
# Restart backend:
Ctrl+C in Terminal 1
npm start

# Try upload again
```

---

### If Nothing Works:

**Full Restart:**

1. [ ] Close both terminals
2. [ ] Stop MySQL in XAMPP
3. [ ] Wait 10 seconds
4. [ ] Start MySQL again
5. [ ] Follow Daily Startup steps again

---

## ✅ You're Ready!

Follow this checklist every time you start the system, and you'll never have connection issues!

**Save this file!** Print it or keep it open while starting.

---

## 📞 Quick Command Reference

**Backend:**
```bash
cd kebena_backend
npm start
```

**Frontend:**
```bash
npm start
```

**Init Database (first time only):**
```bash
cd kebena_backend
npm run init-db
```

**Check Health:**
```
http://localhost:5000/health
```

---

**Happy worship service preparation! 🙏**

*May this tool bless your church!*
