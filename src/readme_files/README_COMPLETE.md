# 🎵 Kebena Church Song Display Web Application

> **Complete, Production-Ready React + TypeScript Application**
> 
> Professional worship presentation software for church services with Bible verses and song lyrics display.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [NEW: Enhanced Bible Display](#-new-enhanced-bible-display)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Support](#-support)

---

## ✨ Features

### 🎵 Song Display
- **Dual Song Libraries**: Hymnal (ውዳሴ) and Local Songs (ሀጋርኛ)
- **Search Functionality**: Search by number, Amharic title, or English title
- **PPT-Style Viewer**: Clean, readable presentation format
- **Slide Navigation**: Arrow keys for easy navigation
- **Real-time Sync**: Control panel syncs with display screen
- **File Upload**: Admin can upload PDF/PPT/DOCX files

### 📖 Bible Display (⭐ NEW ENHANCEMENTS)
- **Two Display Modes**:
  - Show on Preview (control PC only)
  - Show on Display (separate popup window for projector)
- **Advanced Keyboard Shortcuts**:
  - Press **Enter** to display verse
  - Press **←/→** to navigate verses (auto-updates display!)
  - Press **↑/↓** to change chapters
  - Press **PgUp/PgDn** to change books
  - Press **P** for preview only
  - Press **Esc** to clear
- **Auto-Update Feature**: Arrow keys automatically update the display window
- **Multiple Versions**: Amharic, English (KJV), and more
- **Full Bible**: All 66 books with offline fallback
- **Beautiful Display**: Large, readable fonts optimized for projection

### 👥 User Management
- **Role-Based Access**:
  - Regular Users: View-only access
  - Admin Users: Full control (add/edit/delete)
- **Secure Authentication**: JWT-based login system
- **User Dashboard**: Manage all user accounts

### 🎨 Customization
- **Background Control**: Change display wallpaper
- **Brand Colors**: Church colors (#865014, #E0AE3F, #F6EBD8)
- **Responsive Design**: Works on desktop and tablet

### 🔄 Real-Time Synchronization
- **Supabase Integration**: Real-time broadcast between control and display
- **Multi-Window Support**: Control from PC, display on projector
- **Instant Updates**: Changes appear immediately on all screens

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation (3 minutes)

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd kebena_backend
npm install
cd ..

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Initialize database
cd kebena_backend
node src/config/initDatabase.js
cd ..
```

### Run the App

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Opens at http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run backend
```
Runs at http://localhost:3001

### Default Login
- **Username**: admin
- **Password**: admin123
- ⚠️ Change password after first login!

---

## 🎹 NEW: Enhanced Bible Display

### Two Display Options

#### 1. Show on Preview (Eye Button - Brown)
- Displays verse in the preview panel on your control PC
- Perfect for checking verses before projecting
- Uses Supabase sync

#### 2. Show on Display (Monitor Button - Gold)
- Opens a **separate popup window** with the verse
- Drag this window to your **projector/extended screen**
- Press **F11** for fullscreen
- Works exactly like song presentation mode!

### Auto-Update Feature ⚡

**The game-changer for live services:**

When the presentation window is already open:
- Press **←** or **→** to navigate verses
- The display **automatically updates** - no need to reopen!
- Perfect for showing multiple verses during sermons

### Typical Workflow

```
1. Before Service:
   - Open Bible tab
   - Select John 3:16
   - Press Enter → popup window opens
   - Drag window to projector screen
   - Press F11 for fullscreen

2. During Service:
   - Press → to show verse 17 (auto-updates!)
   - Press → to show verse 18 (auto-updates!)
   - Press → to show verse 19 (auto-updates!)
   
3. After Service:
   - Press Esc to clear and close
```

### All Keyboard Shortcuts

| Key | Action | Auto-Update? |
|-----|--------|--------------|
| **Enter** | Show on Display | - |
| **P** | Preview Only | - |
| **←** | Previous Verse | ✅ Yes |
| **→** | Next Verse | ✅ Yes |
| **↑** | Previous Chapter | ❌ No |
| **↓** | Next Chapter | ❌ No |
| **PgUp** | Previous Book | ❌ No |
| **PgDn** | Next Book | ❌ No |
| **Esc** | Clear Display | - |

**💡 Pro Tip**: Verse navigation (←/→) auto-updates, but chapter/book changes require pressing Enter again. This prevents accidental changes during live services!

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.6.3
- **Build Tool**: Vite 6.0.1 (super fast!)
- **Styling**: Tailwind CSS 4.0.0
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **Real-time**: Supabase JS Client 2.45.1
- **Notifications**: Sonner (toast notifications)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (simple, file-based)
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: Multer + Mammoth (DOCX parser)

### External Services
- **Supabase**: Real-time broadcast (free tier OK)
- **Bible API**: GetBible.net (with offline fallback)

---

## 📁 Project Structure

```
kebena-church-song-display/
│
├── 📱 Frontend (React + TypeScript)
│   ├── components/           # React components
│   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   ├── BibleControl.tsx # ⭐ Enhanced with shortcuts
│   │   ├── BibleDisplay.tsx # Real-time Bible display
│   │   ├── LoginScreen.tsx  # Authentication
│   │   ├── SongList.tsx     # Song library browser
│   │   ├── SongViewer.tsx   # Song presentation mode
│   │   └── ui/              # Shadcn UI components
│   │
│   ├── services/            # Business logic
│   │   ├── api.ts           # Backend API client
│   │   ├── bibleService.ts  # Bible API integration
│   │   └── displayStateService.ts  # Supabase sync
│   │
│   ├── utils/               # Utilities
│   │   └── supabaseClient.ts
│   │
│   ├── styles/              # CSS
│   │   └── globals.css      # Tailwind + custom styles
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── index.html           # HTML template
│   ├── types.ts             # TypeScript definitions
│   │
│   └── ⚙️ Config Files
│       ├── package.json     # Dependencies
│       ├── tsconfig.json    # TypeScript config
│       ├── vite.config.ts   # Vite build config
│       ├── postcss.config.js
│       └── .env.example
│
├── 🖥️ Backend (Node.js + Express)
│   └── kebena_backend/
│       ├── src/
│       │   ├── server.js           # Main server
│       │   ├── controllers/        # Request handlers
│       │   │   ├── authController.js
│       │   │   └── songController.js
│       │   ├── routes/             # API routes
│       │   │   ├── authRoutes.js
│       │   │   └── songRoutes.js
│       │   ├── middleware/         # Middleware
│       │   │   ├── auth.js
│       │   │   └── upload.js
│       │   ├── config/             # Configuration
│       │   │   ├── database.js
│       │   │   └── initDatabase.js
│       │   └── utils/              # Utilities
│       │       └── fileProcessor.js
│       │
│       └── package.json
│
└── 📚 Documentation
    ├── README_COMPLETE.md          # ⭐ This file
    ├── DEPLOYMENT_GUIDE.md         # Deployment instructions
    ├── BIBLE_DISPLAY_GUIDE.md      # Bible feature guide
    ├── BIBLE_KEYBOARD_SHORTCUTS.md # Shortcuts reference
    ├── START_HERE.md               # Quick start
    └── kebena_backend/README.md    # Backend docs
```

---

## 💻 Installation

### Detailed Steps

1. **Clone or Download Project**
   ```bash
   # If using git
   git clone <your-repo-url>
   cd kebena-church-song-display

   # Or download and extract ZIP
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd kebena_backend
   npm install
   cd ..
   ```

4. **Setup Supabase**
   - Go to https://app.supabase.com
   - Create new project (free tier)
   - Get **Project URL** and **anon public key**
   - No tables needed - we only use Realtime Broadcast

5. **Configure Environment Variables**
   
   **Frontend (.env in root):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

   **Backend (kebena_backend/.env):**
   ```bash
   cd kebena_backend
   cp .env.example .env
   ```
   Edit `kebena_backend/.env`:
   ```env
   PORT=3001
   JWT_SECRET=your_very_secure_random_string_here
   NODE_ENV=development
   ```

6. **Initialize Database**
   ```bash
   cd kebena_backend
   node src/config/initDatabase.js
   ```
   This creates the SQLite database with:
   - Default admin user (admin/admin123)
   - Empty songs tables
   - User management tables

7. **Start Development Servers**
   
   **Terminal 1:**
   ```bash
   npm run dev
   ```

   **Terminal 2:**
   ```bash
   npm run backend
   ```

8. **Access the Application**
   - Open http://localhost:5173
   - Login with admin/admin123
   - Start adding songs and using Bible display!

---

## 📖 Usage

### For Worship Leaders (Regular Users)

1. **Display Songs**:
   - Browse Hymnal or Local Songs
   - Click a song to open viewer
   - Click "Show" button
   - Drag presentation window to projector
   - Use arrow keys to navigate slides

2. **Display Bible Verses**:
   - Go to Bible / መጽሐፍ ቅዱስ tab
   - Select book, chapter, verse
   - Press **Enter** (or click "Show on Display")
   - Drag window to projector
   - Press **F11** for fullscreen
   - Use **←/→** to navigate verses (auto-updates!)

3. **Quick Verse Navigation**:
   - With display open, just press arrow keys
   - **←** Previous verse (updates instantly)
   - **→** Next verse (updates instantly)
   - **↑** Previous chapter (press Enter to update)
   - **↓** Next chapter (press Enter to update)

### For Administrators

1. **Add New Songs**:
   - Go to Admin Panel
   - Click "Add New Song"
   - Upload PDF/PPT/DOCX or enter manually
   - Song appears in the library

2. **Edit Songs**:
   - Click edit icon on any song
   - Modify title, number, or lyrics
   - Save changes

3. **Manage Users**:
   - Create new user accounts
   - Assign roles (Admin or Regular)
   - Reset passwords

4. **Change Background**:
   - Upload custom wallpaper
   - Applies to both Bible and Song displays

---

## 🚢 Deployment

### Build for Production

```bash
# Build frontend
npm run build

# Output in dist/ folder
```

### Deploy Frontend

The `dist/` folder can be deployed to:

- **Vercel**:
  ```bash
  npm install -g vercel
  vercel deploy
  ```

- **Netlify**:
  - Drag and drop `dist/` folder to Netlify dashboard
  - Or use Netlify CLI

- **GitHub Pages**:
  - Push `dist/` to gh-pages branch
  - Enable GitHub Pages in settings

- **Any Static Host**:
  - Upload `dist/` folder contents via FTP

### Deploy Backend

The `kebena_backend/` folder can run on:

- **Railway**:
  - Connect GitHub repo
  - Auto-deploys on push

- **Render**:
  - Create Web Service
  - Connect repository

- **VPS (Linux Server)**:
  ```bash
  # Install PM2
  npm install -g pm2

  # Start server
  cd kebena_backend
  pm2 start src/server.js --name kebena-backend
  pm2 save
  pm2 startup
  ```

### Production Environment Variables

Update `.env` files for production:

**Frontend:**
```env
VITE_SUPABASE_URL=https://your-production.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_API_BASE_URL=https://api.yourchurch.com/api
```

**Backend:**
```env
PORT=3001
JWT_SECRET=super-long-random-string-min-32-chars
NODE_ENV=production
DATABASE_PATH=./database/production.db
```

---

## 📚 Documentation

### Quick Reference
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[BIBLE_DISPLAY_GUIDE.md](./BIBLE_DISPLAY_GUIDE.md)** - Bible feature documentation
- **[BIBLE_KEYBOARD_SHORTCUTS.md](./BIBLE_KEYBOARD_SHORTCUTS.md)** - Keyboard shortcuts reference (print this!)
- **[START_HERE.md](./START_HERE.md)** - Quick start guide

### Backend Documentation
- **[kebena_backend/README.md](./kebena_backend/README.md)** - Backend API documentation
- **[kebena_backend/SETUP_GUIDE.md](./kebena_backend/SETUP_GUIDE.md)** - Backend setup

---

## 🎯 Success Checklist

Your installation is successful when:

- ✅ Frontend runs at http://localhost:5173
- ✅ Backend runs at http://localhost:3001
- ✅ You can login with admin/admin123
- ✅ Songs load in both libraries
- ✅ Pressing **Enter** in Bible tab opens presentation window
- ✅ Arrow keys (**←/→**) navigate verses and auto-update display
- ✅ Presentation window can be dragged to projector
- ✅ F11 makes it fullscreen
- ✅ Supabase sync works between windows

---

## 🐛 Troubleshooting

### Frontend Issues

**App won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Supabase errors:**
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Enable Realtime in Supabase dashboard

### Backend Issues

**Server won't start:**
```bash
cd kebena_backend
rm -rf node_modules package-lock.json
npm install
node src/config/initDatabase.js
node src/server.js
```

**Database errors:**
```bash
cd kebena_backend
mv kebena.db kebena.db.backup
node src/config/initDatabase.js
```

### Bible Display Issues

**Verses not loading:**
- Bible API may be down (offline mode activates)
- John 3 and Psalms 23 work offline
- Check console (F12) for errors

**Presentation window doesn't open:**
- Check if popup blocker is active
- Try different browser
- Check console for errors

**Arrow keys don't auto-update:**
- Make sure presentation window is still open
- Check if window was closed accidentally
- Reopen with Enter key

---

## 🤝 Support

### Getting Help

1. **Check Documentation**: Read the guides above
2. **Console Logs**: Press F12 and check console
3. **Backend Logs**: Check terminal running backend
4. **Environment Variables**: Verify all .env files are correct

### Common Questions

**Q: Can I use this offline?**
A: Yes! Songs work completely offline. Bible verses need internet for full access, but John 3 and Psalms 23 work offline.

**Q: How many users can I create?**
A: Unlimited! The SQLite database can handle hundreds of users.

**Q: Can I customize the colors?**
A: Yes! Edit `styles/globals.css` and change the custom properties.

**Q: Does it work on Mac/Linux?**
A: Yes! It's cross-platform. Use the `.sh` scripts instead of `.bat` files.

**Q: Can I add my own Bible version?**
A: Currently uses GetBible.net API. You can fork and modify `services/bibleService.ts` to add custom sources.

---

## 📄 License

MIT License - Feel free to use for your church!

---

## 🙏 Credits

Built with love for **Kebena Church** ministry.

### Technologies Used
- React Team - for React
- Vercel - for Vite
- Tailwind Labs - for Tailwind CSS
- Shadcn - for UI components
- Supabase - for real-time features
- GetBible.net - for Bible API

---

## 🎉 You're Ready!

Your Kebena Church Song Display application is now:

- ✅ **Fully functional** React + TypeScript app
- ✅ **Production-ready** with proper configuration
- ✅ **Well-documented** with comprehensive guides
- ✅ **Feature-complete** with Bible and song display
- ✅ **Deployment-ready** for any hosting platform
- ✅ **Church-optimized** with keyboard shortcuts
- ✅ **Auto-updating** display for smooth worship services

**Download, run `npm install`, and start using it for your church services!**

---

**May God bless your worship ministry! 🙏✨**

**For any questions, check the documentation or console logs. Everything you need is included!**
