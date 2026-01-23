@echo off
title Pregnancy App - Development Server
cd /d "%~dp0"
echo Starting Pregnancy App...
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting development server...
echo The app will open in your browser automatically
echo Press Ctrl+C to stop the server
echo.

:: Run npm dev script
call npm run dev
pause
