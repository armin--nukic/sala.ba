# Lokalno pokretanje sala.ba

## Docker varijanta

1. Napravi `.env` iz primjera:

```bash
cp .env.example .env
```

2. Pokreni frontend, backend i PostgreSQL:

```bash
docker compose up -d --build
```

3. Prvi put ubaci demo sale, slike, admin korisnike i forum primjere:

```bash
docker compose exec backend npm run prisma:seed
```

4. Otvori aplikaciju:

- Frontend: http://127.0.0.1:3111
- Backend health: http://127.0.0.1:4111/health
- PostgreSQL: `127.0.0.1:55444`

Admin login poslije seeda:

- `admin@sala.ba`
- `Admin12345!`

Registracija običnog korisnika radi direktno kroz frontend. Rezervacija termina radi samo kada je korisnik prijavljen, pa se upit sprema u bazu i veže za `userId`.

## Korisne Docker komande

Status:

```bash
docker compose ps
```

Logovi:

```bash
docker compose logs -f frontend
docker compose logs -f backend
```

Restart:

```bash
docker compose restart
```

Rebuild nakon izmjena:

```bash
docker compose up -d --build
```

Gašenje bez brisanja baze:

```bash
docker compose down
```

Gašenje i brisanje baze:

```bash
docker compose down -v
```

## Bez Dockera

Trebaš imati lokalni PostgreSQL i Node.js.

```bash
cp .env.example .env
npm install
```

U `.env` promijeni vrijednosti za lokalne portove:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/sala_db?schema=public
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Zatim:

```bash
npm --workspace backend run prisma:migrate
npm --workspace backend run prisma:seed
npm run dev
```

URL-ovi bez Dockera:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/health

## Ako nešto ne radi

Ako frontend ne vidi backend, provjeri da u `.env` za Docker stoji:

```env
NEXT_PUBLIC_API_URL=http://localhost:4111/api
API_INTERNAL_URL=http://backend:4000/api
FRONTEND_URL=http://localhost:3111
```

Ako vidiš staru verziju stranice:

```bash
docker compose up -d --build frontend
```
