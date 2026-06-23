# sala.ba - Local Docker Development README

## Quick Start

Prvi put:

```bash
cp .env.example .env

docker compose up -d --build

docker compose run --rm backend npx prisma migrate deploy

docker compose run --rm backend npm run prisma:seed
```

Otvori:

```text
Frontend:
http://localhost:3111

Backend:
http://localhost:4111

Health:
http://localhost:4111/health
```

---

# Normal Development Flow

Ovo je workflow koji ćeš koristiti skoro svaki dan.

## Scenario 1 - Promijenio sam React komponentu, CSS ili frontend stranicu

Primjeri:

- Home page
- About page
- Navbar
- Footer
- CSS
- Tailwind
- Cards
- Dashboard UI

Pokreni:

```bash
docker compose up -d --build frontend
```

Provjeri:

```text
http://localhost:3111
```

Ako koristiš hot reload možda neće trebati ni rebuild.

---

## Scenario 2 - Promijenio sam backend kod

Primjeri:

- Controller
- Route
- Service
- Validation
- Auth
- Role permissions

Pokreni:

```bash
docker compose up -d --build backend
```

Provjeri:

```bash
curl http://localhost:4111/health
```

---

## Scenario 3 - Promijenio sam frontend i backend

Najčešći slučaj.

Pokreni:

```bash
docker compose up -d --build
```

To je komanda koju ćeš najviše koristiti.

---

## Scenario 4 - Promijenio sam Prisma schema

Primjer:

Dodao si:

```prisma
model VenueImage
model Reservation
model OwnerProfile
```

Pokreni:

```bash
docker compose run --rm backend npx prisma migrate deploy
```

Zatim:

```bash
docker compose up -d backend
```

---

## Scenario 5 - Promijenio sam seed

Primjeri:

- Novi admin
- Novi super admin
- Nove sale
- Novi gradovi

Pokreni:

```bash
docker compose run --rm backend npm run prisma:seed
```

Nema potrebe za rebuildom.

---

## Scenario 6 - Promijenio sam .env

Primjeri:

- JWT_SECRET
- Stripe key
- API URL
- Frontend URL

Pokreni:

```bash
docker compose up -d --build
```

Environment varijable se učitavaju tek nakon restarta.

---

## Scenario 7 - Dodao sam npm paket

Frontend:

```bash
docker compose up -d --build frontend
```

Backend:

```bash
docker compose up -d --build backend
```

---

# Najčešći Workflow

95% vremena:

```bash
docker compose up -d --build
```

Otvori:

```text
http://localhost:3111
```

Refresh browser.

Gotovo.

---

# Provjera da li sve radi

Provjeri containere:

```bash
docker compose ps
```

Provjeri health:

```bash
curl http://localhost:4111/health
```

Provjeri logove:

```bash
docker compose logs -f backend
```

ili:

```bash
docker compose logs -f frontend
```

---

# Seed Accounts

SUPER ADMIN

```text
Email:
superadmin@sala.ba

Password:
SuperAdmin12345!
```

ADMIN

```text
Email:
admin@sala.ba

Password:
Admin12345!
```

OWNER

```text
Email:
owner@sala.ba

Password:
Owner12345!
```

USER

```text
Email:
user@sala.ba

Password:
User12345!
```

---

# Role Permissions

## USER

Može:

- pregledati sale
- slati upite
- rezervisati termine

Ne može:

- dodavati sale
- upravljati korisnicima

---

## OWNER

Može:

- dodati svoju salu
- uređivati svoju salu
- upload slike
- pregled rezervacija svoje sale

Ne može:

- pregledati sve korisnike
- mijenjati role

---

## ADMIN

Može:

- upravljati salama
- odobravati sale
- uređivati sale
- pregled rezervacija

Ne može:

- upravljati SUPER_ADMIN korisnicima

---

## SUPER_ADMIN

Može:

- pregled svih korisnika
- dodjela rola
- aktivacija/deaktivacija korisnika
- upravljanje svim salama
- sve admin akcije

---

# Upload Slika

Upload folder:

```text
/app/backend/uploads
```

Docker volume:

```text
backend_uploads
```

Slike ostaju sačuvane nakon:

```bash
docker compose up -d --build
```

Nemoj koristiti:

```bash
docker compose down -v
```

ako želiš sačuvati slike.

---

# Backup Baze

Dump:

```bash
docker compose exec postgres pg_dump -U sala sala_db > backup.sql
```

Restore:

```bash
docker compose exec -T postgres psql -U sala sala_db < backup.sql
```

---

# Full Reset

Samo ako želiš potpuno novu bazu.

```bash
docker compose down -v

docker compose up -d --build

docker compose run --rm backend npx prisma migrate deploy

docker compose run --rm backend npm run prisma:seed
```

⚠️ Ovo briše:

- PostgreSQL podatke
- Upload slike
- Docker volume
- Sve korisnike i rezervacije

Koristi samo kada stvarno želiš krenuti ispočetka.
