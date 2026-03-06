# ✅ Styling Checklist - Fix "No CSS" Issues

## 🎯 Quick Fix (Try This First!)

```bash
# 1. Clean everything
rm -rf node_modules package-lock.json

# 2. Fresh install
npm install

# 3. Verify Tailwind v4
npm list tailwindcss
# Should show: tailwindcss@4.0.0-alpha.25

# 4. Start dev server
npm run dev
```

**Open http://localhost:5173** - Does it have styling now? ✅

---

## 📋 Step-by-Step Verification

### ✅ Step 1: Check Node.js Version

```bash
node --version
```

**Required:** v18.0.0 or higher

**If older:**
- Download from https://nodejs.org
- Install LTS version (v20+)
- Restart terminal

---

### ✅ Step 2: Verify Project Files Exist

Check these files are present:

```
✅ package.json
✅ vite.config.ts
✅ tsconfig.json
✅ index.html
✅ main.tsx
✅ App.tsx
✅ styles/globals.css
✅ vite-env.d.ts
✅ public/vite.svg
```

**Missing files?** Re-download the project.

---

### ✅ Step 3: Check package.json

Open `package.json` and verify:

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0-alpha.25",
    "tailwindcss": "^4.0.0-alpha.25",
    ...
  }
}
```

**If missing or different version:**
```bash
npm install @tailwindcss/vite@4.0.0-alpha.25 tailwindcss@4.0.0-alpha.25 --save-dev
```

---

### ✅ Step 4: Check vite.config.ts

Open `vite.config.ts` and verify:

```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ⭐ MUST BE HERE!
  ],
  ...
});
```

**If `tailwindcss()` is missing**, add it to the plugins array.

---

### ✅ Step 5: Check styles/globals.css

Open `styles/globals.css` and verify line 3:

```css
@import "tailwindcss";
```

**NOT:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The second syntax is **Tailwind v3** (old). You need **v4** syntax!

---

### ✅ Step 6: Check main.tsx

Open `main.tsx` and verify line 4:

```tsx
import './styles/globals.css';
```

**If missing**, add it after the App import.

---

### ✅ Step 7: Delete Old Config Files

These files should **NOT exist** (Tailwind v4 doesn't use them):

```
❌ tailwind.config.js
❌ tailwind.config.ts
❌ postcss.config.js
```

**If they exist:**
```bash
rm tailwind.config.js tailwind.config.ts postcss.config.js
```

---

### ✅ Step 8: Check Browser Console

1. Run `npm run dev`
2. Open http://localhost:5173
3. Press **F12** (DevTools)
4. Check **Console** tab

**Good signs:**
```
✅ [vite] connected.
✅ No errors
```

**Bad signs:**
```
❌ Failed to load styles/globals.css
❌ @import "tailwindcss" is not defined
❌ Module not found: tailwindcss
```

If you see errors, the Tailwind plugin is not loading!

---

### ✅ Step 9: Check Terminal Output

When you run `npm run dev`, you should see:

```
VITE v6.0.1  ready in 234 ms

➜  Local:   http://localhost:5173/

Tailwind CSS v4.0.0-alpha.25  ⭐ THIS LINE!
✓ ready in 45ms
```

**If "Tailwind CSS v4..." is missing**, the plugin is not active!

---

### ✅ Step 10: Visual Test

When the page loads, check:

**Login Page Should Have:**
- ✅ Brown header (#865014 color)
- ✅ Gold accent color (#E0AE3F)
- ✅ Cream background (#F6EBD8)
- ✅ Styled buttons (not plain HTML buttons)
- ✅ Professional fonts (not Times New Roman)
- ✅ Proper spacing and padding

**Plain HTML Indicators (BAD):**
- ❌ Blue underlined links
- ❌ Times New Roman font
- ❌ No colors (all black/white/blue)
- ❌ Plain HTML buttons
- ❌ No spacing/padding

---

## 🔧 Advanced Troubleshooting

### Issue: "Tailwindcss@4.0.0-alpha.25" not found

**Solution 1: Clear npm cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Use exact version**
```bash
npm install tailwindcss@4.0.0-alpha.25 @tailwindcss/vite@4.0.0-alpha.25 --save-dev --legacy-peer-deps
```

**Solution 3: Check npm registry**
```bash
npm view tailwindcss versions
# Verify 4.0.0-alpha.25 exists
```

---

### Issue: Plugin loads but CSS doesn't process

**Check vite.config.ts import:**
```ts
// ✅ CORRECT:
import tailwindcss from '@tailwindcss/vite';

