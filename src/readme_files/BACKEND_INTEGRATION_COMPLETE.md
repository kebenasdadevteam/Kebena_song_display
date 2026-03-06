# ✅ Backend Integration Complete!

Your frontend is now fully integrated with the backend for **real PPTX file processing**!

## 🎉 What's New

### Backend-Powered File Upload
- ✅ Frontend now calls the backend API for file upload
- ✅ Real PPTX/PDF text extraction on the server
- ✅ Files saved to backend `uploads/` folder
- ✅ Automatic slide extraction using `officeparser` library
- ✅ No more placeholder text!

### Files Created/Updated

**New Files:**
- `/services/api.ts` - API service layer for backend communication

**Updated Files:**
- `/components/AdminPanel.tsx` - Now uses backend API for file upload
- `/kebena_backend/src/utils/fileProcessor.js` - Improved extraction logic

## 🚀 How to Test

### 1. Start Backend (Required!)

```bash
# Terminal 1 - Backend
cd kebena_backend
npm start
```

Wait for: `✅ Server is ready to accept requests`

### 2. Start Frontend

```bash
# Terminal 2 - Frontend (your main project)
npm start
```

### 3. Test File Upload

1. **Login** as admin (username: `admin`, password: `admin123`)
2. **Click "Admin Panel"**
3. **Go to "Add from File" tab**
4. **Upload a PPTX file**
5. **Watch the magic!** ✨
   - File uploads to backend
   - Backend extracts text from slides
   - Extracted slides appear in editable text boxes
   - You can edit before saving

## 📁 Where Files Are Saved

Uploaded files are stored in:
```
kebena_backend/
  uploads/
    ppts/      # PowerPoint files (.ppt, .pptx)
    pdfs/      # PDF files
    images/    # Images (future feature)
```

## 🔍 Troubleshooting

### Error: "File upload failed" or "Make sure backend is running"

**Problem:** Frontend can't reach backend

**Solutions:**
1. **Check backend is running:**
   ```bash
   # Visit in browser:
   http://localhost:5000/health
   
   # Should show:
   {"success": true, "message": "Kebena Church API is running"}
   ```

2. **Check CORS settings** in `kebena_backend/.env`:
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Check API URL** in `/services/api.ts`:
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

### Error: "No text content found in file"

**Problem:** PPTX file has no extractable text

**Solutions:**
- Make sure text is not in images
- Try a different PPTX file
- Check if text is formatted as text (not shapes)

### Upload works but shows empty slides

**Problem:** Text extraction logic needs tuning

**Solution:**
- Check backend console logs
- Look for: `Extracted text from PowerPoint: ...`
- If text appears but no slides, adjust splitting logic

## 🎯 Test Checklist

Test these scenarios:

- [ ] Upload .pptx file - should extract slides
- [ ] Upload .pdf file - should extract content
- [ ] Edit extracted slides before saving
- [ ] Save song with extracted slides
- [ ] Verify file saved in `kebena_backend/uploads/ppts/`
- [ ] Check phpMyAdmin - song should be in database

## 📊 How It Works

### Upload Flow

```
1. User selects file in Admin Panel
   ↓
2. Frontend calls songAPI.uploadFile(file)
   ↓
3. File sent to backend POST /api/songs/upload
   ↓
4. Backend saves file to uploads/ppts/
   ↓
5. Backend extracts text using officeparser
   ↓
6. Backend splits text into slides
   ↓
7. Backend sends slides back to frontend
   ↓
8. Frontend displays slides in editable boxes
   ↓
9. User reviews/edits slides
   ↓
10. User fills in song details and saves
   ↓
11. Song saved to MySQL database
```

### Tech Stack

**Frontend:**
- React component (AdminPanel)
- API service layer (/services/api.ts)
- Toast notifications (Sonner)

**Backend:**
- Express.js API
- Multer (file upload middleware)
- officeparser (PPTX text extraction)
- pdf-parse (PDF text extraction)
- MySQL database

## 🎨 User Experience

### Before (Browser Processing)
- Upload file
- Shows: "Slide 1 content will appear here After backend processing"
- Placeholder text
- Not helpful

### After (Backend Processing)
- Upload file
- Shows: "Uploading file... Processing filename.pptx"
- Shows: "File processed successfully! Extracted 5 slides from filename.pptx"
- **Real extracted content** in editable boxes!
- **Actual song lyrics** ready to use!

## 🔧 Advanced Configuration

### Adjust Slide Splitting

Edit `/kebena_backend/src/utils/fileProcessor.js`:

```javascript
// Change slide splitting logic
.split(/\n{3,}/)  // Currently: 3+ newlines = new slide

// Options:
.split(/\n{2,}/)  // 2+ newlines (more slides)
.split(/\n{4,}/)  // 4+ newlines (fewer slides)
```

### File Size Limit

Edit `/kebena_backend/.env`:

```env
MAX_FILE_SIZE=10485760  # 10MB (current)
MAX_FILE_SIZE=20971520  # 20MB
MAX_FILE_SIZE=52428800  # 50MB
```

### Supported File Types

Currently supported:
- ✅ .pptx (PowerPoint 2007+) - **Best results**
- ✅ .ppt (PowerPoint 97-2003) - Good results
- ✅ .pdf (PDF documents) - Basic results

## 🎓 For Developers

### API Endpoint

**POST** `/api/songs/upload`

**Request:**
```javascript
FormData {
  file: <File object>
}
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "file": {
    "filename": "song-1701234567890.pptx",
    "originalFilename": "Amazing Grace.pptx",
    "filePath": "uploads/ppts/song-1701234567890.pptx",
    "fileType": "pptx",
    "fileSize": 25678,
    "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  },
  "extraction": {
    "slides": [
      "Amazing Grace, how sweet the sound\nThat saved a wretch like me",
      "I once was lost, but now am found\nWas blind but now I see"
    ],
    "slideCount": 2
  }
}
```

### Frontend Code

```typescript
// Upload file
const response = await songAPI.uploadFile(file);

// Get extracted slides
const slides = response.extraction.slides.map((content, index) => ({
  slideNumber: index + 1,
  content
}));

// Display to user for review/edit
```

## 🎉 Success!

You now have:

✅ Real backend file processing  
✅ Automatic PPTX text extraction  
✅ PDF support  
✅ File storage in backend  
✅ Database integration  
✅ Editable extracted slides  
✅ Professional error handling  

## 📝 Next Steps

1. **Test with your church's PPTX files**
2. **Fine-tune extraction logic** if needed
3. **Add more songs** to build your library
4. **Consider production deployment** when ready

## 🆘 Need Help?

1. Check backend console logs
2. Check browser console (F12)
3. Verify both servers are running
4. Test API directly: http://localhost:5000/health

---

**Enjoy your fully functional backend-powered file upload system!** 🚀

May this tool bless your church's worship services! 🙏
