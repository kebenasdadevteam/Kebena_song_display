# 🗄️ MySQL Database Setup with XAMPP - Complete Guide

## ✅ What You Already Have

Good news! Your application is **already configured for MySQL**! The backend is using MySQL (not MongoDB), so you just need to connect it to your XAMPP database.

---

## 📋 Step-by-Step Setup Instructions

### **Step 1: Install and Start XAMPP**

1. **Download XAMPP** (if not installed):
   - Visit: https://www.apachefriends.org/
   - Download the version for your OS (Windows/Mac/Linux)
   - Install it (default installation is fine)

2. **Start MySQL in XAMPP**:
   - Open **XAMPP Control Panel**
   - Click **Start** button next to **MySQL** (Apache is optional - not needed for this app)
   - MySQL status should turn green
   - Default port is **3306**

3. **Verify MySQL is running**:
   - Click **Admin** button next to MySQL in XAMPP
   - This opens **phpMyAdmin** in your browser
   - You should see the phpMyAdmin dashboard

---

### **Step 2: Configure Your Backend**

1. **Navigate to the backend folder**:
   ```bash
   cd kebena_backend
   ```

2. **Create/Edit the `.env` file**:
   
   Create a file named `.env` in the `kebena_backend` folder with these settings:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MySQL Database Configuration (XAMPP Default)
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=kebena_church_db
   
   # JWT Secret (change this to a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=uploads
   
   # CORS (Frontend URL)
   FRONTEND_URL=http://localhost:5173
   ```

   **Important Notes**:
   - `DB_PASSWORD=` is blank (empty) - this is XAMPP's default
   - `DB_USER=root` is XAMPP's default MySQL username
   - If you changed MySQL password in XAMPP, update `DB_PASSWORD`

---

### **Step 3: Initialize the Database**

The backend includes an automatic database setup script!

1. **Install backend dependencies** (if not done):
   ```bash
   npm install
   ```

2. **Run the database initialization**:
   ```bash
   npm run init-db
   ```

   This script will:
   - ✅ Create the database `kebena_church_db`
   - ✅ Create all required tables (users, songs, files, settings, activity_logs)
   - ✅ Create a default admin user: `admin` / `admin123`
   - ✅ Add sample songs for testing

3. **Expected Output**:
   ```
   ✅ Connected to MySQL server
   ✅ Database 'kebena_church_db' created/verified
   ✅ Using database 'kebena_church_db'
   ✅ All tables created successfully
   
   👤 Creating default admin user...
   ✅ Default admin user created
      Username: admin
      Password: admin123
   
   ✅ Default settings configured
   📝 Creating sample songs...
   ✅ 3 sample songs created
   
   🎉 Database initialization completed successfully!
   ```

---

### **Step 4: Start the Backend Server**

```bash
npm start
```

or use the convenient script:

```bash
# Windows
..\start-backend.bat

# Mac/Linux
../start-backend.sh
```

**Expected Output**:
```
✅ MySQL Database connected successfully!
   Database: kebena_church_db
   Host: localhost:3306

