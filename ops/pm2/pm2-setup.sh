#!/usr/bin/env bash
set -euo pipefail
REPO_DIR="${REPO_DIR:-$PWD}"
cd "$REPO_DIR"
if ! command -v pm2 >/dev/null; then
  npm i -g pm2
fi
pushd backend >/dev/null
npm install --omit=dev || npm install
popd >/dev/null
pm2 start ops/pm2/ecosystem.config.cjs
pm2 save
pm2 startup -u "$USER" --hp "$HOME"
echo "PM2 started & boot-persisted."
