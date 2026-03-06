# Bible Display Feature - User Guide

## ✅ What's New

Your Kebena Church Song Display Web App now has **TWO ways** to display Bible verses, just like the song display system!

## 📺 Two Display Options

### 1. **Show on Preview** (Control PC Screen)
- Shows the verse in the **Display Preview** panel on your control computer
- Good for checking the verse before displaying it to the congregation
- Uses the existing Supabase sync system
- Click **"Show on Preview"** button (brown/dark button)

### 2. **Show on Display** (Projector/Extended Screen)
- Opens a **separate popup window** with the Bible verse
- Works exactly like song presentation mode
- You can drag this window to your projector/extended screen
- Click **"Show on Display"** button (gold/yellow button)

## 🎮 How to Use

### For Preview Display:

1. Select your Bible version, book, chapter, and verse(s)
2. Click **"Show on Preview"** button
3. The verse appears in the Display Preview panel on the right
4. Perfect for checking before showing to congregation

### For Projector Display:

1. Select your Bible version, book, chapter, and verse(s)
2. Click **"Show on Display"** button
3. A new window opens with the verse in large text
4. **Drag this window** to your projector/extended screen
5. Press **F11** for fullscreen on the projector
6. The congregation sees the verse in beautiful, large text!

## 🎨 Display Features

### Presentation Window Shows:
- **Reference** at the top (e.g., "John 3:16" or "John 3:16-17")
- **Verse text** in very large, readable font (4rem = ~64px)
- **Dark background** with white text and text shadow
- **Church brand colors** (#865014 background)
- **Centered layout** optimized for projection

### Preview Panel Shows:
- Same verse in smaller format
- Good for control/verification
- Updates with Supabase sync

## 🔄 Workflow Comparison

### Songs Display:
1. Click a song → SongViewer opens
2. Click "Show" button → appears on extended display window
3. Navigate slides with arrows → display updates in real-time
4. Close viewer → display clears

### Bible Display:
1. Select verse → Bible Control panel
2. Click **"Show on Display"** → separate window opens
3. Drag window to projector → press F11
4. Click **"Clear All"** → closes everything

## ⌨️ Keyboard Shortcuts

- **Enter** - Show verse on preview
- **Esc** - Clear all displays
- **↑/↓** - Change chapter
- **←/→** - Change verse

## 🎯 Button Layout

```
┌─────────────────────────────────────┐
│     Show on Preview (Eye icon)      │  ← Brown button (#865014)
│              [Preview]              │     Shows in preview panel
├─────────────────────────────────────┤
│  Show on Display    │   Clear All   │  ← Gold (#E0AE3F) + Outline
│   (Monitor icon)    │  (Eye-off)    │     Opens new window
└─────────────────────────────────────┘
```

## 🚀 Typical Church Service Flow

### During Sermon:

1. **Before the service:**
   - Click "Show on Display" for opening verse
   - Drag the window to projector screen
   - Press F11 for fullscreen
   - Minimize the window when not needed

2. **During the sermon:**
   - Select next verse in control panel
   - Click "Show on Display" again
   - The window updates with new verse
   - OR: Click "Show on Preview" first to check

3. **After the sermon:**
   - Click "Clear All" to remove display
   - Or close the presentation window manually

### Advantages Over Song Display:

- **Independent window** - Doesn't require the "Open Display" main window
- **Drag and position** - Put it anywhere on any screen
- **F11 fullscreen** - Easy fullscreen toggle
- **Simple and fast** - No need for complex sync, just a popup window

## 🔧 Technical Details

### Presentation Window:
- Opens with `window.open()` API
- Size: 1920x1080 (Full HD)
- No menubar, toolbar, or status bar
- Named window: "BiblePresentationMode"
- Auto-closes when you close control panel
- Reuses same window name (replaces if already open)

### Preview Display:
- Uses displayStateService (Supabase sync)
- Appears in Display Preview panel
- Works with existing "Open Display" window
- Good for multi-window setups

## 📝 Tips

1. **Use "Show on Preview" first** to verify the verse is correct
2. **Then use "Show on Display"** to open on projector
3. **Keep the presentation window open** and just update verses
4. **Press F11** on the projector window for fullscreen
5. **Use "Clear All"** to reset everything

## 🎉 Perfect for Church!

Your Bible display now works exactly like your song display - simple, professional, and optimized for church projection services. You can switch between songs and Bible verses seamlessly during worship!

**May God bless your ministry!** 🙏