✅ Server running on port 5000
🌐 API: http://localhost:5000
📚 Ready to serve requests!
```

---

### **Step 5: Start the Frontend**

In a new terminal, from the root directory:

```bash
npm run dev
```

Your app should now be running at: **http://localhost:5173**

---

## 🔍 Verify Database Connection

### **Method 1: Using phpMyAdmin (Easiest)**

1. Open XAMPP Control Panel
2. Click **Admin** next to MySQL
3. In phpMyAdmin, you should see `kebena_church_db` in the left sidebar
4. Click it to expand and see tables:
   - `users` - User accounts
   - `songs` - Song data
   - `files` - Uploaded files
   - `settings` - App settings
   - `activity_logs` - Activity tracking

### **Method 2: Test the Login**

1. Open the app: http://localhost:5173
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. If login works, database connection is successful! ✅

---

## 📊 Database Structure

Your database has these tables:

### **1. `users` Table**
- Stores user accounts (admin and regular users)
- Fields: id, username, password, full_name, role, email, created_at, etc.

### **2. `songs` Table**
- Stores all hymnal and local songs
- Fields: id, number, category, title_amharic, title_english, lyrics (JSON), etc.

### **3. `files` Table**
- Stores uploaded PPT/PDF files
- Fields: id, song_id, filename, file_path, file_size, etc.

### **4. `settings` Table**
- App configuration settings
- Fields: id, setting_key, setting_value, description

### **5. `activity_logs` Table**
- Tracks user actions
- Fields: id, user_id, action, entity_type, details, created_at

---

## 🛠️ Troubleshooting

### ❌ Problem: "Error connecting to MySQL database: ECONNREFUSED"

**Solution**:
- MySQL is not running in XAMPP
- Open XAMPP Control Panel
- Click **Start** next to MySQL

---

### ❌ Problem: "Database 'kebena_church_db' does not exist"

**Solution**:
- Run the initialization script:
  ```bash
  cd kebena_backend
  npm run init-db
  ```

---

### ❌ Problem: "Access denied for user 'root'@'localhost'"

**Solutions**:

1. **Check if you set a MySQL password in XAMPP**:
   - Open XAMPP Control Panel
   - Click **Shell** button
   - Type: `mysql -u root -p`
   - If it asks for password, you have one set
   - Update your `.env` file with: `DB_PASSWORD=your_password`

2. **Reset MySQL root password in XAMPP**:
   - Stop MySQL in XAMPP
   - Edit `C:\xampp\mysql\bin\my.ini` (Windows) or `/Applications/XAMPP/xamppfiles/etc/my.cnf` (Mac)
   - Under `[mysqld]`, add: `skip-grant-tables`
   - Start MySQL
   - Open phpMyAdmin and reset the password
   - Remove `skip-grant-tables` from config
   - Restart MySQL

---

### ❌ Problem: "Port 3306 already in use"

**Solution**:
- Another MySQL service is running
- Check Task Manager (Windows) or Activity Monitor (Mac)
- Stop other MySQL services
- Or change the port in XAMPP (not recommended)

---

### ❌ Problem: Backend starts but can't query database

**Solution**:
- Check if tables exist:
  - Open phpMyAdmin
  - Select `kebena_church_db`
  - You should see 5 tables
- If tables don't exist, run: `npm run init-db`

---

## 🎯 Quick Test Queries

Want to manually check your data? Use phpMyAdmin SQL tab:

### Check all users:
```sql
SELECT id, username, full_name, role FROM users;
```

### Check all songs:
```sql
SELECT id, number, category, title_amharic, title_english FROM songs;
```

### Count songs by category:
```sql
SELECT category, COUNT(*) as count FROM songs GROUP BY category;
```

### Check admin user:
```sql
SELECT * FROM users WHERE role = 'admin';
```

---

## 🔐 Security Notes

### **For Development (Current Setup)**
- Default password: `admin123` is fine for local testing
- No password on MySQL root is fine (localhost only)

### **For Production (When Deploying)**
You MUST:
1. Change admin password in the app
2. Set a strong MySQL root password
3. Change the `JWT_SECRET` in `.env`
4. Use a dedicated MySQL user (not root)
5. Enable firewall rules
6. Use HTTPS

---

## 📁 File Locations (XAMPP)

### **Windows**
- XAMPP Root: `C:\xampp\`
- MySQL Data: `C:\xampp\mysql\data\kebena_church_db\`
- MySQL Config: `C:\xampp\mysql\bin\my.ini`
- phpMyAdmin Config: `C:\xampp\phpMyAdmin\config.inc.php`

### **Mac**
- XAMPP Root: `/Applications/XAMPP/xamppfiles/`
- MySQL Data: `/Applications/XAMPP/xamppfiles/var/mysql/kebena_church_db/`
- MySQL Config: `/Applications/XAMPP/xamppfiles/etc/my.cnf`

### **Linux**
- XAMPP Root: `/opt/lampp/`
- MySQL Data: `/opt/lampp/var/mysql/kebena_church_db/`
- MySQL Config: `/opt/lampp/etc/my.cnf`

---

## 🔄 Backup & Restore

### **Backup Database**

**Method 1: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select `kebena_church_db`
3. Click **Export** tab
4. Click **Go** (default settings are fine)
5. Save the `.sql` file

**Method 2: Using Command Line**
```bash
# Windows (from XAMPP shell)
mysqldump -u root kebena_church_db > backup.sql

# Mac/Linux
/Applications/XAMPP/xamppfiles/bin/mysqldump -u root kebena_church_db > backup.sql
```

### **Restore Database**

**Method 1: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select `kebena_church_db`
3. Click **Import** tab
4. Choose your `.sql` file
5. Click **Go**

**Method 2: Using Command Line**
```bash
# Windows (from XAMPP shell)
mysql -u root kebena_church_db < backup.sql

# Mac/Linux
/Applications/XAMPP/xamppfiles/bin/mysql -u root kebena_church_db < backup.sql
```

---

## ✅ Next Steps

After setting up the database:

1. ✅ Login as admin (`admin` / `admin123`)
2. ✅ Create more user accounts (Admin Panel → User Management)
3. ✅ Add your church songs (Admin Panel → Add Song)
4. ✅ Test Bible display feature
5. ✅ Configure backgrounds (Admin Panel → Settings)
6. ✅ Change admin password for security

---

## 📞 Need Help?

Common questions:

**Q: Can I use a different database name?**
A: Yes! Change `DB_NAME` in `.env` and run `npm run init-db` again.

**Q: Can I connect to a remote MySQL server?**
A: Yes! Change `DB_HOST` in `.env` to the remote server IP/domain.

**Q: How do I add Bible verses to the database?**
A: Bible verses are fetched from an external API, not stored locally. No database setup needed for Bible feature!

**Q: Can I migrate from SQLite to MySQL?**
A: Yes, but you'll need to export data from SQLite and import into MySQL. The schema is already MySQL-compatible.

**Q: Should I use XAMPP in production?**
A: No! XAMPP is for development only. For production, use a proper MySQL server setup (managed hosting, cloud database, etc.).

---

## 🎉 Success Checklist

- [ ] XAMPP installed
- [ ] MySQL started in XAMPP (green status)
- [ ] `.env` file created in `kebena_backend` folder
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database initialized (`npm run init-db`)
- [ ] Backend server running (`npm start`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can login with admin credentials
- [ ] Can see songs in the app
- [ ] Database visible in phpMyAdmin

If all items are checked, you're ready to use the app! 🎊

---

**Made with ❤️ for Kebena Church**
