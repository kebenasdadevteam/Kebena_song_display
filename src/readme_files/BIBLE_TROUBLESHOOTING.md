# 🔧 Bible Section Troubleshooting Guide

## Quick Diagnostics

### Step 1: Check Console Logs
Open the browser console (F12) and look for these messages:

**Expected Logs:**
```
[Display Service] Initialized
[Display Service] Channel subscription status: SUBSCRIBED
[Display Service] Broadcasting state update: {...}
[Display Service] Broadcast result: ok
[Display Service] Received display update: {...}
```

**Problem Indicators:**
- ❌ "Channel not initialized" - Service not started
- ❌ "SUBSCRIPTION_ERROR" - Supabase connection issue
- ❌ No "Received display update" - Broadcast not working

### Step 2: Verify Setup
- [ ] Both control and display windows are open
- [ ] Supabase credentials are configured
- [ ] Internet connection is active
- [ ] No console errors in red

### Step 3: Test Basic Functionality
1. Open Bible tab
2. Keep default selection (John 3:16)
3. Click "Show on Display"
4. Check if toast appears: "Verse displayed on screen"
5. Check console for broadcast messages

---

## Common Issues & Solutions

### Issue 1: "No verses found" Error

**Symptoms:**
- Clicking "Show on Display" shows error
- Toast message: "No verses found"

**Causes:**
- API connection failure
- Invalid book/chapter selection
- Network issue

**Solutions:**
1. Check internet connection
2. Open console and check for network errors
3. Verify book abbreviation mapping
4. Try a different book (e.g., Genesis 1:1)

**Test API Directly:**
```javascript
// Open console and run:
fetch('https://openamharicbible.vercel.app/api/am/books/ዮሐ/chapters/3/16')
  .then(r => r.json())
  .then(console.log);
```

### Issue 2: Display Window Shows Nothing

**Symptoms:**
- Control panel works fine
- Display window remains blank
- No errors in console

**Causes:**
- Display window not subscribed
- Channel not connected
- Different browser tabs not syncing

**Solutions:**
1. **Refresh display window** (F5)
2. **Close and reopen** display window
3. **Check console in BOTH windows** (control and display)
4. **Verify Supabase status:**
   ```javascript
   // In console:
   import { supabase } from './utils/supabaseClient';
   console.log(supabase);
   ```

### Issue 3: Keyboard Shortcuts Not Working

**Symptoms:**
- Arrow keys don't navigate
- Enter doesn't display verse
- Esc doesn't clear

**Causes:**
- Focus in input field
- Event listener not attached
- Browser extension conflict

**Solutions:**
1. **Click outside input fields** before using shortcuts
2. **Enter works in inputs** - just press Enter while typing
3. **Disable browser extensions** temporarily
4. **Check console** for JavaScript errors

### Issue 4: Background Not Updating

**Symptoms:**
- Change background in Admin Panel
- Display doesn't update
- Control preview shows old background

**Causes:**
- State not propagating
- Display state not syncing
- Background prop not passed

**Solutions:**
1. **With verse displayed:**
   - Change background
   - Background updates immediately
   
2. **Without verse displayed:**
   - Show a verse first
   - Then change background
   - Or refresh display window

3. **Check state propagation:**
   ```javascript
   // In console of control window:
   displayStateService.updateDisplayState({
     type: 'none',
     isVisible: false,
     background: '#FF0000'  // Test with red
   });
   ```

### Issue 5: "Channel not initialized" Warning

**Symptoms:**
- Console shows: "Channel not initialized - cannot broadcast"
- Display not updating

**Causes:**
- Service initialized too late
- Component unmounted and remounted
- Supabase connection failed

**Solutions:**
1. **Refresh the page** (Ctrl+R)
2. **Check Supabase credentials:**
   - Open `/utils/supabase/info.tsx`
   - Verify `projectId` and `publicAnonKey` are set
3. **Wait a moment** - service might still be initializing
4. **Check network tab** for failed requests

### Issue 6: Preview Shows Verse But Display Doesn't

**Symptoms:**
- Preview panel shows verse correctly
- Display window shows nothing
- Console shows broadcast sent

**Causes:**
- Display window not listening
- Different channel instance
- Service cleanup issue

