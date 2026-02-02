#!/bin/bash

# ============================================
# BBEdits Deployment Script
# Build Locally, Deploy to Server
# ============================================

# Configuration - UPDATE THESE VALUES
SERVER_USER="root"
SERVER_IP="88.222.245.226"
SERVER_PATH="/var/www/anilweb"
APP_NAME="bbedits-backend"  # Matches ecosystem.config.js

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting BBEdits Deployment...${NC}\n"

# ============================================
# Step 1: Build Client (Next.js)
# ============================================
echo -e "${GREEN}📦 Step 1: Building client (Next.js)...${NC}"
cd client || exit 1
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Client build failed!${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Client built successfully${NC}\n"

# ============================================
# Step 2: Build Server (TypeScript)
# ============================================
echo -e "${GREEN}📦 Step 2: Building server (TypeScript)...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Server built successfully${NC}\n"

# ============================================
# Step 3: Create Backup on Server
# ============================================
echo -e "${GREEN}💾 Step 3: Creating backup on server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
cd ${SERVER_PATH}
BACKUP_DIR="backups/backup_\$(date +%Y%m%d_%H%M%S)"
mkdir -p \$BACKUP_DIR
if [ -d "build" ]; then
    cp -r build \$BACKUP_DIR/ 2>/dev/null || true
fi
if [ -d "client/.next" ]; then
    cp -r client/.next \$BACKUP_DIR/ 2>/dev/null || true
fi
echo "Backup created at: \$BACKUP_DIR"
# Keep only last 5 backups
cd backups
ls -t | tail -n +6 | xargs -r rm -rf
ENDSSH
echo -e "${GREEN}✅ Backup created${NC}\n"

# ============================================
# Step 4: Transfer Built Files to Server
# ============================================
echo -e "${GREEN}🚚 Step 4: Transferring files to server...${NC}"

# Create directories on server if they don't exist
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PATH}/client/.next ${SERVER_PATH}/build ${SERVER_PATH}/mails ${SERVER_PATH}/client/public"

# Transfer Next.js build
echo "Uploading client build..."
scp -r client/.next/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/.next/

# Transfer client public folder (static assets)
echo "Uploading client public files..."
scp -r client/public/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/public/

# Transfer server build
echo "Uploading server build..."
scp -r build/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/build/

# Transfer necessary files (package.json, ecosystem.config.js, etc.)
echo "Uploading configuration files..."
scp package.json ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
scp ecosystem.config.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
scp client/package.json ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/
scp client/next.config.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/

# Transfer email templates
echo "Uploading email templates..."
scp -r mails/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/mails/

echo -e "${GREEN}✅ Files transferred successfully${NC}\n"

# ============================================
# Step 5: Install Dependencies on Server (Production Only)
# ============================================
echo -e "${GREEN}📥 Step 5: Installing production dependencies on server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
cd ${SERVER_PATH}
echo "Installing root dependencies..."
npm install --production --omit=dev
cd client
echo "Installing client dependencies..."
npm install --production --omit=dev
cd ..
ENDSSH
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# ============================================
# Step 6: Restart Application
# ============================================
echo -e "${GREEN}🔄 Step 6: Restarting application...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
cd ${SERVER_PATH}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found, installing..."
    npm install -g pm2
fi

# Restart with PM2 (or start if not running)
if pm2 list | grep -q "bbedits-backend"; then
    echo "Restarting existing PM2 processes..."
    pm2 restart ecosystem.config.js --update-env
else
    echo "Starting PM2 processes for the first time..."
    pm2 start ecosystem.config.js
fi
pm2 save

echo "Application restarted successfully"
ENDSSH

echo -e "${GREEN}✅ Application restarted${NC}\n"

# ============================================
# Step 7: Verify Deployment
# ============================================
echo -e "${GREEN}🔍 Step 7: Verifying deployment...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "pm2 list"

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${BLUE}🌐 Your application should now be running on the server${NC}"
echo -e "${BLUE}📊 Check PM2 status: ${YELLOW}ssh ${SERVER_USER}@${SERVER_IP} 'pm2 list'${NC}"
echo -e "${BLUE}📋 View logs: ${YELLOW}ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs ${APP_NAME}'${NC}"
echo -e "${BLUE}🔙 Rollback if needed: Check backups/ folder on server${NC}\n"

# ============================================
# Optional: Health Check
# ============================================
echo -e "${YELLOW}💡 Tip: Monitor your app for a few minutes to ensure stability${NC}"
