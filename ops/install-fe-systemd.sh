#!/usr/bin/env bash
set -euo pipefail

TARGET_USER="${TARGET_USER:-$SUDO_USER}"
REPO_DIR="${REPO_DIR:-/home/${TARGET_USER}/Earnapp-manager}"
FE_PORT="${FE_PORT:-5173}"

if [[ -z "${TARGET_USER:-}" ]]; then
  echo "Use: sudo TARGET_USER=<your-linux-user> FE_PORT=5173 ops/install-fe-systemd.sh"
  exit 1
fi

command -v node >/dev/null || { echo "Node.js 18+ required"; exit 1; }
command -v npm  >/dev/null || { echo "npm required"; exit 1; }

echo "[1/3] Install systemd unit..."
sudo install -m 0644 -o root -g root "$REPO_DIR/ops/systemd/earnapp-frontend@.service"   /etc/systemd/system/earnapp-frontend@.service

echo "[2/3] Set port override for user '$TARGET_USER' (FE_PORT=$FE_PORT)..."
OVR="/etc/systemd/system/earnapp-frontend@${TARGET_USER}.service.d"
sudo mkdir -p "$OVR"
cat <<EOT | sudo tee "$OVR/override.conf" >/dev/null
[Service]
Environment=FE_PORT=${FE_PORT}
EOT

echo "[3/3] Enable & start..."
sudo systemctl daemon-reload
sudo systemctl enable --now "earnapp-frontend@${TARGET_USER}.service"

echo "OK. Frontend preview is on port ${FE_PORT}."
echo "Logs: sudo journalctl -u earnapp-frontend@${TARGET_USER} -f"
