#!/usr/bin/env bash
set -euo pipefail

TARGET_USER="${TARGET_USER:-$SUDO_USER}"
REPO_DIR="${REPO_DIR:-/root/EarnApp-Manager}"
PORT="${PORT:-4000}"

if [[ -z "${TARGET_USER:-}" ]]; then
  echo "Use: sudo TARGET_USER=<your-linux-user> PORT=4000 ops/install-systemd.sh"
  exit 1
fi

command -v node >/dev/null || { echo "Node.js 18+ required"; exit 1; }

echo "[1/3] npm install backend..."
pushd "$REPO_DIR/backend" >/dev/null
npm install --omit=dev || npm install
popd >/dev/null

echo "[2/3] Install systemd unit..."
sudo install -m 0644 -o root -g root "$REPO_DIR/ops/systemd/earnapp-backend@.service" \
  /etc/systemd/system/earnapp-backend@.service

echo "[3/3] Enable & start for user '$TARGET_USER' (PORT=$PORT)..."
OVR="/etc/systemd/system/earnapp-backend@${TARGET_USER}.service.d"
sudo mkdir -p "$OVR"
cat <<EOT | sudo tee "$OVR/override.conf" >/dev/null
[Service]
Environment=PORT=${PORT}
EOT

sudo systemctl daemon-reload
sudo systemctl enable --now "earnapp-backend@${TARGET_USER}.service"

echo "OK. Logs: sudo journalctl -u earnapp-backend@${TARGET_USER} -f"
