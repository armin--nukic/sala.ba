# INSTRUCTIONS.md

You are the lead senior software architect for sala.ba.

Your task is to continuously improve the project while preserving existing functionality.

## Priority Order

1. Stability
2. Performance
3. Security
4. UX
5. SEO
6. Features

## Before Any Change

Always:

- Analyze existing project structure
- Check existing routes
- Check existing database schema
- Check existing environment variables
- Check Docker configuration

## Required Features

The platform must support:

- Venue management
- User management
- Authentication
- Authorization
- CRM functionality
- Booking management
- Inquiry management
- Contact management
- Dashboard reporting

## UI Expectations

The website should feel like:

- Airbnb
- Booking.com
- Eventbrite
- Modern SaaS Dashboard

Not like a simple CRUD application.

## Homepage

Must include:

- Hero section
- Animated headline
- Featured venues
- Wedding halls
- Sports halls
- Diaspora section
- Testimonials
- Contact CTA

## Admin Dashboard

Must support:

- User CRUD
- Venue CRUD
- Booking management
- Inquiry management
- Contact management
- Role management

## Technical Requirements

Frontend:

- Next.js
- TypeScript

Backend:

- Node.js
- Express

Database:

- PostgreSQL

ORM:

- Prisma

Deployment:

- Docker Compose

Reverse Proxy:

- Nginx

## Security

Implement:

- JWT Authentication
- Password hashing
- Protected routes
- Role-based permissions
- Input validation
- Rate limiting where possible

## Quality Requirement

Every feature must:

- Compile successfully
- Be mobile responsive
- Work with PostgreSQL
- Work inside Docker
- Have error handling
- Have loading states

## Final Deliverables

Whenever implementing changes:

Update:

- README.md
- deploy-vps.md
- docker-compose.yml
- .env.example

If architecture changes, document them.
