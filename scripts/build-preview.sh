#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/docs/build"
mkdir -p "$ROOT_DIR/docs/build"

# Copy public assets
cp -R "$ROOT_DIR/public/"* "$ROOT_DIR/docs/build/"

# Replace index with preview template
if [ -f "$ROOT_DIR/docs/build/index-build.html" ]; then
  mv "$ROOT_DIR/docs/build/index-build.html" "$ROOT_DIR/docs/build/index.html"
fi

# Bundle app for preview
npx esbuild "$ROOT_DIR/src/main.js" \
  --bundle \
  --format=iife \
  --target=es2015 \
  --outfile="$ROOT_DIR/docs/build/bundle.js"

echo "Built preview to docs/build/"
