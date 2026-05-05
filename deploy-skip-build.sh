#!/bin/bash
# Deploy without rebuilding — packages existing build/ and client/.next then pushes to server

SERVER_USER="root"
SERVER_IP="88.222.245.226"
SERVER_PATH="/var/www/anilweb"
SSH_KEY="$HOME/.ssh/id_ed25519_bbedits"
SCP="scp -O -i $SSH_KEY -o StrictHostKeyChecking=no"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

GREEN='\033[0;32m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BLUE}Deploying (skipping builds)...${NC}"

# Step 3: Backup
echo -e "${GREEN}Step 3: Backup${NC}"
$SSH ${SERVER_USER}@${SERVER_IP} "
  cd ${SERVER_PATH}
  BACKUP_DIR=\"backups/backup_\$(date +%Y%m%d_%H%M%S)\"
  mkdir -p \$BACKUP_DIR
  [ -d build ] && cp -r build \$BACKUP_DIR/ || true
  [ -d client/.next ] && cp -r client/.next \$BACKUP_DIR/ || true
  echo Backup: \$BACKUP_DIR
  cd backups && ls -t | tail -n +6 | xargs -r rm -rf
"

# Step 4: Package
echo -e "${GREEN}Step 4: Packaging${NC}"
rm -rf client/.next/cache client/.next/dev 2>/dev/null || true
tar czf /tmp/deploy-client.tar.gz --warning=no-file-changed -C client .next package.json next.config.js || true
if [ ! -s /tmp/deploy-client.tar.gz ]; then echo -e "${RED}Client package empty!${NC}"; exit 1; fi

tar czf /tmp/deploy-server.tar.gz build mails package.json ecosystem.config.js
if [ $? -ne 0 ]; then echo -e "${RED}Server package failed!${NC}"; exit 1; fi
echo "Packaged OK"

# Step 5: Upload
echo -e "${GREEN}Step 5: Uploading${NC}"
CLIENT_URL=$(curl -s -F "reqtype=fileupload" -F "fileToUpload=@/tmp/deploy-client.tar.gz" "https://catbox.moe/user/api.php")
echo "Client URL: $CLIENT_URL"
[[ "$CLIENT_URL" == https://* ]] || { echo -e "${RED}Client upload failed! Response: $CLIENT_URL${NC}"; exit 1; }

SERVER_URL=$(curl -s -F "reqtype=fileupload" -F "fileToUpload=@/tmp/deploy-server.tar.gz" "https://catbox.moe/user/api.php")
echo "Server URL: $SERVER_URL"
[[ "$SERVER_URL" == https://* ]] || { echo -e "${RED}Server upload failed! Response: $SERVER_URL${NC}"; exit 1; }

rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz

# Step 6: Deploy
echo -e "${GREEN}Step 6: Deploying on server${NC}"
$SSH ${SERVER_USER}@${SERVER_IP} "
  set -e
  cd ${SERVER_PATH}
  echo 'Downloading client build...'
  wget -q '${CLIENT_URL}' -O /tmp/deploy-client.tar.gz
  echo 'Downloading server build...'
  wget -q '${SERVER_URL}' -O /tmp/deploy-server.tar.gz
  echo 'Extracting server...'
  tar xzf /tmp/deploy-server.tar.gz
  echo 'Extracting client...'
  tar xzf /tmp/deploy-client.tar.gz -C client
  rm -f /tmp/deploy-client.tar.gz /tmp/deploy-server.tar.gz
  echo 'Installing dependencies...'
  npm install --omit=dev --silent
  cd client && npm install --omit=dev --silent && cd ..
  echo 'Restarting PM2...'
  pm2 restart ecosystem.config.js --update-env
  pm2 save
  echo DEPLOY_DONE
"
echo -e "${GREEN}Deployment complete! https://bbedits.in${NC}"
