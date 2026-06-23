# SKILLS.md

## sala.ba Development Rules

### Project Overview

sala.ba je moderna platforma za pretragu, rezervaciju i upravljanje salama i event prostorima.

Sistem podržava:

- Wedding Halls
- Sports Halls
- Diaspora Events
- Conference Venues
- Celebration Venues

Projekt mora funkcionisati kao kombinacija:

- Marketplace
- CRM
- ERP Lite

---

## Architecture

Always follow:

Frontend

- Next.js
- TypeScript
- Responsive Design
- SEO First

Backend

- Node.js
- Express
- PostgreSQL
- Prisma

Infrastructure

- Docker
- Docker Compose
- Nginx Reverse Proxy

---

## Development Standards

Always:

- Reuse components
- Avoid duplicate code
- Use TypeScript types
- Use DTOs
- Validate API requests
- Handle errors properly
- Use loading states
- Use skeleton loaders
- Support mobile devices

Never:

- Hardcode secrets
- Hardcode URLs
- Hardcode database credentials
- Expose PostgreSQL publicly
- Break existing functionality

---

## Performance Rules

Always optimize:

- Images
- API calls
- Components
- Bundle size

Prefer:

- Lazy loading
- Dynamic imports
- Server Components where applicable
- Pagination

---

## UI Rules

Design style:

- Modern SaaS
- Premium
- Clean
- Fast

Use:

- Cards
- Gradients
- Glassmorphism
- Animations
- Hover effects
- Mobile-first layouts

---

## Authentication

Roles:

USER
OWNER
ADMIN
SUPER_ADMIN

Every admin endpoint must verify role permissions.

---

## Database Rules

Tables:

users
venues
bookings
inquiries
contact_messages

Always create migrations.

Never modify production schema without migration.

---

## Deployment Rules

Ports:

Frontend: 3111
Backend: 4111
PostgreSQL: 55444

Nginx:

sala.ice.lol

Frontend:
127.0.0.1:3111

Backend:
127.0.0.1:4111

PostgreSQL:
Never exposed publicly.

---

## SEO Rules

Every page must have:

- title
- description
- og:title
- og:description
- canonical url

All images:

- alt text
- optimized format

---

## Code Quality

Before creating new code:

1. Check existing code.
2. Check reusable components.
3. Check existing API routes.
4. Check existing database models.
5. Refactor before duplicating.

Always leave project cleaner than before.
