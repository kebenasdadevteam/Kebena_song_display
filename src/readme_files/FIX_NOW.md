# 🚨 FIX THE ERROR NOW - Step by Step

## Your Current Error:
```
File upload error: Error: Cannot connect to backend server. 
Please ensure the backend is running at http://localhost:5000
```

---

## ⚡ THE SOLUTION (3 Steps)

Follow these EXACTLY:

---

## STEP 1: Start MySQL

### XAMPP Users (Most Common):

1. **Find and open "XAMPP Control Panel"**
   - Windows: Search for "XAMPP" in Start Menu
   - Mac: Open from Applications

2. **Look for the MySQL row**

3. **Click the "Start" button** next to MySQL

4. **Wait for it to turn GREEN** and say "Running"

**Screenshot should look like:**
```
Apache  [Start] [Admin]
MySQL   [Stop]  [Admin]  ← Should show green "Running"
```

**Verify it worked:**
- Open this in your browser: http://localhost/phpmyadmin
- You should see a database management page
- ✅ If you see it → MySQL is running!

---

## STEP 2: Start Backend Server

### Open Terminal/Command Prompt

**Windows:**
- Press `Windows + R`
- Type `cmd`
- Press Enter

**Mac:**
- Press `Command + Space`
- Type `Terminal`
- Press Enter

### Navigate to Backend Folder

**Copy and paste this command:**

```bash
cd kebena_backend
```

Press Enter.

**Your prompt should now show something like:**
```
C:\your-path\project-name\kebena_backend>
```

### Install Dependencies (First Time Only)

**If this is your FIRST TIME, run:**

```bash
npm install
```

Wait 2-3 minutes for it to finish.

**You should see:**
```
added 150 packages in 2m
```

### Initialize Database (First Time Only)

**If this is your FIRST TIME, run:**

```bash
npm run init-db
```

**You should see:**
```
✅ Database created successfully
✅ Tables created successfully
✅ Default admin user created
```

### Start the Backend Server

**Now run this:**

```bash
npm start
```

**WAIT FOR THIS MESSAGE:**
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

**✅ When you see this → Backend is running!**

**⚠️ IMPORTANT:** 
- **DO NOT CLOSE this terminal window!**
- Let it stay open
- You'll see a blinking cursor
- This is normal!

---

## STEP 3: Verify Backend is Working

### Test in Browser

**Open this URL in your browser:**
```
http://localhost:5000/health
```

**You should see:**
```json
{
  "success": true,
  "message": "Kebena Church API is running"
}
```

**✅ If you see this → Backend is WORKING!**

**❌ If you see "This site can't be reached":**
- Backend is NOT running
- Go back to Step 2
- Make sure you see "Server running on port 5000"
- Check for any red error messages

---

## STEP 4: Test File Upload Again

**Now go back to your app:**

1. Open http://localhost:3000 in browser
2. Login (if not already logged in)
   - Username: `admin`
   - Password: `admin123`
3. Click **"Admin Panel"**
4. Go to **"Add from File"** tab
5. Click **"Choose File"**
6. Select a PPTX file
7. Watch the magic happen!

**You should see:**
```
✅ Uploading file...
✅ File processed successfully!
✅ Extracted X slides from filename.pptx
```

**🎉 SUCCESS!** The error is fixed!

---

## 🎯 Summary of What You Did

1. ✅ Started MySQL database (XAMPP)
2. ✅ Installed backend dependencies (`npm install`)
3. ✅ Created database (`npm run init-db`)
4. ✅ Started backend server (`npm start`)
5. ✅ Verified backend is running (health check)

---

## 📱 Quick Reference for Next Time

Every time you want to use the app:

### Terminal 1 (Backend):
```bash
cd kebena_backend
npm start
```
**Wait for:** "✅ Server is ready to accept requests"

**Keep this terminal open!**

---

### Then in your browser:
```
http://localhost:3000
```

That's it!

---

## ⚠️ Keep These Running

While using the app, you must keep running:

1. **XAMPP MySQL** (green in control panel)
2. **Backend Terminal** (showing "Server running on port 5000")
3. **Frontend** (your browser at localhost:3000)

**Don't close the backend terminal!**

---

## 🐛 Still Getting Errors?

### Error: "EADDRINUSE: address already in use"

**Means:** Port 5000 is already taken

**Fix:**

**Windows:**
```cmd
netstat -ano | findstr :5000
```
Note the PID number, then:
```cmd
taskkill /PID [number] /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 [PID]
```

Then run `npm start` again.

---

### Error: "Cannot connect to database"

**Means:** MySQL is not running

**Fix:**
1. Open XAMPP Control Panel
2. Make sure MySQL shows **green "Running"**
3. If not, click "Start" next to MySQL
4. Wait for green status
5. Restart backend: `Ctrl+C` then `npm start`

---

### Error: "Module not found"

**Means:** Dependencies not installed

**Fix:**
```bash
cd kebena_backend
npm install
npm start
```

---

## 📊 Visual Checklist

Use this to verify everything:

```
☑️ XAMPP Control Panel → MySQL = Green "Running"
☑️ Terminal shows: "Server running on port 5000"  
☑️ Browser test: http://localhost:5000/health = Success
☑️ Frontend works: http://localhost:3000 = Login page
```

If all ✅ → **System is ready!**

---

## 🎊 Congratulations!

You've successfully:
- ✅ Fixed the "Cannot connect to backend" error
- ✅ Started the backend server
- ✅ Set up the database
- ✅ Got file upload working

**Your church song display system is now fully operational!** 🙏

---

## 💾 Save These Commands

**First Time Setup (do once):**
```bash
cd kebena_backend
npm install
npm run init-db
```

**Every Time You Start (daily):**
```bash
1. Start MySQL in XAMPP
2. cd kebena_backend
3. npm start
```

**Health Check:**
```
http://localhost:5000/health
```

---

## 📚 More Help

- **Complete Guide:** See STARTUP_CHECKLIST.md
- **Troubleshooting:** See TROUBLESHOOTING.md
- **Quick Start:** See QUICK_FIX.md

---

**Now go upload those PPTX files and prepare for worship! 🎵**

*God bless your church services!* 🙏
