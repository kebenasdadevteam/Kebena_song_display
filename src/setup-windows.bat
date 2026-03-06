@echo off
echo ========================================
echo Kebena Church Song Display - Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL command not found in PATH
    echo Please ensure MySQL is installed and running
    echo Download from: https://dev.mysql.com/downloads/mysql/
    echo.
)

echo ========================================
echo Step 1: Installing Backend Dependencies
echo ========================================
cd kebena_backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo ========================================
echo Step 2: Creating uploads folder
echo ========================================
if not exist "uploads" mkdir uploads
echo [OK] Uploads folder ready
echo.

cd ..

echo ========================================
echo Step 3: Installing Frontend Dependencies  
echo ========================================
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo ========================================
echo Step 4: Database Setup
echo ========================================
echo.
echo Please ensure MySQL is running before continuing.
echo.
echo Default credentials in .env file:
echo   DB_HOST=localhost
echo   DB_USER=root
echo   DB_PASSWORD=(empty - change if you have a password)
echo   DB_NAME=kebena_church_db
echo.
set /p continue="Continue with database initialization? (Y/N): "
if /i "%continue%" neq "Y" (
    echo.
    echo Setup paused. Please update kebena_backend\.env with your MySQL credentials
    echo Then run: cd kebena_backend ^&^& npm run init-db
    echo.
    pause
    exit /b 0
)

cd kebena_backend
call npm run init-db
if %errorlevel% neq 0 (
    echo [ERROR] Database initialization failed
    echo Please check:
    echo   1. MySQL is running
    echo   2. Credentials in .env file are correct
    echo   3. You have permission to create databases
    echo.
    echo You can manually initialize later with: cd kebena_backend ^&^& npm run init-db
    cd ..
    pause
    exit /b 1
)
echo [OK] Database initialized successfully
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review kebena_backend\.env file and update MySQL password if needed
echo   2. Run start.bat to launch the application
echo   3. Open http://localhost:5173 in your browser
echo   4. Login with: admin / admin123
echo.
echo [IMPORTANT] Change the admin password after first login!
echo.
pause
