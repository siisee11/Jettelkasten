#!/usr/bin/env bash
set -euo pipefail

# Update Quartz from upstream (v4)
if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found. Please install Node.js + npm." >&2
  exit 1
fi

# Ensure dependencies are installed (required for quartz update)
if [ ! -d node_modules ]; then
  npm install
fi

npx quartz update

# Optional: build to verify
# npx quartz build --serve

# Commit & push if there are changes
if ! git diff --quiet; then
  git add -A
  git commit -m "chore: quartz update"
  git push origin publish
else
  echo "No changes to commit."
fi