// ❌ WRONG:
import tailwindcss from 'tailwindcss';
```

**Verify plugin call:**
```ts
plugins: [
  react(),
  tailwindcss(),  // With parentheses!
]
```

---

### Issue: CSS file not found

**Check import path in main.tsx:**
```tsx
// ✅ CORRECT (if main.tsx is in root):
import './styles/globals.css';

// ❌ WRONG:
import '../styles/globals.css';
import 'styles/globals.css';
```

---

### Issue: Browser shows old cached CSS

**Hard refresh:**
- **Windows/Linux:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

**Or clear cache:**
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

---

### Issue: Development server won't start

**Port conflict:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9   # Mac/Linux
netstat -ano | findstr :5173    # Windows
```

**Permission error:**
```bash
# Run with sudo (Mac/Linux only)
sudo npm run dev
```

---

## 🎯 Final Nuclear Option

If nothing works, complete reset:

```bash
# 1. Delete everything
rm -rf node_modules
rm -rf kebena_backend/node_modules
rm package-lock.json
rm kebena_backend/package-lock.json
rm -rf dist
rm -rf .vite

# 2. Clear global npm cache
npm cache clean --force

# 3. Reinstall Node.js
# Download from https://nodejs.org
# Install fresh

# 4. Reinstall project
npm install

# 5. Reinstall backend
cd kebena_backend
npm install
cd ..

# 6. Start dev server
npm run dev
```

---

## 📊 Diagnostic Script

Create `check-setup.js` in project root:

```js
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Checking Kebena Church App Setup...\n');

// Check Node version
const nodeVersion = process.version;
console.log('✅ Node.js version:', nodeVersion);
if (parseInt(nodeVersion.slice(1)) < 18) {
  console.log('❌ ERROR: Node.js 18+ required!');
}

// Check if files exist
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'main.tsx',
  'styles/globals.css',
  'index.html'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} MISSING!`);
  }
});

// Check Tailwind installation
try {
  const tailwind = execSync('npm list tailwindcss --depth=0', { encoding: 'utf8' });
  if (tailwind.includes('4.0.0-alpha.25')) {
    console.log('✅ Tailwind CSS v4 installed correctly');
  } else {
    console.log('❌ Wrong Tailwind version!');
    console.log(tailwind);
  }
} catch (e) {
  console.log('❌ Tailwind CSS not installed!');
}

console.log('\n✅ Diagnostic complete!');
```

**Run it:**
```bash
node check-setup.js
```

---

## 📞 Getting Help

### Check these in order:

1. **Browser Console (F12)** - Any errors?
2. **Terminal Output** - Shows "Tailwind CSS v4..."?
3. **Network Tab (F12)** - Is globals.css loading?
4. **npm list tailwindcss** - Shows v4.0.0-alpha.25?
5. **vite.config.ts** - Has tailwindcss() plugin?
6. **main.tsx** - Imports './styles/globals.css'?
7. **styles/globals.css** - Has @import "tailwindcss"?

### Still stuck?

**Create issue with:**
- Output of `npm list tailwindcss`
- Output of `npm run dev` (terminal)
- Screenshot of browser console (F12)
- Screenshot of page (to show no styling)
- Your Node.js version (`node --version`)

---

## ✅ Success Indicators

You'll know it works when:

1. ✅ Terminal shows "Tailwind CSS v4.0.0-alpha.25"
2. ✅ Browser loads with styled login page
3. ✅ Brown/gold church colors visible
4. ✅ No console errors
5. ✅ Fonts are professional (not Times New Roman)
6. ✅ Buttons are styled
7. ✅ Proper spacing everywhere

**All checked?** You're ready! 🎉

---

## 📚 Related Documentation

- **[LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)** - Complete setup guide
- **[README.md](./README.md)** - Project overview
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions

---

**Remember:** The issue is almost always one of these:

1. Wrong Tailwind version (need v4, not v3)
2. Missing @tailwindcss/vite plugin
3. Not importing globals.css in main.tsx
4. Old tailwind.config.js file present
5. npm cache issues

**Fix these and 99% of styling issues disappear!** ✨

---

_Styling Checklist v1.0_
_January 2, 2026_
