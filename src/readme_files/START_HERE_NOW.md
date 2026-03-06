# ⚡ START HERE - Get Running in 5 Minutes!

> **Quick start guide for your Kebena Church Song Display App**

---

## 🎯 You're 5 Steps Away from Success!

### Step 1: Install Dependencies (2 minutes)

Open terminal in this folder and run:

```bash
npm install
```

Then install backend:

```bash
cd kebena_backend
npm install
cd ..
```

✅ **Done!** All dependencies installed.

---

### Step 2: Setup Environment (1 minute)

**Option A: Quick Setup (No Supabase)**

Create `.env` file:

```bash
cp .env.example .env
```

**Option B: Full Setup (With Supabase - Recommended)**

1. Go to https://app.supabase.com
2. Create new project (free!)
3. Get your **Project URL** and **anon public key**
4. Edit `.env`:

```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:3001/api
```

✅ **Done!** Environment configured.

---

### Step 3: Initialize Database (30 seconds)

```bash
cd kebena_backend
node src/config/initDatabase.js
cd ..
```

You should see:
```
✅ Database initialized successfully
✅ Default admin user created
```

✅ **Done!** Database ready.

---

### Step 4: Start the App (30 seconds)

**Open TWO terminals:**

**Terminal 1 - Backend:**
```bash
npm run backend
```

Wait for:
```
✅ Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for:
```
  ➜  Local:   http://localhost:5173/
```

✅ **Done!** App is running!

---

### Step 5: Login and Test (1 minute)

1. Open browser: http://localhost:5173
2. Login:
   - Username: `admin`
   - Password: `admin123`

3. Test Bible Display:
   - Click **Bible / መጽሐፍ ቅዱስ** tab
   - Press **Enter** key
   - A window opens → Success! 🎉

4. Test Song Display:
   - Click **Songs / መዝሙሮች** tab
   - Click any song
   - Click **Show** button
   - Display updates → Success! 🎉

✅ **DONE! You're ready!**

---

## 🎹 Quick Keyboard Shortcuts

**Bible Display:**
- **Enter** = Show verse on display
- **←/→** = Previous/Next verse (auto-updates!)
- **↑/↓** = Previous/Next chapter
- **Esc** = Clear display

**Song Display:**
- **←/→** = Previous/Next slide
- **Esc** = Hide song

---

## 🚨 Troubleshooting (If Needed)

### Frontend won't start?

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start?

```bash
cd kebena_backend
rm -rf node_modules package-lock.json
npm install
node src/config/initDatabase.js
node src/server.js
```

### Can't login?

Database might be corrupted:

```bash
cd kebena_backend
rm kebena.db
node src/config/initDatabase.js
cd ..
# Restart backend
```

Default credentials:
- Username: `admin`
- Password: `admin123`

---

## 📖 Next Steps

### Immediately:

1. ✅ Change admin password (Settings → Users)
2. ✅ Add your church songs (Admin Panel → Add Song)
3. ✅ Test Bible display with projector
4. ✅ Print [QUICK_REFERENCE_CARD.md](./QUICK_REFERENCE_CARD.md)

### This Week:

1. ✅ Train your worship team
2. ✅ Practice before Sunday
3. ✅ Customize background (Admin Panel)
4. ✅ Create user accounts for team

### This Month:

1. ✅ Deploy to production server
2. ✅ Add all your song library
3. ✅ Perfect your workflow
4. ✅ Enjoy smooth worship services!

---

## 📚 Full Documentation

**Need more details?**

- **[README_COMPLETE.md](./README_COMPLETE.md)** - Complete overview
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to server
- **[BIBLE_KEYBOARD_SHORTCUTS.md](./BIBLE_KEYBOARD_SHORTCUTS.md)** - All shortcuts
- **[QUICK_REFERENCE_CARD.md](./QUICK_REFERENCE_CARD.md)** - Print this!
- **[WHATS_NEW_ENHANCED.md](./WHATS_NEW_ENHANCED.md)** - New features

---

## ✅ Success Checklist

Your setup is complete when:

- [ ] `npm run dev` works → http://localhost:5173
- [ ] `npm run backend` works → http://localhost:3001
- [ ] You can login with admin/admin123
- [ ] Bible tab loads John 3:16
- [ ] Pressing Enter opens a window
- [ ] Arrow keys navigate verses
- [ ] Songs tab shows song list
- [ ] Clicking a song opens viewer
- [ ] Show button displays lyrics

**All checked?** 🎉 **YOU'RE READY!**

---

## 🎬 Sunday Service Workflow

### Before Service (5 minutes):

1. Start both servers
2. Login to app
3. Test projector connection
4. Open Bible display window
5. Drag to projector, press F11

### During Service:

**Songs:**
- Click song → Click Show → Use arrows

**Bible:**
- Select verse → Press Enter → Use arrows

**Quick switching:**
- Everything in same display window
- Seamless transitions!

### After Service:

- Press Esc to clear
- Close windows
- Stop servers (Ctrl+C)

---

## 💡 Pro Tips

### Tip 1: Keep Display Open
- Open the display window ONCE
- Keep it on projector all service
- Just update with arrow keys
- Super fast! ⚡

### Tip 2: Use Keyboard
- Keyboard is faster than mouse
- Learn these 3 keys:
  - **Enter** (show)
  - **→** (next)
  - **Esc** (clear)
- You'll be a pro in 5 minutes!

### Tip 3: Prepare Ahead
- Add all songs before Sunday
- Write down verse references
- Test everything Saturday
- Arrive 30 min early Sunday
- Stress-free service! 😌

---

## 🆘 Need Help?

### Check These First:

1. **Console Errors**: Press F12 in browser
2. **Backend Logs**: Check Terminal 1
3. **Frontend Logs**: Check Terminal 2
4. **Environment**: Check `.env` file exists

### Common Issues:

**"Cannot connect to backend"**
→ Make sure Terminal 1 is running

**"Supabase error"**
→ Check `.env` has correct credentials

**"Bible verses not loading"**
→ Need internet for full Bible (John 3 works offline)

**"Songs not showing"**
→ Make sure database is initialized

---

## 🎉 You're All Set!

**Your Kebena Church Song Display app is:**

✅ Installed
✅ Configured
✅ Running
✅ Tested
✅ Ready for Sunday!

**Keyboard shortcuts learned:**
✅ Enter = Show
✅ Arrows = Navigate
✅ Esc = Clear

**Documentation available:**
✅ Complete README
✅ Deployment guide
✅ Quick reference
✅ Keyboard shortcuts
✅ What's new

---

**🙏 May God bless your worship service!**

**📧 Questions? Check the documentation files!**

**⭐ Everything you need is included!**

---

_Start Here Guide_
_Version 1.0.0_
_January 2, 2026_

**Next file to read**: [QUICK_REFERENCE_CARD.md](./QUICK_REFERENCE_CARD.md) (print this!)
