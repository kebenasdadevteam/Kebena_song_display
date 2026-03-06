# ✅ Bible Feature Setup Checklist

Use this checklist to ensure everything is properly configured and working.

## 📋 Initial Setup Checklist

### Before First Use

- [ ] **App is running** - The main app loads successfully
- [ ] **Can login** - You can login with your user account
- [ ] **Internet connected** - Check your internet connection (required for real-time sync)
- [ ] **Projector ready** - Your projector/second monitor is connected

### First Time Configuration

- [ ] **Open app** - Navigate to your app URL
- [ ] **Login successfully** - Enter username and password
- [ ] **See Bible tab** - Confirm you can see "Bible / መጽሐፍ ቅዱስ" tab next to Songs tab
- [ ] **Click Bible tab** - Switch to Bible tab successfully
- [ ] **See control panel** - Left panel shows Bible controls
- [ ] **See preview panel** - Right panel shows display preview

### Display Window Setup

- [ ] **Find "Open Display" button** - Located in top right header (Monitor icon)
- [ ] **Click "Open Display"** - New window opens
- [ ] **Display window loads** - Shows church logo/wallpaper
- [ ] **Press F11** - Window goes full screen
- [ ] **Move to projector** - Drag window to second monitor/projector
- [ ] **Verify full screen** - Window covers entire projector screen

## 🧪 Feature Testing Checklist

### Test Basic Functionality

- [ ] **Select version** - Choose a Bible version from dropdown
- [ ] **Select book** - Choose "John" from books list
- [ ] **Enter chapter** - Type "3" in chapter field
- [ ] **Enter verse** - Type "16" for both start and end
- [ ] **Check preview** - Right panel shows the verse preview
- [ ] **Click "Show on Display"** - Verse appears on projector
- [ ] **Verify on projector** - Check that verse is visible and readable
- [ ] **Click "Clear Display"** - Projector shows church wallpaper again

### Test Verse Selection

- [ ] **Single verse** - Display John 3:16 (start: 16, end: 16)
- [ ] **Verse range** - Display Matthew 5:3-4 (start: 3, end: 4)
- [ ] **Different book** - Try Psalms 23:1
- [ ] **Different version** - Switch to different Bible version
- [ ] **Chapter navigation** - Use dropdown to select chapter
- [ ] **Manual input** - Type chapter number manually

### Test Control Features

- [ ] **Preview updates** - Preview shows correct verse before displaying
- [ ] **Show button works** - "Show on Display" button displays verse
- [ ] **Clear button works** - "Clear Display" button hides verse
- [ ] **Verse reference shown** - Reference (e.g., "John 3:16") appears on display
- [ ] **Text readable** - Font size is large and clear
- [ ] **Background correct** - Uses your configured background color

### Test Real-Time Sync

- [ ] **Display updates instantly** - No delay when clicking "Show"
- [ ] **Preview matches display** - Preview panel shows what's on projector
- [ ] **Clear works instantly** - Display clears immediately when clicked
- [ ] **Reconnection works** - Refresh display window and it still works

## 🎪 Integration Testing Checklist

### Songs + Bible Together

- [ ] **Switch to Songs tab** - Click Songs tab successfully
- [ ] **Display a song** - Select and display a hymnal song
- [ ] **Switch to Bible tab** - Click Bible tab while song is displayed
- [ ] **Display a verse** - Show a Bible verse (replaces song on display)
- [ ] **Switch back to Songs** - Return to Songs tab
- [ ] **Songs still work** - Can still display songs normally
- [ ] **Clear from Bible** - Clear button removes verse from display

### Multi-Window Testing

- [ ] **Main window works** - Control panel functions properly
- [ ] **Display window works** - Shows content correctly
- [ ] **Both windows open** - Can have both open simultaneously
- [ ] **Control from main** - Changes in main window appear on display
- [ ] **Display stays synced** - Display window always shows current state

## 🎯 Church Service Simulation

### Pre-Service Setup

- [ ] **Arrive early** - Test before service starts
- [ ] **Login to app** - Login as regular user or admin
- [ ] **Open display window** - Click "Open Display"
- [ ] **Position on projector** - Move to projector screen
- [ ] **Full screen mode** - Press F11
- [ ] **Test a verse** - Display and clear a test verse
- [ ] **Verify visibility** - Check readability from back of church

### During Service Test

- [ ] **Display hymnal song** - Songs tab → Select song → Display
- [ ] **Clear song** - Exit song viewer
- [ ] **Switch to Bible** - Click Bible tab
- [ ] **Search for verse** - Select book, chapter, verse
- [ ] **Preview verse** - Check preview panel
- [ ] **Display verse** - Click "Show on Display"
- [ ] **Verify on screen** - Congregation can read the verse
- [ ] **Clear verse** - Click "Clear Display"
- [ ] **Switch to Songs** - Return to Songs tab
- [ ] **Continue with songs** - Display another song

### Post-Service Cleanup

- [ ] **Clear display** - Nothing showing on projector
- [ ] **Close display window** - Or leave it open for next time
- [ ] **Logout** - Or leave logged in if secure

## 🔧 Admin Panel Checklist (Admins Only)

### Access and Settings

- [ ] **Open Admin Panel** - Click "Admin Panel" button in header
- [ ] **Navigate to Settings** - Click Settings tab
- [ ] **Find background setting** - "Presentation Background" color picker
- [ ] **Change background** - Select a different color
- [ ] **Verify change** - New color shows in Bible preview
- [ ] **Test on display** - Display a verse with new background
- [ ] **Restore if needed** - Return to original color