**Solutions:**
1. **Open display window FIRST** before showing verse
2. **Refresh display window**
3. **Check console in display window** for subscription status
4. **Reopen display window:**
   - Close display tab
   - Click "Open Display" again
   - Try showing verse

---

## Debug Checklist

### Before Reporting Issue:

- [ ] Checked console logs in control window
- [ ] Checked console logs in display window  
- [ ] Verified Supabase credentials exist
- [ ] Tested with default verse (John 3:16)
- [ ] Tried refreshing both windows
- [ ] Tested keyboard shortcuts
- [ ] Verified internet connection
- [ ] Checked for red errors in console
- [ ] Tested background color change
- [ ] Tried opening new display window

### Information to Provide:

1. **Console logs** from both windows
2. **Network tab** showing API requests
3. **Exact steps** to reproduce issue
4. **Which feature** isn't working:
   - [ ] Verse display
   - [ ] Background change
   - [ ] Keyboard shortcuts
   - [ ] Preview
   - [ ] Display sync

---

## Technical Debugging

### Check Service Status

**In Control Window Console:**
```javascript
// Check if service initialized
console.log(displayStateService);

// Check channel status
console.log(displayStateService.channel);

// Manual broadcast test
displayStateService.updateDisplayState({
  type: 'bible',
  isVisible: true,
  bibleText: 'Test verse',
  bibleBook: 'John',
  bibleChapter: 3,
  bibleVerseStart: 16,
  bibleVerseEnd: 16,
  background: '#1a1a2e'
});
```

### Check Supabase Connection

**In Console:**
```javascript
import { supabase } from './utils/supabaseClient';

// Test channel creation
const testChannel = supabase.channel('test-channel');
testChannel.subscribe((status) => {
  console.log('Test channel status:', status);
});
```

### Verify API Connection

**Test Bible API:**
```bash
# John 3:16
curl "https://openamharicbible.vercel.app/api/am/books/ዮሐ/chapters/3/16"

# List all books
curl "https://openamharicbible.vercel.app/api/am/books"
```

---

## Known Working Configuration

### Verified Setup:
```
✅ Browser: Chrome/Edge/Firefox (latest)
✅ Network: Active internet connection
✅ Supabase: Configured with valid credentials
✅ API: Open Amharic Bible API online
✅ Components: All 3 files (BibleControl, BibleDisplay, displayStateService)
```

### Test Scenario:
1. Login as user
2. Click Bible tab
3. See John 3:16 selected by default
4. Click "Open Display" button
5. New window opens with display
6. Click "Show on Display" in control
7. Verse appears in both preview and display window
8. Press Esc - verse clears
9. Change background - updates immediately

**If this works:** ✅ Bible section is working correctly

**If this fails:** Follow troubleshooting steps above

---

## Performance Tips

### For Smooth Operation:

1. **Keep display window open** throughout service
2. **Pre-load commonly used books** by browsing them
3. **Use keyboard shortcuts** for faster navigation
4. **Cache works** - second load of same chapter is instant
5. **Stable internet** - required for first load of each chapter

### Optimization:

- **Preload verses before service:**
  - Navigate through planned verses
  - This caches them for instant display
  
- **Use arrow keys:**
  - Faster than clicking
  - More reliable during service

---

## Emergency Fallback

### If Bible Section Won't Work:

1. **Use manual text:**
   - Copy verse text
   - Paste into a PowerPoint slide
   - Display PowerPoint instead

2. **Print verses:**
   - Pre-print needed verses
   - Have as backup

3. **Use phone/tablet:**
   - Open Bible app
   - Project screen if needed

---

## Support Contacts

### Get Help:

1. **Check documentation:**
   - `/BIBLE_FEATURE_GUIDE.md`
   - `/BIBLE_API_INTEGRATION.md`
   - `/KEYBOARD_SHORTCUTS.md`

2. **Console logs:**
   - Copy all console messages
   - Include in support request

3. **Browser DevTools:**
   - F12 to open
   - Console tab for logs
   - Network tab for API calls

---

## Success Indicators

### Bible Section Working Properly When:

✅ Console shows "Initialized"  
✅ Console shows "SUBSCRIBED"  
✅ Toast appears on "Show"  
✅ Preview updates immediately  
✅ Display window syncs in real-time  
✅ Keyboard shortcuts respond  
✅ Background changes apply  
✅ No red errors in console  

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** Production Ready
