# 🚨 QUICK FIX - Backend Not Running Error

## The Problem

You're seeing this error:
```
File upload error: Error: Cannot connect to backend server. 
Please ensure the backend is running at http://localhost:5000
```

**This means the backend server is NOT running.**

---

## ⚡ FASTEST FIX (Choose Your OS)

### 🪟 **Windows Users:**

**Double-click this file in your project folder:**
```
start-backend.bat
```

That's it! The backend will start automatically.

---

### 🍎 **Mac/Linux Users:**

**Open Terminal in your project folder and run:**

```bash
chmod +x start-backend.sh
./start-backend.sh
```

That's it! The backend will start automatically.

---

## 📋 Manual Method (All OS)

If the scripts don't work, follow these steps:

### Step 1: Check MySQL is Running

**XAMPP Users:**
1. Open **XAMPP Control Panel**
2. Look at MySQL - is it showing **green "Running"**?
3. If NO → Click **"Start"** next to MySQL
4. Wait for green status

**Test:** Open http://localhost/phpmyadmin in browser
- Should show phpMyAdmin page ✅

---

### Step 2: Install Backend Dependencies (First Time Only)

Open Terminal/Command Prompt in your **project root folder**, then:

```bash
cd kebena_backend
npm install
```

Wait for installation to complete (may take 2-3 minutes).

---

### Step 3: Initialize Database (First Time Only)

Still in the `kebena_backend` folder:

```bash
npm run init-db
```

You should see:
```
✅ Database created successfully
✅ Tables created successfully
✅ Default admin user created
```

---

### Step 4: Start Backend

Still in the `kebena_backend` folder:

```bash
npm start
```

**Wait for this message:**
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

**🎉 SUCCESS!** Backend is now running!

---

### Step 5: Verify Backend is Running

Open this URL in your browser:
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

✅ **If you see this** → Backend is working!

❌ **If you see "This site can't be reached"** → Backend is NOT running

---

### Step 6: Keep Backend Running

**IMPORTANT:** 
- ⚠️ **DO NOT CLOSE** the terminal where backend is running
- You should see a blinking cursor
- Backend must stay running while you use the app

**You'll see logs like:**
```
✅ Server is ready to accept requests
```

This terminal should stay open!

---

### Step 7: Start Frontend (New Terminal)

Open a **NEW** Terminal/Command Prompt (keep backend running in the other one):

Navigate to your **main project folder** (NOT kebena_backend):

```bash
npm start
```

Browser will open automatically to http://localhost:3000

---

## ✅ Final Check

You should now have **TWO terminals open:**

**Terminal 1 (Backend):**
```
kebena_backend> npm start
🚀 Server running on port 5000
✅ Server is ready to accept requests
```
☝️ Keep this open!

**Terminal 2 (Frontend):**
```
> npm start
Compiled successfully!
```
☝️ Keep this open too!

---

## 🧪 Test File Upload Now

1. Go to http://localhost:3000
2. Login (admin / admin123)
3. Click **"Admin Panel"**
4. Go to **"Add from File"** tab
5. Upload a PPTX file

**Expected Result:**
```
✅ Uploading file...
✅ File processed successfully!
✅ Extracted X slides from filename.pptx
```

**🎉 If you see this → Everything works!**

---

## 🔍 Troubleshooting

### Error: "EADDRINUSE: address already in use :::5000"

**Problem:** Port 5000 is already being used

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID [number] /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 [PID]
```

Then try `npm start` again.

---

### Error: "Cannot connect to database"

**Problem:** MySQL is not running

**Solution:**
1. Open XAMPP Control Panel
2. Start MySQL (click "Start" button)
3. Wait for green "Running" status
4. Restart backend: `npm start`

---

### Error: "Module not found"

**Problem:** Dependencies not installed

**Solution:**
```bash
cd kebena_backend
rm -rf node_modules   # Mac/Linux
# OR
rmdir /s node_modules  # Windows

npm install
npm start
```

---

### Backend Starts But Shows Errors

**Check these:**

1. **MySQL Running?**
   - XAMPP → MySQL should be green

2. **.env file exists?**
   - Check `kebena_backend/.env` file exists
   - It should have been created automatically

3. **Database created?**
   ```bash
   npm run init-db
   ```

4. **Correct folder?**
   - Backend commands run in `kebena_backend/` folder
   - Frontend commands run in main project folder

---

### Files Not Being Saved

**Check:**

1. **uploads folder exists:**
   - `kebena_backend/uploads/ppts/` should exist
   - `kebena_backend/uploads/pdfs/` should exist

2. **Permissions:**
   - Make sure the folders are writable

---

## 📊 What Should Be Running

```
┌─────────────────────────────────┐
│  MySQL (XAMPP)                  │
│  Port: 3306                     │
│  Status: Green "Running"        │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Backend (Terminal 1)           │
│  Port: 5000                     │
│  Command: npm start             │
│  Folder: kebena_backend/        │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Frontend (Terminal 2)          │
│  Port: 3000                     │
│  Command: npm start             │
│  Folder: main project folder    │
└─────────────────────────────────┘
```

**All three must be running!**

---

## 🎯 Quick Checklist

Before testing file upload:

- [ ] XAMPP MySQL is running (green)
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Compiled successfully"
- [ ] http://localhost:5000/health shows success
- [ ] http://localhost:3000 shows login page
- [ ] Two terminals are open and not closed

If all ✅ → **File upload will work!**

---

## 💡 Pro Tips

### Bookmark These URLs

- **Backend Health:** http://localhost:5000/health
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Frontend:** http://localhost:3000

Quick way to check if services are running!

### Use Startup Scripts

**Windows:** Double-click `start-backend.bat`

**Mac/Linux:** Run `./start-backend.sh`

Saves time!

### Check Logs

Backend terminal shows helpful logs:

```
✅ Server is ready to accept requests
📁 File uploaded: song-123456.pptx
📄 Extracted 5 slides from PowerPoint
✅ Song created successfully
```

Watch for errors here!

---

## 🎊 Success!

Once you see:
```
✅ File processed successfully!
✅ Extracted X slides
```

Your system is working perfectly! 🎉

---

## 🆘 Still Having Issues?

1. **Read the error message carefully** - it tells you what's wrong
2. **Check all services are running** - MySQL, Backend, Frontend
3. **Look at backend terminal** - any red errors?
4. **Browser console (F12)** - any errors?
5. **See TROUBLESHOOTING.md** for detailed debugging

---

**Remember:** Backend must always run BEFORE you use the upload feature!

---

## 📞 Quick Reference

**Start Everything:**
```bash
# 1. Start MySQL (XAMPP)
# 2. Terminal 1:
cd kebena_backend
npm start

# 3. Terminal 2:
npm start
```

**Check Health:**
```
http://localhost:5000/health
```

**Stop Everything:**
```
Ctrl+C in both terminals
Stop MySQL in XAMPP
```

---

**You're all set! Happy uploading! 🙏**
