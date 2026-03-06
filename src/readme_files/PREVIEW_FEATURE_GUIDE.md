# 📋 Preview Feature - Complete Guide

## ✨ Good News: Preview is Already Built-In!

The preview feature you requested is already fully implemented! When you upload a PPT or PDF file, the system automatically shows you all extracted slides for review and editing **before** saving to the database.

---

## 🎯 How the Preview Works

### Upload Flow with Preview:

```
1. Admin clicks "Upload" tab
   ↓
2. Admin selects PPT/PDF file
   ↓
3. File uploads to backend
   ↓
4. Backend extracts all slides
   ↓
5. ✨ PREVIEW APPEARS ✨
   ↓
6. Admin can:
   - View all extracted slides
   - Edit any slide content
   - Fix formatting issues
   - Add missing text
   ↓
7. Admin fills in song metadata
   ↓
8. Admin clicks "Add Song"
   ↓
9. Song saved to database!
```

---

## 🖼️ What You See in Preview

When a file is uploaded, you'll see a screen like this:

### File Information Card
```
┌──────────────────────────────────────────┐
│  ✓  my-church-song.pptx                  │
│     5 slides extracted • 245.67 KB       │
│                                      [X] │
└──────────────────────────────────────────┘
```

### Song Details Form
```
┌─────────────────────────────────────────┐
│ Song Number: [001              ]        │
│ Category:    [Hymnal ▼         ]        │
│ Amharic Title: [የዘወትር መዝሙር    ]        │
│ English Title: [Daily Hymn      ]        │
└─────────────────────────────────────────┘
```

### Extracted Slides (PREVIEW)
```
Extracted Slides (Click to edit)

┌─────────────────────────────────────────┐
│ Slide 1                                 │
│ ┌─────────────────────────────────────┐ │
│ │ የእግዚአብሔር ልጆች                      │ │
│ │ Children of God                     │ │
│ │                                     │ │
│ │ [Click to edit this slide]          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Slide 2                                 │
│ ┌─────────────────────────────────────┐ │
│ │ በእግዚአብሔር ስም እንሄዳለን                 │ │
│ │ In the name of God we go           │ │
│ │                                     │ │
│ │ [Click to edit this slide]          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Slide 3                                 │
│ ┌─────────────────────────────────────┐ │
│ │ [Editable text area...]             │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

... (all slides shown)

[Cancel]  [Add Song (5 slides)]
```

---

## ✏️ How to Edit Slides in Preview

### 1. Click on Any Slide
- Click inside the text area of any slide
- The cursor appears and you can type

### 2. Edit the Content
- Add missing words
- Fix formatting
- Add line breaks
- Remove unwanted text
- Copy/paste corrected text

### 3. Changes Are Instant
- Your edits update immediately
- No need to save individually
- All edits preserved when you click "Add Song"

### Example Editing:

**Before Edit:**
```
┌─────────────────────────────────────┐
│ Slide 1                             │
│ Ygzabher ljoch                      │
│ Children f God                      │
└─────────────────────────────────────┘
```

**After Edit:**
```
┌─────────────────────────────────────┐
│ Slide 1                             │
│ የእግዚአብሔር ልጆች                      │
│ Children of God                     │
└─────────────────────────────────────┘
```

---

## 🎬 Step-by-Step Example

### Scenario: Adding "Amazing Grace" from PPT

#### Step 1: Upload File
1. Go to Admin Panel → Upload tab
2. Click or drag "Amazing-Grace.pptx"
3. File uploads (you see spinner)

#### Step 2: Preview Appears
You see:
```
✓ Amazing-Grace.pptx
  4 slides extracted • 123.45 KB
```

#### Step 3: Review Extracted Slides
```
Slide 1:
┌────────────────────────────┐
│ Amaing Grae                │ ← Typo!
│ How sweet the sound        │
└────────────────────────────┘

Slide 2:
┌────────────────────────────┐
│ That saved a wretch likeme │ ← Space missing!
└────────────────────────────┘

Slide 3:
┌────────────────────────────┐
│ I once was lost            │ ← Looks good!
│ But now I'm found          │
└────────────────────────────┘

Slide 4:
┌────────────────────────────┐
│ Was blind but now I see    │ ← Looks good!
└────────────────────────────┘
```

#### Step 4: Edit Problems
Click Slide 1, fix to:
```
Amazing Grace
How sweet the sound
```

Click Slide 2, fix to:
```
That saved a wretch like me
```

#### Step 5: Fill Song Details
```
Song Number: 123
Category: Hymnal
Amharic Title: አስደናቂ ጸጋ
English Title: Amazing Grace
```

#### Step 6: Add Song
Click "Add Song (4 slides)" button

#### Step 7: Success!
- ✅ Song saved to database with corrections
- ✅ Toast: "Song added successfully!"
- ✅ Song appears in Hymnal list
- ✅ All slides display correctly

---

## 🔄 Three Ways to Preview Files

### Method 1: Direct Upload (Recommended)
**Location:** Admin Panel → Upload tab

**Steps:**
1. Click upload area or drag file
2. File processes automatically
3. Preview appears immediately
4. Edit and save

**Best for:** Quick single file uploads

### Method 2: Auto-Detect
**Location:** Admin Panel → Auto-Detect tab

**Steps:**
1. Place files in `/kebena_backend/uploads/`
2. Click "Scan Folder"
3. See list of all files
4. Click "Process" on any file
5. Preview appears
6. Edit and save

