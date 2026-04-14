#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# LotDuel API — Quick Deploy
# Pull latest from GitHub and restart the service.
# Usage: sudo bash deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e

APP_DIR="/opt/lotduel/lotduel-app"

echo "→ Pulling latest code..."
cd "$APP_DIR"
git pull origin main

echo "→ Updating Python dependencies..."
cd "$APP_DIR/backend"
source venv/bin/activate
pip install -r requirements.txt -q

echo "→ Running database migrations..."
python -c "
from app import create_app
from models import db
app = create_app('production')
with app.app_context():
    db.create_all()
    print('  Tables up to date')
"

echo "→ Restarting service..."
systemctl restart lotduel

echo "→ Checking status..."
sleep 2
if systemctl is-active --quiet lotduel; then
    echo "✓ LotDuel API is running"
    curl -s http://localhost:5000/api/health | python3 -m json.tool
else
    echo "✗ Service failed to start. Check logs:"
    echo "  sudo journalctl -u lotduel -n 20"
    exit 1
fi

echo ""
echo "Deploy complete."
