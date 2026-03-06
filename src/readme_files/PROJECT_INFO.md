# Kebena Church Song Display System

## Overview
A web-based song display application for Kebena Church with split-screen layout for Hymnal (ውዳሴ) and Local Songs (ሀገርኛ), featuring user authentication and role-based access control.

## Features

### Authentication System
- **Login Required**: All users must log in with username and password
- **Role-Based Access**: 
  - **Admin**: Can add, edit, delete songs, and change display settings
  - **Regular User**: Can only view and present songs

### Demo Credentials

**Admin Accounts:**
- Username: `admin` / Password: `admin123`
- Username: `pastor` / Password: `pastor123`

**Regular User:**
- Username: `user` / Password: `user123`

### Song Management
- **Two Categories**: Hymnal (ውዳሴ) and Local Songs (ሀገርኛ)
- **Search Functionality**: Search by song number, Amharic title, or English title
- **Presentation Mode**: Full-screen PPT-style viewer with:
  - Slide navigation (Next/Previous)
  - Auto-play with 5-second intervals
  - Dark/Light theme toggle
  - Keyboard shortcuts (Arrow keys, Space, Esc)
  - Slide indicators

### Admin Features
- **Add New Songs**: Manual text input with slide creation
- **Delete Songs**: Remove songs from the library
- **Display Settings**: Customize presentation background colors
- **Background Presets**: 6 pre-configured color schemes
- **Custom Colors**: Color picker for custom backgrounds

### User Interface
- **Split-Screen Layout**: Hymnal on left, Local Songs on right
- **Responsive Design**: Proper scrolling and overflow handling
- **Toast Notifications**: Success/error messages for all actions
- **Bilingual**: English and Amharic (የአማርኛ) support

## Technical Details

### Song Data Structure
```typescript
{
  id: number;
  number: string;          // e.g., "001"
  category: 'hymnal' | 'local';
  titleAmharic: string;
  titleEnglish: string;
  lyrics: string[];        // Array of slides
  metadata: {
    creator: string;
    uploader: string;
    updatedDate: string;
  }
}
```

### Adding Songs
1. Login as admin
2. Click "Admin Panel"
3. Fill in song details:
   - Song number
   - Category (Hymnal or Local)
   - Amharic title
   - English title
   - Lyrics (separate slides with double line breaks)
4. Submit

### Keyboard Shortcuts (Presentation Mode)
- `→` (Right Arrow): Next slide
- `←` (Left Arrow): Previous slide
- `Space`: Toggle auto-play
- `Esc`: Close viewer

## Future Enhancements
- PDF/PPT file upload support
- Background image uploads
- Font customization
- Logo placement
- User account management
- Persistent data storage (requires backend)
- Version control for song edits
- Schedule songs for services
