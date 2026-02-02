# BBEdits Deployment Guide

## Prerequisites

### On Your Server:
```bash
# Install Node.js (v18 or higher)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Create application directory
sudo mkdir -p /var/www/anilweb
sudo chown $USER:$USER /var/www/anilweb
```

### On Your Local Machine (Windows):
```bash
# Option 1: Using Git Bash (Recommended)
- Install Git for Windows (includes Git Bash with SSH/SCP)
- Use deploy.sh with Git Bash

# Option 2: Using WSL (Windows Subsystem for Linux)
- Install WSL
- Use deploy.sh from WSL terminal

# Option 3: Manual Deployment
- Use deploy.bat (requires manual file transfer with WinSCP/FileZilla)
```

---

## Deployment Methods

### Method 1: Automated Deployment (Linux/Git Bash)

1. **Configure the deployment script:**
```bash
# Edit deploy.sh
SERVER_USER="root"              # Your SSH user
SERVER_IP="72.61.226.238"       # Your server IP
SERVER_PATH="/var/www/anilweb"  # Path on server
```

2. **Make script executable:**
```bash
chmod +x deploy.sh
```

3. **Run deployment:**
```bash
./deploy.sh
```

### Method 2: Windows Batch Script (Semi-Automated)

1. **Edit deploy.bat** - Update server details

2. **Run the script:**
```cmd
deploy.bat
```

3. **Follow the instructions** for manual file transfer and server commands

---

## Server Setup (First Time Only)

### 1. Configure Nginx

Create `/etc/nginx/sites-available/anilweb`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # Replace with your domain

    # Client logs
    access_log /var/log/nginx/anilweb-access.log;
    error_log /var/log/nginx/anilweb-error.log;

    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/anilweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Setup Environment Variables

Create `.env` files on the server:

```bash
cd /var/www/anilweb

# Create root .env
cat > .env << 'EOF'
PORT=8000
ORIGIN=http://yourdomain.com
NODE_ENV=production

# Database
DB_URL=mongodb://localhost:27017/anilweb
REDIS_URL=redis://localhost:6379

# JWT
ACTIVATION_SECRET=your-secret-here
ACCESS_TOKEN=your-access-token-here
REFRESH_TOKEN=your-refresh-token-here

# Email (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Cloud Storage (if using)
CLOUD_NAME=your-cloudinary-name
CLOUD_API_KEY=your-cloudinary-key
CLOUD_SECRET_KEY=your-cloudinary-secret
EOF

# Create client .env
cat > client/.env.local << 'EOF'
NEXT_PUBLIC_SERVER_URI=http://yourdomain.com:8000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://yourdomain.com

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
```

### 3. Start Application with PM2

```bash
cd /var/www/anilweb
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on server reboot
```

---

## Regular Deployment Workflow

### From Your Local Machine:

```bash
# 1. Make changes to your code
# 2. Test locally
npm run dev

# 3. Commit to Git (optional but recommended)
git add .
git commit -m "Your changes"
git push

# 4. Deploy to server
./deploy.sh  # Linux/Git Bash
# OR
deploy.bat   # Windows
```

### The Script Will:
✅ Build client locally (Next.js)
✅ Build server locally (TypeScript)
✅ Transfer only built files to server
✅ Install production dependencies on server
✅ Restart the application with PM2

---

## Useful PM2 Commands

```bash
# SSH into your server first
ssh root@your-server-ip

# View application status
pm2 list

# View logs
pm2 logs anilweb-server
pm2 logs anilweb-client

# Restart specific app
pm2 restart anilweb-server
pm2 restart anilweb-client

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Monitor resources
pm2 monit

# View detailed info
pm2 show anilweb-server
```

---

## Troubleshooting

### Build Fails Locally:
```bash
# Clear cache and rebuild
rm -rf client/.next
rm -rf build
rm -rf node_modules
npm install
npm run build
```

### Application Won't Start on Server:
```bash
# Check logs
pm2 logs

# Check if ports are in use
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8000

# Kill processes if needed
pm2 delete all
pm2 start ecosystem.config.js
```

### Database Connection Issues:
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check Redis is running
sudo systemctl status redis

# Verify .env file
cat /var/www/anilweb/.env
```

---

## Security Recommendations

1. **Setup SSL Certificate:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

2. **Setup Firewall:**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

3. **Use SSH Keys** instead of passwords for deployment

---

## Benefits of This Approach

✅ **Low Server Load**: Building happens on your local machine
✅ **Fast Deployment**: Only transfer built files (~2-3 minutes)
✅ **Database Safe**: Never touches your production database
✅ **No Server Downtime**: PM2 handles graceful restarts
✅ **Easy Rollback**: Keep previous builds on server
✅ **Resource Efficient**: Server just runs the app, doesn't build it

---

## Questions?

Common issues and solutions are documented above. For more help, check:
- PM2 Documentation: https://pm2.keymetrics.io/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Nginx Configuration: https://nginx.org/en/docs/
