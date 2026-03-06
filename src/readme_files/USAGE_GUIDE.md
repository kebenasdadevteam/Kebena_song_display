# Kebena Seventh-Day Adventist Church - Song Display App User Guide

## Overview
This application helps manage and display worship songs during church services with a professional presentation interface.

## Login Credentials

### Admin Accounts (Full Access)
- **Username:** `admin` / **Password:** `admin123`
- **Username:** `pastor` / **Password:** `pastor123`

### Regular User Account (View Only)
- **Username:** `user` / **Password:** `user123`

## Features

### For All Users
✅ Browse songs in two categories:
  - **Hymnal (ውዳሴ)** - Traditional hymns
  - **Local Songs (ሀገርኛ)** - Contemporary worship songs

✅ Search songs by:
  - Song number
  - Amharic title
  - English title

✅ View songs in full-screen presentation mode
✅ Navigate slides using keyboard shortcuts or on-screen buttons
✅ Professional PPT-style display optimized for projection

### For Admin Users Only
✅ Add new songs (with PDF/PPT file upload support)
✅ Edit existing songs
✅ Delete songs
✅ Change presentation background colors
✅ Manage display settings

## How to Add a Song (Admin Only)

### Option 1: Add from File (Recommended)

This option automatically extracts slides from your PDF/PPT/PPTX files.

#### Step 1: Open Admin Panel
1. Login as admin
2. Click the "Admin Panel" button in the header
3. Select "Add from File" tab

#### Step 2: Upload File
1. Click the upload area or drag and drop your file
2. Supported formats: PDF, PPT, PPTX
3. Wait for the system to process the file (2-3 seconds)
4. The system will automatically extract slides from your presentation

#### Step 3: Review Extracted Slides
1. The system displays all detected slides
2. Click on any slide to edit its content
3. Add or remove text as needed
4. Each slide can be edited independently

#### Step 4: Fill Song Details
1. **Song Number:** Enter the song number (e.g., 001, 200)
2. **Category:** Select Hymnal (ውዳሴ) or Local Song (ሀገርኛ)
3. **Amharic Title:** የአማርኛ ርዕስ
4. **English Title:** English title

#### Step 5: Save
- Click "Add Song" button
- The song will appear in the appropriate category with all slides

### Option 2: Add Manually

This option lets you type in all the song details yourself.

#### Step 1: Open Admin Panel
1. Login as admin
2. Click the "Admin Panel" button in the header
3. Select "Add Manually" tab

#### Step 2: Fill Song Details
1. **Song Number:** Enter the song number (e.g., 001, 200)
2. **Category:** Select Hymnal (ውዳሴ) or Local Song (ሀገርኛ)
3. **Amharic Title:** የአማርኛ ርዕስ
4. **English Title:** English title

#### Step 3: Enter Lyrics
- Type or paste your song lyrics in the text area
- **Important:** Separate each slide with a blank line (press Enter twice)
- Example:
  ```
  First verse goes here
  Multiple lines are okay
  
  Second verse goes here
  This will be a new slide
  
  Chorus goes here
  Another slide
  ```

#### Step 4: Save
- Click "Add Song" button
- The song will appear in the appropriate category

## Keyboard Shortcuts (Presentation Mode)

- **→** (Right Arrow) or **Space** - Next slide
- **←** (Left Arrow) - Previous slide
- **Esc** - Close presentation and return to song list

## Changing Background Colors (Admin Only)

1. Open Admin Panel
2. Go to "Display Settings" tab
3. Choose from preset colors:
   - Church Brown
   - Church Gold
   - Dark Blue
   - Deep Purple
   - Forest Green
   - Charcoal
4. Or use custom color picker

## Search Tips

### Searching by Number
- Type just the number: `001`, `200`, etc.
- Partial numbers work: typing `20` will find 200, 201, 202, etc.

### Searching by Title
- Works in both Amharic and English
- Case-insensitive
- Partial matches work

### Examples
- Search `እግዚ` finds all songs with እግዚአብሔር
- Search `lord` finds "The Lord is My Shepherd"
- Search `001` finds song #001

## Church Branding

The app uses official Kebena Seventh-Day Adventist Church colors:
- **Church Brown:** #865014
- **Church Gold:** #E0AE3F
- **Church Cream:** #F6EBD8

## Data Persistence

⚠️ **Important:** Currently, all data is stored in browser memory. This means:
- Songs are lost when you refresh the page
- User accounts are mock accounts (not real database)
- Uploaded files are not permanently stored

To enable permanent storage, you need to connect to MySQL/XAMPP. See `DATABASE_SETUP.md` for instructions.

## Troubleshooting

### Q: How does the "Add from File" feature work?
**A:** When you upload a PPTX file:
1. The system reads the file content
2. Extracts text from each slide automatically
3. Groups the text into editable slides
4. You can review and edit each slide before saving
5. For best results with PDF/PPT files, connect to MySQL/XAMPP backend for advanced processing

### Q: My PPTX file uploaded but shows placeholder text
**A:** This means the system had difficulty extracting text. This can happen if:
- The file has complex formatting
- Text is embedded in images
- Special fonts are used
- Backend processing is needed for better extraction

**Solution:** You can still edit the placeholder slides and replace with actual content, or use "Add Manually" option.

### Q: What's the difference between "Add from File" and "Add Manually"?
**A:** 
- **Add from File:** Upload your presentation file and the system tries to extract slides automatically. Best for PPTX files.
- **Add Manually:** Type everything yourself. Best when you don't have a file or prefer full control.

### Q: I added a song but it disappeared after refresh
**A:** Data is stored in browser memory only. To persist data, connect to MySQL/XAMPP backend.

### Q: The buttons are not visible
**A:** This has been fixed! All buttons now use the church brand colors and are clearly visible.

### Q: How do I backup my songs?
**A:** Currently, there's no export feature. To keep songs permanently:
1. Set up MySQL/XAMPP backend (see DATABASE_SETUP.md)
2. Or manually save lyrics in a text document

### Q: Can multiple people use this at the same time?
**A:** Not currently. This is a single-user application. For multi-user support, you need:
1. MySQL/XAMPP backend
2. Network connection
3. Proper server hosting

## Best Practices

### For Song Entry
- Always fill all required fields
- Use consistent song numbering
- Add blank lines between slides for better readability
- Test the song in presentation mode before the service

### For Presentations
- Test projection setup before service
- Keep background dark for better readability
- Use high-contrast colors
- Practice slide navigation

### For File Organization
- Keep original PDF/PPT files backed up separately
- Use clear, consistent naming for songs
- Organize files by category

## Support & Updates

For technical support or feature requests, contact your IT administrator.

## License
This application is for Kebena Seventh-Day Adventist Church internal use only.

---

**Version:** 1.0  
**Last Updated:** December 2024  
**Developed for:** Kebena Seventh-Day Adventist Church