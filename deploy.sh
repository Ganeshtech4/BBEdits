#!/bin/bash

# ============================================
# BBEdits Deployment Script
# Build Locally, Deploy to Server
# ============================================

SERVER_USER="root"
SERVER_IP="88.222.245.226"
SERVER_PATH="/var/www/anilweb"
APP_NAME="bbedits-backend"
SSH_KEY="$HOME/.ssh/id_ed25519_bbedits"

# -O forces legacy SCP protocol (bypasses SFTP subsystem which crashes on this server)
SCP="scp -O -i $SSH_KEY -o StrictHostKeyChecking=no"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting BBEdits Deployment...${NC}\n"

# ============================================
# Step 1: Build Client (Next.js)
# ============================================
echo -e "${GREEN}Step 1: Building client (Next.js)...${NC}"
cd client || exit 1
npm run build
if [ $? -ne 0 ]; then echo -e "${RED}Client build failed!${NC}"; exit 1; fi
cd ..
echo -e "${GREEN}Client built successfully${NC}\n"

# ============================================
# Step 2: Build Server (TypeScript)
# ============================================
echo -e "${GREEN}Step 2: Building server (TypeScript)...${NC}"
npm run build
if [ $? -ne 0 ]; then echo -e "${RED}Server build failed!${NC}"; exit 1; fi
echo -e "${GREEN}Server built successfully${NC}\n"

# ============================================
# Step 3: Create Backup on Server
# ============================================
echo -e "${GREEN}Step 3: Creating backup on server...${NC}"
$SSH ${SERVER_USER}@${SERVER_IP} "
  cd ${SERVER_PATH}
  BACKUP_DIR=\"backups/backup_\$(date +%Y%m%d_%H%M%S)\"
  mkdir -p \$BACKUP_DIR
  [ -d build ] && cp -r build \$BACKUP_DIR/ || true
  [ -d client/.next ] && cp -r client/.next \$BACKUP_DIR/ || true
  echo Backup: \$BACKUP_DIR
  cd backups && ls -t | tail -n +6 | xargs -r rm -rf
"
echo -e "${GREEN}Backup created${NC}\n"

# ============================================
# Step 4: Package files
# ============================================
echo -e "${GREEN}Step 4: Packaging files...${NC}"

# Clean Next.js cache to reduce size
rm -rf client/.next/cache 2>/dev/null

# Create archives:
# - deploy-client.tar.gz: .next contents with .next/ path prefix (correct for extraction with -C client)
# - deploy-server.tar.gz: server build + mails + config
tar czf /tmp/deploy-client.tar.gz -C client .next package.json next.config.js
if [ $? -ne 0 ]; then echo -e "${RED}Client packaging failed!${NC}"; exit 1; fi

tar czf /tmp/deploy-server.tar.gz build mails package.json ecosystem.config.js
if [ $? -ne 0 ]; then echo -e "${RED}Server packaging failed!${NC}"; exit 1; fi

echo -e "${GREEN}Packaged OK${NC}\n"

# ============================================
# Step 5: Upload via tmpfiles.org → server wget
# (Bypasses SSH/SCP SFTP subsystem crash for large files)
# ============================================
echo -e "${GREEN}Step 5: Uploading via tmpfiles.org...${NC}"

