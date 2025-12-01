@echo off
echo ========================================
echo AI-LMS Setup and Run Script
echo ========================================
echo.

echo Step 1: Configuring npm cache...
call npm config set cache "%USERPROFILE%\AppData\Local\npm-cache" --global

echo.
echo Step 2: Cleaning npm cache...
call npm cache clean --force

echo.
echo Step 3: Installing dependencies...
call npm install

echo.
echo Step 4: Starting development server...
echo The app will open at http://localhost:3000
echo.
call npm run dev

pause
