# Boilerplate Full-Stack Next.js

Sistema completo de autenticação e gerenciamento de usuários com Next.js, PostgreSQL, Redis e MinIO.

## Stack
- Next.js 16 + React 19 + TypeScript
- PostgreSQL + Prisma ORM
- Redis (sessões)
- MinIO (storage S3-compatible)
- TailwindCSS + Shadcn/ui
- Playwright (testes E2E)

## Funcionalidades
✅ Autenticação completa (registro, login, logout)
✅ Upload de avatar com MinIO
✅ Perfil editável (nome, email, senha)
✅ Dashboard protegido
✅ Testes E2E automatizados

## Setup
```bash
docker-compose up -d
cd apps/frontend
pnpm install
pnpm prisma migrate deploy
pnpm dev
```

## Testes
```bash
pnpm playwright test
```

## Autor
Pablo Cardoso
