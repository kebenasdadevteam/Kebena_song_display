# API Testing Guide

Test all API endpoints using your browser, Postman, or curl.

## 🧪 Testing Tools

**Option 1:** Browser (for GET requests only)  
**Option 2:** Postman (recommended - download from postman.com)  
**Option 3:** Thunder Client (VS Code extension)  
**Option 4:** curl (command line)

## 📝 Test Sequence

Follow this sequence to test all functionality:

### 1️⃣ Health Check (No Auth Required)

**Method:** GET  
**URL:** `http://localhost:5000/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "Kebena Church API is running",
  "timestamp": "2024-12-03T10:30:00.000Z",
  "environment": "development"
}
```

### 2️⃣ Login (Get JWT Token)

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "admin",
    "email": "admin@kebenachurch.org"
  }
}
```

**⭐ IMPORTANT:** Copy the `token` value - you'll need it for all subsequent requests!

### 3️⃣ Get All Songs

**Method:** GET  
**URL:** `http://localhost:5000/api/songs`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "songs": [
    {
      "id": 1,
      "number": "001",
      "category": "hymnal",
      "titleAmharic": "እግዚአብሔር መስተዳድሩ",
      "titleEnglish": "God Our Refuge",
      "lyrics": ["Slide 1...", "Slide 2..."],
      "metadata": {
        "creator": "admin",
        "uploader": "admin",
        "fileType": "manual"
      }
    }
  ]
}
```

### 4️⃣ Get Single Song

**Method:** GET  
**URL:** `http://localhost:5000/api/songs/1`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "song": {
    "id": 1,
    "number": "001",
    "category": "hymnal",
    "titleAmharic": "እግዚአብሔር መስተዳድሩ",
    "titleEnglish": "God Our Refuge",
    "lyrics": ["First slide...", "Second slide..."],
    "metadata": { ... },
    "files": []
  }
}
```

### 5️⃣ Create New Song (Manual)

**Method:** POST  
**URL:** `http://localhost:5000/api/songs`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body:**
```json
{
  "number": "100",
  "category": "hymnal",
  "titleAmharic": "የሙከራ መዝሙር",
  "titleEnglish": "Test Song",
  "lyrics": [
    "This is the first slide",
    "This is the second slide",
    "This is the third slide"
  ],
  "fileType": "manual"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Song created successfully",
  "songId": 4
}
```

### 6️⃣ Upload File

**Method:** POST  
**URL:** `http://localhost:5000/api/songs/upload`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body:** (multipart/form-data)
- Field name: `file`
- File: Select a PDF or PPTX file

**Expected Response:**
```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "file": {
    "filename": "test-song-1234567890.pptx",
    "originalFilename": "test-song.pptx",
    "filePath": "uploads/ppts/test-song-1234567890.pptx",
    "fileType": "pptx",
    "fileSize": 25678,
    "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  },
  "extraction": {
    "slides": [
      "Extracted slide 1 content",
      "Extracted slide 2 content"
    ],
    "slideCount": 2
  }
}
```

### 7️⃣ Create Song from Uploaded File

**Method:** POST  
**URL:** `http://localhost:5000/api/songs/from-file`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body:**
```json
{
  "number": "101",
  "category": "local",
  "titleAmharic": "ከፋይል የተሰራ",
  "titleEnglish": "Created from File",
  "lyrics": [
    "First extracted slide",
    "Second extracted slide"
  ],
  "fileData": {
    "filename": "test-song-1234567890.pptx",
    "originalFilename": "test-song.pptx",
    "filePath": "uploads/ppts/test-song-1234567890.pptx",
    "fileType": "pptx",
    "fileSize": 25678,
    "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Song created successfully from uploaded file",
  "songId": 5
}
```

### 8️⃣ Update Song

**Method:** PUT  
**URL:** `http://localhost:5000/api/songs/4`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body:**
```json
{
  "titleEnglish": "Updated Test Song",
  "lyrics": [
    "Updated first slide",
    "Updated second slide"
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Song updated successfully"
}
```

### 9️⃣ Search Songs

