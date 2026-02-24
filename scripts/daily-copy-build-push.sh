#!/bin/bash
set -euo pipefail

REPO_DIR="/Users/jay/git/Jettelkasten"
LOG_DIR="$REPO_DIR/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/daily-copy-build-push-$(date +%F).log"

exec >> "$LOG_FILE" 2>&1

echo "[$(date '+%F %T')] start"

cd "$REPO_DIR"

# Ensure deterministic PATH for cron
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

npm run copy
npm run build

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "Daily copy+build sync $(date +%F)"
  git push origin publish
  echo "[$(date '+%F %T')] changes committed and pushed"
else
  echo "[$(date '+%F %T')] no changes"
fi

echo "[$(date '+%F %T')] done"
