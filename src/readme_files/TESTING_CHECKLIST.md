# ✅ Testing Checklist - Verify Everything Works

## Pre-Flight Check

### 1. XAMPP MySQL
- [ ] XAMPP Control Panel is open
- [ ] MySQL service is **Running** (green indicator)
- [ ] Port 3306 is active
- [ ] Can access phpMyAdmin at http://localhost/phpmyadmin

### 2. Database Exists
- [ ] Open phpMyAdmin
- [ ] Database `kebena_church_db` exists in left sidebar
- [ ] Database has tables: users, songs, files, activity_logs, settings
- [ ] Default admin user exists in `users` table

**If database doesn't exist:**
```bash
cd kebena_backend
npm run init-db
```

### 3. Backend Server
- [ ] Terminal/CMD open in `/kebena_backend` folder
- [ ] Run: `npm start`
- [ ] See: "✅ MySQL Database connected successfully!"
- [ ] See: "🚀 Server running on port 5000"
- [ ] No error messages in terminal
- [ ] http://localhost:5000/health shows "OK"

### 4. Frontend Server
- [ ] New terminal/CMD open in project root
- [ ] Run: `npm run dev`
- [ ] See: "Local: http://localhost:5173"
- [ ] No compilation errors
- [ ] Browser opens automatically or manually go to URL

---

## 🧪 Functional Tests

### Test 1: Login ✅
1. [ ] Go to http://localhost:5173
2. [ ] See login screen with church logo
3. [ ] Enter username: `admin`
4. [ ] Enter password: `admin123`
5. [ ] Click "Login" button
6. [ ] **Success:** Logged in, see main interface
7. [ ] **Success:** See toast: "Songs loaded from database"

**If login fails:**
- Check backend is running
- Check database has admin user
- Check browser console (F12) for errors

---

### Test 2: View Existing Songs ✅
1. [ ] After login, see split screen
2. [ ] Left side: "Hymnal Songs" section
3. [ ] Right side: "Local Songs" section
4. [ ] Songs appear in lists (if database has songs)
5. [ ] Can scroll through song lists
6. [ ] Click on any song to view
7. [ ] **Success:** Song viewer opens with slides

**If no songs appear:**
- Check if database has songs (phpMyAdmin → songs table)
- Check browser console for API errors
- Try adding a test song (next test)

---

### Test 3: Add Song Manually ✅
1. [ ] Click "Admin Panel" button (top right)
2. [ ] Go to "Manual" tab
3. [ ] Fill in:
   - [ ] Song Number: `TEST001`
   - [ ] Category: Select "Hymnal"
   - [ ] Amharic Title: `ሙከራ መዝሙር`
   - [ ] English Title: `Test Song`
   - [ ] Lyrics: Enter some test text (separate with blank lines)
4. [ ] Click "Add Song" button
5. [ ] **Success:** See toast: "Song added successfully!"
6. [ ] **Success:** Song appears in Hymnal list
7. [ ] Click song to verify it displays correctly

**If add fails:**
- Check backend terminal for errors
- Check all required fields are filled
- Verify MySQL is running

---

### Test 4: Upload PPT/PDF with Preview ✅

#### Prepare Test File:
- [ ] Have a PPT, PPTX, or PDF file ready
- [ ] File should contain text (for extraction)
- [ ] File size under 10MB

#### Upload Process:
1. [ ] Admin Panel → "Upload" tab
2. [ ] Click upload area or drag file
3. [ ] **Wait:** See "Uploading file..." toast
4. [ ] **Success:** See green card: "✓ filename.pptx - X slides extracted"
5. [ ] **Success:** Preview appears below

#### Preview Verification:
6. [ ] See "Extracted Slides (Click to edit)" heading
7. [ ] See multiple slide cards (one per slide)
8. [ ] Each card has:
   - [ ] "Slide X" label
   - [ ] Editable textarea with extracted content
