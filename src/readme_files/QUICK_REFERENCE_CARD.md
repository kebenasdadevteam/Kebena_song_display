# 🎯 Kebena Church Display - Quick Reference Card

**Print this and keep it at your control station!**

---

## 🚀 STARTING THE APP

### Option 1: Windows
```
Double-click: start-backend.bat
Double-click: start.bat
```

### Option 2: Mac/Linux
```bash
./start-backend.sh
./start.sh
```

### Option 3: Manual
```bash
Terminal 1: npm run backend
Terminal 2: npm run dev
```

**Then open**: http://localhost:5173

---

## 🔐 LOGIN

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change after first login!**

---

## 📖 BIBLE DISPLAY - COMPLETE WORKFLOW

### 🎬 Before Service (Setup)

```
1. Click: Bible / መጽሐፍ ቅዱስ tab
2. Select: Book, Chapter, Verse
3. Press: Enter (or click "Show on Display")
4. A popup window opens
5. Drag: Window to projector screen
6. Press: F11 (fullscreen on projector)
✅ DONE! Display is ready
```

### ⚡ During Service (Fast Navigation)

**Window is already open on projector, now just:**

```
Press →  = Next verse (auto-updates instantly!)
Press ←  = Previous verse (auto-updates instantly!)
Type new verse number = Auto-updates after 300ms! ⚡
Change chapter = Auto-updates after 300ms! ⚡
Change book = Auto-updates after 300ms! ⚡
Press P  = Preview only (check before showing)
Press Esc = Clear display
```

**NEW: Just change ANY selection and it auto-updates!**
No need to press Enter or click buttons repeatedly! 🎉

### 💡 Example: Showing John 3:16-19

```
1. Setup (once):
   Select: John 3:16
   Press: Enter
   [Window opens and shows John 3:16]

2. Navigate (during service):
   Press: → [Shows John 3:17 instantly]
   Press: → [Shows John 3:18 instantly]
   Press: → [Shows John 3:19 instantly]
   Press: ← [Back to John 3:18]

✅ No need to press Enter again!
   Arrow keys auto-update!
```

---

## 🎵 SONG DISPLAY - COMPLETE WORKFLOW

### Before Service

```
1. Click: Songs / መዝሙሮች tab
2. Browse: Hymnal (ውዳሴ) or Local Songs (ሀጋርኛ)
3. Click: A song
   [SongViewer opens]
4. Click: Show button (Eye icon)
   [Display updates]
5. The display window shows the song
   (Same window as Bible display)
```

### During Service

```
Press →  = Next slide
Press ←  = Previous slide
Press Esc = Hide song

Click Hide button = Stop displaying
```

---

## ⌨️ ALL KEYBOARD SHORTCUTS

### Bible Controls

| Key | Action | Auto-Update? |
|-----|--------|--------------|
| `Enter` | Show on Display | - |
| `P` | Preview Only | - |
| `←` | Previous Verse | ✅ **YES** |
| `→` | Next Verse | ✅ **YES** |
| `↑` | Previous Chapter | ❌ No* |
| `↓` | Next Chapter | ❌ No* |
| `PgUp` | Previous Book | ❌ No* |
| `PgDn` | Next Book | ❌ No* |
| `Esc` | Clear Display | - |

*_Press Enter after changing chapter/book_

### Song Controls (in SongViewer)

| Key | Action |
|-----|--------|
| `→` | Next slide |
| `←` | Previous slide |
| `Esc` | Hide song |

---

## 🎮 BUTTON REFERENCE

### Bible Buttons

| Button | Color | Icon | Action |
|--------|-------|------|--------|
| **Show on Preview** | Brown | 👁️ Eye | Shows in preview panel |
| **Show on Display** | Gold | 🖥️ Monitor | Opens popup window |
| **Clear All** | Outline | 👁️‍🗨️ Eye-off | Clears everything |

### Song Buttons

| Button | Icon | Action |
|--------|------|--------|
| **Show** | 👁️ Eye | Display song |
| **Hide** | 👁️‍🗨️ Eye-off | Hide song |

---

## 🎯 TYPICAL SUNDAY WORKFLOW

### 1. Opening (9:00 AM)

```
□ Start both servers
□ Login to app
□ Click "Bible" tab
□ Select opening verse (e.g., Psalms 23:1)
□ Press Enter
□ Drag window to projector
□ Press F11 for fullscreen
```

### 2. Hymn Time (9:15 AM)

