# ✅ Test Bible Section - Quick Start

## 5-Minute Test Guide

Follow these exact steps to verify the Bible section is working:

### Step 1: Start the Application (2 minutes)

1. **Open Terminal/Command Prompt**
2. **Navigate to project directory:**
   ```bash
   cd C:/Users/PC/Desktop/kebena_SDA/2026_song_project
   ```

3. **Install dependencies (if first time):**
   ```bash
   npm install
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```

5. **Wait for message:**
   ```
   ➜  Local:   http://localhost:5173/
   ```

6. **Open in browser:**
   - Click the link or go to `http://localhost:5173`

### Step 2: Login (30 seconds)

1. **Use test credentials:**
   - Username: `admin`
   - Password: `admin123`
   
2. **Click "Login"**

3. **Verify you see:**
   - Header with church name
   - Two tabs: "Songs / መዝሙሮች" and "Bible / መጽሐፍ ቅዱስ"
   - "Open Display" button
   - "Admin Panel" button
   - Your name in top right

### Step 3: Test Bible Display (2 minutes)

#### 3A. Open Display Window

1. **Click "Open Display" button** (top right)
2. **New window opens** with blank display
3. **Position windows:**
   - Keep control window visible
   - Place display window to the side
   - (In real use, display goes to projector)

#### 3B. Select Bible Tab

1. **Click "Bible / መጽሐፍ ቅዱስ" tab**
2. **Verify you see:**
   - Bible Control Panel on left
   - Display Preview on right
   - Instructions box with keyboard shortcuts
   - Default selection: John 3:16

#### 3C. Display a Verse

1. **Click "Show on Display" button**
2. **Check for:**
   - ✅ Toast notification: "Verse displayed on screen"
   - ✅ Verse appears in preview (right panel)
   - ✅ Verse appears in display window
   - ✅ Reference shows: "John 3:16"

**Expected Text:**
```
John 3:16
16. For God so loved the world...
(in Amharic)
```

#### 3D. Test Keyboard Shortcuts

**With cursor outside input fields:**

1. **Press → (Right Arrow)**
   - Verse changes to John 3:17
   
2. **Press Enter**
   - New verse displays
   
3. **Press Esc**
   - Display clears
   
4. **Press ← (Left Arrow)**
   - Back to verse 16
   
5. **Press ↓ (Down Arrow)**
   - Chapter changes to 4

#### 3E. Test Background Change

1. **Click "Admin Panel" button**
2. **Click "Settings" tab**
3. **Click a preset color** (e.g., "Church Gold")
4. **Verify:**
   - Preview updates immediately
   - Display window updates
   - Sample text visible

5. **Try image background:**
   - In "Background Image/Wallpaper" field
   - Enter: `https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920`
   - Press Tab
   - Image appears as background

### Step 4: Verify Console (30 seconds)

1. **Press F12** to open DevTools
2. **Click "Console" tab**
3. **Look for:**
   ```
   [Display Service] Initialized
   [Display Service] Channel subscription status: SUBSCRIBED
   ```

4. **When showing verse:**
   ```
   [Display Service] Broadcasting state update: {...}
   [Display Service] Broadcast result: ok
   [Display Service] Received display update: {...}
   ```

5. **Should see:**
   - ✅ Green/blue log messages
   - ❌ No red errors

---

## Expected Results

### ✅ SUCCESS - Everything Working When:

- [x] App starts without errors
- [x] Login works
- [x] Bible tab loads
- [x] Display window opens
- [x] Verse shows on click
- [x] Preview updates
- [x] Display window syncs
- [x] Keyboard shortcuts work
- [x] Background changes apply
- [x] Console shows "SUBSCRIBED"
- [x] No red errors

**Status:** 🎉 Bible section is WORKING PERFECTLY!

### ❌ FAILURE - Something Wrong When:

- [ ] CSS error on startup
- [ ] Bible tab won't load
- [ ] Display window blank
- [ ] Verse doesn't appear
- [ ] Keyboard shortcuts don't respond
- [ ] Background won't change
- [ ] Console shows red errors
- [ ] "Channel not initialized" warning

**Action:** See `/BIBLE_TROUBLESHOOTING.md`

---

## Quick Fixes

### Issue: CSS Error on Startup

**Error Message:**
```
@layer base is used but no matching @tailwind base directive
```

**Fix:**
1. Open `/styles/globals.css`
2. Verify line 3 has: `@import "tailwindcss";`
3. If not, add it at the top
4. Save and restart

