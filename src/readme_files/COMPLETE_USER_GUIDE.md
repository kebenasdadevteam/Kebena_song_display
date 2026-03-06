# Kebena Church Song Display Web App - Complete User Guide

## 🎯 Overview
Complete church worship display system with **full Amharic Bible integration**, song lyrics display, and real-time projection control for Ethiopian Orthodox Tewahedo Church services.

---

## 📖 **Bible Feature - Fully Integrated**

### **API Integration**
The app uses the official **Amharic Bible API** (https://openamharicbible.vercel.app/api/am) with:
- ✅ All 66 books of the Bible (Old & New Testament)
- ✅ Full Amharic text support
- ✅ Verse-by-verse navigation
- ✅ Search functionality
- ✅ Offline fallback for popular verses (John 3, Psalms 23)

### **How to Display Bible Verses**

1. **Navigate to Bible Tab**
   - Click on "Bible / መጽሐፍ ቅዱስ" tab in the main interface

2. **Select Your Verse**
   - **Version**: የአማርኛ መጽሐፍ ቅዱስ (Amharic Bible)
   - **Book**: Choose from 66 books (e.g., ዮሐንስ - John)
   - **Chapter**: Select chapter number (1-21 for John)
   - **Verse**: Choose start and end verses (e.g., 3:16-17 for multiple verses)

3. **Display Options**
   - **Preview Only** - Click "Show on Preview" or press `P` key
   - **Show on Display** - Click "Show on Display" or press `Enter` key
   - **Clear Display** - Click "Clear All" or press `Esc` key

### **⌨️ ALL Keyboard Shortcuts for Bible**

| Key | Action |
|-----|--------|
| `Enter` | Display selected verse on projector |
| `P` | Preview verse in control panel only |
| `Esc` | Clear all displays (preview & projector) |
| `← →` (Left/Right Arrows) | Navigate to previous/next verse |
| `↑ ↓` (Up/Down Arrows) | Navigate to previous/next chapter |
| `PgUp` / `PgDn` | Navigate to previous/next book |

**💡 Auto-Update Feature**: When display window is open, arrow keys automatically update the displayed verse!

### **Search the Bible**

1. Enter search term in the "Search / ይፈልጉ" field
2. Click "Search" button or press Enter
3. View search results with book, chapter, and verse references
4. Click on any result to navigate to that verse

---

## 🎵 **Song Display Feature**

### **Song Categories**
- **Hymnal (ውዳሴ)** - Traditional hymns
- **Local Songs (ሀገርኛ)** - Contemporary worship songs

### **How to Display Songs**

1. **Browse Songs**
   - Songs tab shows two sections: Hymnal (left) and Local Songs (right)
   - Use search to find songs by number, Amharic title, or English title

2. **Select a Song**
   - Click on any song to open the song viewer
   - Navigate slides using arrow keys or buttons
   - Press `Esc` to return to song list

3. **Song Viewer Keyboard Shortcuts**
   - `← →` - Previous/Next slide
   - `Home` - First slide
   - `End` - Last slide
   - `Esc` - Close viewer

---

## 🖥️ **Display Settings (Admin Only)**

### **Opening the Display Window**

1. Click **"Open Display"** button in the header
2. A new window opens - this is your projector window
3. **IMPORTANT**: Move this window to your projector/external display
4. Press `F11` for fullscreen mode on the projector

### **Background Image Setup**

Admins can customize the display background:

1. **Open Admin Panel** → Click "Admin Panel" button (admins only)
2. **Go to Settings Tab**
3. **Choose Background Type**:

#### **Option 1: Use Quick Preset Images**
Click any preset button:
- 🏛️ Church Interior
- ✝️ Cross Background
- 📖 Bible Background
- 🎵 Worship Background

#### **Option 2: Use Custom Image URL**
1. Find a high-quality image (1920x1080 recommended)
2. Get the image URL (from Unsplash, Pexels, or your own server)
3. Paste URL in "Image URL" field
4. Press `Enter` to apply

**Example URLs you can try:**
```
https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80
https://images.unsplash.com/photo-1464983308776-8f1e83b2a4f0?w=1920&q=80
```

#### **Option 3: Use Solid Color**
- Click on color preset buttons (Church Brown, Church Gold, Dark Blue, etc.)
- Or use custom color picker for any color

### **Background Features**
- ✅ Background shows when idle (no content displayed)
- ✅ Background appears behind Bible verses and songs
- ✅ Automatically syncs to all display windows
- ✅ Saved in browser (persists after refresh)

---

## 🔐 **User Roles**

### **Regular User**
- View and display songs
- View and display Bible verses
- Control display window

### **Admin User**
- All user features PLUS:
- Add new songs (manual entry or file upload)
- Edit existing songs
- Delete songs
- Change display backgrounds
- Manage user accounts
- Create/edit/delete users

---

## 📱 **Projector Setup Guide**

### **Extended Display Mode (Recommended)**

1. **Connect Projector** to your laptop via HDMI/VGA
2. **Configure Display** (Windows: `Win+P`, Mac: System Preferences > Displays)
3. **Select "Extend"** - This creates a second screen
4. **Open Application** on your main monitor
5. **Click "Open Display"** - New window opens
6. **Drag window** to projector screen (second monitor)
7. **Press F11** for fullscreen
8. **Control everything** from your main laptop screen

### **Display Window Features**
- ✅ NO headers or navigation (clean projection)
- ✅ Large, readable fonts optimized for projection
- ✅ PowerPoint-style slide format
- ✅ Real-time updates from control panel
- ✅ Shows background when idle
- ✅ Works with both Bible and Songs

---

## 🎨 **Church Brand Colors**

The app uses Kebena Church official colors:
- **Primary Brown**: #865014
- **Gold**: #E0AE3F  
- **Light Cream**: #F6EBD8

---

## 🛠️ **Admin Features**

### **Song Management**

#### **Add Songs Manually**
1. Admin Panel → "Manual" tab
2. Fill in:
   - Song Number
   - Category (Hymnal or Local)
   - Amharic Title
   - English Title
   - Lyrics (separate slides with double line breaks)
3. Click "Add Song"

#### **Upload Songs from Files**
1. Admin Panel → "Upload" tab
2. Upload PDF or PPT/PPTX file
3. System extracts slides automatically
4. Review and edit extracted content
5. Add song details and save

#### **Edit Songs**
1. Admin Panel → "Manage" tab
2. Click edit icon next to song
3. Modify any field
4. Click "Save Changes"

#### **Delete Songs**
1. Admin Panel → "Manage" tab
2. Click trash icon next to song
3. Confirm deletion

### **User Management**

#### **Add New User**
1. Admin Panel → "Users" tab
2. Click "Add User"
3. Fill in:
   - Username
   - Full Name
   - Email
   - Password
   - Role (Admin or User)
4. Click save

#### **Edit User**
1. Find user in list
2. Click edit button
3. Modify details
4. Save changes

---

## 📋 **Complete Keyboard Shortcuts Reference**

### **Bible Control**
| Shortcut | Action |
|----------|--------|
| `Enter` | Display verse on projector |
| `P` | Preview only (no projector) |
| `Esc` | Clear all displays |
| `←` | Previous verse (auto-updates display) |
| `→` | Next verse (auto-updates display) |
| `↑` | Previous chapter |
| `↓` | Next chapter |
| `PgUp` | Previous book |
| `PgDn` | Next book |

### **Song Viewer**
| Shortcut | Action |
|----------|--------|
| `←` or `Left Arrow` | Previous slide |
| `→` or `Right Arrow` | Next slide |
| `Home` | First slide |
| `End` | Last slide |
| `Esc` | Close song viewer |

### **Display Window**
| Shortcut | Action |
|----------|--------|
| `Esc` | Clear display |
| `F11` | Toggle fullscreen |

---

## 💡 **Pro Tips**

1. **Practice Before Service**
   - Test Bible navigation with keyboard shortcuts
   - Try different backgrounds to see what works best
   - Practice switching between Bible and Songs

2. **Projector Optimization**
   - Use dark backgrounds with light text for better visibility
   - High-resolution images (1920x1080+) look best
   - Test font sizes from back of church

3. **Efficient Workflow**
   - Keep display window open on projector throughout service
   - Use keyboard shortcuts for quick navigation
   - Prepare commonly used verses/songs beforehand

4. **Backup Plan**
   - Popular verses (John 3, Psalms 23) work offline
   - Songs stored in database persist even without internet

---

## 🐛 **Troubleshooting**

### **Bible verses not loading**
- Check internet connection
- Try popular verses (John 3:16, Psalms 23) which work offline
- API may be temporarily down - offline verses available

### **Display window not showing on projector**
- Make sure projector is set to "Extend" mode (not "Mirror")
- Drag window manually to second screen
- Press F11 for fullscreen

### **Background not showing**
- Check URL is valid and accessible
- Try a preset background first
- Use HTTPS URLs for security

### **Songs not saving**
- Check backend connection
- Verify admin permissions
- Songs saved locally as fallback

---

## 📞 **Support**

For technical assistance:
- Check documentation files in project root
- Verify all components are properly installed
- Ensure Supabase connection is configured

---

## ✨ **New in This Version**

- ✅ **Full Amharic Bible API Integration** - All 66 books available
- ✅ **Bible Search Feature** - Search verses by keyword
- ✅ **Enhanced Keyboard Shortcuts** - Complete navigation with keyboard
- ✅ **Admin Background Control** - Easy image URL upload with presets
- ✅ **Clean Display Mode** - NO headers on projection screen
- ✅ **Auto-Update Display** - Arrow keys update display in real-time
- ✅ **Offline Fallback** - Popular verses work without internet

---

**🙏 May this tool serve your church worship services with excellence!**

**የቀበና ቤተክርስትያን የመዝሙር ማሳያ**
