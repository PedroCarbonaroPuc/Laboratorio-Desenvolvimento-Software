#!/bin/bash
echo "=== RentACar - Parando containers ==="
cd "$(dirname "$0")"
docker compose down
echo "=== Containers parados ==="