**Best for:** Batch processing multiple files

### Method 3: Manual Entry (No Preview)
**Location:** Admin Panel → Manual tab

**Steps:**
1. Type all content manually
2. No file upload needed
3. No preview (you type the final content)

**Best for:** Songs without digital files

---

## 🛠️ Preview Features

### What You Can Do:

✅ **View All Slides**
- See every slide extracted from file
- Scroll through all content
- Check formatting

✅ **Edit Any Slide**
- Click to edit
- Type corrections
- Copy/paste text
- Add line breaks

✅ **See Slide Count**
- "5 slides extracted"
- Know how many slides you're adding

✅ **Check File Info**
- Filename displayed
- File size shown
- File type badge (PDF/PPTX)

✅ **Preview Before Saving**
- Nothing saved until you click "Add Song"
- Cancel anytime
- Make unlimited edits

✅ **Add Metadata**
- Song number
- Category (Hymnal/Local)
- Amharic title
- English title

### What Happens Behind the Scenes:

1. **File Upload:**
   - File sent to backend
   - Saved in `/kebena_backend/uploads/`

2. **Processing:**
   - Backend extracts text from each slide
   - Returns array of slide contents
   - Frontend displays in text areas

3. **Editing:**
   - Changes stored in frontend state
   - Not saved to database yet
   - Allows free editing

4. **Saving:**
   - All slides saved as JSON array
   - Metadata added
   - Inserted into database
   - File reference stored

---

## 📊 Extraction Quality

### PPT/PPTX Files:
- ✅ Text extraction works well
- ✅ Maintains line breaks
- ✅ Preserves slide order
- ⚠️ May need formatting fixes
- ⚠️ Images not extracted (text only)

### PDF Files:
- ✅ Text extraction works
- ✅ Multi-page supported
- ⚠️ May need more editing
- ⚠️ Complex layouts need review

### Why Preview is Essential:
- Automated extraction isn't perfect
- Different file formats vary
- Amharic text may need correction
- You can fix issues before saving
- No need to delete and re-upload

---

## 🎨 UI Elements in Preview

### File Status Card (Green)
```
┌────────────────────────────────────┐
│ ✓  my-song.pptx           [Remove] │
│    5 slides • 245 KB               │
└────────────────────────────────────┘
```

### Processing Indicator
```
┌────────────────────────────────────┐
│ ⟳  my-song.pptx                    │
│    Processing file...              │
└────────────────────────────────────┘
```

### Slide Editor (Each Slide)
```
┌────────────────────────────────────┐
│ Slide 3                            │
│ ┌────────────────────────────────┐ │
│ │                                │ │
│ │  [Editable textarea - 4 rows]  │ │
│ │                                │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### Action Buttons
```
[Cancel]  [Add Song (5 slides)]
   ↑             ↑
   |             |
   |             └─ Shows slide count
   └─ Discard and start over
```

---

## 💡 Pro Tips

### Tip 1: Check All Slides
- Scroll through entire preview
- Extraction quality varies by slide
- First slide often has title formatting

### Tip 2: Fix Common Issues
- **Spacing:** Add spaces between words
- **Line breaks:** Press Enter for new lines  
- **Amharic:** Copy/paste correct characters
- **Special chars:** Type manually if garbled

### Tip 3: Use Consistent Formatting
- Same style for all slides
- Consistent line spacing
- Match existing songs format

### Tip 4: Save Often
- Don't spend too long editing
- Can always edit song later
- "Manage Songs" tab for editing

### Tip 5: Test First
- Upload one test song first
- Verify extraction quality
- Check how it displays in viewer

---

## ✅ Verification Steps

After adding a song with preview:

### 1. Check Song List
- Logout and login
- Song appears in correct category
- Title displays correctly

### 2. View Song
- Click on song
- All slides display properly
- Navigate through slides
- Check formatting

### 3. Check Database
- Open phpMyAdmin
- Go to `songs` table
- Find your song
- Verify slide count matches

### 4. Test Editing
- Admin Panel → Manage Songs
- Edit the song
- Verify all slides editable

---

## 🔧 Troubleshooting Preview

### Preview Not Showing?
**Check:**
- Backend is running
- File uploaded successfully
- No errors in console (F12)
- File is valid PPT/PDF

### Slides Look Wrong?
**Normal!** That's why preview exists:
- Click each slide to fix
- Edit text directly
- Fix before saving

### Can't Edit Slides?
**Check:**
- Click inside text area
- Text area has focus
- Not in read-only mode
- Try different slide

### Preview Too Small?
- Scroll down to see all slides
- Each slide has text area
- Maximum height with scroll

---

## 📝 Summary

The preview feature is **fully working** and provides:

1. ✅ **Complete slide preview** - See all extracted content
2. ✅ **Inline editing** - Fix any issues before saving
3. ✅ **Real-time updates** - Changes reflected immediately
4. ✅ **Metadata input** - Add song details
5. ✅ **Confirmation** - Nothing saved until you approve
6. ✅ **Cancellation** - Discard and start over anytime

**You have full control over content before it enters your database!**

---

## 🎉 Enjoy Your Preview Feature!

The preview system ensures:
- No bad data in database
- Quality control before saving
- Easy correction of extraction errors
- Professional song management

**Upload a file now and see it in action!** 🚀
