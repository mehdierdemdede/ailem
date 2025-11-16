# AilePlus Mobile

React Native + TypeScript scaffold implementing a clean architecture layout.

## Structure
- `src/app` – Navigation and app shell.
- `src/core` – Cross-cutting concerns (configuration, DI, theme, network layer).
- `src/features` – Feature-based folders containing domain, application, and UI layers.
- `src/shared` – Shared UI components and utilities.

## Getting Started
1. Copy `.env.example` to `.env` and set runtime values.
2. Install dependencies (e.g., `npm install`).
3. Start the app with `npm run start` and then use your preferred platform runner.

## Environment
See `.env.example` for required variables. Use `src/core/config/env.ts` to access them in code.
