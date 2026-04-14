# LotDuel API — VPS Deployment Guide

## Prerequisites

- Hostinger KVM 2 VPS with Ubuntu 22.04 or 24.04
- SSH access as root
- `api.lotduel.com` DNS configured (see step 1)

## Step-by-Step

### 1. DNS Setup (Namecheap)

Add an A record for the API subdomain:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | api | YOUR_VPS_IP | Automatic |

Wait 5–10 minutes for propagation. Verify with:
```bash
dig api.lotduel.com
```

### 2. SSH Into VPS

```bash
ssh root@YOUR_VPS_IP
```

### 3. Run Setup Script

```bash
# Download and run
curl -fsSL https://raw.githubusercontent.com/LotDuel/lotduel-app/main/deploy/setup.sh -o setup.sh
sudo bash setup.sh
```

This installs everything: Python, PostgreSQL, Nginx, creates the database,
clones the repo, sets up the virtual environment, and starts the service.

**Save the credentials it prints at the end.**

### 4. SSL Certificate

```bash
sudo certbot --nginx -d api.lotduel.com
```

Follow the prompts. Certbot auto-renews via systemd timer.

### 5. Verify API

```bash
curl https://api.lotduel.com/api/health
# Should return: {"service":"lotduel-api","status":"ok","version":"2.0.0"}
```

### 6. Connect Frontend (Vercel)

In Vercel dashboard → lotduel-app → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| VITE_API_URL | https://api.lotduel.com |

Then redeploy (or push any commit to trigger auto-deploy).

## Operations

### Deploy Updates

```bash
ssh root@YOUR_VPS_IP
sudo bash /opt/lotduel/lotduel-app/deploy/deploy.sh
```

### View Logs

```bash
# API logs
sudo journalctl -u lotduel -f

# Nginx access logs
sudo tail -f /var/log/nginx/lotduel-api-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/lotduel-api-error.log
```

### Restart Service

```bash
sudo systemctl restart lotduel
sudo systemctl status lotduel
```

### Database Access

```bash
sudo -u postgres psql lotduel
```

### Seed Sample Data (optional)

```bash
cd /opt/lotduel/lotduel-app/backend
source venv/bin/activate
python seed.py
```

## Architecture

```
Internet
   │
   ▼
Nginx (443/SSL)  ──→  Gunicorn (127.0.0.1:5000)  ──→  PostgreSQL (localhost:5432)
api.lotduel.com        2 workers, 30s timeout           lotduel database
```

## File Locations

| What | Where |
|------|-------|
| App code | /opt/lotduel/lotduel-app/ |
| Python venv | /opt/lotduel/lotduel-app/backend/venv/ |
| Environment | /opt/lotduel/lotduel-app/backend/.env |
| Systemd service | /etc/systemd/system/lotduel.service |
| Nginx config | /etc/nginx/sites-available/api.lotduel.com |
| Nginx logs | /var/log/nginx/lotduel-api-*.log |
| SSL certs | /etc/letsencrypt/live/api.lotduel.com/ |
