@echo off
setlocal
title Pregnancy App - Development Server
cd /d "%~dp0"

echo ===================================================
echo   Pregnancy App Development Server
echo ===================================================
echo.

:: 1. Cleanup Port 3000
echo [1/3] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo       Killing process %%a...
    taskkill /PID %%a /F >nul 2>&1
)

:: 2. Check Dependencies
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo       Installing...
    call npm install
) else (
    echo       Dependencies found.
)

:: 3. Start Server
echo [3/3] Starting Vite Server...
echo.
echo       The app will open at: http://localhost:3000
echo.

:: Open browser after 3 seconds asynchronously
start "" /b cmd /c "timeout /t 3 >nul & start http://localhost:3000"

:: Start the server
call npm run dev
