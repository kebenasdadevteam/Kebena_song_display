# Kebena Church Song Display - New Features

## Overview
This document outlines the new features added to the Kebena Church Song Display application:
- **Dual Storage System** (Database + LocalStorage)
- **XML Hymnal Import** (325 songs)
- **Mobile Control & Sync** (WebSocket-based)

## Features

### 1. Dual Storage System

The application now uses a smart dual-storage system that:
- **Saves to both database and localStorage** when adding/editing/deleting songs
- **Tries database first**, then falls back to localStorage when fetching songs
- **Works offline** - if XAMPP is not running, songs are saved to localStorage only
- **Auto-syncs** - when database connection is restored, local songs can be synced

#### How It Works:
- When you add a song → Saves to localStorage (always) + Database (if available)
- When you load songs → Tries database first → Falls back to localStorage if DB unavailable
- When database comes back online → You can manually sync local songs to database

#### Files:
- `/services/dualStorage.ts` - Main dual storage service
- Updated `/App.tsx` - Uses dualStorageService instead of direct API calls

### 2. XML Hymnal Import

Import the complete hymnal songbook (325 songs) from an XML file.

#### How To Use:
1. Click **"Import XML"** button in the header (admin only)
2. Select the XML file (`new_hymnal_song_-_Final.xml`)
3. Wait for parsing and import
4. Songs are saved to both localStorage and database (if available)

#### XML Format Supported:
```xml
<resources>
  <string-array name="hymnal_Song">
    <item>
      <page>
        <line>Line 1 of slide 1</line>
        <line>Line 2 of slide 1</line>
      </page>
      <page>
        <line>Line 1 of slide 2</line>
      </page>
    </item>
  </string-array>
</resources>
```

#### Files:
- `/utils/xmlParser.ts` - XML parsing utility
- `/components/XMLImporter.tsx` - XML import UI component
- `/imports/new_hymnal_song_-_Final.xml` - Source XML file with 325 hymnal songs

### 3. Mobile Control & Sync

Control the church display from multiple devices (phones, tablets, computers) with real-time sync.

#### Features:
- **QR Code** - Scan to open control panel on mobile devices
- **Room-based** - Multiple devices can join the same room
- **Real-time Sync** - Sync current song to all connected devices
- **Works Offline** - Chat and local features work without WebSocket server
- **Device Counter** - See how many control/display devices are connected

#### How To Use:
1. Click **"Mobile"** button in the header
2. Share the Control URL or QR code with other devices
3. Open Display URL on projector screen
4. Use "Sync to All Devices" to send current song to all devices

#### WebSocket Setup (Optional):
If you want real-time sync across devices, run the WebSocket server:

```bash
cd kebena_backend
node src/websocket-server.js
```

The server will run on `ws://localhost:8080` by default.

Without the WebSocket server:
- Chat still works using BroadcastChannel (same browser, different tabs)
- Sync features require the server to work

#### Files:
- `/hooks/useWebSocket.ts` - WebSocket React hook
- `/components/MobileControl.tsx` - Mobile control dialog
- `/imports/websocket-server.js` - WebSocket server (optional)

## Database vs LocalStorage

### When Database is Available (XAMPP Running):
- ✅ Songs saved to MySQL database
- ✅ Songs also backed up to localStorage
- ✅ All devices can access the same songs
- ✅ Data persists even if localStorage is cleared

### When Database is NOT Available (XAMPP Not Running):
- ✅ Songs saved to localStorage only
- ✅ App still works fully
- ✅ Songs persist in browser
- ⚠️ Each device has its own songs
- ⚠️ Clearing browser data removes songs

### Best Practice:
1. **Development**: Use localStorage (no XAMPP needed)
2. **Production**: Use database (start XAMPP before using app)
3. **Backup**: Export songs from database periodically

## Quick Start

### Import Hymnal Songs:
1. Login as admin
2. Click "Import XML"
3. Select `/imports/new_hymnal_song_-_Final.xml`
4. Wait for import (325 songs)
5. Done! Songs are now in localStorage (and database if running)

### Use Mobile Control:
1. Click "Mobile" button
2. Scan QR code with phone
3. Control app from phone
4. Open Display URL on projector
5. Sync songs across all devices

### Check Storage Mode:
- **Database mode**: Toast says "Songs loaded from database"
- **LocalStorage mode**: Toast says "Using local storage"
- **Sample data mode**: Toast says "Using sample data" (no songs found)

## API Changes

### Old Way (Direct API):
```typescript
await songAPI.createSong(songData);
await songAPI.getAllSongs();
```

### New Way (Dual Storage):
```typescript
await dualStorageService.addSong(songData);
await dualStorageService.getAllSongs();
```

The dual storage service automatically handles:
- Saving to both localStorage and database
- Falling back to localStorage if database unavailable
- Returning songs from best available source

## Troubleshooting

### Songs not saving to database:
- ✅ Check if XAMPP is running
- ✅ Check MySQL service is started
- ✅ Check `kebena_church_db` database exists
- ✅ Songs are still saved to localStorage as backup

### Mobile control not syncing:
- ✅ Check if WebSocket server is running (`node src/websocket-server.js`)
- ✅ Check port 8080 is not blocked
- ✅ Chat still works without server (same browser only)

### XML import fails:
- ✅ Check XML file format matches expected structure
- ✅ Check console for parsing errors
- ✅ Try smaller XML file first to test

## Files Modified

### New Files:
- `/services/dualStorage.ts` - Dual storage service
- `/utils/xmlParser.ts` - XML parser
- `/hooks/useWebSocket.ts` - WebSocket hook
- `/components/MobileControl.tsx` - Mobile control UI
- `/components/XMLImporter.tsx` - XML importer UI

### Modified Files:
- `/App.tsx` - Integrated new features
- `/types.ts` - Added Song interface

### Unchanged:
- `/components/AdminPanel.tsx` - No changes (still works)
- `/components/SongViewer.tsx` - No changes (still works)
- `/components/SongList.tsx` - No changes (still works)
- Database schema - No changes needed

## Future Enhancements

Possible improvements:
1. **Auto-sync**: Automatically sync localStorage to database when connection restored
2. **Export**: Export songs from localStorage to XML/JSON
3. **Conflict Resolution**: Handle conflicts when same song edited on multiple devices
4. **Offline Queue**: Queue database operations when offline, execute when online
5. **Progressive Web App**: Make app installable on mobile devices

## Questions?

If you have questions about these new features:
1. Check this README
2. Check console logs for errors
3. Check browser's Application tab → LocalStorage to see stored songs
4. Check MySQL database to see database songs
