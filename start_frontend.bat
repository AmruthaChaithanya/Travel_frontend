@echo off
REM MyTravel Frontend Quick Start Script for Windows

echo ========================================
echo   MyTravel Frontend - Starting Server
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)

echo.
echo Starting development server...
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend should be running at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
