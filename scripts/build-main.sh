#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Bundle app for main site
npx esbuild "$ROOT_DIR/src/main.js" \
  --bundle \
  --format=iife \
  --target=es2015 \
  --outfile="$ROOT_DIR/docs/bundle.js"

echo "Built main bundle to docs/bundle.js"
