# 📊 System Flow Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEBENA CHURCH SONG DISPLAY                   │
│                      Complete System Flow                        │
└─────────────────────────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                            │
│                     (React Frontend - Port 5173)                  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Login       │  │ Song List   │  │ Song Viewer │             │
│  │ Screen      │→ │ (Browse)    │→ │ (Present)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                                                         │
│         ↓ (if admin)                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ADMIN PANEL                          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ Manage  │ Auto-Detect │  Upload  │  Manual  │ Settings │    │
│  │ Songs   │   Files     │  PPT/PDF │  Entry   │          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP REST API Calls
                            │ (fetch/axios)
                            ↓
┌───────────────────────────────────────────────────────────────────┐
│                        BACKEND API                                │
│                   (Node.js + Express - Port 5000)                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │   Authentication     │        │   Song Management    │       │
│  │   /api/auth/*        │        │   /api/songs/*       │       │
│  │                      │        │                      │       │
│  │  • Login             │        │  • Get all songs     │       │
│  │  • Get profile       │        │  • Get by ID         │       │
│  │  • Change password   │        │  • Create song       │       │
│  └──────────────────────┘        │  • Update song       │       │
│                                  │  • Delete song       │       │
│  ┌──────────────────────┐        │  • Upload file       │       │
│  │   File Processing    │        │  • Process upload    │       │
│  │                      │        │  • Scan uploads      │       │
│  │  • Extract PPT text  │        └──────────────────────┘       │
│  │  • Extract PDF text  │                                       │
│  │  • Save to uploads/  │                                       │
│  └──────────────────────┘                                       │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ MySQL Queries
                            │ (mysql2/promise)
                            ↓
┌───────────────────────────────────────────────────────────────────┐
│                        MYSQL DATABASE                             │
│                   (XAMPP MySQL - Port 3306)                       │
│                   Database: kebena_church_db                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   users     │  │   songs     │  │   files     │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ id          │  │ id          │  │ id          │             │
│  │ username    │  │ number      │  │ song_id     │             │
│  │ password    │  │ category    │  │ filename    │             │
│  │ role        │  │ title_am    │  │ file_path   │             │
│  │ is_active   │  │ title_en    │  │ file_type   │             │
│  └─────────────┘  │ lyrics      │  │ file_size   │             │
│                   │ source_file │  └─────────────┘             │
│  ┌─────────────┐  │ file_type   │                              │
│  │ activity_   │  │ creator_id  │  ┌─────────────┐             │
│  │   logs      │  │ uploader_id │  │  settings   │             │
│  ├─────────────┤  │ view_count  │  ├─────────────┤             │
│  │ id          │  │ created_at  │  │ id          │             │
│  │ user_id     │  │ updated_at  │  │ key         │             │
│  │ action      │  └─────────────┘  │ value       │             │
│  │ entity_type │                   └─────────────┘             │
│  │ entity_id   │                                                │
│  │ timestamp   │                                                │
│  └─────────────┘                                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow for Adding a Song

### Complete Journey from Upload to Display

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADD SONG WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Admin Uploads File
┌─────────────────┐
│  AdminPanel.tsx │
│  Upload Tab     │
│                 │
│  1. User selects│
│     PPT/PDF     │
│                 │
│  2. onChange    │
│     triggers    │
│                 │
│  3. Calls       │
│  songAPI.upload │
│   File(file)    │
└────────┬────────┘
         │
         │ HTTP POST multipart/form-data
         │ File: [binary data]
         ↓
┌─────────────────────────────────┐
│  Backend: /api/songs/upload     │
│  (songController.js)            │
│                                 │
│  1. Receives file via multer    │
│  2. Saves to /uploads/          │
│  3. Calls processUploadedFile() │
│  4. Extracts text from slides   │
│  5. Returns JSON:               │
│     {                           │
│       success: true,            │
│       extraction: {             │
│         slides: [               │
│           "Slide 1 text",       │
│           "Slide 2 text",       │
│           ...                   │
│         ]                       │
│       }                         │
│     }                           │
└────────────────┬────────────────┘
                 │
                 │ Response
                 ↓
┌─────────────────────────────────┐
│  Frontend: AdminPanel.tsx       │
│                                 │
│  1. Receives slide array        │
│  2. Creates ExtractedSlide[]    │
│  3. Sets state:                 │
│     extractedSlides             │
│                                 │
│  4. Shows PREVIEW UI:           │
│     ┌────────────────────┐     │
│     │ ✓ file.pptx        │     │
│     │ 5 slides extracted │     │
│     └────────────────────┘     │
│                                 │
│     ┌────────────────────┐     │
│     │ Song Details Form  │     │
│     │ [Number]           │     │
│     │ [Category]         │     │
│     │ [Amharic Title]    │     │
│     │ [English Title]    │     │
│     └────────────────────┘     │
│                                 │
│     ┌────────────────────┐     │
│     │ Slide 1            │     │
│     │ [Editable textarea]│     │
│     └────────────────────┘     │
│     ┌────────────────────┐     │
│     │ Slide 2            │     │
│     │ [Editable textarea]│     │
│     └────────────────────┘     │
│     ...                         │
│                                 │
│  5. Admin can edit slides       │
│  6. Admin fills metadata        │
└────────────────┬────────────────┘
                 │
                 │ Admin clicks "Add Song"
                 ↓
┌─────────────────────────────────┐
│  AdminPanel.tsx                 │
│  handleSubmitFromFile()         │
│                                 │
│  Calls: onAddSong({             │
│    number: "001",               │
│    category: "hymnal",          │
│    titleAmharic: "...",         │
│    titleEnglish: "...",         │
│    lyrics: [edited slides],     │
│    metadata: {...}              │
│  })                             │
└────────────────┬────────────────┘
                 │
                 │ Callback to App.tsx
                 ↓
┌─────────────────────────────────┐
│  App.tsx                        │
│  handleAddSong()                │
│                                 │
│  Calls: songAPI.createSong({    │
│    number,                      │
│    category,                    │
│    titleAmharic,                │
│    titleEnglish,                │
│    lyrics,                      │
│    fileType                     │
│  })                             │
└────────────────┬────────────────┘
                 │
                 │ HTTP POST application/json
                 ↓
┌──────────────────────────────────────┐
│  Backend: /api/songs                 │
│  (songController.js - createSong)    │
│                                      │
│  1. Validates all fields             │
│  2. Validates lyrics is array        │
│  3. Inserts into database:           │
│                                      │
│     INSERT INTO songs (              │
│       number,                        │
│       category,                      │
│       title_amharic,                 │
│       title_english,                 │
│       lyrics,                        │
│       file_type,                     │
│       creator_id,                    │
│       uploader_id                    │
│     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)│
│                                      │
│  4. lyrics stored as:                │
│     JSON.stringify([                 │
│       "slide1", "slide2", ...        │
│     ])                               │
│                                      │
│  5. Returns:                         │
│     {                                │
│       success: true,                 │
│       songId: 25                     │
│     }                                │
└────────────────┬─────────────────────┘
                 │
                 │ Success response
                 ↓
┌─────────────────────────────────┐
│  App.tsx                        │
│                                 │
│  1. Receives success            │
│  2. Calls loadSongsFromDatabase()│
│  3. Fetches all songs via       │
│     songAPI.getAllSongs()       │
└────────────────┬────────────────┘
                 │
                 │ HTTP GET
                 ↓
┌──────────────────────────────────────┐
│  Backend: /api/songs                 │
│  (songController.js - getAllSongs)   │
│                                      │
│  1. Queries database:                │
│                                      │
│     SELECT * FROM songs              │
│     WHERE is_active = TRUE           │
│     ORDER BY number ASC              │
│                                      │
│  2. Parses JSON lyrics               │
│  3. Formats response                 │
│  4. Returns:                         │
│     {                                │
│       success: true,                 │
│       count: 26,                     │
│       songs: [                       │
│         {                            │
│           id: 25,                    │
│           number: "001",             │
│           titleEnglish: "...",       │
│           titleAmharic: "...",       │
│           lyrics: ["...", "..."],    │
│           category: "hymnal",        │
│           metadata: {...}            │
│         },                           │
│         ...                          │
│       ]                              │
│     }                                │
└────────────────┬─────────────────────┘
                 │
                 │ Songs array response
                 ↓
┌─────────────────────────────────┐
│  App.tsx                        │
│                                 │
│  1. Receives all songs          │
│  2. Updates state:              │
│     setSongs(response.songs)    │
│  3. Shows toast:                │
│     "Song added successfully!"  │
│                                 │
│  4. UI re-renders               │
│  5. New song appears in list    │
└─────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│  User sees new song!            │
│  ✅ Song in database            │
│  ✅ Song in frontend list       │
│  ✅ Song persists on refresh    │
│  ✅ Can view/edit/delete        │
└─────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌───────────────────────────────────────────┐
│          LOGIN PROCESS                    │
└───────────────────────────────────────────┘

STEP 1: User Enters Credentials
┌──────────────────┐
│  LoginScreen.tsx │
│                  │
│  [username]      │
│  [password]      │
│  [Login Button]  │
└────────┬─────────┘
         │
         │ onLogin(username, password)
         ↓
┌────────────────────────────┐
│  authAPI.login()           │
│                            │
│  POST /api/auth/login      │
│  Body: {                   │
│    username: "admin",      │
│    password: "admin123"    │
│  }                         │
└────────┬───────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: authController.js         │
│  login()                            │
│                                     │
│  1. Query database:                 │
│     SELECT * FROM users             │
│     WHERE username = ?              │
│     AND is_active = TRUE            │
│                                     │
│  2. Verify password:                │
│     bcrypt.compare(password, hash)  │
│                                     │
│  3. Generate JWT token:             │
│     jwt.sign({                      │
│       userId,                       │
│       username,                     │
│       role                          │
│     }, JWT_SECRET, {                │
│       expiresIn: '7d'               │
│     })                              │
│                                     │
│  4. Return:                         │
│     {                               │
│       success: true,                │
│       token: "eyJhbG...",           │
│       user: {                       │
│         id, username, name, role    │
│       }                             │
│     }                               │
└────────┬────────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  Frontend: authAPI.login()         │
│                                    │
│  1. Stores token:                  │
│     localStorage.setItem(          │
│       'auth_token',                │
│       response.token               │
│     )                              │
│                                    │
│  2. Stores user:                   │
│     localStorage.setItem(          │
│       'user',                      │
│       JSON.stringify(user)         │
│     )                              │
│                                    │
│  3. Returns user object            │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  App.tsx                           │
│                                    │
│  1. Sets currentUser state         │
│  2. useEffect triggers:            │
│     loadSongsFromDatabase()        │
│  3. App renders main UI            │
└────────────────────────────────────┘

All subsequent API calls include:
Authorization: Bearer <token>
```

---

## 💾 Database Storage

```
┌───────────────────────────────────────────────┐
│         HOW SONGS ARE STORED                  │
└───────────────────────────────────────────────┘

Song Object in Frontend:
{
  id: 25,
  number: "001",
  category: "hymnal",
  titleAmharic: "የዘወትር መዝሙር",
  titleEnglish: "Daily Hymn",
  lyrics: [
    "Slide 1 content here...",
    "Slide 2 content here...",
    "Slide 3 content here..."
  ],
  metadata: {
    creator: "Admin",
    uploader: "Admin",
    sourceFile: "song.pptx",
    fileType: "ppt"
  }
}
         │
         │ Transformed for database
         ↓
MySQL Record:
┌──────────────┬────────────────────────────┐
│ Column       │ Value                      │
├──────────────┼────────────────────────────┤
│ id           │ 25                         │
│ number       │ "001"                      │
│ category     │ "hymnal"                   │
│ title_amharic│ "የዘወትር መዝሙር"              │
│ title_english│ "Daily Hymn"               │
│ lyrics       │ '["Slide 1...", "Slide 2..]'│
│ source_file  │ "song.pptx"                │
│ file_type    │ "ppt"                      │
│ creator_id   │ 1                          │
│ uploader_id  │ 1                          │
│ view_count   │ 0                          │
│ created_at   │ 2024-12-07 10:30:00        │
│ updated_at   │ 2024-12-07 10:30:00        │
│ is_active    │ TRUE                       │
└──────────────┴────────────────────────────┘

Note: lyrics stored as JSON string:
'["Slide 1 content", "Slide 2 content", ...]'

When retrieved, parsed back to array:
lyrics = JSON.parse(row.lyrics)
```

---

## 🔄 Preview Feature Architecture

```
┌───────────────────────────────────────────────┐
│      PREVIEW SYSTEM ARCHITECTURE              │
└───────────────────────────────────────────────┘

File Upload → Backend Processing → Frontend Preview

┌─────────────┐
│ User uploads│
│   file.pptx │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────────┐
│ Backend: fileProcessor.js        │
│                                  │
│ processUploadedFile(path, type)  │
│                                  │
│ IF type === 'pptx':              │
│   ├─ Extract with pptxtojson     │
│   ├─ Read text from slides       │
│   └─ Return array                │
│                                  │
│ IF type === 'pdf':               │
│   ├─ Extract with pdf-parse      │
│   ├─ Split by pages              │
│   └─ Return array                │
│                                  │
│ Returns:                         │
│ {                                │
│   success: true,                 │
│   slides: [                      │
│     "Text from slide 1",         │
│     "Text from slide 2",         │
│     ...                          │
│   ],                             │
│   slideCount: 5                  │
│ }                                │
└──────────┬───────────────────────┘
           │
           ↓
┌──────────────────────────────────┐
│ Frontend: AdminPanel.tsx         │
│                                  │
│ State Management:                │
│                                  │
│ extractedSlides: [               │
│   {                              │
│     slideNumber: 1,              │
│     content: "Text..."           │
│   },                             │
│   {                              │
│     slideNumber: 2,              │
│     content: "Text..."           │
│   }                              │
│ ]                                │
│                                  │
│ UI Render:                       │
│ {extractedSlides.map(slide => (  │
│   <Card>                         │
│     <Label>Slide {slide.number}  │
│     <Textarea                    │
│       value={slide.content}      │
│       onChange={updateSlide}     │
│     />                           │
│   </Card>                        │
│ ))}                              │
│                                  │
│ User can:                        │
│ • View all slides                │
│ • Click any textarea             │
│ • Edit content                   │
│ • Changes update state           │
│ • Click "Add Song"               │
│ • Edited content saved to DB     │
└──────────────────────────────────┘
```

---

## 🎯 Complete Request/Response Flow

```
┌──────────────────────────────────────────────────────────────┐
│              TYPICAL API REQUEST/RESPONSE                    │
└──────────────────────────────────────────────────────────────┘

GET /api/songs
├─ Request:
│  ├─ Method: GET
│  ├─ Headers:
│  │  ├─ Authorization: Bearer <token>
│  │  └─ Content-Type: application/json
│  └─ Query: ?category=hymnal&search=Amazing
│
├─ Backend Processing:
│  ├─ auth middleware validates token
│  ├─ Extract query parameters
│  ├─ Build SQL query with filters
│  ├─ Execute query
│  ├─ Parse JSON lyrics
│  └─ Format response
│
└─ Response:
   ├─ Status: 200 OK
   ├─ Headers:
   │  └─ Content-Type: application/json
   └─ Body:
      {
        "success": true,
        "count": 3,
        "songs": [
          {
            "id": 12,
            "number": "045",
            "category": "hymnal",
            "titleAmharic": "አስደናቂ ጸጋ",
            "titleEnglish": "Amazing Grace",
            "lyrics": [
              "Amazing Grace, how sweet the sound",
              "That saved a wretch like me",
              "I once was lost, but now I'm found",
              "Was blind but now I see"
            ],
            "metadata": {
              "creator": "admin",
              "uploader": "admin",
              "sourceFile": "amazing-grace.pptx",
              "fileType": "ppt",
              "viewCount": 15,
              "updatedDate": "2024-12-07"
            }
          },
          ...
        ]
      }
```

---

## 📁 File System Structure

```
Project Root
│
├─ Frontend Files
│  ├─ App.tsx                    ← Main app, database integration
│  ├─ components/
│  │  ├─ AdminPanel.tsx          ← Preview feature here!
│  │  ├─ SongList.tsx            ← Display songs
│  │  ├─ SongViewer.tsx          ← Present slides
│  │  └─ LoginScreen.tsx         ← Authentication
│  ├─ services/
│  │  └─ api.ts                  ← API calls to backend
│  └─ types.ts                   ← TypeScript interfaces
│
├─ Backend Files
│  └─ kebena_backend/
│     ├─ .env                    ← Configuration (created!)
│     ├─ src/
│     │  ├─ server.js            ← Express server
│     │  ├─ config/
│     │  │  ├─ database.js       ← MySQL connection
│     │  │  └─ initDatabase.js   ← Create tables
│     │  ├─ controllers/
│     │  │  ├─ authController.js ← Login/auth
│     │  │  └─ songController.js ← Song CRUD
│     │  ├─ middleware/
│     │  │  ├─ auth.js           ← JWT verification
│     │  │  └─ upload.js         ← File upload (multer)
│     │  ├─ routes/
│     │  │  ├─ authRoutes.js     ← /api/auth/*
│     │  │  └─ songRoutes.js     ← /api/songs/*
│     │  └─ utils/
│     │     └─ fileProcessor.js  ← Extract PPT/PDF
│     └─ uploads/                ← Uploaded files stored here
│
└─ Database
   └─ kebena_church_db (MySQL)
      ├─ users
      ├─ songs
      ├─ files
      ├─ activity_logs
      └─ settings
```

---

## 🎉 Summary

This diagram shows how:
- ✅ Frontend connects to backend via API
- ✅ Backend saves to MySQL database
- ✅ Files are processed and previewed
- ✅ Songs persist across sessions
- ✅ Authentication secures endpoints
- ✅ Preview allows editing before save

**Everything works together seamlessly!** 🚀
