# INF CRM

Multi-tenant SaaS CRM for influencers.

## Features
- Deal Pipeline (Kanban)
- Payment Tracking
- Contract Management
- Calendar & Reminders
- Multi-tenant Isolation

## Tech Stack
- **Backend:** NestJS, Prisma, PostgreSQL, Redis, BullMQ
- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui, TanStack Query
- **Storage:** MinIO / S3
- **Email:** Resend

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start infrastructure:
   ```bash
   docker compose up -d
   ```
3. Setup database:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start development:
   ```bash
   npm run dev
   ```

## Development Workflow
- Backend API: `http://localhost:3001`
- Frontend Web: `http://localhost:3000`
- MinIO Console: `http://localhost:9001`
