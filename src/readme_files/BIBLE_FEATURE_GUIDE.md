# Bible Feature - Quick Start Guide

## Overview

The Kebena Church Song Display Web App now includes a **Bible Display** feature with real-time synchronization between control and display screens. This allows you to:

- Control Bible verses from one PC (Control Screen)
- Display verses on another screen or projector (Display Screen)
- Search and preview verses without showing them on the display
- Show/hide verses with one click

## How It Works

### Two Screen Modes

1. **Control Screen** - For the technical operator (your PC)
   - Access the main app as normal
   - Switch to the "Bible / መጽሐፍ ቅዱስ" tab
   - Search and select verses
   - Preview what's on the display
   - Control what shows on the projection

2. **Display Screen** - For the projection/congregation
   - Click the "Open Display" button in the header
   - A new window opens showing only what you choose to display
   - Press F11 for full screen
   - This screen updates in real-time when you click "Show on Display"

## Using the Bible Feature

### Step 1: Open Display Screen
1. Login to the app
2. Click the **"Open Display"** button in the top header
3. A new window opens - this is your projection screen
4. Press **F11** to make it full screen
5. Move this window to your projector/display monitor

### Step 2: Control Bible Verses
1. In the main app, click the **"Bible / መጽሐፍ ቅዱስ"** tab
2. You'll see two sections:
   - **Left**: Control Panel (for searching and selecting verses)
   - **Right**: Display Preview (shows what's on the projection)

### Step 3: Select a Verse
1. **Version**: Choose from 3 Bible versions (currently using sample data)
2. **Book**: Select from Old/New Testament books
3. **Chapter**: Type or select the chapter number
4. **Verse**: Set start and end verse (for single verse, make them the same)

### Step 4: Display the Verse
- Click **"Show on Display"** - The verse appears on the projection screen
- Click **"Clear Display"** - The projection shows the church wallpaper

### Important Features

- **Private Search**: When you change verse selections, they are NOT shown on the display until you click "Show on Display"
- **Preview**: The right panel shows exactly what's on the projection
- **Real-time Sync**: Multiple control screens can be used - all see the same display state
- **No Delay**: Changes appear instantly on the display screen

## Current Bible Data

The app currently uses **sample Bible verses** for demonstration. You mentioned you have **3 XML versions** of the Bible.

### How to Load Your XML Bible Files

The Bible service is ready to load XML files. To integrate your XML Bibles:

1. Go to the Admin Panel
2. Add a new "Bible Upload" feature (future enhancement)
3. Upload your 3 XML Bible versions
4. The app will parse and load all verses

**For now**, the app shows placeholder verses with a message: "Please upload Bible XML files"

## Keyboard Shortcuts

When in Bible Control:
- **Tab Navigation**: Switch between Songs and Bible tabs
- **Enter**: Submit/Show verse (when form is focused)

## Real-time Synchronization

The Bible feature uses **Supabase Realtime** to sync between devices:
- Changes are broadcast to all connected screens instantly
- Works across different PCs on the same network
- Uses secure WebSocket connections
- No polling or delays

## Technical Details

### Architecture
```
Control PC (Browser 1)
    ↓
Supabase Realtime Channel
    ↓
Display Screen (Browser 2, 3, 4...)
```

### Display State
The system tracks:
- What type of content is showing (song, bible, or none)
- Whether content is visible
- Bible reference (version, book, chapter, verses)
- Verse text to display
- Background color

## Switching Between Songs and Bible

The app has **two main sections**:

### Songs Section (Existing - Unchanged)
- Click **"Songs / መዝሙሮች"** tab
- Works exactly as before
- Hymnal and Local songs
- Song viewer with slides

### Bible Section (New)
- Click **"Bible / መጽሐፍ ቅዱስ"** tab  
- Bible control and preview
- Real-time display synchronization

Both sections work independently. You can switch between them anytime.

## Usage During Church Service

### Typical Workflow:

1. **Before Service**:
   - Open main app on your control PC
   - Click "Open Display" button
   - Move display window to projector
   - Press F11 for full screen
   - Login (if not already logged in)

2. **During Service - Displaying Songs**:
   - Stay in "Songs" tab
   - Select and display songs as usual
   - Use existing song viewer

3. **When Preacher Gives Bible Verse**:
   - Switch to "Bible" tab
   - Search for the verse (preacher won't see this on display)
   - Preview it in the right panel
   - When ready, click "Show on Display"
   - Congregation sees the verse on the projector

4. **After Verse Reading**:
   - Click "Clear Display"
   - Switch back to "Songs" tab if needed

## Multi-Device Support

You can have:
- **Multiple control PCs** - All see the same state and can control the display
- **Multiple display screens** - All show the same content in sync
- **No master/slave** - Any control PC can update the display

This is useful if you have:
- Backup control PC
- Multiple projection screens
- Overflow rooms with separate displays

## Troubleshooting

### Display not updating?
- Check internet connection (Supabase Realtime requires internet)
- Refresh the display window
- Check browser console for errors

### Can't see preview?
- Make sure you're logged in
- Check that display window is open
- Try clicking "Show on Display" to test

### Wrong verse showing?
- Check your version/book/chapter/verse selections
- Verify in the preview panel before showing
- Clear and show again if needed

## Next Steps

To fully activate the Bible feature with your data:

1. **Provide XML Bible Files**: Share your 3 XML Bible versions
2. **XML Parser**: I'll create a parser to load verses into the system
3. **Admin Upload**: Add ability to upload/manage Bible versions
4. **Verse Search**: Add text search within verses
5. **Favorites**: Save frequently used verses

## Questions?

The Bible feature is designed to be simple and reliable for live church services. Let me know if you need:
- Different Bible versions
- Custom verse formatting
- Multi-verse ranges
- Verse comparison views
- Any other enhancements
