# sala.ba

Nova full-stack aplikacija za marketplace sala/prostora, upite, rezervacije i osnovni CRM/admin sistem.

## Stack

- Frontend: Next.js, React, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + role-based admin protection
- Deploy: Docker Compose + Nginx reverse proxy

## Lokalno pokretanje

```bash
cp .env.example .env
npm install
npm --workspace backend run prisma:generate
docker compose up -d postgres
npm --workspace backend run prisma:migrate
npm --workspace backend run prisma:seed
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000/health

Za Docker test sa traženim portovima:

```bash
cp .env.example .env
docker compose build
docker compose up -d
docker compose logs -f backend frontend
```

Docker portovi:

- Frontend: http://127.0.0.1:3111
- Backend: http://127.0.0.1:4111
- PostgreSQL: `127.0.0.1:55444`

## Seed admin nalozi

Primjeri su u `.env.example`. Promijeni ih prije deploya.

## API

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/venues`
- `GET /api/venues/:slug`
- `POST /api/venues`
- `PUT /api/venues/:id`
- `DELETE /api/venues/:id`
- `POST /api/contact`
- `POST /api/inquiries`
- `GET /api/admin/stats`
- `GET /api/admin/contact-messages`
- `GET /api/admin/inquiries`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