### Issue: Display Window Blank

**Fix:**
1. Close display window
2. Click "Open Display" again
3. Try showing verse again
4. Check console in both windows

### Issue: Supabase Not Connected

**Error:**
```
Failed to connect to Supabase
```

**Fix:**
1. Check internet connection
2. Verify `/utils/supabase/info.tsx` exists
3. Credentials should auto-populate

### Issue: Bible API Not Loading

**Error:**
```
Failed to fetch verses
```

**Fix:**
1. Check internet connection
2. Test API: `curl https://openamharicbible.vercel.app/api/am/books`
3. Try different verse

---

## Test Scenarios

### Scenario 1: Quick Scripture Reference

**Goal:** Display John 3:16 in under 10 seconds

**Steps:**
1. Open app → 2 sec
2. Login → 2 sec  
3. Click Bible tab → 1 sec
4. Click "Show on Display" → 1 sec
5. Verse appears → instant

**Total:** ~6 seconds ✅

### Scenario 2: Navigate to Different Verse

**Goal:** Show Psalm 23:1 using keyboard

**Steps:**
1. From John 3:16 (default)
2. Click Book dropdown
3. Type "Psalm" or scroll
4. Chapter: Type "23"
5. Verse: Type "1"
6. Press Enter

**Expected:** Psalm 23:1 displays instantly

### Scenario 3: Verse Range

**Goal:** Display Matthew 5:3-12 (Beatitudes)

**Steps:**
1. Select Book: Matthew
2. Chapter: 5
3. Start Verse: 3
4. End Verse: 12
5. Click "Show"

**Expected:** All 10 verses display together

### Scenario 4: Change Background Mid-Service

**Goal:** Update background while verse is displayed

**Steps:**
1. Show any verse
2. Admin Panel → Settings
3. Change background color
4. Verify display updates without clearing verse

**Expected:** Background changes, verse stays

---

## Performance Benchmarks

### Expected Load Times:

- **App startup:** 2-3 seconds
- **Login:** < 1 second
- **Bible tab load:** < 1 second
- **First verse fetch:** 1-2 seconds (API call)
- **Cached verse:** Instant
- **Display sync:** < 100ms
- **Background change:** Instant
- **Keyboard response:** Instant

### Network Requirements:

- **First load:** Internet required (fetch verse from API)
- **Cached verse:** Works offline
- **Display sync:** Real-time (Supabase)
- **Background image:** Downloads once, then cached

---

## Production Readiness Checklist

### Before Sunday Service:

- [ ] Test all features Friday/Saturday
- [ ] Preload common verses (cache them)
- [ ] Set desired background
- [ ] Test keyboard shortcuts
- [ ] Verify display window on projector
- [ ] Check internet connection
- [ ] Have backup verses ready
- [ ] Print troubleshooting guide

### During Service:

- [ ] Open display window before service
- [ ] Keep control window ready
- [ ] Use keyboard shortcuts for speed
- [ ] Monitor console for errors
- [ ] Have Bible app as backup

### After Service:

- [ ] Close display window
- [ ] Logout
- [ ] Note any issues
- [ ] Update verse cache for next week

---

## Real-World Usage

### Typical Service Flow:

1. **Setup (10 min before):**
   - Start app
   - Login
   - Open display window
   - Test with one verse
   - Set background

2. **During Scripture Reading:**
   - Navigate to verse
   - Press Enter when pastor ready
   - Keep verse visible while reading
   - Press Esc when done

3. **Quick Reference:**
   - Use arrow keys to navigate
   - Enter to show
   - Esc to hide
   - Repeat as needed

---

## Troubleshooting Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| CSS Error | Add `@import "tailwindcss";` to globals.css |
| Display Blank | Refresh display window |
| No Sync | Check console, reopen windows |
| Keyboard Not Working | Click outside inputs first |
| API Error | Check internet, try different verse |
| Background Won't Change | Show a verse first, then change |
| Slow Loading | Internet slow, preload verses |

---

## Success Confirmation

**Run this 1-minute test:**

1. Start app
2. Login
3. Click Bible tab
4. Click "Show on Display"
5. Verse appears in both windows
6. Press Esc
7. Display clears

**If all 7 steps work:** ✅ **BIBLE SECTION IS FULLY FUNCTIONAL**

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** Ready for Production

🙏 **God bless your worship service!**
