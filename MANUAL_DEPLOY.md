# Manual Deployment Guide

Since SSH is timing out, follow these steps with your server terminal open:

## Files to Transfer

You need to upload these directories/files from your local machine to the server:

### 1. Client Build (Next.js)
**Local:** `E:\Work\Clients\bb\anilweb\client\.next\*`
**Server:** `/var/www/anilweb/client/.next/`

### 2. Client Public Files
**Local:** `E:\Work\Clients\bb\anilweb\client\public\*`
**Server:** `/var/www/anilweb/client/public/`

### 3. Server Build
**Local:** `E:\Work\Clients\bb\anilweb\build\*`
**Server:** `/var/www/anilweb/build/`

### 4. Email Templates
**Local:** `E:\Work\Clients\bb\anilweb\mails\*`
**Server:** `/var/www/anilweb/mails/`

### 5. Configuration Files
- `package.json` → `/var/www/anilweb/`
- `ecosystem.config.js` → `/var/www/anilweb/`
- `client/package.json` → `/var/www/anilweb/client/`
- `client/next.config.js` → `/var/www/anilweb/client/`

## Option 1: Using Hostinger File Manager

1. Login to Hostinger control panel
2. Go to File Manager
3. Navigate to `/var/www/anilweb/`
4. Upload the folders/files listed above
5. After upload, run in server terminal:
```bash
cd /var/www/anilweb
pm2 restart ecosystem.config.js
pm2 save
```

## Option 2: Using SFTP Client (FileZilla/WinSCP)

1. Connect to: 88.222.245.226
2. Port: 22 (or check Hostinger panel for SFTP port)
3. Upload the directories listed above
4. Restart PM2 in server terminal

## Option 3: Direct Server Commands

Run these commands in your open server terminal:

```bash
cd /var/www/anilweb

# Create backup
BACKUP_DIR="backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r build $BACKUP_DIR/ 2>/dev/null || true
cp -r client/.next $BACKUP_DIR/ 2>/dev/null || true

# Restart application (after you upload files)
pm2 restart ecosystem.config.js --update-env
pm2 save
pm2 list
```

## Quick Check - Changed Files Summary

The phone number updates are in:
- `client/.next/` (Next.js build - contains all React components)
- `mails/*.ejs` (Email templates)

**Most critical:** Upload `client/.next/` folder - this has all the updated phone numbers.
