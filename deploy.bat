@echo off
REM ============================================
REM BBEdits Deployment Script (Windows)
REM Build Locally, Deploy to Server
REM ============================================

REM Configuration - UPDATE THESE VALUES
set SERVER_USER=root
set SERVER_IP=your-server-ip
set SERVER_PATH=/var/www/anilweb
set APP_NAME=anilweb

echo.
echo ========================================
echo BBEdits Deployment Starting...
echo ========================================
echo.

REM ============================================
REM Step 1: Build Client (Next.js)
REM ============================================
echo [Step 1] Building client (Next.js)...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Client build failed!
    exit /b 1
)
cd ..
echo Client built successfully
echo.

REM ============================================
REM Step 2: Build Server (TypeScript)
REM ============================================
echo [Step 2] Building server (TypeScript)...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Server build failed!
    exit /b 1
)
echo Server built successfully
echo.

REM ============================================
REM Step 3: Transfer Files to Server
REM ============================================
echo [Step 3] Transferring files to server...
echo NOTE: This requires SCP/rsync on Windows (Git Bash, WSL, or WinSCP)
echo.
echo Manual transfer instructions:
echo 1. Use WinSCP or FileZilla to connect to %SERVER_IP%
echo 2. Transfer these folders:
echo    - client\.next\  to  %SERVER_PATH%/client/.next/
echo    - build\  to  %SERVER_PATH%/build/
echo    - mails\  to  %SERVER_PATH%/mails/
echo 3. Transfer these files:
echo    - package.json  to  %SERVER_PATH%/
echo    - ecosystem.config.js  to  %SERVER_PATH%/
echo    - client\package.json  to  %SERVER_PATH%/client/
echo    - client\next.config.js  to  %SERVER_PATH%/client/
echo.

REM If you have Git Bash installed, uncomment these lines:
REM bash -c "scp -r client/.next %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/client/"
REM bash -c "scp -r build %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/"
REM bash -c "scp -r mails %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/"
REM bash -c "scp package.json ecosystem.config.js %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/"
REM bash -c "scp client/package.json client/next.config.js %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/client/"

pause
echo.

REM ============================================
REM Step 4 & 5: Run commands on server via SSH
REM ============================================
echo [Step 4] Install dependencies and restart on server
echo.
echo Connect to your server and run:
echo.
echo   cd %SERVER_PATH%
echo   npm install --production
echo   cd client
echo   npm install --production
echo   cd ..
echo   pm2 restart ecosystem.config.js --update-env
echo   pm2 save
echo   pm2 list
echo.

pause

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Check your application at: http://%SERVER_IP%
echo.
