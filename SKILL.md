# sala.ba Development Rules

- Uvijek prvo provjeriti postojeću strukturu prije rada.
- Ne brisati postojeću funkcionalnost bez jasne potrebe.
- Koristiti postojeći stack projekta: Next.js, React, TypeScript, Express, Prisma, PostgreSQL i Docker.
- Svaka nova funkcionalnost koja treba podatke mora imati frontend, backend i bazni sloj.
- Paziti na Docker portove: frontend `3111`, backend `4111`, PostgreSQL `55444`.
- Backend u Docker mreži priča sa bazom preko `postgres:5432`.
- PostgreSQL ne smije biti javno otvoren na internetu.
- Ne hardcodirati secret podatke, tokene, šifre ili produkcijske URL-ove.
- Pisati čist, tipiziran i čitljiv kod.
- UI mora biti mobile-first, responsive i SEO friendly.
- Admin endpointi i admin UI moraju provjeravati role.
- Preferirati reusable komponente i izbjegavati duplicate code.
- Dodati validaciju zahtjeva na backendu.
- Za promjene schema koristiti Prisma migracije.
