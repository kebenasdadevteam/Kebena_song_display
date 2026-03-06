# Troubleshooting Guide

## Error: "TypeError: Failed to fetch"

This error means the **frontend cannot connect to the backend server**.

### ✅ Solution Checklist

#### 1. **Is the Backend Running?**

Open a terminal and check:

```bash
cd kebena_backend
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

**Test:** Open http://localhost:5000/health in your browser

Should show:
```json
{
  "success": true,
  "message": "Kebena Church API is running"
}
```

If you see "Site can't be reached" → Backend is NOT running!

#### 2. **Is MySQL Running?**

The backend needs MySQL to work.

**XAMPP Users:**
1. Open XAMPP Control Panel
2. Check if MySQL shows "Running" (green)
3. If not, click "Start" next to MySQL

**Test Database:**
- Open http://localhost/phpmyadmin
- You should see `kebena_church_db` database

#### 3. **Check Port 5000**

The backend runs on port 5000. Make sure nothing else is using it.

**Windows:**
```bash
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :5000
```

If another process is using port 5000:
- Option 1: Kill that process
- Option 2: Change backend port in `kebena_backend/.env`:
  ```env
  PORT=5001
  ```
  Then update frontend API URL in `/services/api.ts`:
  ```typescript
  const API_URL = 'http://localhost:5001/api';
  ```

#### 4. **Firewall/Antivirus**

Sometimes firewall blocks localhost connections.

**Try:**
- Temporarily disable firewall
- Add exception for port 5000
- Add exception for Node.js

#### 5. **Backend Configuration**

Check `kebena_backend/.env` file exists and has:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kebena_church_db
DB_PORT=3306
JWT_SECRET=kebena-church-secret-key-2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

#### 6. **Reinstall Dependencies**

Sometimes node_modules get corrupted:

```bash
cd kebena_backend
rm -rf node_modules package-lock.json   # Mac/Linux
# OR
rmdir /s node_modules                    # Windows
del package-lock.json                    # Windows

