#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# LotDuel API — VPS Initial Setup Script
# Run once on a fresh Hostinger KVM 2 VPS (Ubuntu 22.04/24.04)
# Usage: sudo bash setup.sh
# ═══════════════════════════════════════════════════════════════

set -e

APP_USER="lotduel"
APP_DIR="/opt/lotduel"
DB_NAME="lotduel"
DB_USER="lotduel"
DB_PASS=$(openssl rand -hex 16)
SECRET_KEY=$(openssl rand -hex 32)
DOMAIN="api.lotduel.com"

echo "═══════════════════════════════════════════"
echo "  LotDuel API — VPS Setup"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. System Updates ──────────────────────────────────────────

echo "→ Updating system packages..."
apt update && apt upgrade -y

# ── 2. Install Dependencies ───────────────────────────────────

echo "→ Installing Python, PostgreSQL, Nginx, Certbot..."
apt install -y \
    python3 python3-pip python3-venv \
    postgresql postgresql-contrib \
    nginx certbot python3-certbot-nginx \
    git curl ufw

# ── 3. Firewall ───────────────────────────────────────────────

echo "→ Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── 4. Create App User ────────────────────────────────────────

echo "→ Creating app user..."
if ! id "$APP_USER" &>/dev/null; then
    useradd -r -m -s /bin/bash "$APP_USER"
fi

# ── 5. PostgreSQL Setup ───────────────────────────────────────

echo "→ Setting up PostgreSQL..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# ── 6. Clone / Update App ─────────────────────────────────────

echo "→ Setting up application directory..."
mkdir -p "$APP_DIR"

if [ -d "$APP_DIR/lotduel-app" ]; then
    echo "  Repo already exists, pulling latest..."
    cd "$APP_DIR/lotduel-app"
    git pull origin main
else
    echo "  Cloning repo..."
    cd "$APP_DIR"
    git clone https://github.com/LotDuel/lotduel-app.git
    cd lotduel-app
fi

# ── 7. Python Virtual Environment ─────────────────────────────

echo "→ Setting up Python virtual environment..."
cd "$APP_DIR/lotduel-app/backend"

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# ── 8. Environment File ───────────────────────────────────────

echo "→ Creating environment file..."
ENV_FILE="$APP_DIR/lotduel-app/backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << EOF
FLASK_ENV=production
SECRET_KEY=$SECRET_KEY
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
FRONTEND_URL=https://lotduel.com
EOF
    chmod 600 "$ENV_FILE"
    echo "  Created .env with generated credentials"
else
    echo "  .env already exists, skipping"
fi

# ── 9. Initialize Database ────────────────────────────────────

echo "→ Initializing database tables..."
cd "$APP_DIR/lotduel-app/backend"
source venv/bin/activate
python -c "
from app import create_app
from models import db
app = create_app('production')
with app.app_context():
    db.create_all()
    print('  Tables created successfully')
"

# ── 10. Set Ownership ─────────────────────────────────────────

echo "→ Setting file ownership..."
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ── 11. Systemd Service ───────────────────────────────────────

echo "→ Installing systemd service..."
cp "$APP_DIR/lotduel-app/deploy/lotduel.service" /etc/systemd/system/lotduel.service
systemctl daemon-reload
systemctl enable lotduel
systemctl start lotduel

# ── 12. Nginx Config ──────────────────────────────────────────

echo "→ Configuring Nginx..."
cp "$APP_DIR/lotduel-app/deploy/nginx.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# ── 13. SSL Certificate ───────────────────────────────────────

echo "→ Obtaining SSL certificate..."
echo ""
echo "  Make sure $DOMAIN points to this server's IP first!"
echo "  Then run: sudo certbot --nginx -d $DOMAIN"
echo ""

# ── Done ──────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════"
echo "  Setup Complete!"
echo "═══════════════════════════════════════════"
echo ""
echo "  Database:     postgresql://$DB_USER:****@localhost:5432/$DB_NAME"
echo "  App dir:      $APP_DIR/lotduel-app/backend"
echo "  Service:      systemctl status lotduel"
echo "  Nginx:        /etc/nginx/sites-available/$DOMAIN"
echo "  Env file:     $APP_DIR/lotduel-app/backend/.env"
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  SAVE THESE CREDENTIALS:                │"
echo "  │  DB Password: $DB_PASS  │"
echo "  │  Secret Key:  ${SECRET_KEY:0:16}...     │"
echo "  └─────────────────────────────────────────┘"
echo ""
echo "  Next steps:"
echo "  1. Point $DOMAIN DNS to this server IP"
echo "  2. Run: sudo certbot --nginx -d $DOMAIN"
echo "  3. Set VITE_API_URL=https://$DOMAIN in Vercel env vars"
echo "  4. Redeploy frontend on Vercel"
echo ""
