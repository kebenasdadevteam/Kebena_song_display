# Complete Setup Guide - Frontend + Backend Integration

This guide walks you through setting up the complete Kebena Church Song Display system with MySQL database.

## 📋 Overview

You now have two parts:
1. **Frontend** - React web application (the current project)
2. **Backend** - Node.js API with MySQL (kebena_backend folder)

## 🎯 Setup Checklist

### Phase 1: Install Prerequisites

- [ ] Install Node.js (v14 or higher)
- [ ] Install XAMPP (for MySQL)
- [ ] Start MySQL in XAMPP Control Panel

### Phase 2: Backend Setup

- [ ] Navigate to kebena_backend folder
- [ ] Install dependencies: `npm install`
- [ ] Configure `.env` file
- [ ] Initialize database: `npm run init-db`
- [ ] Start backend server: `npm start`
- [ ] Verify at http://localhost:5000/health

### Phase 3: Frontend Setup

- [ ] Update frontend to connect to backend API
- [ ] Test login functionality
- [ ] Test song CRUD operations
- [ ] Test file upload

## 🚀 Step-by-Step Instructions

### STEP 1: Install XAMPP

1. **Download XAMPP**
   - Go to: https://www.apachefriends.org/
   - Download for your operating system
   - Install with default settings

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - MySQL should show green "Running" status

3. **Verify MySQL**
   - Click "Admin" next to MySQL (opens phpMyAdmin)
   - You should see the phpMyAdmin interface

### STEP 2: Setup Backend

1. **Open Command Prompt/Terminal**
   ```bash
   cd path/to/kebena_backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   Wait for all packages to install (may take 2-3 minutes)

3. **Create .env File**
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

4. **Edit .env File**
   
   Open `.env` in a text editor and verify these settings:
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

5. **Initialize Database**
   ```bash
   npm run init-db
   ```
   
   You should see:
   ```
   ✅ MySQL Database connected successfully!
   ✅ Database 'kebena_church_db' created/verified
   ✅ All tables created successfully
   ✅ Default admin user created
   ```

6. **Start Backend Server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   🚀 Server running on port 5000
   ✅ Server is ready to accept requests
   ```

