# 🧪 Testing Guide - Keyboard Navigation & Database

## 🎯 Test 1: Bible Keyboard Navigation

### What to Test:
The arrow keys should now update the Bible display window in real-time without needing to reopen it.

### Steps:

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Navigate to Bible tab**
   - Login (if needed)
   - Click on "Bible" tab

3. **Open display window**
   - Select: John 3:16
   - Press `Enter` (or click "Show on Display")
   - A new window should open showing the verse

4. **Test verse navigation (←→)**
   - Press `→` (right arrow)
   - **Expected**: Display updates to John 3:17 after ~300ms
   - Press `→` again
   - **Expected**: Display updates to John 3:18
   - Press `←` (left arrow)
   - **Expected**: Display goes back to John 3:17

5. **Test chapter navigation (↑↓)**
   - Press `↓` (down arrow)
   - **Expected**: Display updates to John 4:17 (next chapter, verse 17 resets to 1)
   - Press `↑` (up arrow)
   - **Expected**: Display updates to John 3:1 (previous chapter)

6. **Test book navigation (PgUp/PgDn)**
   - Press `PgDn` (Page Down)
   - **Expected**: Display updates to Acts 1:1 (next book)
   - Press `PgUp` (Page Up)
   - **Expected**: Display updates to John 1:1 (previous book)

7. **Test other shortcuts**
   - Press `P`
   - **Expected**: Verse shows in preview panel (not display window)
   - Press `Esc`
   - **Expected**: Display window closes, preview clears

### ✅ Success Criteria:
- [ ] Display window updates automatically when using arrow keys
- [ ] No need to press Enter again after each navigation
- [ ] Updates happen smoothly after ~300ms (debounced)
- [ ] Verse reference updates in display window title
- [ ] Preview panel also updates with the verse
- [ ] All keyboard shortcuts work as documented

---

## 🎯 Test 2: MySQL Database Connection

### What to Test:
The application connects to MySQL database via XAMPP and can perform CRUD operations.

### Prerequisites:
- XAMPP installed
- MySQL running in XAMPP (green status)
- `.env` file created in `kebena_backend` folder

### Steps:

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Status should turn green
   - Port 3306 should be active

2. **Initialize database**
   ```bash
   cd kebena_backend
   npm install
   npm run init-db
   ```

3. **Expected output:**
   ```
   ✅ Connected to MySQL server
   ✅ Database 'kebena_church_db' created/verified
   ✅ Using database 'kebena_church_db'
   ✅ All tables created successfully
   
   👤 Creating default admin user...
   ✅ Default admin user created
      Username: admin
      Password: admin123
   
   ✅ Default settings configured
   📝 Creating sample songs...
   ✅ 3 sample songs created
   
   🎉 Database initialization completed successfully!
   ```

4. **Verify in phpMyAdmin**
   - Click "Admin" button next to MySQL in XAMPP
   - Browser opens phpMyAdmin
   - Look for `kebena_church_db` in left sidebar
   - Click it to see tables:
     - ✅ users
     - ✅ songs
     - ✅ files
     - ✅ settings
     - ✅ activity_logs

5. **Check sample data**
   - Click on `users` table
   - **Expected**: 1 admin user exists
   - Click on `songs` table
   - **Expected**: 3 sample songs exist (2 hymnal, 1 local)

6. **Start backend server**
   ```bash
   npm start
   ```
   
7. **Expected output:**
   ```
   ✅ MySQL Database connected successfully!
      Database: kebena_church_db
      Host: localhost:3306
   
   ✅ Server running on port 5000
   🌐 API: http://localhost:5000
   📚 Ready to serve requests!
   ```

8. **Test login**
   - Start frontend: `npm run dev` (from root folder)
   - Open: http://localhost:5173
   - Login with:
     - Username: `admin`
     - Password: `admin123`
   - **Expected**: Login successful, redirects to main screen

9. **Test song display**
   - Look at Hymnal (ውዳሴ) section
   - **Expected**: See 2 sample songs
   - Look at Local Songs (ሀጋርኛ) section
   - **Expected**: See 1 sample song

10. **Test song CRUD (Admin only)**
    - Click "Admin Panel"
    - Click "Add Song"
    - Fill in details and save
    - **Expected**: New song appears in list
    - Edit the song
    - **Expected**: Changes saved successfully
    - Delete the song (optional)
    - **Expected**: Song removed from list

### ✅ Success Criteria:
- [ ] MySQL starts in XAMPP without errors
- [ ] Database initialization completes successfully
- [ ] All 5 tables created in phpMyAdmin
- [ ] Admin user exists with correct credentials
- [ ] 3 sample songs exist in database
- [ ] Backend connects to database without errors
- [ ] Can login with admin credentials
- [ ] Can view songs from database
- [ ] Can add/edit/delete songs (admin)
- [ ] Changes persist after refresh (data is in database)

