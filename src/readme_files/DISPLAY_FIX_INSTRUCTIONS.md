# Display Fix - Testing Instructions

## What Was Fixed

I've updated the display synchronization system to use **localStorage** for state persistence. This means:

1. When you click "Show on Display", the state is saved to localStorage
2. When the display window opens, it loads the current state from localStorage
3. Updates are broadcast via Supabase for real-time sync
4. The display window now shows what's currently being displayed, even if it was opened after you clicked "Show"

## Testing Steps

### Step 1: Test Bible Display

1. **Open the control panel** (main window)
2. Go to the **Bible / መጽሐፍ ቅዱስ** tab
3. Select a verse (e.g., John 3:16)
4. Click **"Show on Display"**
5. Check the **Display Preview** panel - it should show the verse ✅
6. Now click **"Open Display"** in the header
7. The new window should show:
   - Debug info in top-left corner
   - The Bible verse in the center
   - Same content as the preview panel

### Step 2: Test Song Display

1. Go to the **Songs / መዝሙሮች** tab
2. Click on any song from Hymnal or Local Songs
3. The SongViewer opens
4. Click the **"Show"** button (Eye icon) in the control bar
5. Make sure the **display window is open** (from Step 1)
6. The display should update to show:
   - Song title in Amharic
   - Current slide lyrics
   - Slide indicator (e.g., "1 / 5")
7. Press **→** arrow key to go to next slide
8. The display should update automatically

### Step 3: Check Debug Info

In the display window (top-left corner), you should see:

```json
{
  "isVisible": true,
  "type": "bible" or "song",
  "hasBibleText": true (for Bible),
  "songId": 123 (for songs),
  "hasSong": true (for songs),
  "timestamp": 1234567890
}
```

### Step 4: Verify Console Logs

Press **F12** in both windows and check the Console tab:

**Control Window:**
- `[Display Service] Broadcasting state update:`
- `[Display Service] Saved state to localStorage`
- `[Display Service] Broadcast successful`

**Display Window:**
- `[BibleDisplay] Initializing display service...`
- `[BibleDisplay] Loaded state from localStorage:`
- `[BibleDisplay] Received state update:`
- `[Display Service] Channel subscription status: SUBSCRIBED`

## Common Issues

### Issue: Display window is blank

**Check:**
1. Look at the debug info - does it show `isVisible: true`?
2. Check if `type` is correct (`bible` or `song`)
3. For songs, check if `hasSong` is `true`

**Solution:**
- If debug shows the data is there but nothing displays, it's a rendering issue
- If debug shows `isVisible: false`, the state wasn't saved correctly
- Try refreshing the display window (Ctrl+R)

### Issue: Preview works but display doesn't

**Check:**
1. Open browser console (F12) in both windows
2. Look for `[Display Service]` messages
3. Check if localStorage has the state:
   - In console, type: `localStorage.getItem('display_state')`
   - Should show JSON with the current state

**Solution:**
- The localStorage should persist across windows
- Make sure you're not in incognito mode (doesn't share localStorage)
- Try closing and reopening the display window

### Issue: Songs don't load in display

**Check:**
1. Debug info shows `hasSong: false`?
2. Console shows error loading songs?

**Solution:**
- The display window needs to fetch songs from the API
- Make sure your backend is running
- Check if offline mode is active

### Issue: Updates are delayed

**Check:**
1. Are both windows showing `SUBSCRIBED` in console?
2. Check your internet connection
3. Verify Supabase project is active

**Solution:**
- The broadcast should be instant
- localStorage provides immediate fallback
- Try refreshing both windows

## Removing Debug Info

Once everything works, you can remove the debug overlay:

1. Open `/components/BibleDisplay.tsx`
2. Find the section with `{/* Debug Overlay - Remove this in production */}`
3. Delete the entire `<div className="absolute top-4 left-4...">` block

## How the Flow Works

### When you click "Show on Display":

1. **Control Panel** calls `displayStateService.updateDisplayState()`
2. **Service** saves state to localStorage
3. **Service** notifies local listeners (preview updates)
4. **Service** broadcasts to Supabase channel
5. **Display Window** receives broadcast
6. **Display Window** updates its UI

### When display window opens:

1. **Display Window** initializes the service
2. **Service** loads state from localStorage
3. **Display Window** renders the saved state
4. **Display Window** subscribes to future updates

This means the display ALWAYS shows the current state, whether it opened before or after you clicked "Show"!

## Success Criteria

✅ Bible verses appear in both preview and display window
✅ Songs appear in both preview and display window
✅ Navigating slides updates the display in real-time
✅ Opening display window after clicking "Show" still displays content
✅ Debug info shows correct state
✅ Console logs show successful broadcasts

If all these work, your display system is fully functional! 🎉
