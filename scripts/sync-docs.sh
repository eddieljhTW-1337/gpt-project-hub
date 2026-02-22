#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/docs"
mkdir -p "$ROOT_DIR/docs"

cp -R "$ROOT_DIR/public/"* "$ROOT_DIR/docs/"
cp -R "$ROOT_DIR/src" "$ROOT_DIR/docs/"

# Fix module path for GitHub Pages
if [ -f "$ROOT_DIR/docs/index.html" ]; then
  perl -0pi -e 's|<script type="module" src="\.\./src/main\.js"></script>|<script src="./src/bundle.js?v=761eba3"></script>|g' "$ROOT_DIR/docs/index.html"
  perl -0pi -e 's|<script nomodule src="\.\./src/bundle\.js"></script>||g' "$ROOT_DIR/docs/index.html"
fi

printf "Synced docs/ from public/ and src/\n"
