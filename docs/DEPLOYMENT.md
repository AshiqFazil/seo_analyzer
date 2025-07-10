# Deployment Guide

## Overview

This guide covers deploying the SEO Analyzer application to production environments. It includes setup for various deployment scenarios, from simple VPS deployments to cloud-based solutions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Production Deployment](#production-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Minimum Requirements:**
- **CPU**: 2 cores, 2.0 GHz
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB available space
- **OS**: Ubuntu 20.04+, CentOS 7+, or Windows Server 2019+

**Recommended Requirements:**
- **CPU**: 4 cores, 3.0 GHz
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **Network**: 100 Mbps bandwidth

### Software Dependencies

**Backend Requirements:**
```bash
# Python 3.8+
python --version

# Node.js 16+ (for frontend build)
node --version

# Git
git --version

# Nginx (web server)
nginx -v

# PostgreSQL (production database)
psql --version
```

**Development Tools:**
```bash
# Docker (optional, for containerized deployment)
docker --version

# PM2 (process manager)
npm install -g pm2
```

---

## Environment Setup

### 1. Server Preparation

**Update System:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y

# Install essential packages
sudo apt install -y curl wget git build-essential
```

**Create Application User:**
```bash
# Create user
sudo adduser seoanalyzer
sudo usermod -aG sudo seoanalyzer

# Switch to user
sudo su - seoanalyzer
```

### 2. Python Environment Setup

**Install Python:**
```bash
# Ubuntu/Debian
sudo apt install -y python3 python3-pip python3-venv

# CentOS/RHEL
sudo yum install -y python3 python3-pip
```

**Create Virtual Environment:**
```bash
cd /opt/seo_analyzer
python3 -m venv venv
source venv/bin/activate
```

### 3. Node.js Setup

**Install Node.js:**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Database Setup

**Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql postgresql-server
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Configure Database:**
```bash
# For SQLite (current setup)
# Database will be created automatically in backend/instance/

# For PostgreSQL (production recommendation)
sudo -u postgres createuser --interactive seoanalyzer
sudo -u postgres createdb seo_analyzer_prod
sudo -u postgres psql
ALTER USER seoanalyzer PASSWORD 'your_secure_password';
\q
```

---

## Production Deployment

### 1. Application Deployment

**Clone Repository:**
```bash
cd /opt
sudo git clone https://github.com/yourusername/seo_analyzer.git
sudo chown -R seoanalyzer:seoanalyzer seo_analyzer
cd seo_analyzer
```

**Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create production environment file
cat > .env << EOF
SECRET_KEY=your_production_secret_key_here
FLASK_ENV=production
GEMINI_API_KEY=your_production_gemini_key
GEMINI_API_KEY2=your_production_gemini_key2
# Using SQLite for simplicity, can be changed to PostgreSQL for production
DATABASE_URL=sqlite:///instance/seo_analyzer.db
EOF
```

**Frontend Build:**
```bash
cd ../frontend
npm install
npm run build
```

### 2. Web Server Configuration

**Install Nginx:**
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/seo_analyzer
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend static files
    location / {
        root /opt/seo_analyzer/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/seo_analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Process Management

**Install PM2:**
```bash
npm install -g pm2
```

**Create PM2 Configuration:**
```bash
# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'seo-analyzer-backend',
    script: 'app.py',
    cwd: '/opt/seo_analyzer/backend',
    interpreter: '/opt/seo_analyzer/backend/venv/bin/python',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/pm2/seo-analyzer-error.log',
    out_file: '/var/log/pm2/seo-analyzer-out.log',
    log_file: '/var/log/pm2/seo-analyzer-combined.log',
    time: true
  }]
};
EOF
```

**Start Application:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Cloud Deployment

### 1. AWS Deployment

**EC2 Setup:**
```bash
# Launch EC2 instance (t3.medium or larger)
# Ubuntu 20.04 LTS recommended

# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Follow the production deployment steps above
```

**RDS Database:**
```bash
# Create RDS PostgreSQL instance
# Update DATABASE_URL in .env file
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/database_name
```

**Load Balancer:**
```bash
# Create Application Load Balancer
# Configure target groups for backend
# Set up SSL certificate in ACM
```

### 2. Google Cloud Platform

**Compute Engine:**
```bash
# Create VM instance
gcloud compute instances create seo-analyzer \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud
```

**Cloud SQL:**
```bash
# Create Cloud SQL instance
gcloud sql instances create seo-analyzer-db \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1
```

### 3. Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/seo_analyzer
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: seo_analyzer
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

**PM2 Monitoring:**
```bash
# Monitor application status
pm2 status
pm2 monit

# View logs
pm2 logs seo-analyzer-backend
pm2 logs seo-analyzer-backend --lines 100
```

**System Monitoring:**
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs
```

### 2. Log Management

**Configure Log Rotation:**
```bash
sudo nano /etc/logrotate.d/seo-analyzer
```

**Log Rotation Configuration:**
```
/var/log/pm2/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 seoanalyzer seoanalyzer
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Backup Strategy

**Database Backup:**
```bash
# Create backup script
cat > /opt/seo_analyzer/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup SQLite database
cp /opt/seo_analyzer/backend/instance/seo_analyzer.db $BACKUP_DIR/db_backup_$DATE.db

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/seo_analyzer

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF
```

chmod +x /opt/seo_analyzer/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/seo_analyzer/backup.sh
```

### 4. Updates and Maintenance

**Application Updates:**
```bash
# Pull latest changes
cd /opt/seo_analyzer
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Update frontend
cd ../frontend
npm install
npm run build

# Restart application
pm2 restart all
```

**System Updates:**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services if needed
sudo systemctl restart nginx
pm2 restart all
```

---

## Security Considerations

### 1. Firewall Configuration

**Configure UFW:**
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow application port (if not using reverse proxy)
sudo ufw allow 5000

# Check status
sudo ufw status
```

### 2. SSL/TLS Configuration

**Install Certbot:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**Obtain SSL Certificate:**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 3. Security Headers

**Nginx Security Headers:**
```nginx
# Add to nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 4. Environment Security

**Secure Environment Variables:**
```bash
# Use strong, unique secrets
SECRET_KEY=$(openssl rand -hex 32)
echo "SECRET_KEY=$SECRET_KEY" >> .env

# Rotate API keys regularly
# Monitor API usage for anomalies
```

---

## Troubleshooting

### Common Issues

**Application Won't Start:**
```bash
# Check PM2 status
pm2 status
pm2 logs seo-analyzer-backend

# Check Python environment
source venv/bin/activate
python app.py

# Check environment variables
cat .env
```

**Database Connection Issues:**
```bash
# Test database connection
psql -h localhost -U seoanalyzer -d seo_analyzer_prod

# Check PostgreSQL status
sudo systemctl status postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

**Nginx Issues:**
```bash
# Test nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

**Performance Issues:**
```bash
# Monitor system resources
htop
free -h
df -h

# Check application logs
pm2 logs --lines 100

# Monitor network
nethogs
```

### Recovery Procedures

**Application Recovery:**
```bash
# Restart application
pm2 restart all

# If that fails, restart PM2
pm2 kill
pm2 start ecosystem.config.js
```

**Database Recovery:**
```bash
# Restore SQLite database
cp backup_file.db /opt/seo_analyzer/backend/instance/seo_analyzer.db

# For PostgreSQL (if migrated)
psql -h localhost -U seoanalyzer -d seo_analyzer_prod < backup_file.sql
```

**System Recovery:**
```bash
# Reboot system if necessary
sudo reboot

# Check all services after reboot
sudo systemctl status nginx postgresql
pm2 status
```

---

## Performance Optimization

### 1. Application Optimization

**Gunicorn Configuration:**
```bash
# Optimize for production
gunicorn --workers 4 --bind 0.0.0.0:5000 --timeout 120 app:app
```

**Database Optimization:**
```sql
-- Add indexes for better performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
```

### 2. Caching Strategy

**Redis Caching:**
```bash
# Install Redis
sudo apt install -y redis-server

# Configure application to use Redis for caching
```

### 3. CDN Configuration

**CloudFront (AWS):**
- Create CloudFront distribution
- Configure origin as your application
- Enable compression and caching

**Cloudflare:**
- Add domain to Cloudflare
- Configure DNS records
- Enable caching and security features

---

## Support and Maintenance

### Contact Information
- **Technical Issues**: Create GitHub issue
- **Security Issues**: Report via GitHub security tab
- **Emergency**: Contact system administrator

### Maintenance Schedule
- **Daily**: Monitor logs and system resources
- **Weekly**: Review performance metrics
- **Monthly**: Update system packages
- **Quarterly**: Security audit and penetration testing

---

*Last updated: January 2024* 