#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" pull || true
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" build
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d --remove-orphans
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T backend php artisan migrate --force
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T backend php artisan storage:link || true
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T backend php artisan optimize
docker image prune -f