---

## 🎯 Test 3: Integration Test

### What to Test:
Both features work together in a real worship service scenario.

### Scenario: Sunday Morning Service

1. **Setup Phase**
   ```bash
   # Terminal 1: Backend
   cd kebena_backend
   npm start
   
   # Terminal 2: Frontend
   cd ..
   npm run dev
   ```

2. **Login**
   - Open http://localhost:5173
   - Login as admin

3. **Display a song**
   - Navigate to "Hymnal" section
   - Click on song #001
   - Press `Enter` or click display button
   - Move display window to projector
   - Use arrow keys to navigate slides
   - **Expected**: Song displays, slides navigate smoothly

4. **Switch to Bible verse**
   - Without closing song display
   - Click "Bible" tab
   - Select John 3:16
   - Press `Enter`
   - **Expected**: Display switches to Bible verse

5. **Navigate through verses**
   - Use `→` to go to verse 17
   - Use `→` to go to verse 18
   - Use `↓` to go to chapter 4
   - **Expected**: Display updates automatically

6. **Back to songs**
   - Click "Hymnal" tab
   - Select another song
   - Press `Enter`
   - **Expected**: Display switches back to song

7. **Add new song (Admin)**
   - Click "Admin Panel"
   - Add a new song with multiple slides
   - Save
   - Navigate to that song in Hymnal/Local
   - Display it
   - **Expected**: New song displays correctly

8. **Cleanup**
   - Press `Esc` to close display
   - Logout
   - Close all windows

### ✅ Success Criteria:
- [ ] Backend and frontend start without errors
- [ ] Can login and access all features
- [ ] Songs display correctly from database
- [ ] Bible verses display correctly
- [ ] Can switch between songs and Bible seamlessly
- [ ] Keyboard navigation works for both
- [ ] Admin can add/edit songs
- [ ] Changes persist (stored in database)
- [ ] No console errors during usage
- [ ] Application performs well (no lag)

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: Display window not updating
**Fix**: 
- Close display window (`Esc`)
- Press `Enter` to reopen
- Try navigation again
- Check browser console for errors

### Issue 2: Database connection error
**Fix**:
- Check MySQL is running in XAMPP (green status)
- Verify `.env` file exists in `kebena_backend`
- Run `npm run init-db` again
- Restart backend server

### Issue 3: Arrow keys not working
**Fix**:
- Make sure display window is open (press `Enter` first)
- Don't type in input fields while testing
- Focus should be on main window, not input
- Check keyboard shortcuts are not captured by browser

### Issue 4: Sample songs not showing
**Fix**:
- Run `npm run init-db` in `kebena_backend`
- Check phpMyAdmin: `songs` table should have 3 rows
- Restart backend server
- Refresh frontend

### Issue 5: Login fails
**Fix**:
- Username: `admin` (lowercase)
- Password: `admin123` (exactly)
- Check backend is running (port 5000)
- Check database has `users` table with admin user

---

## 📊 Test Results Template

Copy this and fill in your results:

```
# Test Results - [Date]

## Environment:
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari/Edge]
- Node Version: [Run: node --version]
- MySQL Version: [Check in XAMPP]

## Test 1: Bible Keyboard Navigation
- [ ] PASS - Arrow keys update display
- [ ] PASS - Chapter navigation works
- [ ] PASS - Book navigation works
- [ ] PASS - Debounce prevents flickering
- Notes: _____________________

## Test 2: MySQL Database
- [ ] PASS - XAMPP MySQL starts
- [ ] PASS - Database initialization succeeds
- [ ] PASS - Tables created
- [ ] PASS - Sample data exists
- [ ] PASS - Backend connects
- [ ] PASS - Login works
- [ ] PASS - CRUD operations work
- Notes: _____________________

## Test 3: Integration
- [ ] PASS - Complete workflow works
- [ ] PASS - Switching between features works
- [ ] PASS - Performance is good
- [ ] PASS - No console errors
- Notes: _____________________

## Issues Found:
[List any issues or bugs discovered]

## Overall Result:
[ ] All tests PASSED ✅
[ ] Some tests FAILED ❌ (list above)
```

---

## 🎉 Success!

If all tests pass, you have:
- ✅ Working Bible keyboard navigation with auto-update
- ✅ MySQL database connected via XAMPP
- ✅ Full CRUD functionality for songs
- ✅ Smooth integration between all features
- ✅ Production-ready application!

Ready for your church services! 🙏

---

**Need Help?**
- Check `/MYSQL_XAMPP_SETUP_GUIDE.md` for database setup
- Check `/FIXES_APPLIED_KEYBOARD_AND_DATABASE.md` for fix details
- Check `/TROUBLESHOOTING.md` for general issues

**Made with ❤️ for Kebena Church**