echo "Uploading client build (~30MB)..."
CLIENT_RAW=$(curl -sF "file=@/tmp/deploy-client.tar.gz" https://tmpfiles.org/api/v1/upload)
CLIENT_URL=$(echo "$CLIENT_RAW" | grep -o 'http[^"]*' | sed 's|tmpfiles.org/|tmpfiles.org/dl/|')
if [ -z "$CLIENT_URL" ]; then echo -e "${RED}Client upload failed! Response: $CLIENT_RAW${NC}"; exit 1; fi
echo "Client URL: $CLIENT_URL"

echo "Uploading server build..."
SERVER_RAW=$(curl -sF "file=@/tmp/deploy-server.tar.gz" https://tmpfiles.org/api/v1/upload)
SERVER_URL=$(echo "$SERVER_RAW" | grep -o 'http[^"]*' | sed 's|tmpfiles.org/|tmpfiles.org/dl/|')
if [ -z "$SERVER_URL" ]; then echo -e "${RED}Server upload failed! Response: $SERVER_RAW${NC}"; exit 1; fi
echo "Server URL: $SERVER_URL"

rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz
echo -e "${GREEN}Uploaded OK${NC}\n"

# ============================================
# Step 6: Server downloads, extracts, restarts
# ============================================
echo -e "${GREEN}Step 6: Deploying on server...${NC}"
$SSH ${SERVER_USER}@${SERVER_IP} "
  set -e
  cd ${SERVER_PATH}

  echo 'Downloading client build...'
  wget -q '${CLIENT_URL}' -O /tmp/deploy-client.tar.gz

  echo 'Downloading server build...'
  wget -q '${SERVER_URL}' -O /tmp/deploy-server.tar.gz

  echo 'Extracting server build...'
  tar xzf /tmp/deploy-server.tar.gz

  echo 'Extracting client build into client/...'
  tar xzf /tmp/deploy-client.tar.gz -C client

  rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz

  echo 'Installing server dependencies...'
  npm install --omit=dev --silent

  echo 'Installing client dependencies...'
  cd client && npm install --omit=dev --silent && cd ..

  echo 'Restarting PM2...'
  pm2 restart ecosystem.config.js --update-env
  pm2 save

  echo 'Done!'
"
echo -e "${GREEN}Deployed OK${NC}\n"

# ============================================
# Step 7: Verify
# ============================================
echo -e "${GREEN}Step 7: Verifying deployment...${NC}"
$SSH ${SERVER_USER}@${SERVER_IP} "pm2 list"

echo -e "\n${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}Check: https://bbedits.in${NC}\n"

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
# Step 3: Package builds into zip files
# ============================================
echo -e "${GREEN}📦 Step 3: Packaging builds into archives...${NC}"

# Remove old archives
rm -f /tmp/bbedits-client.tar.gz /tmp/bbedits-server.tar.gz /tmp/bbedits-mails.tar.gz /tmp/bbedits-config.tar.gz

# Tar client .next (exclude dev/cache — not needed in production)
echo "Archiving client build..."
tar czf /tmp/bbedits-client.tar.gz -C client/.next --exclude='./dev' --exclude='./cache' --exclude='./trace' .
echo "Client archive: $(du -sh /tmp/bbedits-client.tar.gz | cut -f1)"

# Tar server build
echo "Archiving server build..."
tar czf /tmp/bbedits-server.tar.gz build/
echo "Server archive: $(du -sh /tmp/bbedits-server.tar.gz | cut -f1)"

# Tar mails
echo "Archiving mail templates..."
tar czf /tmp/bbedits-mails.tar.gz mails/

# Tar config files
echo "Archiving config files..."
tar czf /tmp/bbedits-config.tar.gz package.json ecosystem.config.js client/package.json client/next.config.js

echo -e "${GREEN}✅ Packages ready${NC}\n"

# ============================================
# Step 4: Backup + Transfer via tar archives (single-file uploads)
# ============================================
echo -e "${GREEN}🚚 Step 4: Transferring files to server...${NC}"

# Create remote dirs + backup in one SSH call
ssh $SSH_OPTS -o "ServerAliveInterval=10" ${SERVER_USER}@${SERVER_IP} \
  "mkdir -p ${SERVER_PATH}/{client/.next,build,mails,client/public,backups} && \
   BDIR=${SERVER_PATH}/backups/backup_\$(date +%Y%m%d_%H%M%S) && \
   mkdir -p \$BDIR && \
   cp -r ${SERVER_PATH}/build \$BDIR/ 2>/dev/null || true && \
   cp -r ${SERVER_PATH}/client/.next \$BDIR/ 2>/dev/null || true && \
   echo Backup: \$BDIR && \
   cd ${SERVER_PATH}/backups && ls -t | tail -n +6 | xargs -r rm -rf && \
   echo Backup done"

# Upload each archive (single-file transfers are reliable even on slow connections)
# Use SSH stdin pipe for client (avoids SCP connection reset on first transfer)
echo "Uploading client build (~$(du -sh /tmp/bbedits-client.tar.gz | cut -f1))..."
ssh $SSH_OPTS -o "ServerAliveInterval=10" ${SERVER_USER}@${SERVER_IP} \
    "cat > ${SERVER_PATH}/bbedits-client.tar.gz" < /tmp/bbedits-client.tar.gz
echo "Client upload done"
echo "Uploading server build..."
scp $SSH_OPTS -o "ServerAliveInterval=10" \
    /tmp/bbedits-server.tar.gz ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
echo "Uploading mails + config..."
scp $SSH_OPTS -o "ServerAliveInterval=10" \
    /tmp/bbedits-mails.tar.gz /tmp/bbedits-config.tar.gz \
    ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

# Extract on server
echo "Extracting on server..."
ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} << ENDSSH
set -e
cd ${SERVER_PATH}
echo "Extracting client build..."
rm -rf client/.next && mkdir -p client/.next
tar xzf bbedits-client.tar.gz -C client/.next/
echo "Extracting server build..."
rm -rf build && mkdir -p build
tar xzf bbedits-server.tar.gz
echo "Extracting mails..."
tar xzf bbedits-mails.tar.gz
echo "Extracting config..."
tar xzf bbedits-config.tar.gz
# Cleanup archives
rm -f bbedits-client.tar.gz bbedits-server.tar.gz bbedits-mails.tar.gz bbedits-config.tar.gz
echo "Extraction complete"
ENDSSH
echo -e "${GREEN}✅ Files transferred and extracted${NC}\n"

# ============================================
# Step 5: Install Dependencies on Server (Production Only)
# ============================================
echo -e "${GREEN}📥 Step 5: Installing production dependencies on server...${NC}"
ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} << ENDSSH
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
ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} << ENDSSH
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
ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "pm2 list"

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