7. **Verify Backend is Running**
   
   Open browser and go to: http://localhost:5000/health
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Kebena Church API is running"
   }
   ```

### STEP 3: Connect Frontend to Backend

Now you need to update the frontend to use the real backend API.

1. **Create API Service File**
   
   Create a new file in the frontend project:
   
   **File: `/services/api.js`**
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   
   // Store auth token
   let authToken = localStorage.getItem('auth_token');
   
   // Helper function for API calls
   async function apiCall(endpoint, options = {}) {
     const headers = {
       'Content-Type': 'application/json',
       ...options.headers
     };
     
     if (authToken && !options.skipAuth) {
       headers['Authorization'] = `Bearer ${authToken}`;
     }
     
     const response = await fetch(`${API_URL}${endpoint}`, {
       ...options,
       headers
     });
     
     const data = await response.json();
     
     if (!response.ok) {
       throw new Error(data.message || 'API request failed');
     }
     
     return data;
   }
   
   // Auth API
   export const authAPI = {
     async login(username, password) {
       const data = await apiCall('/auth/login', {
         method: 'POST',
         body: JSON.stringify({ username, password }),
         skipAuth: true
       });
       
       if (data.token) {
         authToken = data.token;
         localStorage.setItem('auth_token', data.token);
         localStorage.setItem('user', JSON.stringify(data.user));
       }
       
       return data;
     },
     
     logout() {
       authToken = null;
       localStorage.removeItem('auth_token');
       localStorage.removeItem('user');
     },
     
     async getProfile() {
       return await apiCall('/auth/me');
     }
   };
   
   // Song API
   export const songAPI = {
     async getAllSongs(params = {}) {
       const query = new URLSearchParams(params).toString();
       return await apiCall(`/songs${query ? '?' + query : ''}`);
     },
     
     async getSongById(id) {
       return await apiCall(`/songs/${id}`);
     },
     
     async createSong(songData) {
       return await apiCall('/songs', {
         method: 'POST',
         body: JSON.stringify(songData)
       });
     },
     
     async uploadFile(file) {
       const formData = new FormData();
       formData.append('file', file);
       
       const response = await fetch(`${API_URL}/songs/upload`, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${authToken}`
         },
         body: formData
       });
       
       return await response.json();
     },
     
     async createFromFile(songData) {
       return await apiCall('/songs/from-file', {
         method: 'POST',
         body: JSON.stringify(songData)
       });
     },
     
     async updateSong(id, updates) {
       return await apiCall(`/songs/${id}`, {
         method: 'PUT',
         body: JSON.stringify(updates)
       });
     },
     
     async deleteSong(id) {
       return await apiCall(`/songs/${id}`, {
         method: 'DELETE'
       });
     }
   };
   ```

2. **Update LoginScreen Component**
   
   Replace the mock login with real API call:
   
   ```javascript
   import { authAPI } from '../services/api';
   
   // In handleLogin function:
   const handleLogin = async (e) => {
     e.preventDefault();
     setError('');
     setIsLoading(true);
     
     try {
       const response = await authAPI.login(credentials.username, credentials.password);
       
       if (response.success) {
         toast.success('Login successful!');
         onLogin(response.user);
       }
     } catch (error) {
       setError(error.message || 'Login failed. Please try again.');
       toast.error('Login failed');
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. **Update App.tsx**
   
   Replace mock songs with API data:
   
   ```javascript
   import { useEffect } from 'react';
   import { songAPI, authAPI } from './services/api';
   
   export default function App() {
     // ... existing state ...
     
     // Load songs from API
     useEffect(() => {
       if (currentUser) {
         loadSongs();
       }
     }, [currentUser]);
     
     const loadSongs = async () => {
       try {
         const response = await songAPI.getAllSongs();
         if (response.success) {
           setSongs(response.songs);
         }
       } catch (error) {
         console.error('Error loading songs:', error);
         toast.error('Failed to load songs');
       }
     };
     
     const handleAddSong = async (songData) => {
       try {
         const response = await songAPI.createSong(songData);
         if (response.success) {
           toast.success('Song added successfully!');
           await loadSongs(); // Reload songs
           setShowAdminPanel(false);
         }
       } catch (error) {
         console.error('Error adding song:', error);
         toast.error('Failed to add song');
       }
     };
     
     // ... rest of component ...
   }
   ```

4. **Update AdminPanel for File Upload**
   
   Add file upload integration:
   
   ```javascript
   import { songAPI } from '../services/api';
   
   const handleFileUpload = async (e) => {
     const file = e.target.files?.[0];
     if (!file) return;
     
     setIsProcessing(true);
     
     try {
       const response = await songAPI.uploadFile(file);
       
       if (response.success) {
         setUploadedFile(file);
         setExtractedSlides(response.extraction.slides.map((content, index) => ({
           slideNumber: index + 1,
           content
         })));
         toast.success(`Extracted ${response.extraction.slideCount} slides!`);
       }
     } catch (error) {
       toast.error('File upload failed');
     } finally {
       setIsProcessing(false);
     }
   };
   ```

### STEP 4: Test the Complete System

1. **Start Backend** (if not already running)
   ```bash
   cd kebena_backend
   npm start
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   # In your main project directory
   npm start
   ```

3. **Test Login**
   - Go to http://localhost:3000
   - Username: `admin`
   - Password: `admin123`
   - Should successfully login

4. **Test Song Display**
   - You should see 3 sample songs loaded from database
   - Try searching for songs
   - Click on a song to view it

5. **Test Adding Song Manually**
   - Click "Admin Panel"
   - Go to "Add Manually" tab
   - Fill in song details
   - Add lyrics
   - Click "Add Song"
   - Song should be saved to database

6. **Test File Upload**
   - Click "Admin Panel"
   - Go to "Add from File" tab
   - Upload a PPTX file
   - System should extract slides
   - Fill in details and save

## 🎯 Verification Checklist

### Backend Verification

- [ ] http://localhost:5000/health shows success
- [ ] phpMyAdmin shows `kebena_church_db` database
- [ ] Database has 5 tables (users, songs, files, settings, activity_logs)
- [ ] Sample songs exist in database

### Frontend Verification

- [ ] Login works with real credentials
- [ ] Songs load from database
- [ ] Can add songs manually
- [ ] Can upload files
- [ ] Can view songs in presentation mode
- [ ] Admin panel shows for admin users

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"

**Check:**
1. Backend server is running (npm start in kebena_backend)
2. Backend URL is correct (http://localhost:5000)
3. No firewall blocking port 5000

### Issue: "CORS error"

**Solution:**
Make sure CORS_ORIGIN in backend `.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

### Issue: "Database connection failed"

**Check:**
1. MySQL is running in XAMPP
2. Database credentials in `.env` are correct
3. Run `npm run init-db` again

### Issue: "Songs not loading"

**Check:**
1. Login is successful (check browser console)
2. JWT token is being sent (check Network tab)
3. Backend `/api/songs` endpoint returns data

### Issue: "File upload fails"

**Check:**
1. `uploads/` folder exists in backend
2. File size is under 10MB
3. File type is PDF/PPT/PPTX

## 📱 Next Steps

After successful setup:

1. **Add More Songs**
   - Use Admin Panel to add your church's songs
   - Upload existing PPT files
   - Organize by hymnal/local categories

2. **User Management**
   - Create user accounts for worship team
   - Test with regular user (view-only access)

3. **Backup Database**
   - Export database from phpMyAdmin regularly
   - Keep backup of uploaded files

4. **Production Deployment** (when ready)
   - See backend README.md for deployment guide
   - Get domain name and hosting
   - Configure SSL certificate

## 🆘 Getting Help

If you encounter issues:

1. **Check Console Logs**
   - Frontend: Browser Developer Tools (F12)
   - Backend: Terminal where server is running

2. **Check Database**
   - Open phpMyAdmin
   - Look at tables and data

3. **Test API Directly**
   - Use Postman or browser
   - Test endpoints one by one

4. **Review Documentation**
   - Frontend: USAGE_GUIDE.md
   - Backend: README.md

## ✅ Success Criteria

Your system is fully functional when:

✅ Backend server runs without errors  
✅ Database has all tables and sample data  
✅ Frontend connects to backend successfully  
✅ Login works with database authentication  
✅ Songs are loaded from and saved to database  
✅ File upload extracts content properly  
✅ Admin can CRUD operations on songs  
✅ Regular users can view songs only  

---

**Congratulations!** You now have a complete, database-backed church song display system! 🎉

**Questions?** Check the troubleshooting section or review the documentation.
