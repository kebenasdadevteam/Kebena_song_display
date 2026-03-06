# Unified Display System - Complete Guide

## ✅ What's New

Your Kebena Church Song Display Web App now has a **unified display system** that shows both **Songs** and **Bible Verses** on the same projection window using real-time Supabase synchronization!

## 🎯 How It Works

### For Songs:

1. **Select a song** from the Hymnal or Local Songs section
2. The **SongViewer** opens with the song slides
3. Click the **"Show"** button (Eye icon) in the control bar to display the current slide on the projection screen
4. Navigate with **← →** arrow keys to change slides - the display updates automatically
5. Click **"Hide"** (Eye-off icon) to clear the display
6. When you close the SongViewer, it automatically clears the display

### For Bible Verses:

1. Go to the **Bible / መጽሐፍ ቅዱስ** tab
2. Select version, book, chapter, and verse(s)
3. Click **"Show on Display"** to project the verse
4. The verse appears instantly on the projection screen
5. Click **"Clear Display"** to hide the verse

## 📺 Display Window

### Opening the Display:
- Click **"Open Display"** button in the header
- This opens a new window at `?mode=display`
- Put this window on your projector/external screen
- Press **F11** for fullscreen

### What the Display Shows:
- **Bible verses** with reference and text
- **Song lyrics** with title and slide indicator
- **Kebena Church logo** when nothing is displayed (wallpaper)
- All content uses your church brand colors and backgrounds

## 🎮 Control Features

### In Song Viewer:
- **Show/Hide buttons**: Toggle display visibility
- **Arrow keys**: Navigate slides (automatically updates display)
- **Space**: Auto-play toggle
- **P**: Old presentation mode (separate window)
- **Esc**: Close viewer and clear display

### In Bible Control:
- **Enter**: Show verse on display
- **Esc**: Clear display
- **↑↓**: Change chapter
- **←→**: Change verse

## 🔄 Real-time Sync

The system uses **Supabase Realtime Broadcast** for instant synchronization:

1. **Control Panel** (your PC) sends display commands
2. **Display Window** (projector) receives updates instantly
3. Both screens stay perfectly synchronized
4. Works across different browser windows/tabs

## 🎨 Display Features

### For Songs:
- Shows **Amharic title** at the top
- Displays **current slide lyrics** in large text
- Shows **slide indicator** (e.g., "2 / 5")
- Updates **automatically** when you navigate slides
- Uses your selected **background color**

### For Bible Verses:
- Shows **reference** (e.g., "John 3:16" or "John 3:16-17")
- Displays **verse text** with verse numbers
- Large, readable **white text**
- Professional **church presentation** style

## 🐛 Troubleshooting

### Display not showing content?

1. **Check the display window is open**: Click "Open Display" in header
2. **Check console logs**: Press F12 and look for `[Display Service]` messages
3. **Verify Supabase connection**: You should see "SUBSCRIBED" status
4. **Try refreshing both windows**: Ctrl+R on both control and display

### Songs not loading?

- The display fetches songs from the API when a song is displayed
- If offline, songs won't load on the display window
- Check your backend is running

### Bible verses not appearing?

- The Bible feature has offline fallback for John 3 and Psalms 23
- Other verses require the Open Amharic Bible API
- Check the preview panel - if it shows, the display should too

## 📝 Technical Details

### Files Modified:
- `/components/BibleDisplay.tsx` - Now handles both songs and Bible
- `/components/SongViewer.tsx` - Added display broadcast functionality
- `/services/displayStateService.ts` - Improved sync with proper await
- `/components/BibleControl.tsx` - Better initialization

### Display State Structure:
```typescript
{
  type: 'song' | 'bible' | 'none',
  isVisible: boolean,
  
  // For songs:
  songId?: number,
  songSlide?: number,
  
  // For Bible:
  bibleVersion?: string,
  bibleBook?: string,
  bibleChapter?: number,
  bibleVerseStart?: number,
  bibleVerseEnd?: number,
  bibleText?: string,
  
  background?: string,
  timestamp?: number
}
```

## ✨ Benefits

1. **One display window** for everything (songs + Bible)
2. **Real-time sync** - instant updates
3. **Automatic cleanup** - closes displays when you're done
4. **Professional look** - church-ready projection
5. **Keyboard shortcuts** - fast control during service
6. **Offline support** - graceful fallback for Bible verses

## 🎉 You're All Set!

Your church can now:
- Display **songs** during worship
- Display **Bible verses** during sermons
- Switch between them **seamlessly**
- Control everything from **one screen**
- Project to the **congregation** on another screen

**God bless your ministry!** 🙏
