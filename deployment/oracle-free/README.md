# Free Deployment Lineup: Oracle VPS + MySQL + Vercel

This path avoids Docker and paid Forge hosting.

## Target Architecture

```text
Oracle Cloud Always Free Ubuntu VPS
  - Nginx
  - PHP 8.3 FPM
  - Laravel API
  - MySQL 8
  - Supervisor queue worker

Vercel Hobby
  - Customer Next.js app
  - Admin Next.js app

GitHub
  - Source code
```

## 1. Create Oracle Cloud VPS

1. Create an Oracle Cloud account.
2. Create an Always Free compute instance.
3. Recommended image: Ubuntu 24.04.
4. Recommended shape: Ampere A1 Flex if available.
5. Add your SSH public key.
6. In the Oracle subnet security list, allow inbound:

```text
22/tcp
80/tcp
443/tcp
```

Save:

```text
VPS_PUBLIC_IP
SSH_PRIVATE_KEY
```

## 2. SSH Into The VPS

From your local machine:

```bash
ssh ubuntu@VPS_PUBLIC_IP
```

## 3. Provision Backend And MySQL

Run this on the VPS:

```bash
sudo apt-get update
sudo apt-get install -y git
git clone https://github.com/NexyraSoft/Amar-Dokan.git /tmp/amar-dokan
cd /tmp/amar-dokan
sudo API_DOMAIN=VPS_PUBLIC_IP bash deployment/oracle-free/provision-ubuntu.sh
```

If you already own a domain and pointed `api.yourdomain.com` to the VPS:

```bash
sudo API_DOMAIN=api.yourdomain.com ENABLE_SSL=1 bash deployment/oracle-free/provision-ubuntu.sh
```

The script prints the generated MySQL password. Save it.

## 4. Test Backend

Without a domain:

```bash
curl http://VPS_PUBLIC_IP/api/v1/health
curl http://VPS_PUBLIC_IP/api/v1/products
```

With a domain:

```bash
curl https://api.yourdomain.com/api/v1/health
curl https://api.yourdomain.com/api/v1/products
```

Expected health response:

```json
{"status":"ok"}
```

## 5. Deploy Customer Website On Vercel

1. Go to Vercel.
2. Import the GitHub repository.
3. Set root directory:

```text
customer-website
```

4. Add environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=http://VPS_PUBLIC_IP/api/v1
```

If using SSL/domain:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
```

5. Deploy.
6. Save the Vercel URL, for example:

```text
https://amar-dokan-customer.vercel.app
```

## 6. Deploy Admin Dashboard On Vercel

Create another Vercel project from the same GitHub repository.

Set root directory:

```text
admin-dashboard
```

Add environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=http://VPS_PUBLIC_IP/api/v1
```

If using SSL/domain:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
```

Deploy and save the admin URL, for example:

```text
https://amar-dokan-admin.vercel.app
```

## 7. Update Backend CORS For Vercel URLs

SSH into the VPS:

```bash
ssh ubuntu@VPS_PUBLIC_IP
sudo nano /var/www/amar-dokan/backend/.env
```

Update:

```text
CORS_ALLOWED_ORIGINS=https://amar-dokan-customer.vercel.app,https://amar-dokan-admin.vercel.app
SANCTUM_STATEFUL_DOMAINS=amar-dokan-customer.vercel.app,amar-dokan-admin.vercel.app
FRONTEND_URL=https://amar-dokan-customer.vercel.app
```

Then run:

```bash
cd /var/www/amar-dokan/backend
sudo php artisan optimize:clear
sudo php artisan optimize
sudo systemctl reload php8.3-fpm
sudo systemctl reload nginx
```

## 8. Future Backend Deploys

After pushing code to GitHub:

```bash
ssh ubuntu@VPS_PUBLIC_IP
sudo bash /var/www/amar-dokan/deployment/oracle-free/deploy-backend.sh
```

## 9. Production Notes

- This is a free demo/MVP deployment path.
- Oracle Always Free can be capacity-limited by region.
- Keep regular database backups.
- Do not use `APP_DEBUG=true` in production.
- Use a real domain and HTTPS before taking real customer orders.
- Vercel Hobby is intended for personal/non-commercial usage.
