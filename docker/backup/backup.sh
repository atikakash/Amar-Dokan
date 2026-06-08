#!/usr/bin/env sh
set -eu

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/backups/${TIMESTAMP}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

mkdir -p "${BACKUP_DIR}"

mysqldump \
  --host="${DB_HOST:-mysql}" \
  --port="${DB_PORT:-3306}" \
  --user="${DB_USERNAME}" \
  --password="${DB_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  "${DB_DATABASE}" | gzip > "${BACKUP_DIR}/mysql.sql.gz"

tar -czf "${BACKUP_DIR}/storage.tar.gz" -C /var/www/html storage

find /backups -mindepth 1 -maxdepth 1 -type d -mtime "+${RETENTION_DAYS}" -exec rm -rf {} \;

echo "Backup completed: ${BACKUP_DIR}"
