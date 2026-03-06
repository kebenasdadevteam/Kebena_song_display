# Bible Feature Quick Start Guide

## 🚀 Quick Start

### Opening the Bible Tab
1. Log in to the application
2. Click on the **"Bible / መጽሐፍ ቅዱስ"** tab at the top
3. You'll see the Bible Control Panel on the left and Display Preview on the right

### Displaying a Verse

**Step 1: Select Book**
- Click the "Book / መጽሐፍ" dropdown
- Choose a book (e.g., "ዮሐንስ (John)")

**Step 2: Select Chapter**
- Choose a chapter number (1-21 for John)
- Use the number input or dropdown

**Step 3: Select Verses**
- **Start**: Enter the starting verse number (e.g., 16)
- **End**: Enter the ending verse number (e.g., 17)
- For a single verse, use the same number for both

**Step 4: Display**
- Click **"Show on Display"** button
- The verse appears on the projection screen immediately

**Step 5: Clear**
- Click **"Clear Display"** to remove the verse from screen

## 📖 Features

### Real-Time Bible API
- ✅ Fetches verses directly from Open Amharic Bible API
- ✅ No need to upload Bible files
- ✅ Always up-to-date content
- ✅ Fast loading with smart caching

### All 66 Bible Books
- **39 Old Testament books** - Genesis to Malachi
- **27 New Testament books** - Matthew to Revelation
- Amharic names with English translations

### Verse Range Display
- Show single verses: John 3:16
- Show verse ranges: John 3:16-17
- Display multiple verses at once

### Dual Screen Support
1. **Control Screen** - Your laptop/PC
   - Select books, chapters, verses
   - Preview what's displayed
   - Control what appears on projection

2. **Display Screen** - Projector/TV
   - Large, readable text
   - Clean design for congregation
   - Auto-synchronized with control

## 🎯 Common Use Cases

### During Worship Service

**Scripture Reading**
```
1. Pastor announces: "Let's read John 3:16-17"
2. Operator selects John, Chapter 3, Verses 16-17
3. Clicks "Show on Display"
4. Congregation reads from projection
5. Operator clicks "Clear Display" when done
```

**Sermon References**
```
1. Pastor mentions a verse
2. Operator quickly finds and displays it
3. Verse stays on screen while pastor explains
4. Clear when moving to next point
```

**Altar Call**
```
1. Display key salvation verses
2. Switch between verses as needed
3. Keep verses visible during invitation
```

## ⌨️ Workflow Tips

### Preparing Ahead
1. Note down verses pastor will use
2. Pre-select books and chapters
3. Keep verses ready to display instantly

### During Service
1. Keep control window open
2. Display window on projector in fullscreen (F11)
3. Have next verse ready before clearing current one
4. Use preview panel to verify before showing

### After Service
- No cleanup needed!
- Verses are fetched fresh each time
- Nothing to save or delete

## 🔍 Finding Verses

### By Book and Chapter
1. Know the reference (e.g., Romans 8:28)
2. Select "ሮሜ (Romans)"
3. Select Chapter 8
4. Enter verse 28

### Book Names Reference

**Popular Old Testament Books:**
- ዘፍጥረት - Genesis
- ዘጸአት - Exodus
- መዝሙረ ዳዊት - Psalms
- ኢሳይያስ - Isaiah

**Popular New Testament Books:**
- ማቴዎስ - Matthew
- ማርቆስ - Mark
- ሉቃስ - Luke
- ዮሐንስ - John
- ሐዋርያት - Acts
- ሮሜ - Romans

## 🎨 Display Customization

### Background Color
- Controlled by admin panel
- Applies to both songs and Bible verses
- Default: Dark theme for projection

### Text Size
- Automatically optimized for projection
- Large, readable fonts
- Reference shown at top
- Verse text in center

## ⚡ Performance

### Fast Loading
- First load: ~1-2 seconds
- Cached loads: Instant
- No lag during display

### Network Requirements
- Requires internet connection
- Uses external Bible API
- Minimal bandwidth usage
- Cached verses work offline

## 🐛 Troubleshooting

### "Failed to load verses"
**Problem:** Can't fetch verses from API
**Solution:**
1. Check internet connection
2. Try selecting a different chapter
3. Refresh the page
4. Verify API is accessible: https://openamharicbible.vercel.app/api/am/books

### Display not updating
**Problem:** Projection screen not showing verse
**Solution:**
1. Ensure display window is open
2. Check Supabase connection
3. Click "Open Display" button again
4. Refresh display window

### Wrong verse displayed
**Problem:** Different verse than selected
**Solution:**
1. Check verse numbers are correct
2. Verify correct book and chapter selected
3. Clear display and show again

### "Loading..." stuck
**Problem:** Verses taking too long to load
**Solution:**
1. Check network speed
2. Try a different chapter
3. Clear browser cache
4. Restart application

## 📱 Keyboard Shortcuts

Currently no keyboard shortcuts for Bible display.
Use mouse to navigate controls.

**Future Enhancement:**
- Quick book/chapter navigation
- Keyboard-only verse selection
- Hotkeys for common verses

## 🔄 Real-Time Sync

### How It Works
1. Control panel selects verse
2. State saved to Supabase database
3. Display screen listens for changes
4. Updates instantly when new verse shown

### Multi-Operator Support
- Multiple people can control
- Last action wins
- Display always shows latest verse
- Perfect for tag-team operations

## 💡 Pro Tips

### Speed Tips
1. **Favorite verses**: Keep them in a note for quick reference
2. **Verse ranges**: Display 2-3 verses at once for context
3. **Preview first**: Check preview before showing publicly
4. **Keep display open**: Don't close display window during service

### Best Practices
1. **Test before service**: Open display window early
2. **Check internet**: Verify connection before starting
3. **Have backup**: Know where to find physical Bibles
4. **Coordinate**: Communicate with pastor about verses
5. **Practice**: Try different books before Sunday

### Common Mistakes to Avoid
❌ Closing display window accidentally
❌ Forgetting to clear previous verse
❌ Not checking preview before displaying
❌ Using without internet connection
❌ Not testing before service starts

## 📊 Supported Features

✅ All 66 Bible books
✅ All chapters and verses
✅ Verse range display (1-50 verses)
✅ Real-time synchronization
✅ Dual-screen support
✅ Amharic text display
✅ Automatic caching
✅ Preview before display
✅ Clean, readable projection

## 🔮 Coming Soon

🚧 **Planned Features:**
- Search verses by keyword
- Multiple Bible versions (KJV, NIV)
- Verse bookmarks/favorites
- Recently displayed verses
- Keyboard shortcuts
- Parallel version display
- Verse history log

## 📞 Need Help?

**Common Questions:**
- See [BIBLE_API_INTEGRATION.md](BIBLE_API_INTEGRATION.md) for technical details
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for general app issues

**Technical Support:**
- Review API documentation
- Check browser console for errors
- Verify Supabase connection

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Feature Status:** ✅ Production Ready

**Enjoy displaying God's Word! 🙏**
