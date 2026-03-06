# Bible API Integration Guide

## Overview
The Kebena Church Song Display Web App now integrates with the **Open Amharic Bible API** to provide real-time Bible verse access during worship services.

## API Details

### Base URL
```
https://openamharicbible.vercel.app/api/am
```

### Available Endpoints

1. **List All Books**
   ```
   GET /books
   ```
   Returns a list of all available Bible books.

2. **Get Chapter Verses**
   ```
   GET /books/:book/chapters/:chapter
   ```
   Returns all verses in a specific chapter.
   
   Example:
   ```bash
   GET /books/ዘፍ/chapters/1
   # or with full name
   GET /books/ኦሪት ዘፍጥረት/chapters/1
   ```

3. **Get Single Verse**
   ```
   GET /books/:book/chapters/:chapter/:verse
   ```
   Returns a specific verse.
   
   Example:
   ```bash
   GET /books/ዘፍ/chapters/1/4
   ```

4. **Search Bible**
   ```
   GET /search?q=keyword&limit=5&book=ዘፍ&testament=old
   ```
   Search for verses containing specific keywords.

## Implementation

### Service Layer (`/services/bibleService.ts`)

The `BibleService` class provides:

- **`getChapterVerses(version, book, chapter)`** - Fetches all verses for a chapter
- **`getVerse(version, book, chapter, verse)`** - Fetches a single verse
- **`getVerseRange(version, book, chapter, start, end)`** - Fetches a range of verses
- **`search(query, options)`** - Searches the Bible for keywords
- **Caching** - API responses are cached to reduce network calls

### Book Mappings

The service includes mappings between English book names, Amharic names, and API abbreviations:

```typescript
{
  name: 'Genesis',
  nameAmharic: 'ዘፍጥረት',
  abbreviation: 'ዘፍ',
  chapters: 50
}
```

All 66 books of the Bible are mapped (39 Old Testament + 27 New Testament).

### Components

**BibleControl.tsx**
- User interface for selecting Bible verses
- Displays book, chapter, and verse selectors
- Shows loading states during API calls
- Preview panel for selected verses
- Integration with display state service for projection

**BibleDisplay.tsx**
- Full-screen projection display
- Shows selected verses with references
- Synchronized with control panel via Supabase

## Features

✅ **Real-time verse loading** from the Amharic Bible API
✅ **Caching** to improve performance and reduce API calls
✅ **Loading indicators** during data fetching
✅ **Error handling** with user-friendly messages
✅ **Verse range selection** (single verse or multiple verses)
✅ **Dual-screen support** (control + display)
✅ **Real-time synchronization** using Supabase

## Usage Flow

1. User selects a book from the dropdown (e.g., "ዮሐንስ (John)")
2. User selects a chapter (e.g., "3")
3. API automatically fetches all verses for John chapter 3
4. User selects verse range (e.g., verses 16-17)
5. User clicks "Show on Display"
6. Selected verses appear on the projection screen
7. Display screen shows:
   ```
   ዮሐንስ 3:16-17
   
   16. እግዚአብሔር ዓለምን በጣም ስለ ወዳት...
   
   17. እግዚአብሔር ልጁን ወደ ዓለም ላከው...
   ```

## Error Handling

The service handles various error scenarios:

- **Network errors**: Falls back gracefully, shows error toast
- **Invalid book/chapter**: Validates input before API call
- **Empty responses**: Shows "No verses found" message
- **API timeouts**: Cached data prevents repeated failures

## Performance Optimizations

1. **Caching**: Fetched chapters are cached in memory
2. **Lazy loading**: Only fetches data when needed
3. **Debouncing**: Prevents excessive API calls during user interaction

## MongoDB Note

The MongoDB connection provided:
```
mongodb+srv://henookgirmaa_db_user:iSoUclkLQfLDEPxX@cluster0.b7qr7gp.mongodb.net/?appName=Cluster0
```

This is used by the backend (`kebena_backend`) for:
- Storing songs (hymnal and local songs)
- User authentication and management
- Song metadata

**The Bible verses are NOT stored in MongoDB** - they are fetched in real-time from the Open Amharic Bible API. This approach:
- Keeps the database lightweight
- Always provides up-to-date Bible content
- Reduces storage requirements
- Simplifies maintenance

## API Response Format

### Chapter Response
```json
{
  "book": "ዘፍ",
  "chapter": 1,
  "verses": [
    { "verse": 1, "text": "በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።" },
    { "verse": 2, "text": "ምድር ባዶና ባድላ ነበረች..." }
  ]
}
```

### Single Verse Response
```json
{
  "verse": 16,
  "text": "እግዚአብሔር ዓለምን በጣም ስለ ወዳት..."
}
```

### Search Response
```json
{
  "results": [
    {
      "book": "ዮሐ",
      "chapter": 3,
      "verse": 16,
      "text": "እግዚአብሔር ዓለምን በጣም ስለ ወዳት..."
    }
  ]
}
```

## Future Enhancements

Potential improvements for the Bible feature:

1. **Multiple versions** - Add English KJV, other translations
2. **Offline mode** - Cache frequently accessed verses
3. **Bookmarks** - Save favorite verses
4. **Search UI** - Add search interface in the control panel
5. **History** - Track recently displayed verses
6. **Parallel display** - Show multiple versions side by side

## Troubleshooting

**Issue: Verses not loading**
- Check internet connection
- Verify API is accessible: `curl https://openamharicbible.vercel.app/api/am/books`
- Check browser console for errors
- Clear cache and reload

**Issue: Wrong book displayed**
- Verify book abbreviation matches API format
- Check book mapping in `bibleService.ts`

**Issue: Display not updating**
- Ensure display window is open
- Check Supabase connection
- Verify real-time subscription is active

## Support

For API issues or questions:
- API Repository: [Open Amharic Bible](https://github.com/yourusername/openamharicbible)
- Report bugs in the app repository

---

**Last Updated**: January 2026
**API Version**: v1
**Integration Status**: ✅ Complete
