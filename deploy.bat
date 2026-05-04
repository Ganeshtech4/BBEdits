@echo off
REM ============================================
REM BBEdits Deployment Script (Windows)
REM ============================================

set SERVER_USER=root
set SERVER_IP=88.222.245.226
set SERVER_PATH=/var/www/anilweb
set SSH_KEY=/c/Users/Administrator/.ssh/id_ed25519_bbedits
set BASH="C:\Program Files\Git\bin\bash.exe"
set SSH_OPTS=-i "%SSH_KEY%" -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=120

echo.
echo ========================================
echo  BBEdits Deployment Starting...
echo ========================================
echo.

REM Step 1: Build Client
if exist "client\.next" (
    echo [Step 1] Client build exists - SKIPPING
) else (
    echo [Step 1] Building client...
    cd client
    call npm run build
    if %errorlevel% neq 0 ( echo ERROR: Client build failed! & exit /b 1 )
    cd ..
    echo Client built OK
)
echo.

REM Step 2: Build Server
if exist "build" (
    echo [Step 2] Server build exists - SKIPPING
) else (
    echo [Step 2] Building server...
    call npm run build
    if %errorlevel% neq 0 ( echo ERROR: Server build failed! & exit /b 1 )
    echo Server built OK
)
echo.

REM Step 3: Pack archives with correct paths
echo [Step 3] Packaging...

if exist "client\.next\cache" rd /s /q "client\.next\cache"

%BASH% -c "cd '/e/Work/Clients/bb/anilweb' && tar czf /tmp/deploy-client.tar.gz -C client .next package.json next.config.js && tar czf /tmp/deploy-server.tar.gz build mails package.json ecosystem.config.js && echo PACKED_OK"
if %errorlevel% neq 0 ( echo ERROR: Packaging failed! & exit /b 1 )
echo Packed OK
echo.

REM Step 4: Upload via tmpfiles.org + server wget (bypasses SSH large-file crash)
echo [Step 4] Uploading and deploying...
%BASH% -c "
  set -e
  SSH_KEY=/c/Users/Administrator/.ssh/id_ed25519_bbedits
  SSH=\"ssh -i \$SSH_KEY -o StrictHostKeyChecking=no\"
  SERVER=root@88.222.245.226

  echo 'Uploading client build to tmpfiles.org...'
  CLIENT_RAW=\$(curl -sF 'file=@/tmp/deploy-client.tar.gz' https://tmpfiles.org/api/v1/upload)
  CLIENT_URL=\$(echo \"\$CLIENT_RAW\" | grep -o 'http[^\"]*' | sed 's|tmpfiles.org/|tmpfiles.org/dl/|')
  [ -z \"\$CLIENT_URL\" ] && echo \"Upload failed: \$CLIENT_RAW\" && exit 1
  echo \"Client URL: \$CLIENT_URL\"

  echo 'Uploading server build to tmpfiles.org...'
  SERVER_RAW=\$(curl -sF 'file=@/tmp/deploy-server.tar.gz' https://tmpfiles.org/api/v1/upload)
  SERVER_URL=\$(echo \"\$SERVER_RAW\" | grep -o 'http[^\"]*' | sed 's|tmpfiles.org/|tmpfiles.org/dl/|')
  [ -z \"\$SERVER_URL\" ] && echo \"Upload failed: \$SERVER_RAW\" && exit 1
  echo \"Server URL: \$SERVER_URL\"

  rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz

  echo 'Server downloading and deploying...'
  \$SSH \$SERVER \"
    set -e
    cd /var/www/anilweb
    wget -q '\$CLIENT_URL' -O /tmp/deploy-client.tar.gz
    wget -q '\$SERVER_URL' -O /tmp/deploy-server.tar.gz
    tar xzf /tmp/deploy-server.tar.gz
    tar xzf /tmp/deploy-client.tar.gz -C client
    rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz
    npm install --omit=dev --silent
    cd client && npm install --omit=dev --silent && cd ..
    pm2 restart ecosystem.config.js --update-env
    pm2 save
    pm2 list
    echo DEPLOY_DONE
  \"
"
if %errorlevel% neq 0 ( echo ERROR: Deployment failed! & exit /b 1 )

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo Check: https://bbedits.in
echo.
