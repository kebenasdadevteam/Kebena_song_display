# 🎵 Kebena Church Song Display - Quick Start

## 🚨 Getting "Cannot connect to backend" Error?

**👉 READ THIS:** [FIX_NOW.md](./FIX_NOW.md) ← Click here for instant solution!

---

## ⚡ Super Quick Start

### First Time? (Setup - Do Once)

```bash
# 1. Install backend dependencies
cd kebena_backend
npm install

# 2. Create database
npm run init-db

# 3. Start backend
npm start
```

**Keep this terminal open!**

---

### Every Other Time (Daily Use)

```bash
# 1. Start XAMPP MySQL (click "Start" button)

# 2. Start backend
cd kebena_backend
npm start

# 3. Start frontend (new terminal)
npm start
```

**Done!** Open http://localhost:3000

---

## 📚 Documentation Guide

**Choose based on your situation:**

### 🚨 **Having Problems?**
1. **Error: "Cannot connect to backend"** → [FIX_NOW.md](./FIX_NOW.md)
2. **Other errors** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### 📖 **Need Instructions?**
1. **Step-by-step startup** → [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)
2. **Quick fix guide** → [QUICK_FIX.md](./QUICK_FIX.md)
3. **First-time setup** → [START_HERE.md](./START_HERE.md)

### 🔧 **Technical Details?**
1. **Backend setup** → [kebena_backend/README.md](./kebena_backend/README.md)
2. **API testing** → [kebena_backend/API_TESTING_GUIDE.md](./kebena_backend/API_TESTING_GUIDE.md)
3. **Integration info** → [BACKEND_INTEGRATION_COMPLETE.md](./BACKEND_INTEGRATION_COMPLETE.md)

---

## ✅ Quick Health Check

**Is everything running? Check these:**

| Service | Check | Expected Result |
|---------|-------|-----------------|
| MySQL | XAMPP Control Panel | Green "Running" |
| Backend | http://localhost:5000/health | `{"success": true}` |
| Frontend | http://localhost:3000 | Login page |

---

## 🎯 Common Issues - Quick Solutions

### "Cannot connect to backend"
**→ Backend not running**
```bash
cd kebena_backend
npm start
```

### "Cannot connect to database"  
**→ MySQL not running**
- Open XAMPP → Start MySQL

### "Module not found"
**→ Dependencies not installed**
```bash
cd kebena_backend
npm install
```

### "Port already in use"
**→ Backend already running somewhere**
- Close other terminals or restart computer

---

## 🎊 What This System Does

✅ **Display church songs** in presentation mode  
✅ **Upload PPTX files** - automatic slide extraction  
✅ **Search songs** by number or title (Amharic/English)  
✅ **Manage song library** - add, edit, delete  
✅ **Admin controls** - user management, backgrounds  
✅ **Keyboard shortcuts** - for worship service control  

---

## 🔐 Default Login

**Username:** `admin`  
**Password:** `admin123`

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MySQL (XAMPP)
- **File Processing:** officeparser, pdf-parse

---

## 📁 Project Structure

```
project/
├── App.tsx                    # Main frontend app
├── components/                # React components
├── services/
│   └── api.ts                # Backend API calls
├── kebena_backend/           # Backend server
│   ├── src/
│   │   ├── server.js        # Main server file
│   │   ├── routes/          # API routes
│   │   └── controllers/     # Business logic
│   ├── uploads/             # Uploaded files
│   └── .env                 # Configuration
└── Documentation files
```

---

## 🚀 Startup Scripts

**Windows:**
```
Double-click: start-backend.bat
```

**Mac/Linux:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

---

## 💡 Pro Tips

1. **Keep backend terminal open** - Don't close it!
2. **Bookmark health check** - http://localhost:5000/health
3. **Use two monitors** - One for terminals, one for app
4. **Check XAMPP first** - Always start MySQL before backend

---

## 🆘 Emergency Help

**System not working at all?**

1. Close everything
2. Restart computer
3. Follow [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md)

**Still stuck?**

Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Has solutions for every error!

---

## 📞 Quick Commands

```bash
# Install backend dependencies (first time)
cd kebena_backend && npm install

# Create database (first time)  
cd kebena_backend && npm run init-db

# Start backend (every time)
cd kebena_backend && npm start

# Start frontend (every time, new terminal)
npm start

# Check backend health
curl http://localhost:5000/health
```

---

## 🎓 Learn More

- **Full backend documentation:** `/kebena_backend/README.md`
- **API endpoints:** `/kebena_backend/API_TESTING_GUIDE.md`
- **Setup guide:** `/kebena_backend/SETUP_GUIDE.md`

---

## ⭐ Features

### Song Management
- Upload PPTX/PDF files
- Automatic slide extraction
- Manual text entry
- Edit existing songs
- Delete songs

### Presentation Mode
- Full-screen slides
- Keyboard navigation (← → arrow keys)
- Slide counter
- Clean, readable fonts
- Custom backgrounds

### Search & Filter
- Search by song number
- Search by Amharic title
- Search by English title
- Filter by category (Hymnal/Local)

### Admin Features
- User management
- Role-based access (admin/user)
- Background customization
- Song library management

---

## 🎨 Customization

**Church Brand Colors:**
- Primary: #865014 (Brown)
- Secondary: #E0AE3F (Gold)
- Background: #F6EBD8 (Cream)

**Logo:** Church logo automatically included

---

## 📊 System Requirements

- **Node.js:** v14 or higher
- **MySQL:** 5.7 or higher (via XAMPP)
- **Browser:** Chrome, Firefox, Safari, Edge (latest)
- **OS:** Windows, macOS, Linux

---

## 🎉 You're Ready!

**Start here:** [FIX_NOW.md](./FIX_NOW.md) if you have errors

**Or jump to:** [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md) for detailed steps

---

**God bless your worship services! 🙏**

*Built with ❤️ for Kebena SDA Church*

---

## 📝 Version

**Current Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Production Ready ✅

---

## 🔄 Updates

To get latest updates:
```bash
git pull origin main
cd kebena_backend
npm install
```

---

**Happy worshiping! 🎵**
