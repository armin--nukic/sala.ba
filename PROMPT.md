# sala.ba Full Refactor Plan

Ovaj projekat je nova full-stack aplikacija za sale/prostore/evente na domeni `sala.ice.lol`.

## Cilj

Izgraditi moderan, brz, responsive i SEO-friendly proizvod za `sala.ba` koji radi kao marketplace, booking inquiry sistem i mali CRM/ERP admin panel.

## Stack

- Frontend: Next.js, React, TypeScript
- Styling: custom CSS sa premium/glassmorphism UI pristupom
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Deploy: Docker Compose + Nginx

## Funkcionalnosti

- Dvojezični BS/EN switcher
- Home, sale, wedding, sport, diaspora, about, contact
- Login, register, logout
- Dashboard za korisnika
- Admin panel za korisnike, role, sale, kontakt poruke i upite
- Venue CRUD
- Contact form save u bazu
- Inquiry form save u bazu
- Seed za admin, super admin i demo sale

## API

Backend izlaže:

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
- `GET /api/admin/contact-messages`
- `POST /api/inquiries`
- `GET /api/admin/inquiries`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`

## Docker

Compose servisi:

- `frontend`: `127.0.0.1:3111:3000`
- `backend`: `127.0.0.1:4111:4000`
- `postgres`: `127.0.0.1:55444:5432`

PostgreSQL nikada ne izlagati javno. Backend u Docker mreži koristi `postgres:5432`.

## Nastavak rada

1. Provjeri `.env`.
2. Pokreni `npm install`.
3. Pokreni migracije i seed.
4. Testiraj auth, CRUD, contact i inquiries.
5. Kod novih funkcionalnosti dodaj validaciju, API endpoint, Prisma promjenu ako treba i UI.
6. Održavaj mobile-first dizajn i SEO metadata.
