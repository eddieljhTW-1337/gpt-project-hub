#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/docs"
mkdir -p "$ROOT_DIR/docs"

cp -R "$ROOT_DIR/public/"* "$ROOT_DIR/docs/"
cp -R "$ROOT_DIR/src" "$ROOT_DIR/docs/"

printf "Synced docs/ from public/ and src/\n"
