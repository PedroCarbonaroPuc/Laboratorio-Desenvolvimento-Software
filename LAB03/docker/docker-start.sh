#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

echo "[docker-start] Subindo MongoDB, backend e frontend..."
docker compose -f "${COMPOSE_FILE}" up --build -d

echo "[docker-start] Ambiente pronto:"
echo "- Frontend: http://localhost:5173"
echo "- Backend:  http://localhost:8080"
echo "- MongoDB:  mongodb://localhost:27017/moeda_estudantil"
