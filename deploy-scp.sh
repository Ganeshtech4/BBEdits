#!/bin/bash
# Quick deploy - upload built files via SCP and restart PM2
SSH_KEY="$HOME/.ssh/id_ed25519_bbedits"
SERVER_USER="root"
SERVER_IP="88.222.245.226"
SERVER_PATH="/var/www/anilweb"
SCP="scp -O -i $SSH_KEY -o StrictHostKeyChecking=no"
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

echo "=== Transferring client .next build ==="
# Delete old .next on server first, then upload fresh
$SSH ${SERVER_USER}@${SERVER_IP} "rm -rf ${SERVER_PATH}/client/.next && mkdir -p ${SERVER_PATH}/client/.next"
$SCP -r client/.next ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/

echo "=== Transferring client package.json and next.config.js ==="
$SCP client/package.json ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/
$SCP client/next.config.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/client/

echo "=== Transferring server build ==="
$SCP -r build ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
$SCP package.json ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
$SCP ecosystem.config.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo "=== Installing client dependencies on server ==="
$SSH ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PATH}/client && npm install --omit=dev --silent"

echo "=== Restarting PM2 ==="
$SSH ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PATH} && pm2 restart ecosystem.config.js --update-env && pm2 save"

echo "=== PM2 status ==="
$SSH ${SERVER_USER}@${SERVER_IP} "pm2 list"

echo "=== Done ==="
