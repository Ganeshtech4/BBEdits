@echo off
echo Creating deployment package...

REM Create temp directory
if exist deploy-package rmdir /s /q deploy-package
mkdir deploy-package
mkdir deploy-package\client
mkdir deploy-package\client\.next
mkdir deploy-package\client\public
mkdir deploy-package\build
mkdir deploy-package\mails

REM Copy files
echo Copying client build...
xcopy /E /I /Y client\.next deploy-package\client\.next

echo Copying client public...
xcopy /E /I /Y client\public deploy-package\client\public

echo Copying server build...
xcopy /E /I /Y build deploy-package\build

echo Copying email templates...
xcopy /E /I /Y mails deploy-package\mails

echo Copying config files...
copy /Y package.json deploy-package\
copy /Y ecosystem.config.js deploy-package\
copy /Y client\package.json deploy-package\client\
copy /Y client\next.config.js deploy-package\client\

REM Create zip (requires PowerShell)
echo Creating zip file...
powershell -command "Compress-Archive -Path deploy-package\* -DestinationPath bbedits-deploy.zip -Force"

echo.
echo ===================================
echo Package created: bbedits-deploy.zip
echo ===================================
echo.
echo Upload this file to your server and run:
echo   cd /var/www/anilweb
echo   unzip -o bbedits-deploy.zip
echo   pm2 restart ecosystem.config.js
echo   pm2 save
echo.

rmdir /s /q deploy-package
pause
