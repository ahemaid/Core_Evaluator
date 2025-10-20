# ServicePro Deployment Guide

This guide covers deploying the ServicePro platform to production environments.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or MongoDB instance
- Domain name and SSL certificate
- Server with sufficient resources (recommended: 2GB RAM, 2 CPU cores)

## Environment Setup

### 1. Environment Variables

Create `.env` files for different environments:

#### Production (`.env.production`)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicepro
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://yourdomain.com
UPLOAD_PATH=/var/www/servicepro/uploads
MAX_FILE_SIZE=5242880
```

#### Development (`.env.development`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/servicepro-dev
JWT_SECRET=dev-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 2. MongoDB Configuration

#### MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Configure IP whitelist for your server
3. Create database user with read/write permissions
4. Get connection string

#### Local MongoDB Setup
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Frontend Deployment

### 1. Build Production Bundle

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Deploy to Static Hosting

#### Option A: Nginx Static Hosting
```bash
# Copy build files to web directory
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/servicepro
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option B: Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option C: Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Backend Deployment

### 1. Server Setup

#### Ubuntu/Debian Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/servicepro.git
cd servicepro/backend

# Install dependencies
npm install --production

# Create upload directories
mkdir -p uploads/provider-photos
mkdir -p uploads/receipts

# Set permissions
sudo chown -R www-data:www-data uploads/
```

### 3. PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'servicepro-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

Start application:
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/servicepro-api`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload size limit
    client_max_body_size 5M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/servicepro-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Initialization

### 1. Initialize RBAC System

```bash
cd backend
node scripts/initializeRBAC.js
```

### 2. Create Admin User

```bash
# Using MongoDB shell
mongo your-mongodb-uri

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@servicepro.com",
  password: "$2b$10$hashedpassword", // Use bcrypt to hash
  role: "admin",
  isApproved: true,
  isActive: true,
  createdAt: new Date()
});
```

## Monitoring and Logging

### 1. PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart servicepro-backend
```

### 2. Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 3. Application Logs

```bash
# PM2 logs
pm2 logs servicepro-backend

# System logs
sudo journalctl -u nginx -f
```

## Backup Strategy

### 1. Database Backup

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your-mongodb-uri" --out="/backup/mongodb_$DATE"

# Keep only last 7 days
find /backup -name "mongodb_*" -mtime +7 -delete
```

### 2. File Backup

```bash
# Backup uploads directory
tar -czf "/backup/uploads_$(date +%Y%m%d).tar.gz" /var/www/servicepro/uploads/
```

## Performance Optimization

### 1. Enable Gzip Compression

Add to Nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Enable Caching

```nginx
# Static assets caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization

- Enable MongoDB indexes
- Use connection pooling
- Implement query optimization

## Security Considerations

### 1. Firewall Configuration

```bash
# UFW setup
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
```

### 2. Security Headers

Add to Nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Rate Limiting

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

location /api {
    limit_req zone=api burst=20 nodelay;
    # ... rest of configuration
}

location /api/auth/login {
    limit_req zone=login burst=5 nodelay;
    # ... rest of configuration
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check IP whitelist
   - Verify connection string
   - Check network connectivity

2. **File Upload Issues**
   - Check directory permissions
   - Verify file size limits
   - Check Nginx client_max_body_size

3. **SSL Certificate Issues**
   - Verify domain configuration
   - Check certificate expiration
   - Renew certificates if needed

4. **Performance Issues**
   - Monitor PM2 processes
   - Check database performance
   - Review Nginx logs

### Health Checks

```bash
# Application health
curl http://localhost:5000/health

# Database connectivity
mongo your-mongodb-uri --eval "db.stats()"

# SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review logs for errors
   - Check disk space
   - Monitor performance metrics

2. **Monthly**
   - Update dependencies
   - Review security patches
   - Backup verification

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Disaster recovery testing

---

**Deployment Version**: 1.0.0  
**Last Updated**: December 2024
