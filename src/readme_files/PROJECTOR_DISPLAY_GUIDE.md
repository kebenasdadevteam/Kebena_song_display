# Projector Display System - Complete Guide

## 🎯 What You Need to Know

The Kebena Church Song Display Web App uses a **unified display system** - one window that shows everything on your projector. This guide explains how it all works together.

## 📺 The Unified Display Concept

### How It Works
```
┌─────────────────┐         ┌─────────────────┐
│  Your Laptop    │         │   Projector     │
│  (Control)      │ ──────> │   (Display)     │
├─────────────────┤         ├─────────────────┤
│ • Select songs  │         │ • Shows songs   │
│ • Pick verses   │         │ • Shows verses  │
│ • Control slides│         │ • Auto-updates  │
│ • Change bg     │         │ • Full screen   │
└─────────────────┘         └─────────────────┘
```

### Two Windows, One System
1. **Control Window** (Your laptop)
   - Where you work
   - Select songs and Bible verses
   - Navigate slides
   - Change backgrounds
   - Admin controls

2. **Display Window** (Projector)
   - What congregation sees
   - Shows only what you choose
   - Auto-updates in real-time
   - Professional PPT-style display
   - Fullscreen mode

## 🚀 Complete Setup Walkthrough

### Step 1: Hardware Setup
1. **Connect projector** to your computer
2. **Configure display mode**:
   - Windows: Press `Win + P` → Select "Extend"
   - macOS: System Preferences → Displays → Uncheck "Mirror"
   - Linux: Display Settings → Select "Extend"
3. **Test the setup**: Move a window to verify second screen works

### Step 2: Software Setup (One Time)
1. **Open the web app** in your browser (Chrome recommended)
2. **Login** with your credentials
3. Click **"Open Display"** button in header
4. **New window opens** - this is your display window

### Step 3: Position Display Window
1. **Drag the display window** to your projector screen
2. **Press F11** to enter fullscreen mode
3. **Keep this window open** throughout the service
4. **Switch back** to control window on your laptop

### Step 4: Configure Background (Admin Only)
1. In control window, click **"Admin Panel"**
2. Go to **"Display Settings"** tab
3. Choose background:
   - **Preset Colors**: Quick church colors
   - **Custom Color**: Any color you want
   - **Background Image**: URL to a wallpaper image
4. Changes apply immediately to display window

## 🎵 Operating During Service

### Displaying Bible Verses

1. **In Control Window:**
   ```
   Bible Tab → Select Book → Chapter → Verses
   ```

2. **Click "Show on Display"** (or press Enter)

3. **Display Window Automatically Shows:**
   ```
   ┌─────────────────────────────┐
   │                             │
   │      John 3:16-17           │
   │                             │
   │   For God so loved the      │
   │   world that he gave...     │
   │                             │
   └─────────────────────────────┘
   ```

4. **Navigate:**
   - `←/→` keys: Switch verses
   - `↑/↓` keys: Change chapters
   - Updates appear instantly on projector

### Displaying Songs

1. **In Control Window:**
   ```
   Songs Tab → Select Song → Click to Open
   ```

2. **Click "Show" button** (eye icon)

3. **Display Window Shows Current Slide:**
   ```
   ┌─────────────────────────────┐
   │                             │
   │    Amazing Grace            │
   │                             │
   │   Amazing grace, how        │
   │   sweet the sound...        │
   │                             │
   │         1 / 4               │
   └─────────────────────────────┘
   ```

4. **Navigate Slides:**
   - `←/→` keys: Previous/Next slide
   - Display updates automatically

### Clearing the Display

**Press Esc** to clear content
- Display shows idle wallpaper
- Church logo appears
- Ready for next item

## 🎨 Background Management

### Why It Matters
- Professional appearance when idle
- Better text visibility
- Church branding
- Visual consistency

### Background Options

#### 1. Solid Colors
**Best for**: Simplicity, guaranteed visibility
```
Admin Panel → Display Settings → Choose Preset
- Church Brown (#865014)
- Church Gold (#E0AE3F)  
- Dark Blue (#1a1a2e)
```

#### 2. Custom Colors
**Best for**: Matching church colors
```
Admin Panel → Display Settings → Color Picker
Pick any color → Applies immediately
```

#### 3. Background Images
**Best for**: Professional church services
```
Admin Panel → Display Settings → Background Image
Enter URL: https://example.com/church-bg.jpg

Requirements:
✓ High resolution (1920x1080+)
✓ Accessible URL (https preferred)
✓ Direct image link (.jpg, .png)
✓ Darker images work better for white text
```

### Testing Backgrounds
1. Change background in Admin Panel
2. Check preview
3. Look at display window
4. Verify text is readable
5. Adjust if needed

## 🔄 Real-Time Synchronization

### How Sync Works
- Uses Supabase for instant updates
- All connected windows see changes
- No manual refresh needed
- Works across multiple devices

### What Gets Synced
✅ Bible verse selection
✅ Song display
✅ Slide changes
✅ Background changes
✅ Show/hide commands

### Multiple Operators
⚠️ **Important**: Only one person should control at a time
- Multiple logins allowed
- But only one should click buttons
- Prevents conflicting commands
- Designate one operator per service

## ⌨️ Complete Keyboard Shortcuts

### Control Window

#### Bible Control
| Shortcut | Action |
|----------|--------|
| `Enter` | Show verse on display |
| `P` | Preview only (not on projector) |
| `←` | Previous verse |
| `→` | Next verse |
| `↑` | Previous chapter |
| `↓` | Next chapter |
| `PgUp` | Previous book |
| `PgDn` | Next book |
| `Esc` | Clear display |

