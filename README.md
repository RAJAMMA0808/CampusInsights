## EduManage Monorepo

Apps:
- `@edumanage/server` — Express + Passport + PostgreSQL
- `@edumanage/web` — React + Vite + Tailwind

Quick start:
1. Start Postgres: `docker compose up -d`
2. Copy `apps/server/.env.example` to `.env` and adjust if needed
3. Install deps: `npm i -w @edumanage/server -w @edumanage/web`
4. Run server: `npm run dev:server`
5. In another terminal, run web: `npm run dev:web`

Auth test users: register via `/register` then login.

# CampusInsights
