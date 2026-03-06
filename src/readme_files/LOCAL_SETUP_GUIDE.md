# 🚀 Local Setup Guide - Fix Styling Issues

## ⚠️ IMPORTANT: Tailwind CSS v4 Setup

This project uses **Tailwind CSS v4 (alpha)** which requires specific setup. Follow these steps **exactly** to ensure styling works properly.

---

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 🛠️ Step-by-Step Setup

### Step 1: Clean Install (IMPORTANT!)

Delete any existing `node_modules` if you have them:

```bash
# Windows
rmdir /s /q node_modules
del package-lock.json

# Mac/Linux
rm -rf node_modules package-lock.json
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

**Expected packages for Tailwind v4:**
- `tailwindcss@^4.0.0-alpha.25`
- `@tailwindcss/vite@^4.0.0-alpha.25`

**Verify installation:**
```bash
npm list tailwindcss
# Should show: tailwindcss@4.0.0-alpha.25
```

### Step 3: Install Backend Dependencies

```bash
cd kebena_backend
npm install
cd ..
```

### Step 4: Setup Environment Variables

```bash
# Copy example file
cp .env.example .env
```

**Edit `.env` file:**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=http://localhost:3001/api
```

**For testing without Supabase (optional):**
```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 5: Initialize Backend Database

```bash
cd kebena_backend
node src/config/initDatabase.js
cd ..
```

**Expected output:**
```
✅ Database initialized successfully
✅ Default admin user created (username: admin, password: admin123)
```

### Step 6: Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Wait for:**
```
✅ Server running on http://localhost:3001
✅ Database connected
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Wait for:**
```
  VITE v6.0.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 7: Test in Browser

1. Open http://localhost:5173
2. **Check DevTools Console** (F12):
   - Should see no CSS errors
   - Should see Vite connection established
   - Should see Tailwind styles loading

3. **Check Styling**:
   - Login page should have brown (#865014) branding
   - Buttons should be styled
   - Typography should be correct
   - No unstyled HTML

---

## 🐛 Troubleshooting Styling Issues

### Issue: "No styling, just plain HTML"

**Cause:** Tailwind CSS not loading

**Solution:**

1. **Check browser console** (F12):
   ```
   Look for errors like:
   - "Failed to load styles/globals.css"
   - "Tailwind is not defined"
   ```

2. **Verify globals.css is imported:**
   
   Check `main.tsx`:
   ```tsx
   import './styles/globals.css'; // Must be present!
   ```

3. **Check Vite plugin:**
   
   Check `vite.config.ts`:
   ```ts
   import tailwindcss from '@tailwindcss/vite';
   
   plugins: [
     react(),
     tailwindcss(), // Must be here!
   ],
   ```

4. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### Issue: "Vite not found" or "Module not found"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Kill the process using port 5173

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts:
server: {
  port: 5174, // Use different port
}
```

### Issue: "Tailwind classes not working"

**Cause:** Tailwind v4 uses different syntax

**Solution:**

1. **Check globals.css has v4 import:**
   ```css
   @import "tailwindcss";
   ```
   NOT:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Verify @tailwindcss/vite is installed:**
   ```bash
   npm list @tailwindcss/vite
   ```

3. **No tailwind.config.js needed** - v4 doesn't use it!

### Issue: "postcss.config.js not found"

**This is OK!** Tailwind v4 doesn't need PostCSS config. The file has been deleted intentionally.

---

## ✅ Verify Everything Works

### Checklist:

- [ ] `npm run dev` starts without errors
- [ ] Browser opens http://localhost:5173
- [ ] No console errors in browser DevTools
- [ ] Login page has styling (brown header, styled buttons)
- [ ] Fonts are correct (not default Times New Roman)
- [ ] Colors match church branding (#865014, #E0AE3F, #F6EBD8)
- [ ] Backend running on http://localhost:3001
- [ ] Can login with admin/admin123

### Quick Visual Test:

**Login Screen should show:**
- Brown/gold header with "Kebena Church Song Display"
- Cream/beige background (#F6EBD8)
- Styled input fields with borders
- Brown login button (#865014)
- Proper spacing and typography

**If you see plain HTML with blue links and Times New Roman font**, Tailwind is not loading!

---

## 📁 Project Structure Verification

Make sure these files exist:

```
kebena-church-song-display/
├── package.json              ✅ Has tailwindcss@^4.0.0-alpha.25
├── vite.config.ts            ✅ Has tailwindcss() plugin
├── tsconfig.json             ✅ TypeScript config
├── tsconfig.node.json        ✅ Node TypeScript config
├── vite-env.d.ts             ✅ Vite types
├── index.html                ✅ HTML entry point
├── main.tsx                  ✅ Imports globals.css
├── App.tsx                   ✅ Main component
├── .env                      ✅ Environment variables
├── .gitignore                ✅ Git ignore
├── styles/
│   └── globals.css           ✅ Has @import "tailwindcss"
├── components/               ✅ All components
├── services/                 ✅ API services
├── utils/                    ✅ Utilities
├── public/
│   └── vite.svg              ✅ Favicon
└── kebena_backend/           ✅ Backend server
```

---

## 🔍 Deep Debugging

If styling still doesn't work after following all steps:

### 1. Check Vite's Dev Server Output

When you run `npm run dev`, you should see:

```
VITE v6.0.1  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose

Tailwind CSS v4.0.0-alpha.25

Processing...
✓ styles/globals.css
```

If you DON'T see "Tailwind CSS v4.0.0-alpha.25", the plugin is not loading!

### 2. Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `globals.css`
5. Click on it
6. Should show processed CSS with Tailwind classes

If it shows raw CSS with `@import "tailwindcss"`, the plugin is not processing!

### 3. Test Tailwind Inline

Add this to `App.tsx` temporarily:

```tsx
<div className="bg-red-500 text-white p-4">
  If this is red with white text, Tailwind works!
</div>
```

- **If it's red**: Tailwind works, something else is wrong
- **If it's not red**: Tailwind is not processing classes

### 4. Force Reinstall Everything

**Nuclear option:**

```bash
# Delete EVERYTHING
rm -rf node_modules
rm -rf kebena_backend/node_modules
rm package-lock.json
rm kebena_backend/package-lock.json
rm -rf dist

# Clear npm cache
npm cache clean --force

# Reinstall frontend
npm install

# Reinstall backend
cd kebena_backend
npm install
cd ..

# Restart dev server
npm run dev
```

---

## 🎯 Expected Behavior

### When Everything Works:

**Terminal 2 (Frontend) should show:**
```
VITE v6.0.1  ready in 234 ms

➜  Local:   http://localhost:5173/

Tailwind CSS v4.0.0-alpha.25
✓ ready in 45ms
```

**Browser should show:**
- Fully styled login page
- Brown/gold church colors
- Professional typography
- Smooth animations
- No console errors

**DevTools Console should show:**
```
[Vite] connected.
[HMR] connected
```

---

## 📞 Still Having Issues?

### Check These Common Mistakes:

1. ❌ **Using Node.js v16 or older**
   - ✅ Upgrade to Node.js v18+

2. ❌ **Missing `@import "tailwindcss"` in globals.css**
   - ✅ Check line 3 of styles/globals.css

3. ❌ **Not importing globals.css in main.tsx**
   - ✅ Check line 4 of main.tsx

4. ❌ **Wrong Tailwind version (v3 instead of v4)**
   - ✅ Run: `npm list tailwindcss`
   - ✅ Should show: 4.0.0-alpha.25

5. ❌ **Missing @tailwindcss/vite plugin**
   - ✅ Run: `npm list @tailwindcss/vite`
   - ✅ Should be installed

6. ❌ **Old tailwind.config.js file present**
   - ✅ Delete it! v4 doesn't use it

7. ❌ **Browser cache**
   - ✅ Hard refresh: Ctrl+Shift+R (Windows/Linux)
   - ✅ Hard refresh: Cmd+Shift+R (Mac)

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **npm run dev** starts without errors
✅ **Browser loads** at http://localhost:5173
✅ **Styling is perfect** - brown/gold colors visible
✅ **No console errors** in DevTools
✅ **Login page looks professional** - not plain HTML
✅ **Backend responds** at http://localhost:3001
✅ **Can login** with admin/admin123
✅ **Bible tab works** - press Enter opens styled window
✅ **Songs tab works** - shows styled song list

---

## 📚 Next Steps After Styling Works

1. **Change admin password** (Settings → Users)
2. **Add Supabase credentials** (for real-time sync)
3. **Add your church songs** (Admin Panel)
4. **Customize background** (Admin Panel)
5. **Train your team** (print QUICK_REFERENCE_CARD.md)
6. **Use in Sunday service!** 🎉

---

**Remember:**
- Tailwind v4 is NEW (alpha version)
- It uses `@import "tailwindcss"` syntax
- It requires `@tailwindcss/vite` plugin
- No tailwind.config.js needed
- No postcss.config.js needed

**If you see styling, you're good to go!** 🚀

---

_Last updated: January 2, 2026_
_Tailwind CSS v4.0.0-alpha.25_