#### Song Viewer
| Shortcut | Action |
|----------|--------|
| `←` | Previous slide |
| `→` | Next slide |
| `Space` | Play/Pause auto-advance |
| `P` | Open presentation window |
| `Esc` | Close viewer |

### Display Window
| Shortcut | Action |
|----------|--------|
| `F11` | Toggle fullscreen |
| `Esc` | Clear all content |

## 🎯 Best Practices

### Before Service
- [ ] Connect and test projector (30 min early)
- [ ] Open display window
- [ ] Position on projector screen
- [ ] Enter fullscreen (F11)
- [ ] Test background visibility
- [ ] Load planned songs/passages
- [ ] Have backup plan ready

### During Service
- [ ] One designated operator
- [ ] Clear display between items
- [ ] Test verse/song before displaying
- [ ] Use Esc to clear quickly
- [ ] Keep control window organized
- [ ] Monitor projector occasionally

### After Service
- [ ] Close display window
- [ ] Log out of app
- [ ] Disconnect projector properly
- [ ] Note any technical issues
- [ ] Update song database if needed

## 🔧 Troubleshooting

### Display Window Issues

**Problem**: Display window won't open
**Solutions**:
- Allow browser popups
- Disable popup blocker
- Try different browser (Chrome recommended)
- Check JavaScript is enabled

**Problem**: Can't find display window
**Solutions**:
- Check if minimized
- Look on all screens
- Close and reopen with "Open Display" button
- Check Windows taskbar

**Problem**: Display not fullscreen
**Solutions**:
- Click on display window
- Press F11
- Exit and re-enter fullscreen
- Check browser settings

### Content Not Updating

**Problem**: Display shows old content
**Solutions**:
1. Press Esc to clear
2. Reselect content
3. Refresh display window (F5)
4. Check internet connection
5. Reopen display window

**Problem**: Changes not appearing
**Solutions**:
- Verify internet connection
- Refresh both windows
- Check Supabase connection
- Clear browser cache
- Try incognito mode

### Background Issues

**Problem**: Image background not showing
**Solutions**:
- Verify URL works in browser
- Use direct image link (.jpg, .png)
- Check HTTPS (browser may block HTTP)
- Try different image hosting
- Use solid color as backup

**Problem**: Text not visible on background
**Solutions**:
- Use darker backgrounds
- Choose high-contrast images
- Test with sample text in preview
- Adjust image brightness externally
- Fallback to solid color

### Projector Issues

**Problem**: Duplicate displays instead of extend
**Solutions**:
- Windows: Win+P → Extend
- macOS: Uncheck Mirror Displays
- Linux: Select Extend mode
- Check cable connections
- Restart if necessary

**Problem**: Display on wrong screen
**Solutions**:
- Drag window to correct screen
- Swap display order in OS settings
- Identify screens in display settings
- Use "Identify" button in Windows

## 📱 Quick Reference

### Workflow Summary
```
1. Open Display Window → Move to Projector → F11
2. Select Bible/Song → Show on Display
3. Navigate with Arrow Keys
4. Clear with Esc
5. Repeat for Next Item
```

### Emergency Procedures

**If Everything Freezes**:
1. Press Esc
2. Refresh display window (F5)
3. Reselect content
4. Worst case: Close and reopen display

**If Wrong Content Displays**:
1. Press Esc immediately
2. Select correct content
3. Show on display again

**If Lost Connection**:
1. Check internet
2. Refresh both windows
3. Verify Supabase status
4. Restart browser if needed

## 💡 Pro Tips

### Preparation
- Create a service plan with passages/songs
- Test all content before service
- Have printed backup lyrics
- Bookmark frequently used verses
- Set up background the day before

### During Service
- Keep control window hidden from congregation
- Use preview before displaying
- Clear between items for clean transitions
- Practice keyboard shortcuts beforehand
- Stay calm if technical issues occur

### Technical
- Use Chrome for best compatibility
- Ensure strong internet connection
- Keep browser updated
- Clear cache weekly
- Test changes in off-hours

### Visual Quality
- 1920x1080 minimum for images
- Darker backgrounds for better contrast
- Test visibility from back of room
- Consistent branding throughout
- Professional, distraction-free design

## 📊 System Architecture

```
┌──────────────────────────────────────────────┐
│           Browser (Your Laptop)              │
├──────────────────┬───────────────────────────┤
│  Control Window  │    Display Window         │
│  ┌────────────┐  │    ┌────────────┐        │
│  │ Login      │  │    │ Fullscreen │        │
│  │ Song List  │──┼───>│ Bible/Songs│        │
│  │ Bible Ctrl │  │    │ Background │        │
│  │ Admin Panel│  │    └────────────┘        │
│  └────────────┘  │                           │
└──────────┬───────┴───────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │  Supabase   │
    │  Real-time  │
    │  Sync       │
    └─────────────┘
```

## 📞 Support

### Self-Help Resources
1. This guide (comprehensive)
2. DISPLAY_QUICK_REFERENCE.md (quick tips)
3. UNIFIED_DISPLAY_SETUP.md (detailed setup)
4. Browser console (F12 for errors)

### Common Questions

**Q: Do I need two computers?**
A: No! One computer with two screens (laptop + projector)

**Q: Can I use this offline?**
A: Bible and Song display need internet for sync. Database can cache.

**Q: How many songs can I add?**
A: Unlimited (database storage)

**Q: Can multiple people login?**
A: Yes, but only one should control display at a time

**Q: What browsers work best?**
A: Chrome (recommended), Firefox, Edge. Safari has limitations.

**Q: Can I customize the display colors?**
A: Yes! Admin Panel → Display Settings

---

**Remember**: The display window is your "projector screen". Open it once, keep it on the projector, and control everything from your laptop. It's that simple!

🎉 **Happy Worshiping!**
