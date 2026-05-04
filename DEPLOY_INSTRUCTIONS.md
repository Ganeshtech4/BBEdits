# Manual Deployment Instructions

Since SSH is not connecting, follow these steps to deploy manually.

## What Was Updated

✅ **New About Page** - Beautiful profiles for Anil (Premiere Pro) & Hemanth (After Effects)
✅ **Phone Numbers** - Support: 9110772715, Hire: 9398008571
✅ **Footer Links** - Updated to BB Edits YouTube & Instagram
✅ **Card Images** - Fixed rounded corners

## Option 1: Using Hostinger File Manager (Easiest)

### Step 1: Zip the files locally

Run this command in PowerShell:
```powershell
Compress-Archive -Path "E:\Work\Clients\bb\anilweb\client\.next\*" `
                 -DestinationPath "E:\Work\Clients\bb\anilweb\client-build.zip" -Force

Compress-Archive -Path "E:\Work\Clients\bb\anilweb\build\*" `
                 -DestinationPath "E:\Work\Clients\bb\anilweb\server-build.zip" -Force

Compress-Archive -Path "E:\Work\Clients\bb\anilweb\mails\*" `
                 -DestinationPath "E:\Work\Clients\bb\anilweb\mails-build.zip" -Force
```

### Step 2: Upload via Hostinger File Manager

1. Login to Hostinger control panel
2. Open File Manager
3. Navigate to `/var/www/anilweb/`
4. Upload these zip files:
   - `client-build.zip`
   - `server-build.zip`
   - `mails-build.zip`

### Step 3: Extract on Server

In your **open server terminal**, run:
```bash
cd /var/www/anilweb

# Backup first
BACKUP_DIR="backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r build $BACKUP_DIR/ 2>/dev/null || true
cp -r client/.next $BACKUP_DIR/ 2>/dev/null || true

# Extract uploads
unzip -o client-build.zip -d client/.next/
unzip -o server-build.zip -d build/
unzip -o mails-build.zip -d mails/

# Clean up zip files
rm -f client-build.zip server-build.zip mails-build.zip

# Restart PM2
pm2 restart ecosystem.config.js --update-env
pm2 save
pm2 list
```

## Option 2: Direct Copy (If you have SFTP access on different port)

Check your Hostinger panel for SFTP port (might be different from 22).

## Option 3: Transfer via Your Server Terminal

If you can access your local Windows files from the server terminal:

```bash
# On server, download directly from your local machine
# (This only works if both are on same network or you have direct access)
scp -r user@your-local-ip:E:/Work/Clients/bb/anilweb/client/.next/* /var/www/anilweb/client/.next/
scp -r user@your-local-ip:E:/Work/Clients/bb/anilweb/build/* /var/www/anilweb/build/
scp -r user@your-local-ip:E:/Work/Clients/bb/anilweb/mails/* /var/www/anilweb/mails/
```

## Verification

After deployment, in server terminal:
```bash
pm2 logs bbedits-backend --lines 50
```

Check your website: https://bbedits.in

## Files Summary

**Client Build:** `E:\Work\Clients\bb\anilweb\client\.next\` → `/var/www/anilweb/client/.next/`
**Server Build:** `E:\Work\Clients\bb\anilweb\build\` → `/var/www/anilweb/build/`
**Email Templates:** `E:\Work\Clients\bb\anilweb\mails\` → `/var/www/anilweb/mails/`
