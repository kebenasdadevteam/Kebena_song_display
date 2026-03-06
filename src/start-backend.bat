@echo off
echo ========================================
echo  Kebena Church Backend Startup
echo ========================================
echo.

echo Checking if backend folder exists...
if not exist "kebena_backend" (
    echo ERROR: kebena_backend folder not found!
    echo Make sure you're running this from the project root.
    pause
    exit /b 1
)

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Navigating to backend folder...
cd kebena_backend

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
)

echo.
echo Checking .env file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo The .env file should have been created automatically.
    echo Please check the setup.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting Backend Server...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
