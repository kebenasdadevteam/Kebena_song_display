# Unified Display Setup Guide

## Overview
The Kebena Church Song Display Web App features a unified display system for projectors that handles both Bible verses and songs seamlessly.

## How It Works

### Single Display Window
- **One Window for Everything**: The display window shows both Bible verses and songs
- **Always Open**: Once opened, keep the window on your projector screen throughout the service
- **Auto-Updates**: Content updates automatically when you select different verses or songs from the control panel

### Setting Up for Church Service

#### 1. Initial Setup (Do this once before service)
1. Login as admin or user
2. Click **"Open Display"** button in the top header
3. A new window will open - this is your projector display
4. Move this window to your second screen (projector)
5. Press **F11** on the display window for fullscreen mode
6. Leave this window open throughout the service

#### 2. Configure Background (Admin Only)
1. Click **"Admin Panel"** button in the header
2. Go to **"Display Settings"** tab
3. Choose from:
   - **Preset Colors**: Quick church-themed colors
   - **Custom Color**: Pick any color using the color picker
   - **Background Image**: Enter a URL to use a custom wallpaper
     - Example: `https://example.com/church-background.jpg`
     - Best resolution: 1920x1080 or higher
4. The preview shows how it will look
5. Changes apply immediately to the display window

#### 3. During Service - Bible Verses
1. Switch to **"Bible / መጽሐፍ ቅዱስ"** tab
2. Select version, book, chapter, and verses
3. Click **"Show on Display"** or press **Enter**
4. The verse appears on the projector instantly
5. Use arrow keys to navigate to next/previous verses
6. Press **Esc** to clear the display

#### 4. During Service - Songs
1. Switch to **"Songs / መዝሙሮች"** tab
2. Browse Hymnal or Local songs
3. Click on a song to open the viewer
4. Click the **"Show"** button (eye icon) to display
5. Use arrow buttons or keyboard arrows to navigate slides
6. The projector updates automatically with each slide
7. Click **"Hide"** to clear the display

## Projector Setup (Extended Display Mode)

### Windows
1. Connect your projector to the computer
2. Press **Windows + P**
3. Select **"Extend"** (NOT duplicate or second screen only)
4. The display window can now be moved to the projector screen

### macOS
1. Connect your projector
2. Open **System Preferences > Displays**
3. Click **"Arrangement"** tab
4. Uncheck **"Mirror Displays"**
5. Drag the display window to the second screen

### Linux
1. Connect your projector
2. Open display settings
3. Choose **"Extended"** or **"Extend"** mode
4. Position screens as needed
5. Move the display window to projector screen

## Key Features

### Automatic Synchronization
- Control panel and display window sync in real-time
- Multiple users can control the same display
- Changes appear instantly on the projector

### Professional Presentation
- Large, readable fonts optimized for projection
- Text shadows for better visibility
- Verse references shown prominently
- Slide indicators for songs
- Clean, distraction-free design

### Background Options
- **Solid Colors**: Fast, simple, always visible
- **Images/Wallpapers**: Professional church backgrounds
- **Preview**: Test how text looks before displaying

### Idle State
When nothing is displayed, the projector shows:
- Your custom background
- Church name and logo
- Subtle watermark text
- Professional waiting screen

## Keyboard Shortcuts

### Bible Control
- **Enter**: Show verse on display
- **P**: Preview only (not on projector)
- **←/→**: Previous/Next verse
- **↑/↓**: Previous/Next chapter
- **PgUp/PgDn**: Change book
- **Esc**: Clear display

### Song Viewer
- **Enter**: Show song on display
- **←/→**: Previous/Next slide
- **Space**: Play/Pause auto-advance
- **Esc**: Close viewer and clear display

### Display Window
- **Esc**: Clear all content (shows idle screen)
- **F11**: Toggle fullscreen

## Tips for Best Results

### Image Backgrounds
- Use high-resolution images (1920x1080 minimum)
- Choose images with low contrast for better text readability
- Darker backgrounds work better for white text
- Host images online (Unsplash, Imgur, etc.)

### Text Visibility
- All text has automatic shadow for readability
- White text works on all backgrounds
- Preview before displaying to congregation

### Workflow
1. Open display window once at service start
2. Keep it on projector throughout service
3. Control content from your laptop
4. Congregation only sees what you choose to display

### Multiple Operators
- Multiple people can log in simultaneously
- Only one person should control display to avoid conflicts
- Changes from control panel appear on all displays

## Troubleshooting

### Display window not opening
- Allow popups in your browser
- Check if popup blocker is enabled
- Try a different browser (Chrome recommended)

### Display not updating
- Refresh both control and display windows
- Check internet connection
- Verify Supabase is connected

### Background image not showing
- Verify the image URL is accessible
- Check HTTPS (some browsers block HTTP images)
- Try a direct image link (ending in .jpg, .png)
- Use browser developer tools to check for errors

### Extended display issues
- Confirm projector is in "Extend" mode, not "Mirror"
- Check display settings in your OS
- Try disconnecting and reconnecting the projector
- Verify correct screen is selected

## Best Practices

1. **Test Before Service**
   - Open display 30 minutes early
   - Test background visibility
   - Practice switching between Bible and songs

2. **Prepare Content**
   - Pre-load songs in the database
   - Note Bible passages in advance
   - Bookmark frequently used verses

3. **Keep It Simple**
   - One operator per service
   - Clear display between items
   - Use consistent backgrounds

4. **Backup Plan**
   - Have printed lyrics as backup
   - Know manual projector controls
   - Test internet connection beforehand

## Support

For issues or questions:
1. Check this guide first
2. Review troubleshooting section
3. Test with different browsers
4. Verify all connections

---

**Remember**: The display window is your "projector screen". Keep it open and on the projector throughout the entire service. Control everything from the main window on your laptop!
