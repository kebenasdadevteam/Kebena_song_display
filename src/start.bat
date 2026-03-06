@echo off
echo ========================================
echo Kebena Church Song Display - Starting
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "kebena_backend\node_modules" (
    echo [ERROR] Backend dependencies not installed
    echo Please run setup-windows.bat first
    pause
    exit /b 1
)

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo [ERROR] Frontend dependencies not installed
    echo Please run setup-windows.bat first
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Kebena Backend" cmd /k "cd kebena_backend && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Kebena Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Press Ctrl+C in each window to stop the servers
echo.

REM Try to open browser
start http://localhost:5173

pause
