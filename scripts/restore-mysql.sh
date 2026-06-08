#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: scripts/restore-mysql.sh deployment/backups/YYYYMMDD-HHMMSS/mysql.sql.gz"
  exit 1
fi

ENV_FILE="${ENV_FILE:-.env.production}"
BACKUP_FILE="$1"

set -a
source "${ENV_FILE}"
set +a

gzip -dc "${BACKUP_FILE}" | docker compose --env-file "${ENV_FILE}" exec -T mysql \
  mysql -u"${DB_USERNAME:-ecommerce}" -p"${DB_PASSWORD}" "${DB_DATABASE:-ecommerce}"
