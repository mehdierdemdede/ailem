# AilePlus Admin

Next.js 14 Admin/Partner panel scaffold using the App Router and TypeScript.

## Structure
- `app/` – App Router entrypoints and pages.
- `lib/` – Shared utilities (API client, helpers).
- `config/` – Environment mapping and runtime configuration.
- `api/` – Client-side API abstractions grouped by feature.

## Getting Started
1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies (`npm install`).
3. Run `npm run dev` to start the development server.

## Environment
Refer to `.env.example` for required keys. `config/env.ts` exposes a typed accessor.
