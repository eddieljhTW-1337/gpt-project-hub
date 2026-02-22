#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/docs"
mkdir -p "$ROOT_DIR/docs"

cp -R "$ROOT_DIR/public/"* "$ROOT_DIR/docs/"

# Keep preview template out of main site root
rm -f "$ROOT_DIR/docs/index-build.html"

printf "Synced docs/ from public/ and src/\n"
