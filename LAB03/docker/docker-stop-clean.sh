#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

echo "[docker-stop-clean] Parando e removendo containers, redes, volumes e imagens locais..."
docker compose -f "${COMPOSE_FILE}" down --volumes --remove-orphans --rmi local

echo "[docker-stop-clean] Ambiente limpo com sucesso."