9. [ ] **Click any textarea** - cursor appears, can type
10. [ ] **Edit some text** - changes appear immediately

#### Complete Upload:
11. [ ] Fill in song details:
    - [ ] Song Number: `TEST002`
    - [ ] Category: Select "Local Song"
    - [ ] Amharic Title: Enter title
    - [ ] English Title: Enter title
12. [ ] Verify edited slides show your changes
13. [ ] Click "Add Song (X slides)" button
14. [ ] **Success:** Toast: "Song added successfully!"
15. [ ] **Success:** Song appears in Local Songs list
16. [ ] Click song to view - all edited slides display

**If preview doesn't appear:**
- Check backend terminal for processing errors
- Verify file is valid PPT/PDF format
- Check `/kebena_backend/uploads/` folder for file
- Try a different file

---

### Test 5: Auto-Detect Files ✅

#### Setup:
1. [ ] Place a PPT or PDF file in `/kebena_backend/uploads/` folder
2. [ ] Admin Panel → "Auto-Detect" tab
3. [ ] Click "Scan Folder" button

#### Verification:
4. [ ] **Success:** Toast: "Found X files in uploads folder"
5. [ ] See table with detected files
6. [ ] Each file shows:
   - [ ] Filename
   - [ ] File type badge (PDF/PPTX)
   - [ ] File size
   - [ ] Upload date
   - [ ] "Process" button

#### Process File:
7. [ ] Click "Process" button on a file
8. [ ] **Wait:** See "Processing..." spinner
9. [ ] **Success:** Preview appears (same as Upload test)
10. [ ] Follow same steps as Test 4 to complete

---

### Test 6: Edit Existing Song ✅
1. [ ] Admin Panel → "Manage Songs" tab
2. [ ] See table of all songs
3. [ ] Click edit icon (pencil) on any song
4. [ ] **Success:** Edit form appears
5. [ ] Modify:
   - [ ] Change song number
   - [ ] Change title
   - [ ] Edit lyrics (add/remove text)
6. [ ] Click "Save Changes" button
7. [ ] **Success:** Toast: "Song updated successfully!"
8. [ ] Verify changes in song list
9. [ ] Open song to verify edited content displays

---

### Test 7: Delete Song ✅
1. [ ] Admin Panel → "Manage Songs" tab
2. [ ] Find test song (TEST001 or TEST002)
3. [ ] Click trash icon (red)
4. [ ] Confirm deletion dialog
5. [ ] **Success:** Toast: "Song deleted"
6. [ ] **Success:** Song removed from list
7. [ ] Verify in phpMyAdmin - song `is_active = FALSE`

---

### Test 8: Persistence Check ✅
1. [ ] Add or edit a song
2. [ ] **Close browser completely**
3. [ ] **Stop frontend** (Ctrl+C in terminal)
4. [ ] **Keep backend running**
5. [ ] Start frontend again: `npm run dev`
6. [ ] Login again
7. [ ] **Success:** All songs still there
8. [ ] **Success:** Changes are preserved
9. [ ] **Success:** Songs loaded from database

**This proves songs are saved to MySQL!**

---

### Test 9: Search Functionality ✅
1. [ ] Go to main screen (not admin panel)
2. [ ] In Hymnal section, type in search box
3. [ ] Try searching by:
   - [ ] Song number
   - [ ] English title (partial)
   - [ ] Amharic title (partial)
4. [ ] **Success:** Results filter as you type
5. [ ] **Success:** Matching songs appear
6. [ ] Clear search - all songs reappear

---

### Test 10: Song Viewer ✅
1. [ ] Click any song from list
2. [ ] **Success:** Full screen viewer opens
3. [ ] See:
   - [ ] Song title at top
   - [ ] Current slide content (large text)
   - [ ] Slide counter (e.g., "1 / 5")
   - [ ] Navigation arrows
   - [ ] Close button
