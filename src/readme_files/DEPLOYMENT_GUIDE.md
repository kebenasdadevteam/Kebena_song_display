# 🚀 Kebena Church Song Display - Deployment Guide

This is a complete, deployment-ready React + TypeScript project for church worship services.

## ✅ Project Structure

```
kebena-church-song-display/
├── components/              # React components
│   ├── AdminPanel.tsx
│   ├── BibleControl.tsx    # ⭐ NEW: Enhanced with shortcuts
│   ├── BibleDisplay.tsx
│   ├── LoginScreen.tsx
│   ├── SongList.tsx
│   ├── SongViewer.tsx
│   └── ui/                 # Shadcn UI components
├── services/               # API and business logic
│   ├── api.ts              # Backend API service
│   ├── bibleService.ts     # Bible API integration
│   └── displayStateService.ts  # Supabase real-time sync
├── utils/                  # Utilities
│   └── supabaseClient.ts
├── styles/                 # CSS styles
│   └── globals.css         # Tailwind + custom styles
├── kebena_backend/         # Node.js backend server
│   ├── src/
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
├── index.html              # HTML template
├── package.json            # ⭐ Frontend dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── .env.example            # Environment variables template

```

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git** (optional, for version control)
- **Supabase Account** (free tier works fine)

## 🛠️ Installation Steps

### Step 1: Download the Project

Download this entire project folder to your local machine.

### Step 2: Install Frontend Dependencies

Open terminal/command prompt in the project root folder and run:

```bash
# IMPORTANT: Clean install to avoid conflicts
npm install
```

**This installs Tailwind CSS v4** which is required for styling.

**Verify Tailwind is installed:**
```bash
npm list tailwindcss
# Should show: tailwindcss@4.0.0-alpha.25
```

⚠️ **If styling doesn't work, see [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)**

### Step 3: Install Backend Dependencies

Navigate to the backend folder and install:

```bash
cd kebena_backend
npm install
cd ..
```

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

3. Get Supabase credentials:
   - Go to https://app.supabase.com
   - Create a new project (or use existing)
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public** key

### Step 5: Configure Backend

1. Navigate to backend folder:
   ```bash
   cd kebena_backend
   ```

2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

3. Edit `kebena_backend/.env`:
   ```env
   PORT=3001
   JWT_SECRET=your_secure_random_string_here
   NODE_ENV=development
   ```

4. Initialize the database:
   ```bash
   node src/config/initDatabase.js
   ```

5. Return to root folder:
   ```bash
   cd ..
   ```

## 🎯 Running the Application

### Development Mode (Recommended for Testing)

You need TWO terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
This starts the React app at http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run backend
```
This starts the Node.js API server at http://localhost:3001

### Quick Start Scripts (Windows)

Use the included batch files:

```bash
# Start backend
start-backend.bat

# Start frontend
start.bat
```

### Quick Start Scripts (Mac/Linux)

Use the included shell scripts:

```bash
# Make scripts executable (first time only)
chmod +x start-backend.sh start.sh

# Start backend
./start-backend.sh

# Start frontend
./start.sh
```

## 🌐 Production Build

### Build Frontend for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy Frontend

The `dist/` folder can be deployed to:
- **Vercel**: Upload via Vercel dashboard or CLI
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **Any static hosting**: Upload `dist` folder contents

### Deploy Backend

The `kebena_backend/` folder can be deployed to:
- **Railway**: Connect GitHub repo
- **Render**: Web Service deployment
- **Heroku**: Git push deployment
- **VPS**: Copy folder and run with PM2

Example PM2 deployment:
```bash
npm install -g pm2
cd kebena_backend
pm2 start src/server.js --name kebena-backend
pm2 save
pm2 startup
```

## ⚙️ Configuration

### Supabase Setup

1. Create a **Supabase project**
2. No tables needed - we only use **Realtime Broadcast** feature
3. Enable **Realtime** in project settings
4. Copy credentials to `.env` file

### Backend Database

The backend uses **SQLite** for local development. On first run:
```bash
cd kebena_backend
node src/config/initDatabase.js
```

This creates:
- `users` table with default admin account
- `songs` table for hymnal and local songs
- Default admin user: **username: admin, password: admin123**

⚠️ **Important**: Change the default admin password after first login!

## 🎹 New Keyboard Shortcuts

The Bible Control now includes advanced keyboard shortcuts:

| Key | Action |
|-----|--------|
| **Enter** | Show verse on display window |
| **P** | Show on preview panel only |
| **←/→** | Previous/Next verse (auto-updates if display open) |
| **↑/↓** | Previous/Next chapter |
| **PgUp/PgDn** | Previous/Next book |
| **Esc** | Clear all displays |

### Auto-Update Feature

When the Bible presentation window is open:
- Pressing **←** or **→** automatically updates the display
- No need to click "Show on Display" again
- Perfect for quickly navigating during sermons!

## 📱 Usage During Church Service

### Bible Display Workflow:

1. **Before Service:**
   - Open the app on your control PC
   - Select Bible tab
   - Press **Enter** or click "Show on Display"
   - A popup window appears
   - **Drag this window to your projector screen**
   - Press **F11** for fullscreen

2. **During Service:**
   - Use **←/→** arrow keys to change verses
   - Display automatically updates!
   - Use **↑/↓** to change chapters
   - Press **P** to preview before showing

3. **After Service:**
   - Press **Esc** to clear
   - Or close the presentation window

### Song Display Workflow:

1. Click a song from the list
2. Click "Show" in the song viewer
3. Display window updates (same window as Bible)
4. Use **←/→** to navigate slides
5. Click "Hide" or press **Esc** to clear

## 🔒 Security Notes

### For Production Deployment:

1. **Change default admin password immediately**
2. **Use strong JWT_SECRET** in backend `.env`
3. **Enable HTTPS** on production servers
4. **Set proper CORS** in `kebena_backend/src/server.js`
5. **Use environment variables** for all secrets

### Recommended .env for Production:

```env
# Frontend (.env in root)
VITE_SUPABASE_URL=https://your-production.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_API_BASE_URL=https://your-backend-domain.com/api

