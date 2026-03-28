#!/bin/bash
echo "=== RentACar - Iniciando containers ==="
cd "$(dirname "$0")"
docker compose up -d --build
echo "=== Containers iniciados ==="
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo "  MongoDB:  localhost:27017"