4. [ ] Test navigation:
   - [ ] Click next arrow → slide advances
   - [ ] Click previous arrow → slide goes back
   - [ ] Press → key → slide advances
   - [ ] Press ← key → slide goes back
   - [ ] Press Escape → viewer closes
5. [ ] All slides display correctly

---

### Test 11: Presentation Mode ✅
1. [ ] Open any song in viewer
2. [ ] Click "Presentation Mode" button
3. [ ] **Success:** New window opens
4. [ ] New window shows:
   - [ ] Only slide content
   - [ ] No navigation controls
   - [ ] Full screen layout
5. [ ] Navigate in main window
6. [ ] **Success:** Presentation window updates simultaneously
7. [ ] Close presentation window
8. [ ] Main window still works

**Perfect for projector/second screen!**

---

### Test 12: Background Settings ✅
1. [ ] Admin Panel → "Settings" tab
2. [ ] See background color presets
3. [ ] Click different preset
4. [ ] **Success:** Preview updates
5. [ ] Try custom color picker
6. [ ] **Success:** Preview shows custom color
7. [ ] Close admin panel
8. [ ] Open any song in viewer
9. [ ] **Success:** Viewer uses selected background

---

## 🔍 Database Verification Tests

### Test 13: Check Database Records ✅
1. [ ] Open http://localhost/phpmyadmin
2. [ ] Click database: `kebena_church_db`
3. [ ] Click table: `songs`
4. [ ] **Success:** See Browse tab with song records
5. [ ] Verify columns:
   - [ ] `id` - sequential numbers
   - [ ] `number` - song numbers you entered
   - [ ] `title_amharic` - Amharic titles
   - [ ] `title_english` - English titles
   - [ ] `lyrics` - JSON array format: `["slide1","slide2",...]`
   - [ ] `category` - "hymnal" or "local"
   - [ ] `is_active` - TRUE for visible songs
6. [ ] Count records - should match frontend song count

---

### Test 14: API Response Test ✅
1. [ ] Open new browser tab
2. [ ] Go to: http://localhost:5000/api/songs
3. [ ] **Success:** See JSON response:
```json
{
  "success": true,
  "count": 5,
  "songs": [
    {
      "id": 1,
      "number": "001",
      "titleEnglish": "...",
      "titleAmharic": "...",
      "lyrics": ["...", "..."],
      "category": "hymnal"
    },
    ...
  ]
}
```
4. [ ] Verify data matches what you see in frontend
5. [ ] Count songs in JSON - should match database

---

## 🐛 Error Handling Tests

### Test 15: Backend Offline ✅
1. [ ] Stop backend server (Ctrl+C)
2. [ ] Try to login in frontend
3. [ ] **Expected:** See error about backend not available
4. [ ] **Expected:** Toast: "Using offline mode" or "Cannot connect"
5. [ ] Restart backend
6. [ ] Refresh frontend
7. [ ] **Success:** Everything works again

---

### Test 16: Invalid File Upload ✅
1. [ ] Admin Panel → Upload tab
2. [ ] Try uploading:
   - [ ] Text file (.txt)
   - [ ] Image file (.jpg)
   - [ ] Video file (.mp4)
3. [ ] **Expected:** Error toast: "Invalid file type"
4. [ ] Try valid file (PPT/PDF)
5. [ ] **Success:** Uploads and processes

---

### Test 17: Missing Required Fields ✅
1. [ ] Admin Panel → Manual tab
2. [ ] Leave song number empty
3. [ ] Fill other fields
4. [ ] Click "Add Song"
5. [ ] **Expected:** Error: "Please fill all required fields"
6. [ ] Fill all fields
7. [ ] **Success:** Song adds successfully

---

## 📊 Performance Tests

### Test 18: Multiple Songs ✅
1. [ ] Add 10-20 songs via any method
2. [ ] Verify:
   - [ ] Song list scrolls smoothly
   - [ ] Search is responsive
   - [ ] No lag when opening songs
   - [ ] Navigation is fast

---

