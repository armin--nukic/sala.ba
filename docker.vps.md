# VPS Docker Update Runbook

Ovo je postupak za update VPS deploya bez mijenjanja portova i bez diranja nginx konfiguracije.

## 1. Udji u projekat

```bash
cd /path/to/sala.ba
```

Ako deploy ide iz git repozitorija:

```bash
git pull
```

## 2. Provjeri `.env`

Za VPS obavezno postavi produkcijske URL-ove. Primjer:

```env
NODE_ENV=production

NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN/api
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN
API_INTERNAL_URL=http://backend:4000/api

PORT=4000
BACKEND_PUBLIC_URL=https://YOUR_DOMAIN
FRONTEND_URL=https://YOUR_DOMAIN
FRONTEND_URLS=https://YOUR_DOMAIN

DATABASE_URL=postgresql://sala:YOUR_DB_PASSWORD@postgres:5432/sala_db?schema=public
POSTGRES_USER=sala
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
POSTGRES_DB=sala_db

JWT_SECRET=CHANGE_TO_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
```

Seed nalozi:

```env
SEED_SUPER_ADMIN_EMAIL=superadmin@sala.ba
SEED_SUPER_ADMIN_PASSWORD=SuperAdmin12345!
SEED_ADMIN_EMAIL=admin@sala.ba
SEED_ADMIN_PASSWORD=Admin12345!
SEED_OWNER_EMAIL=owner@sala.ba
SEED_OWNER_PASSWORD=Owner12345!
SEED_USER_EMAIL=user@sala.ba
SEED_USER_PASSWORD=User12345!
```

Nakon prvog login-a promijeni lozinke u sistemu ili u env-u pa ponovo pusti seed.

## 3. Build imagea

```bash
docker compose build
```

## 4. Start containeri

```bash
docker compose up -d
```

Portovi u compose-u ostaju:

- Frontend container izlazi na `127.0.0.1:3111`
- Backend container izlazi na `127.0.0.1:4111`
- PostgreSQL izlazi na `127.0.0.1:55444`

## 5. Migracije baze

Pokreni poslije svakog updatea:

```bash
docker compose run --rm backend npx prisma migrate deploy
```

## 6. Seed baze

Seed je idempotent i siguran za ponavljanje:

```bash
docker compose run --rm backend npm run prisma:seed
```

Ili zajedno:

```bash
docker compose run --rm backend sh -c "npx prisma migrate deploy && npm run prisma:seed"
```

## 7. Restart app nakon DB updatea

```bash
docker compose up -d backend frontend
```

## 8. Upload volume

Upload slika ide u:

```text
/app/backend/uploads/venues
```

Compose volume:

```text
backend_uploads:/app/backend/uploads
```

Ne pokreci `docker compose down -v` na produkciji osim ako namjerno brises bazu i uploadovane slike.

## 9. Provjera

```bash
docker compose ps
curl http://127.0.0.1:4111/health
curl -I http://127.0.0.1:3111
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
```

Ako nginx vec radi, provjeri domenu:

```bash
curl -I https://YOUR_DOMAIN
curl https://YOUR_DOMAIN/api/auth/me
```

`/api/auth/me` bez login tokena treba vratiti auth error, sto znaci da proxy do backend API-ja radi.

## 10. Login nalozi

- SUPER_ADMIN: `superadmin@sala.ba` / `SuperAdmin12345!`
- ADMIN: `admin@sala.ba` / `Admin12345!`
- OWNER: `owner@sala.ba` / `Owner12345!`
- USER: `user@sala.ba` / `User12345!`

## 11. Test uploada na VPS-u

1. Login kao `superadmin@sala.ba`.
2. Otvori `/admin`.
3. U `Venues Management` uploaduj jednu ili vise slika.
4. Kreiraj salu.
5. Otvori public detail stranicu sale.
6. Slika treba dolaziti sa `https://YOUR_DOMAIN/uploads/venues/...`.

Ako se slika ne vidi:

```bash
docker compose logs --tail=100 backend
docker compose exec backend ls -lah /app/backend/uploads/venues
curl -I https://YOUR_DOMAIN/uploads/venues/IME_FAJLA.png
```

## 12. Rollback na prethodni kod

Ako update ne valja:

```bash
git log --oneline -5
git checkout PREVIOUS_COMMIT
docker compose build
docker compose up -d
```

Rollback baze nije automatski. Prisma migracije tretiraj kao forward-only na produkciji.
