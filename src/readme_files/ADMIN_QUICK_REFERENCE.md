# Admin Quick Reference Card
## Kebena Church Song Display System

---

## 🔐 Admin Login
- **Username:** `admin` or `pastor`
- **Password:** `admin123` or `pastor123`

---

## ➕ Adding Songs - Two Methods

### Method 1: 📁 Add from File (AUTOMATIC)
**Best for:** When you have PowerPoint/PDF files

1. Click **Admin Panel** → **Add from File** tab
2. Upload your PPT/PPTX/PDF file
3. Wait 2-3 seconds for automatic extraction
4. Review and edit the extracted slides
5. Fill in song details (number, title, category)
6. Click **Add Song**

✅ **Pros:**
- Automatic slide extraction
- Saves time
- Preserves original formatting

⚠️ **Note:** 
- PPTX files work best
- Some files may need manual editing
- Complex PDFs may require backend processing

---

### Method 2: ✍️ Add Manually
**Best for:** When typing from scratch or no file available

1. Click **Admin Panel** → **Add Manually** tab
2. Fill in song details (number, title, category)
3. Type lyrics in text area
4. **Separate slides with blank lines** (press Enter twice)
5. Click **Add Song**

✅ **Pros:**
- Full control over content
- No file needed
- Works for any source

---

## 🎨 How to Format Lyrics (Manual Entry)

```
First verse line 1
First verse line 2
First verse line 3

Second verse line 1
Second verse line 2

Chorus line 1
Chorus line 2
Chorus line 3
```

**Rule:** One blank line = New slide

---

## 🎨 Changing Background Colors

1. **Admin Panel** → **Settings** tab
2. Choose from presets:
   - Church Brown (#865014)
   - Church Gold (#E0AE3F)
   - Dark Blue
   - Deep Purple
   - Forest Green
   - Charcoal
3. Or use **Custom Color Picker**

---

## 🔍 Finding Songs Quickly

**Search works on:**
- Song number (e.g., `001`)
- Amharic title
- English title

**Tip:** Partial matches work! Type `እግዚ` to find all songs with እግዚአብሔር

---

## ⌨️ Presentation Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `Esc` | Exit presentation |

---

## 📋 Song Categories

1. **Hymnal (ውዳሴ)** - Traditional hymns
2. **Local Songs (ሀገርኛ)** - Contemporary worship

---

## 🔧 Troubleshooting

### Problem: PPTX file uploaded but shows placeholder text
**Solution:** 
- The system tried but couldn't extract text properly
- Edit the placeholder slides manually
- Or use "Add Manually" method instead

### Problem: Songs disappear after page refresh
**Solution:**
- This is expected (browser memory only)
- To save permanently: Set up MySQL/XAMPP backend
- See `DATABASE_SETUP.md`

### Problem: Can't see uploaded file content
**Solution:**
- For PPTX: System will attempt automatic extraction
- For PDF/PPT: May need backend processing
- Edit extracted slides as needed

---

## ✅ Pre-Service Checklist

- [ ] Test projection setup
- [ ] Load all songs for today's service
- [ ] Test each song in presentation mode
- [ ] Check background color setting
- [ ] Practice slide navigation
- [ ] Have backup plan (printed lyrics)

---

## 📊 File Support Status

| File Type | Auto-Extraction | Status |
|-----------|----------------|---------|
| PPTX | ✅ Yes | Works well in browser |
| PPT | ⚠️ Limited | Needs backend for best results |
| PDF | ⚠️ Limited | Needs backend for best results |

**Recommendation:** Convert PPT to PPTX for best results

---

## 🎯 Best Practices

1. **Use consistent song numbering**
   - Hymnal: 001-999
   - Local: 001-999 (separate)

2. **Always test songs before service**
   - Check slide breaks
   - Verify all text is visible
   - Test navigation

3. **Backup your work**
   - Keep original files
   - Set up database for persistence
   - Document song list

4. **Name files clearly**
   - Example: `001_Amazing_Grace.pptx`
   - Helps with organization

---

## 🆘 Quick Help

**Issue:** Button not visible
**Fix:** All buttons now use church colors - clearly visible

**Issue:** Need to edit a song
**Fix:** Click Edit icon on song card (hover to see)

**Issue:** Want to delete a song
**Fix:** Click trash icon on song card, confirm deletion

**Issue:** File upload not working
**Fix:** Ensure file is PPT/PPTX/PDF, max size reasonable

---

## 📱 Contact

**For technical support:**
Contact your church IT administrator

**For feature requests:**
Document in church IT request system

---

**App Version:** 1.0  
**Last Updated:** December 2024  
**Church:** Kebena Seventh-Day Adventist Church

---

## 🎨 Brand Colors Reference

- **Church Brown:** #865014 (Primary)
- **Church Gold:** #E0AE3F (Accent)
- **Church Cream:** #F6EBD8 (Background)

---

## 💡 Pro Tips

1. **Use "Add from File" for bulk imports**
   - Faster for multiple songs
   - Maintains consistency

2. **Use "Add Manually" for quick fixes**
   - When file isn't available
   - For short songs/choruses

3. **Review extracted slides before saving**
   - System may split slides differently
   - Adjust as needed

4. **Keep original files backed up**
   - Store in organized folder
   - Name files consistently

5. **Test on actual projection before service**
   - Check font size readability
   - Verify colors work well
   - Practice navigation timing

---

**Print this card and keep near your worship tech station!**
