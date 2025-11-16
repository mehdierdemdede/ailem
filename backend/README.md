# AilePlus Backend

NestJS API scaffold prepared for PostgreSQL (via Prisma) and Redis.

## Structure
- `src/main.ts` – Application bootstrap with validation and configuration.
- `src/app.module.ts` – Root module wiring configuration and feature modules.
- `src/common` – Cross-cutting concerns like configuration and persistence abstractions.
- `src/modules` – Feature modules organized by bounded context.
- `prisma` – Prisma schema and migration entry points.

## Getting Started
1. Copy `.env.example` to `.env` and adjust database/redis credentials.
2. Install dependencies (`npm install`).
3. Run `npm run start:dev` to start the API.

## Environment
The `.env.example` file enumerates required environment variables for local development.
