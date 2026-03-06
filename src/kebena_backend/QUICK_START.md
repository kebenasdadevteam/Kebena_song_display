# Quick Start Guide - 5 Minutes Setup

Get your backend running in 5 minutes!

## Prerequisites

✅ Node.js installed  
✅ XAMPP installed  
✅ MySQL running in XAMPP

## Steps

### 1. Install Dependencies (1 minute)

```bash
cd kebena_backend
npm install
```

### 2. Configure Environment (30 seconds)

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**No need to edit** - defaults work with XAMPP!

### 3. Initialize Database (30 seconds)

```bash
npm run init-db
```

Expected output:
```
✅ MySQL Database connected successfully!
✅ Database 'kebena_church_db' created/verified
✅ All tables created successfully
✅ Default admin user created
   Username: admin
   Password: admin123
```

### 4. Start Server (10 seconds)

```bash
npm start
```

Expected output:
```
🚀 Server running on port 5000
✅ Server is ready to accept requests
```

### 5. Verify (30 seconds)

Open browser: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "message": "Kebena Church API is running"
}
```

## ✅ Done!

Your backend is running! 

**Default Login:**
- Username: `admin`
- Password: `admin123`

## Next Steps

1. **Keep this terminal open** (server must stay running)
2. **Open a new terminal** for frontend
3. **Follow SETUP_GUIDE.md** to connect frontend

## API Endpoints

- Health: http://localhost:5000/health
- Login: http://localhost:5000/api/auth/login
- Songs: http://localhost:5000/api/songs

## Common Commands

```bash
# Start server
npm start

# Start with auto-restart (development)
npm run dev

# Reinitialize database (WARNING: deletes all data!)
npm run init-db
```

## Troubleshooting

**Error: "Cannot connect to MySQL"**
- Start MySQL in XAMPP Control Panel

**Error: "Port 5000 already in use"**
- Change PORT in .env to 5001

**Error: "Database not found"**
- Run: `npm run init-db`

---

**Need more help?** See README.md for full documentation.
