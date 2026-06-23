# Deploy na sala.ice.lol

Ovaj projekat je Docker Compose setup: PostgreSQL, Express backend i Next frontend. Na VPS-u ga najlakše vrtiš iza Nginx reverse proxyja.

## 1. Upload na GitHub

Ako je ovo već repo `sala.ba`, samo commit/push:

```bash
git status
git add .
git commit -m "Improve SEO mobile admin deploy"
git push origin main
```

Ako je lokalni folder novi i treba ga povezati sa GitHub repo:

```bash
git init
git remote add origin git@github.com:TVOJ_USERNAME/sala.ba.git
git add .
git commit -m "Initial sala.ba full stack app"
git branch -M main
git push -u origin main
```

## 2. Priprema VPS-a

Na serveru instaliraj Docker, Compose plugin, Nginx i Certbot:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Odjavi se i prijavi ponovo da Docker grupa proradi.

## 3. Clone projekta

```bash
cd /var/www
sudo mkdir -p sala.ba
sudo chown -R $USER:$USER sala.ba
git clone git@github.com:TVOJ_USERNAME/sala.ba.git sala.ba
cd sala.ba
```

Ako koristiš HTTPS remote:

```bash
git clone https://github.com/TVOJ_USERNAME/sala.ba.git sala.ba
```

## 4. `.env` za produkciju

```bash
cp .env.example .env
nano .env
```

Za `sala.ice.lol` postavi ovako:

```env
NODE_ENV=production

NEXT_PUBLIC_API_URL=https://sala.ice.lol/api
NEXT_PUBLIC_SITE_URL=https://sala.ice.lol
API_INTERNAL_URL=http://backend:4000/api

PORT=4000
BACKEND_PUBLIC_URL=https://sala.ice.lol
FRONTEND_URL=https://sala.ice.lol
FRONTEND_URLS=https://sala.ice.lol,http://127.0.0.1:3111,http://localhost:3111

POSTGRES_USER=sala
POSTGRES_PASSWORD=OVDJE_JAKA_LOZINKA
POSTGRES_DB=sala_db
DATABASE_URL=postgresql://sala:OVDJE_JAKA_LOZINKA@postgres:5432/sala_db?schema=public

JWT_SECRET=OVDJE_DUG_RANDOM_SECRET
JWT_EXPIRES_IN=7d

SEED_ADMIN_EMAIL=admin@sala.ba
SEED_ADMIN_PASSWORD=PROMIJENI_OVO
SEED_SUPER_ADMIN_EMAIL=superadmin@sala.ba
SEED_SUPER_ADMIN_PASSWORD=PROMIJENI_OVO

STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_SUCCESS_URL=https://sala.ice.lol/dashboard?plan=pro
STRIPE_CANCEL_URL=https://sala.ice.lol/dashboard?plan=cancelled
```

Za `JWT_SECRET` možeš generisati:

```bash
openssl rand -base64 48
```

## 5. Build i start

```bash
docker compose up -d --build
docker compose ps
```

Prvi put ubaci demo podatke:

```bash
docker compose exec backend npm run prisma:seed
```

Provjera:

```bash
curl http://127.0.0.1:4111/health
curl -I http://127.0.0.1:3111
docker compose logs -f --tail=100
```

## 6. Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/sala.ice.lol
```

Ubaci:

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

Aktiviraj:

```bash
sudo ln -s /etc/nginx/sites-available/sala.ice.lol /etc/nginx/sites-enabled/sala.ice.lol
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL certifikat

DNS za `sala.ice.lol` mora pokazivati na IP VPS-a. Onda:

```bash
sudo certbot --nginx -d sala.ice.lol
```

Provjera:

```bash
curl -I https://sala.ice.lol
curl https://sala.ice.lol/health
```

## 8. Update poslije novog pusha

Na VPS-u:

```bash
cd /var/www/sala.ba
git pull origin main
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose ps
```

Ako želiš opet ubaciti seed demo podatke:

```bash
docker compose exec backend npm run prisma:seed
```

## 9. Admin test nalozi

Ako nisi promijenio seed:

```text
admin@sala.ba
Admin12345!
```

```text
superadmin@sala.ba
SuperAdmin12345!
```

Obavezno promijeni lozinke poslije deploya.

## 10. SEO poslije deploya

Kad HTTPS radi, otvori:

- `https://sala.ice.lol/sitemap.xml`
- `https://sala.ice.lol/robots.txt`

Zatim dodaj domain u Google Search Console i submituj sitemap:

```text
https://sala.ice.lol/sitemap.xml
```

## 11. Korisne komande

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose restart
docker compose down
docker compose down -v
```

`down -v` briše bazu, zato ga koristi samo kad stvarno želiš fresh start.
