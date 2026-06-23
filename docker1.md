# Local Docker Update Runbook

Ovo je brzi postupak da lokalni Docker bude up to date sa kodom, bazom, migracijama, seed podacima i upload storageom.

## 1. Provjeri `.env`

Minimalno treba biti ovako za lokalni Docker:

```env
NEXT_PUBLIC_API_URL=http://localhost:4111/api
NEXT_PUBLIC_SITE_URL=http://localhost:3111
API_INTERNAL_URL=http://backend:4000/api

PORT=4000
BACKEND_PUBLIC_URL=http://localhost:4111
FRONTEND_URL=http://localhost:3111
FRONTEND_URLS=http://localhost:3111,http://127.0.0.1:3111

DATABASE_URL=postgresql://sala:sala_password@postgres:5432/sala_db?schema=public
POSTGRES_USER=sala
POSTGRES_PASSWORD=sala_password
POSTGRES_DB=sala_db

JWT_SECRET=change-this-long-random-secret
JWT_EXPIRES_IN=7d
```

Seed ima default naloge, ali ih mozes eksplicitno dodati:

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

## 2. Rebuild i start

```bash
docker compose build
docker compose up -d
```

Portovi ostaju:

- Frontend: http://localhost:3111
- Backend: http://localhost:4111
- Backend health: http://localhost:4111/health
- PostgreSQL host port: `127.0.0.1:55444`

## 3. Migracije baze

Pokreni svaki put nakon updatea koda:

```bash
docker compose run --rm backend npx prisma migrate deploy
```

## 4. Seed

Seed je idempotent: updateuje postojece korisnike i sale, ne duplira korisnike.

```bash
docker compose run --rm backend npm run prisma:seed
```

Jedna komanda za migracije + seed:

```bash
docker compose run --rm backend sh -c "npx prisma migrate deploy && npm run prisma:seed"
```

## 5. Restart nakon migracije/seeda

```bash
docker compose up -d backend frontend
```

## 6. Upload storage

Slike se uploaduju u backend container na:

```text
/app/backend/uploads/venues
```

`docker-compose.yml` koristi volume:

```text
backend_uploads:/app/backend/uploads
```

Zato slike ostaju sacuvane nakon rebuild/restart. Nemoj koristiti `docker compose down -v` ako ne zelis obrisati bazu i upload volume.

## 7. Login nalozi

- SUPER_ADMIN: `superadmin@sala.ba` / `SuperAdmin12345!`
- ADMIN: `admin@sala.ba` / `Admin12345!`
- OWNER: `owner@sala.ba` / `Owner12345!`
- USER: `user@sala.ba` / `User12345!`

## 8. Brzi test

```bash
curl http://localhost:4111/health
docker compose ps
docker compose logs --tail=100 backend
```

Test uploada:

1. Login na http://localhost:3111/login kao `superadmin@sala.ba`.
2. Otvori http://localhost:3111/admin.
3. U `Venues Management` klikni `Upload images`.
4. Popuni formu i klikni `Create venue`.
5. Otvori novu salu na public stranici i provjeri da se slika vidi.

## 9. Reset samo ako bas hoces sve ispocetka

Ovo brise bazu i upload volume:

```bash
docker compose down -v
docker compose up -d --build
docker compose run --rm backend sh -c "npx prisma migrate deploy && npm run prisma:seed"
```