```
□ Click "Songs" tab
□ Find opening hymn (search by number)
□ Click song → SongViewer opens
□ Click "Show" button
□ Use → arrow to navigate slides
□ Click "Hide" when done
```

### 3. Scripture Reading (9:45 AM)

```
□ Click "Bible" tab
□ Select first verse (e.g., John 3:16)
□ Press Enter (or just →/← if window still open)
□ Press → for verse 17
□ Press → for verse 18
□ Press → for verse 19
```

### 4. Sermon (10:00 AM)

**Preacher mentions different verses:**

```
Verse 1: Romans 8:28
  □ Type: Romans 8 28
  □ Press: Enter

Verse 2: Romans 8:29  
  □ Press: → (auto-updates!)

Verse 3: John 3:16
  □ Select: John 3
  □ Type: 16
  □ Press: Enter

Verse 4: John 3:17
  □ Press: → (auto-updates!)
```

### 5. Closing (11:30 AM)

```
□ Select closing hymn
□ Show lyrics with "Show" button
□ Navigate slides with →
□ Press Esc to clear
□ Close presentation window
□ Done! 🎉
```

---

## 🚨 TROUBLESHOOTING

### Display window is blank
```
✓ Check if popup blocker is active
✓ Try closing and pressing Enter again
✓ Check browser console (F12)
```

### Arrow keys don't work
```
✓ Make sure you're in Bible tab
✓ Make sure no input field is focused
✓ Click somewhere outside input boxes
```

### Display doesn't auto-update
```
✓ Check if presentation window is still open
✓ Close window and press Enter again
✓ Only ←/→ auto-update (not ↑/↓)
```

### Songs won't load
```
✓ Check backend is running (Terminal 2)
✓ Check http://localhost:3001/api/songs
✓ Make sure database is initialized
```

### Bible verses not loading
```
✓ Check internet connection (API needs it)
✓ Try John 3:16 (works offline)
✓ Try Psalms 23:1 (works offline)
```

---

## 📞 EMERGENCY RESTART

**If everything breaks:**

```bash
1. Close all browser windows
2. Stop both terminals (Ctrl+C)
3. Run: start-backend.bat (or .sh)
4. Run: start.bat (or .sh)
5. Refresh browser
6. Login again
```

**Nuclear option (resets everything):**

```bash
cd kebena_backend
rm kebena.db
node src/config/initDatabase.js
cd ..
# Restart servers
```

---

## 💡 PRO TIPS

### Tip 1: Keep Display Open
- Open presentation window ONCE at start
- Keep it open all service
- Just use arrow keys to update
- Much faster! ⚡

### Tip 2: Use Both Hands
- Left hand: Arrow keys (←→↑↓)
- Right hand: Enter key
- Maximum speed! 💨

### Tip 3: Preview First
- Press `P` to preview
- Check it's correct
- Then press Enter to show
- Prevents mistakes! ✅

### Tip 4: Prepare Verses
- Before service, write down verse references
- Navigate quickly during live service
- No fumbling! 📝

### Tip 5: Test Before Service
- Arrive 30 minutes early
- Test projector connection
- Test display window
- Test F11 fullscreen
- Peace of mind! 😌

---

## 📏 DISPLAY WINDOW SPECS

- **Size**: 1920x1080 (Full HD)
- **Font Size**: 4rem (~64px) for verses
- **Reference Size**: 3rem (~48px)
- **Background**: Church colors or custom
- **Text Color**: White with shadow
- **Alignment**: Center
- **Padding**: 4rem all sides

---

## 🎨 KEYBOARD SHORTCUTS SUMMARY

```
╔═══════════════════════════════════════╗
║   KEBENA CHURCH - SHORTCUTS           ║
╠═══════════════════════════════════════╣
║  Enter    = Show on Display           ║
║  P        = Preview Only              ║
║  ←/→      = Verse (auto-updates! ⚡)  ║
║  ↑/↓      = Chapter                   ║
║  PgUp/Dn  = Book                      ║
║  Esc      = Clear All                 ║
╚═══════════════════════════════════════╝
```

---

## ✅ PRE-SERVICE CHECKLIST

```
□ Backend server running (green checkmark in terminal)
□ Frontend running (http://localhost:5173)
□ Logged in successfully
□ Projector connected and working
□ Test verse displayed and visible on projector
□ F11 fullscreen working
□ Arrow keys responding
□ Songs loading in library
□ All team members know the shortcuts
```

---

**🙏 God bless your worship service!**

**📋 Keep this card visible at your control station!**

---

_Last updated: Friday, January 2, 2026_
_Version: 1.0.0 (Enhanced Bible Display)_