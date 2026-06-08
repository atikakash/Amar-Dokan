# Backup Strategy

## What Is Backed Up

- MySQL database dump
- Laravel `storage` directory

Backups are created by the `backup` service in `docker-compose.yml`.

Default schedule:

```text
02:00 every day
```

Default retention:

```text
14 days
```

Set retention with:

```text
BACKUP_RETENTION_DAYS=14
```

## Backup Location

```text
deployment/backups/YYYYMMDD-HHMMSS/
  mysql.sql.gz
  storage.tar.gz
```

## Manual Backup

```bash
docker compose --env-file .env.production run --rm backup sh /usr/local/bin/backup.sh
```

## Restore MySQL

```bash
bash scripts/restore-mysql.sh deployment/backups/YYYYMMDD-HHMMSS/mysql.sql.gz
```

## Restore Storage

```bash
docker compose --env-file .env.production down
docker run --rm \
  -v ecommerce_backend_storage:/restore \
  -v "$PWD/deployment/backups/YYYYMMDD-HHMMSS:/backup" \
  alpine sh -c "rm -rf /restore/* && tar -xzf /backup/storage.tar.gz -C /restore --strip-components=1"
docker compose --env-file .env.production up -d
```

## Offsite Backups

For production, sync `deployment/backups` to offsite storage.

Example:

```bash
rsync -az deployment/backups/ backup-user@backup-host:/backups/ecommerce/
```

Recommended policy:

- Daily local backups
- Daily offsite sync
- Weekly restore test
- Monthly archive snapshot