**Method:** GET  
**URL:** `http://localhost:5000/api/songs?search=test`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "songs": [
    {
      "id": 4,
      "titleEnglish": "Updated Test Song",
      ...
    }
  ]
}
```

### 🔟 Filter by Category

**Method:** GET  
**URL:** `http://localhost:5000/api/songs?category=hymnal`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "songs": [
    { "category": "hymnal", ... },
    { "category": "hymnal", ... }
  ]
}
```

### 1️⃣1️⃣ Get Statistics (Admin Only)

**Method:** GET  
**URL:** `http://localhost:5000/api/songs/stats`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "total_songs": 5,
    "hymnal_count": 3,
    "local_count": 2,
    "total_views": 10,
    "max_views": 5
  },
  "recentSongs": [...],
  "popularSongs": [...]
}
```

### 1️⃣2️⃣ Delete Song

**Method:** DELETE  
**URL:** `http://localhost:5000/api/songs/4`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Song deleted successfully"
}
```

### 1️⃣3️⃣ Get Current User Profile

**Method:** GET  
**URL:** `http://localhost:5000/api/auth/me`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "System Administrator",
    "role": "admin",
    "email": "admin@kebenachurch.org",
    "created_at": "2024-12-03T10:00:00.000Z",
    "last_login": "2024-12-03T10:30:00.000Z"
  }
}
```

### 1️⃣4️⃣ Create New User (Admin Only)

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```
**Body:**
```json
{
  "username": "testuser",
  "password": "password123",
  "fullName": "Test User",
  "role": "user",
  "email": "test@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 2
}
```

### 1️⃣5️⃣ Get All Users (Admin Only)

**Method:** GET  
**URL:** `http://localhost:5000/api/auth/users`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": 1,
      "username": "admin",
      "full_name": "System Administrator",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-12-03T10:00:00.000Z"
    },
    ...
  ]
}
```

## 🧪 Postman Collection

### Import This Collection

Create a new collection in Postman and add these requests:

1. **Collection:** Kebena Church API
2. **Variables:**
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set after login)

3. **Requests:**
   - Health Check
   - Login
   - Get Songs
   - Create Song
   - Upload File
   - etc.

### Auto-Set Token

In Postman, after the login request, add this to the "Tests" tab:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.collectionVariables.set("token", jsonData.token);
}
```

Then in other requests, use: `{{token}}` in the Authorization header.

## 🐛 Common Test Issues

### Issue: "401 Unauthorized"

**Cause:** Token missing or expired

**Solution:**
1. Login again to get new token
2. Make sure token is in Authorization header
3. Format: `Bearer YOUR_TOKEN_HERE`

### Issue: "404 Not Found"

**Cause:** Wrong URL or server not running

**Solution:**
1. Verify server is running
2. Check URL spelling
3. Ensure port is 5000

### Issue: "400 Bad Request"

**Cause:** Invalid request body

**Solution:**
1. Check JSON syntax
2. Verify all required fields
3. Check data types (array vs string)

### Issue: "403 Forbidden"

**Cause:** Insufficient permissions

**Solution:**
1. Login as admin user
2. Check user role in response

## ✅ Testing Checklist

Use this checklist to verify all endpoints:

- [ ] Health check works
- [ ] Login returns token
- [ ] Get all songs works
- [ ] Get single song works
- [ ] Create song manually works
- [ ] Upload file works
- [ ] Create from file works
- [ ] Update song works
- [ ] Delete song works
- [ ] Search songs works
- [ ] Filter by category works
- [ ] Get statistics works
- [ ] Get user profile works
- [ ] Create user works (admin)
- [ ] Get all users works (admin)

## 📊 Expected Database Changes

After testing, check phpMyAdmin:

**songs table:**
- Should have new entries from created songs

**files table:**
- Should have entries for uploaded files

**activity_logs table:**
- Should show all CRUD operations

**users table:**
- Should have new users if you created any

## 🚀 Next Steps

After successful testing:

1. **Integrate with Frontend**
   - Use the API in your React app
   - See SETUP_GUIDE.md

2. **Test Edge Cases**
   - Invalid credentials
   - Missing required fields
   - Large file uploads

3. **Performance Testing**
   - Add many songs (100+)
   - Test search performance
   - Check pagination

---

**Happy Testing!** 🎉

For more details, see README.md