# Backend (kebena_backend/.env)
PORT=3001
JWT_SECRET=very-long-random-string-at-least-32-characters
NODE_ENV=production
DATABASE_PATH=./database/production.db
```

## 📊 Technology Stack

- **Frontend:**
  - React 18.3.1
  - TypeScript 5.6.3
  - Vite 6.0.1
  - Tailwind CSS 4.0.0
  - Shadcn UI components
  - Supabase JS Client 2.45.1

- **Backend:**
  - Node.js
  - Express.js
  - SQLite3
  - JWT authentication
  - Multer (file uploads)
  - Mammoth (DOCX parsing)

## 🐛 Troubleshooting

### Frontend won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start

```bash
cd kebena_backend
rm -rf node_modules package-lock.json
npm install
node src/config/initDatabase.js
node src/server.js
```

### Supabase connection issues

1. Check `.env` file has correct credentials
2. Verify Supabase project is active
3. Check browser console for errors
4. Enable Realtime in Supabase dashboard

### Bible verses not loading

1. Bible API may be down - offline mode activates automatically
2. John 3 and Psalms 23 work offline
3. Check console for API errors

### Database errors

```bash
cd kebena_backend
# Backup old database
mv kebena.db kebena.db.backup
# Reinitialize
node src/config/initDatabase.js
```

## 📖 Documentation Files

- `README.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - This file
- `BIBLE_DISPLAY_GUIDE.md` - Bible feature guide
- `START_HERE.md` - Quick start guide
- `kebena_backend/README.md` - Backend documentation

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs (F12 in browser)
3. Check backend logs in terminal
4. Verify all environment variables are set

## 🎉 Success Criteria

Your deployment is successful when:

✅ Frontend runs at http://localhost:5173
✅ Backend runs at http://localhost:3001
✅ You can login with admin/admin123
✅ Songs load in both Hymnal and Local Songs
✅ Bible verses display when pressing Enter
✅ Presentation window opens and can be moved
✅ Arrow keys navigate and auto-update display
✅ Supabase sync works between windows

## 📦 Project Files Checklist

Make sure you have all these files:

### Frontend Config:
- [x] package.json
- [x] tsconfig.json
- [x] tsconfig.node.json
- [x] vite.config.ts
- [x] index.html
- [x] main.tsx
- [x] vite-env.d.ts
- [x] .env.example
- [x] .gitignore
- [x] public/vite.svg

### Source Files:
- [x] App.tsx
- [x] types.ts
- [x] components/ folder
- [x] services/ folder
- [x] utils/ folder
- [x] styles/globals.css

### Backend Files:
- [x] kebena_backend/package.json
- [x] kebena_backend/src/server.js
- [x] kebena_backend/.env.example

## 🚢 Ready to Deploy!

Your project is now a complete, production-ready React TypeScript application with:

- ✅ Proper TypeScript configuration
- ✅ Vite build system
- ✅ Professional folder structure
- ✅ Environment variable management
- ✅ Development and production scripts
- ✅ Complete documentation
- ✅ Backend API server
- ✅ Database system
- ✅ Real-time synchronization
- ✅ Advanced keyboard shortcuts
- ✅ Auto-update display feature

**You can now deploy this to any hosting platform!**

---

**God bless your ministry! 🙏**