### User Management

- [ ] **Access Users tab** - Click Users tab in Admin Panel
- [ ] **View user list** - See all registered users
- [ ] **Verify permissions** - Confirm Bible feature works for all users
- [ ] **Test with regular user** - Login as non-admin and test Bible

## 📊 Performance Checklist

### Speed and Responsiveness

- [ ] **Quick verse selection** - Dropdowns are responsive
- [ ] **Instant preview** - Preview updates immediately
- [ ] **Fast display** - Verse appears on screen in < 1 second
- [ ] **Smooth switching** - No lag when switching between tabs
- [ ] **No freezing** - App remains responsive during use

### Reliability

- [ ] **Consistent sync** - Display always shows correct content
- [ ] **No disconnections** - Real-time connection stays stable
- [ ] **Refresh works** - Can refresh and continue working
- [ ] **Browser compatible** - Works in your browser (Chrome/Firefox/Edge)

## 🌐 Network Checklist

### Connection Requirements

- [ ] **Internet connected** - Both control and display have internet
- [ ] **Same network** - Devices on same WiFi/LAN (optional but recommended)
- [ ] **Supabase accessible** - Can connect to Supabase servers
- [ ] **No firewall blocks** - Firewall allows WebSocket connections

### Multi-Device (If Applicable)

- [ ] **Second control PC** - Can open control on another PC
- [ ] **Both can control** - Both control PCs work simultaneously
- [ ] **Second display** - Can open display on another screen
- [ ] **All sync together** - All displays show same content

## 📱 Device Compatibility Checklist

### Browser Testing

- [ ] **Chrome** - Works in Google Chrome
- [ ] **Firefox** - Works in Mozilla Firefox
- [ ] **Edge** - Works in Microsoft Edge
- [ ] **Safari** - Works in Safari (if on Mac)

### Screen Sizes

- [ ] **Desktop** - Works on desktop computer
- [ ] **Laptop** - Works on laptop screen
- [ ] **Projector** - Displays correctly on projector
- [ ] **Large display** - Readable on large screens

## 🎨 Display Quality Checklist

### Visual Verification

- [ ] **Text is large** - Font size is easily readable
- [ ] **Text is clear** - No blurriness or distortion
- [ ] **Background works** - Background color looks good
- [ ] **Contrast good** - White text on dark background is clear
- [ ] **Reference visible** - Verse reference is shown at top
- [ ] **Spacing good** - Proper spacing between lines
- [ ] **Centered** - Content is centered on screen

### From Congregation View

- [ ] **Readable from back** - Can read from back row
- [ ] **No glare** - Screen angle minimizes glare
- [ ] **Consistent brightness** - Projector brightness is appropriate
- [ ] **Color accurate** - Colors look good on projector

## 🔒 Security Checklist

### User Permissions

- [ ] **All users can view** - Regular users can display verses
- [ ] **Admins can configure** - Only admins can change settings
- [ ] **Login required** - Must login to use app
- [ ] **Passwords work** - User authentication functions properly

### Data Safety

- [ ] **No data loss** - Songs data is safe
- [ ] **Settings preserved** - Background and settings are saved
- [ ] **User accounts intact** - User management still works

## 📚 Documentation Checklist

### Read and Understand

- [ ] **Read QUICK_REFERENCE_BIBLE.md** - Quick start guide
- [ ] **Read BIBLE_FEATURE_GUIDE.md** - Detailed usage guide
- [ ] **Read START_HERE_BIBLE.md** - Overview and setup
- [ ] **Bookmark for reference** - Save links to documentation

### Training

- [ ] **Train yourself** - Practice using the feature
- [ ] **Train backup operator** - Teach someone else
- [ ] **Create notes** - Write down your church's specific workflow
- [ ] **Plan for questions** - Know who to ask for help

## 🎯 Final Verification

### Everything Works

- [ ] **Songs feature unchanged** - Song display works exactly as before
- [ ] **Bible feature works** - Can display Bible verses
- [ ] **Can switch between** - Easy to switch Songs ↔ Bible
- [ ] **Display syncs** - Real-time sync is working
- [ ] **Preview accurate** - Preview matches display
- [ ] **Buttons responsive** - All buttons work
- [ ] **No errors** - No error messages or issues

### Ready for Service

- [ ] **Tested thoroughly** - All features work as expected
- [ ] **Team trained** - Operators know how to use it
- [ ] **Backup plan** - Know what to do if issues arise
- [ ] **Contact info** - Know how to get help if needed
- [ ] **Confident** - Feel ready to use in live service

## 📝 Notes Section

### Issues Found
```
(List any issues you encountered during testing)

1. 
2. 
3. 
```

### Questions for Support
```
(List any questions or unclear points)

1. 
2. 
3. 
```

### Custom Workflow Notes
```
(Document your church's specific workflow)

1. 
2. 
3. 
```

## ✅ Sign-Off

Once you've completed all checklists above:

- [ ] **All core features tested** ✅
- [ ] **Ready for use in services** ✅
- [ ] **Team is trained** ✅
- [ ] **Documentation read** ✅
- [ ] **Backup plan in place** ✅

**Date Tested**: _______________
**Tested By**: _______________
**Status**: Ready / Needs Work
**Notes**: _______________

---

## 🚀 Next Steps

After completing this checklist:

1. **If everything passes**: You're ready to use it in church! 🎉
2. **If issues found**: Note them in the "Issues Found" section and ask for help
3. **If questions remain**: Read the detailed guides or ask for clarification

**The Bible feature is ready to enhance your church's worship services!** 📖🙏
