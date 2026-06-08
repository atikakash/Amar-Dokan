# Monitoring Setup

The Compose stack includes:

- Prometheus
- Grafana
- Nginx Prometheus Exporter
- Node Exporter
- cAdvisor

## URLs

```text
Prometheus: http://SERVER_IP:9090
Grafana:    http://SERVER_IP:3002
```

Set ports with:

```text
PROMETHEUS_PORT=9090
GRAFANA_PORT=3002
```

Grafana credentials:

```text
GRAFANA_ADMIN_USER
GRAFANA_ADMIN_PASSWORD
```

## Metrics

Prometheus scrapes:

- Prometheus health
- VPS host metrics from Node Exporter
- Container CPU/memory from cAdvisor
- Nginx connection metrics from Nginx Prometheus Exporter

## Recommended Alerts

Add Alertmanager later for:

- Container restart loops
- MySQL container down
- High disk usage
- High memory usage
- Queue backlog
- HTTP health endpoint down
- Backup missing for more than 24 hours

## Logs

Useful commands:

```bash
docker compose --env-file .env.production logs -f nginx
docker compose --env-file .env.production logs -f backend
docker compose --env-file .env.production logs -f queue
docker compose --env-file .env.production logs -f mysql
```

For larger production systems, forward Docker logs to Loki, OpenSearch, or another centralized log backend.