### Test 19: Large Slide Count ✅
1. [ ] Upload PPT/PDF with 10+ slides
2. [ ] Verify:
   - [ ] All slides extract correctly
   - [ ] Preview shows all slides
   - [ ] Can scroll through preview
   - [ ] Can edit all slides
   - [ ] Song saves successfully
   - [ ] Viewer displays all slides

---

## ✅ Complete Success Checklist

### Backend:
- [ ] ✅ MySQL running
- [ ] ✅ Database created with tables
- [ ] ✅ Backend starts without errors
- [ ] ✅ Health endpoint responds
- [ ] ✅ Can process PPT files
- [ ] ✅ Can process PDF files
- [ ] ✅ Uploads folder exists
- [ ] ✅ .env file configured

### Frontend:
- [ ] ✅ Starts without errors
- [ ] ✅ Login works
- [ ] ✅ Loads songs from database
- [ ] ✅ Preview feature works
- [ ] ✅ Can add songs (all methods)
- [ ] ✅ Can edit songs
- [ ] ✅ Can delete songs
- [ ] ✅ Search works
- [ ] ✅ Song viewer works
- [ ] ✅ Presentation mode works

### Database:
- [ ] ✅ Songs persist
- [ ] ✅ Data survives refresh
- [ ] ✅ API returns correct data
- [ ] ✅ Edits save permanently
- [ ] ✅ Deletions work (soft delete)

### File Upload:
- [ ] ✅ Can upload PPT/PPTX
- [ ] ✅ Can upload PDF
- [ ] ✅ Preview appears
- [ ] ✅ Can edit slides
- [ ] ✅ Saves to database
- [ ] ✅ Files stored in uploads/

---

## 🎯 Final Verification

### Quick 5-Point Check:
1. [ ] Login → See "Songs loaded from database"
2. [ ] Add test song → Appears in list
3. [ ] Refresh page → Song still there
4. [ ] Upload file → Preview works
5. [ ] Edit song → Changes save

### If ALL checks pass: 🎉
```
╔════════════════════════════════════════╗
║                                        ║
║   ✅ SYSTEM FULLY OPERATIONAL! ✅      ║
║                                        ║
║   Everything is working perfectly!     ║
║   Ready for church services! 🙏        ║
║                                        ║
╚════════════════════════════════════════╝
```

### If ANY checks fail:
- See troubleshooting in `/FIXED_DATABASE_CONNECTION.md`
- Check browser console (F12) for errors
- Check backend terminal for errors
- Verify XAMPP MySQL is running
- Restart backend and try again

---

## 📝 Test Results Log

Keep track of your testing:

```
Date: ___________

Tester: __________

System:
- [ ] Windows / [ ] Mac / [ ] Linux
- [ ] XAMPP / [ ] Other MySQL

Backend:
- [ ] Running ✅ / [ ] Not running ❌
- Port: ______
- Database connected: [ ] Yes / [ ] No

Frontend:
- [ ] Running ✅ / [ ] Not running ❌
- Port: ______

Tests Passed: ___ / 19

Issues Found:
_______________________________________
_______________________________________
_______________________________________

Resolution:
_______________________________________
_______________________________________
_______________________________________

Final Status:
[ ] All systems operational
[ ] Minor issues (not critical)
[ ] Major issues (needs fixing)

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

## 🎓 Tips for Testing

1. **Test systematically** - Don't skip tests
2. **Note errors** - Write down exact error messages
3. **Check logs** - Browser console + backend terminal
4. **Test twice** - Especially after fixing issues
5. **Use test data** - Don't test with real songs initially
6. **Clean up** - Delete test songs after testing

---

## 🚀 Ready for Production

When all tests pass:
1. ✅ Create backup of database
2. ✅ Document admin credentials
3. ✅ Test on actual projector setup
4. ✅ Train church staff
5. ✅ Create backup procedures
6. ✅ Monitor first few uses

**Congratulations! Your system is ready!** 🎉
