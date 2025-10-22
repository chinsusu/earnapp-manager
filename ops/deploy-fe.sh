#!/usr/bin/env bash
# Build the frontend and reload Nginx.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/Earnapp-manager}"
FRONTEND_DIR="$REPO_DIR/frontend"

echo "[1/3] Install deps (first run may take a while)..."
cd "$FRONTEND_DIR"
if [ ! -d node_modules ]; then
  npm ci || npm install
fi
# ensure Bootstrap is present (for the refreshed UI)
if ! npm ls bootstrap >/dev/null 2>&1; then
  npm i bootstrap@^5.3.3
fi

echo "[2/3] Build..."
npm run build

echo "[3/3] Reload Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "Done. Site is served from $FRONTEND_DIR/dist via Nginx."
