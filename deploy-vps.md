# VPS deploy za sala.ice.lol

## 1. Clone repo

```bash
git clone <REPO_URL> sala.ba
cd sala.ba
```

## 2. Copy `.env.example` u `.env`

```bash
cp .env.example .env
```

## 3. Edit env

```bash
nano .env
```

Obavezno promijeni:

- `JWT_SECRET`
- `POSTGRES_PASSWORD`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_SUPER_ADMIN_EMAIL`
- `SEED_SUPER_ADMIN_PASSWORD`
- `NEXT_PUBLIC_API_URL=https://sala.ice.lol/api`
- `NEXT_PUBLIC_SITE_URL=https://sala.ice.lol`
- `FRONTEND_URL=https://sala.ice.lol`

Backend u Docker mreži treba koristiti:

```env
DATABASE_URL=postgresql://sala:YOUR_PASSWORD@postgres:5432/sala_db?schema=public
```

## 4. Build

```bash
docker compose build
```

## 5. Start

```bash
docker compose up -d
```

## 6. Provjera logova

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## 7. Provjera containera

```bash
docker compose ps
curl http://127.0.0.1:4111/health
curl -I http://127.0.0.1:3111
```

## 8. Nginx config za `sala.ice.lol`

```bash
sudo nano /etc/nginx/sites-available/sala.ice.lol
```

```nginx
server {
    listen 80;
    server_name sala.ice.lol;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:4111/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:4111/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3111;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktiviraj site:

```bash
sudo ln -s /etc/nginx/sites-available/sala.ice.lol /etc/nginx/sites-enabled/sala.ice.lol
```

## 9. Nginx test i reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Za HTTPS:

```bash
sudo certbot --nginx -d sala.ice.lol
```

## 10. Restart app

```bash
docker compose restart
docker compose restart backend
docker compose restart frontend
docker compose logs -f --tail=100
```

PostgreSQL nije javno izložen jer je mapiran samo na `127.0.0.1:55444:5432`.
