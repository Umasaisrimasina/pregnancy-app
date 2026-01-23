@echo off
title Pregnancy App - Development Server
cd /d "%~dp0"
echo Starting Pregnancy App...
echo.

:: Try ports 5173, 5174, 5175 in sequence
set PORT=5173

:check_port
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo Port %PORT% is in use, trying next port...
    if %PORT%==5173 set PORT=5174& goto check_port
    if %PORT%==5174 set PORT=5175& goto check_port
    if %PORT%==5175 set PORT=5176& goto check_port
    echo All ports 5173-5176 are in use. Please close other apps and try again.
    pause
    exit /b 1
)

echo.
echo The app will open in your browser at http://localhost:%PORT%
echo Press Ctrl+C to stop the server
echo.

:: Run vite with the available port
call npx vite --port %PORT%
pause
