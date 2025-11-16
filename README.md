# AilePlus Monorepo

This repository hosts the multi-module AilePlus platform.

## Structure
- **mobile/** – React Native (TypeScript) application skeleton using a clean architecture layout.
- **backend/** – NestJS API scaffold prepared for Prisma, PostgreSQL, and Redis.
- **admin/** – Next.js 14 (TypeScript) admin panel scaffold.
- **infra/** – Docker Compose for PostgreSQL and Redis plus infra assets.

## Getting Started
1. Install dependencies within each module using the package manager of your choice (npm/yarn/pnpm).
2. Copy the respective `.env.example` files to `.env` and adjust values.
3. Use `infra/docker-compose.yml` to start PostgreSQL and Redis locally.
4. Follow each module's README for module-specific setup.
