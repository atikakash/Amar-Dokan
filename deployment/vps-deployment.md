# VPS Deployment Guide

## 1. Prepare DNS

Point your production domain to the VPS public IP.

Example:

```text
example.com A 203.0.113.10
```

## 2. Prepare Server

Ubuntu example:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git ufw
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

Firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 3. Clone App

```bash
sudo mkdir -p /srv/ecommerce
sudo chown -R $USER:$USER /srv/ecommerce
git clone <your-repo-url> /srv/ecommerce
cd /srv/ecommerce
cp .env.production.example .env.production
```

Fill `.env.production`.

## 4. TLS Options

Recommended production pattern:

- Use a host-level reverse proxy such as Caddy, Traefik, or Nginx with Certbot for TLS.
- Forward HTTPS traffic to this Compose stack on port 80.

Minimal host Nginx TLS proxy:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

## 5. Deploy

```bash
bash scripts/deploy.sh
```

For image-based deployment from CI:

```bash
export REGISTRY_IMAGE=ghcr.io/your-org/ecommerce
export IMAGE_TAG=<git-sha-or-latest>
docker compose --env-file .env.production pull
docker compose --env-file .env.production up -d --remove-orphans
docker compose --env-file .env.production exec backend php artisan migrate --force
```

## 6. CI/CD Secrets

Add these GitHub repository secrets:

```text
PUBLIC_API_URL
GHCR_TOKEN
VPS_HOST
VPS_USER
VPS_SSH_KEY
VPS_APP_DIR
```

`GHCR_TOKEN` needs package read access so the VPS can pull private images. The workflow publishes images to GitHub Container Registry and deploys to the VPS over SSH.

## 7. Rollback

Set an older image tag and restart:

```bash
export IMAGE_TAG=<previous-sha>
docker compose --env-file .env.production up -d --remove-orphans
docker compose --env-file .env.production exec backend php artisan migrate:status
```

Database rollbacks should be handled manually and only after confirming migration safety.