npm install
npm start
```

---

## Error: "Missing Description for DialogContent"

**Fixed!** The AdminPanel now includes DialogDescription.

If you still see this warning:
1. Check that `DialogDescription` is imported
2. Make sure it's inside `DialogHeader`

---

## File Upload Shows No Slides Extracted

### Possible Causes:

#### 1. **File Has No Text**

Some PPTX files have text as images, not actual text.

**Solution:**
- Open the PPTX in PowerPoint
- Copy text and paste into a new slide (to make it actual text)
- Save and upload again

#### 2. **File Type Not Supported**

Only these formats work:
- ✅ .pptx (PowerPoint 2007+) - Best results
- ✅ .ppt (PowerPoint 97-2003)
- ✅ .pdf (PDF documents)

**Solution:** Convert file to .pptx format

#### 3. **File Too Large**

Default limit is 10MB.

**Check file size:**
- Windows: Right-click → Properties
- Mac: Right-click → Get Info

**Solution:** 
- Compress images in PowerPoint
- Or increase limit in `kebena_backend/.env`:
  ```env
  MAX_FILE_SIZE=20971520  # 20MB
  ```

---

## Backend Starts But Can't Connect to Database

### Error Message:
```
❌ Error connecting to MySQL database
```

### Solutions:

#### 1. **MySQL Not Running**

**XAMPP:**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for green "Running" status

#### 2. **Wrong Credentials**

Check `kebena_backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # Leave empty for XAMPP default
DB_NAME=kebena_church_db
DB_PORT=3306
```

#### 3. **Database Doesn't Exist**

Run initialization script:

```bash
cd kebena_backend
npm run init-db
```

#### 4. **Port 3306 In Use**

Check if MySQL is running on a different port:

**phpMyAdmin:**
- Open http://localhost/phpmyadmin
- Look at the top for port number

Update `.env` if different:
```env
DB_PORT=3307  # or whatever port you see
```

---

## Songs Not Appearing After Upload

### Check:

#### 1. **Backend Logs**

Look at the terminal where backend is running. You should see:
```
Extracted text from PowerPoint: ...
Extracted 3 slides from PowerPoint
```

#### 2. **Database**

Open phpMyAdmin → `kebena_church_db` → `songs` table

Check if song was saved.

#### 3. **Frontend Not Refreshing**

After adding song, the frontend should update automatically.

**Manual refresh:**
- Close and reopen Admin Panel
- Or refresh the entire page (F5)

---

## CORS Errors

### Error in Browser Console:
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

### Solution:

Check `kebena_backend/.env`:

```env
CORS_ORIGIN=http://localhost:3000
```

If your frontend runs on different port:
```env
CORS_ORIGIN=http://localhost:3001  # or whatever port
```

**Then restart backend:**
```bash
# Ctrl+C to stop
npm start
```

---

## JWT Token Expired

### Error:
```
Token expired. Please login again.
```

### Solution:

Simply login again. Tokens expire after 7 days by default.

To change expiration:

`kebena_backend/.env`:
```env
JWT_EXPIRE=30d   # 30 days
JWT_EXPIRE=90d   # 90 days
JWT_EXPIRE=1y    # 1 year
```

---

## Backend Running But Frontend Shows Old Data

### Cause:
Frontend still using mock data instead of API.

### Check:

1. **API calls being made?**
   - Open Browser DevTools (F12)
   - Go to Network tab
   - Upload a file
   - Look for request to `localhost:5000`

2. **If no API calls:**
   - Make sure `/services/api.ts` exists
   - Check AdminPanel imports: `import { songAPI } from '../services/api'`

---

## Complete Restart (Nuclear Option)

If nothing works, try complete restart:

### 1. Stop Everything
```bash
# Stop backend: Ctrl+C
# Stop frontend: Ctrl+C
```

### 2. Reset Backend
```bash
cd kebena_backend
rm -rf node_modules
npm install
npm run init-db
```

### 3. Reset Frontend
```bash
# In main project folder
rm -rf node_modules
npm install
```

### 4. Restart MySQL
- XAMPP: Stop and Start MySQL

### 5. Start Fresh
```bash
# Terminal 1: Backend
cd kebena_backend
npm start

# Terminal 2: Frontend
npm start
```

---

## Still Having Issues?

### Debug Steps:

1. **Check Backend Console**
   - Look for error messages in red
   - Copy the error and search online

2. **Check Browser Console**
   - Press F12
   - Go to Console tab
   - Look for red errors
   - Check Network tab for failed requests

3. **Test API Directly**
   
   Test health endpoint:
   ```
   http://localhost:5000/health
   ```
   
   Should return JSON, not error page.

4. **Check All Services**
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:3000
   - MySQL: http://localhost/phpmyadmin
   - Database: Check `kebena_church_db` exists

5. **Environment Variables**
   
   Print to verify:
   ```bash
   cd kebena_backend
   node -e "require('dotenv').config(); console.log(process.env.PORT)"
   ```
   
   Should print: `5000`

---

## Common Mistakes

❌ **Backend not started** - Most common!  
✅ Always run `npm start` in kebena_backend folder

❌ **Wrong folder** - Running commands in wrong directory  
✅ Backend commands in `kebena_backend/`, frontend in root

❌ **MySQL not running**  
✅ Check XAMPP Control Panel - MySQL must be green

❌ **Database not created**  
✅ Run `npm run init-db` in backend folder

❌ **Port already in use**  
✅ Change port in `.env` or kill the other process

❌ **Forgot to login**  
✅ Login with admin/admin123 before testing

---

## Quick Verification

Run through this checklist:

- [ ] XAMPP MySQL is running (green in control panel)
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] http://localhost:5000/health shows success message
- [ ] http://localhost/phpmyadmin shows `kebena_church_db`
- [ ] Frontend is running on http://localhost:3000
- [ ] Can login with admin/admin123
- [ ] Browser console (F12) shows no red errors

If all checkboxes are ✅ → System should work!

---

**Need more help?** Check the README files in the kebena_backend folder.
