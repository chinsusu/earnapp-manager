#!/usr/bin/env bash
set -euo pipefail

USER_NAME="${USER_NAME:-$USER}"
REPO_DIR="${REPO_DIR:-/root/EarnApp-Manager}"

echo "[1/5] Building frontend..."
cd "$REPO_DIR/frontend"
npm ci
npm run build

echo "[2/5] Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt update
    sudo apt install -y nginx
fi

echo "[3/5] Configuring Nginx site..."
# Update root path in config
sudo sed "s|/root/EarnApp-Manager|$REPO_DIR|g" "$REPO_DIR/ops/nginx/earnapp.conf" \
    | sudo tee /etc/nginx/sites-available/earnapp.conf >/dev/null

echo "[4/5] Enabling site..."
sudo ln -sf /etc/nginx/sites-available/earnapp.conf /etc/nginx/sites-enabled/earnapp.conf
sudo rm -f /etc/nginx/sites-enabled/default

echo "[5/5] Testing and reloading Nginx..."
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo "✅ Nginx setup complete!"
echo "📊 Frontend: http://$(hostname -I | awk '{print $1}')"
echo "🔌 Backend API: http://127.0.0.1:4000"
echo ""
echo "Test: curl http://localhost"
