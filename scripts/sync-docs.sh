#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/docs"
mkdir -p "$ROOT_DIR/docs"

cp -R "$ROOT_DIR/public/"* "$ROOT_DIR/docs/"
cp -R "$ROOT_DIR/src" "$ROOT_DIR/docs/"

# Fix module path for GitHub Pages
if [ -f "$ROOT_DIR/docs/index.html" ]; then
  perl -0pi -e 's|<script type="module" src="\.\./src/main\.js"></script>|<script type="module" src="./src/main.js"></script>|g' "$ROOT_DIR/docs/index.html"
fi

printf "Synced docs/ from public/ and src/\n"
