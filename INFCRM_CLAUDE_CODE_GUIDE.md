# INF CRM - CLAUDE CODE DEVELOPMENT GUIDE
## Multi-Tenant Influencer CRM - Complete Implementation Roadmap

---

## 📋 DOCUMENT PURPOSE

This guide is designed for **non-technical founders** building INF CRM using **Claude Code** through prompts only.

**Product Type:** Multi-tenant SaaS CRM for influencers  
**Core Value:** Pipeline + Calendar + Payments in one panel  
**Target:** Influencers managing brand deals  
**Timeline:** 6-8 weeks to MVP  

Every technical decision has been made. Follow this document step-by-step.

---

## 🎯 PROJECT OVERVIEW

**Product:** INF CRM  
**Category:** Multi-Tenant SaaS CRM  
**Primary Users:** Influencers, Content Creators, Talent Managers  

**Core MVP Features:**
1. 📊 **Deal Pipeline (Kanban)** - Visual deal stages
2. 💰 **Payment Tracking** - Installments + partial payments + overdue alerts
3. 📄 **Contract Management** - Upload + signing status
4. 📅 **Calendar & Reminders** - Deliverable + publish + payment dates
5. 📧 **Smart Notifications** - Email + in-app reminders

**User Flow:**
```
Sign Up → Create Workspace (Tenant) 
  → Add Brands & Deals 
    → Move in Pipeline 
      → Track Payments 
        → Upload Contracts 
          → Get Reminders
```

**NOT:**
- ❌ Multi-platform social posting
- ❌ Analytics dashboard (Phase 2)
- ❌ Team collaboration (basic MVP)
- ❌ Mobile app (web-first)

**IS:**
✅ Deal pipeline management  
✅ Payment tracking with overdue detection  
✅ Contract + file storage  
✅ Smart reminder system  
✅ Multi-tenant architecture  

---

## 🏗 ARCHITECTURE PHILOSOPHY

### Why This Architecture?

**The Spec Says NestJS + Prisma:**
- Multi-tenant complexity requires solid backend
- NestJS = enterprise-grade, structured
- Prisma = type-safe database with migrations
- Clear separation of concerns

**Multi-Tenant Strategy:**
```
Shared Database with tenantId
  → Every table has tenantId column
  → Every query filtered by tenantId
  → JWT contains tenantId claim
  → TenantGuard enforces isolation
```

**Key Principle:**
> "No query without tenantId filtering" - Zero cross-tenant leakage

---

## 🛠 FINAL TECH STACK DECISIONS

### ✅ RECOMMENDED STACK (From Spec)

| Component | Technology | Why |
|-----------|-----------|-----|
| **Backend Framework** | NestJS | Enterprise-grade, modular, TypeScript |
| **Database** | PostgreSQL | Relational, reliable, production-ready |
| **ORM** | Prisma | Type-safe, migrations, great DX |
| **Cache/Queue** | Redis + BullMQ | Background jobs, reminders |
| **Frontend** | Next.js 14 (App Router) | Full-stack, SEO, modern |
| **UI Library** | Tailwind + shadcn/ui | Fast development, professional |
| **Auth** | JWT + Refresh Tokens | Secure, scalable |
| **File Storage** | MinIO (local) / S3 (prod) | Object storage, presigned URLs |
| **Email** | Resend or SendGrid | Transactional emails |
| **Calendar UI** | FullCalendar or react-big-calendar | Rich calendar features |
| **Data Fetching** | TanStack Query | Caching, optimistic updates |
| **Deployment** | Docker + Railway/Fly.io | Container-first, easy deploy |

### ❌ WHAT NOT TO USE

**Supabase: NO** (Spec is explicit about NestJS + Prisma)
- ❌ Supabase would conflict with NestJS backend
- ❌ Spec requires custom multi-tenant logic
- ❌ BullMQ + Redis needed for reminder system
- ✅ NestJS gives full control over tenant isolation

**Why Not Supabase:**
- Multi-tenant with shared DB + tenantId is easier in NestJS
- BullMQ worker for reminders needs custom backend
- Prisma migrations give better control
- NestJS guards for tenant enforcement

---

## 📁 PROJECT STRUCTURE (Monorepo)

```
inf-crm/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── dto/
│   │   │   │   ├── tenants/
│   │   │   │   ├── users/
│   │   │   │   ├── brands/
│   │   │   │   ├── contacts/
│   │   │   │   ├── deals/
│   │   │   │   │   ├── deals.controller.ts
│   │   │   │   │   ├── deals.service.ts
│   │   │   │   │   ├── deals.module.ts
│   │   │   │   │   └── dto/
│   │   │   │   ├── deliverables/
│   │   │   │   ├── payments/
│   │   │   │   ├── files/
│   │   │   │   ├── contracts/
│   │   │   │   ├── reminders/
│   │   │   │   ├── notifications/
│   │   │   │   ├── activity-log/
│   │   │   │   ├── dashboard/
│   │   │   │   └── calendar/
│   │   │   ├── common/
│   │   │   │   ├── guards/
│   │   │   │   │   └── tenant.guard.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   └── tenant.decorator.ts
│   │   │   │   ├── interceptors/
│   │   │   │   └── filters/
│   │   │   ├── workers/
│   │   │   │   └── reminder-worker.ts
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Next.js Frontend
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── (dashboard)/
│       │   │   ├── layout.tsx
│       │   │   ├── dashboard/
│       │   │   ├── pipeline/
│       │   │   ├── brands/
│       │   │   ├── deals/
│       │   │   │   └── [id]/
│       │   │   ├── calendar/
│       │   │   ├── finance/
│       │   │   └── settings/
│       │   ├── layout.tsx
│       │   └── page.tsx              # Landing
│       ├── components/
│       │   ├── ui/                   # shadcn/ui
│       │   ├── dashboard/
│       │   ├── pipeline/
│       │   │   ├── KanbanBoard.tsx
│       │   │   ├── DealCard.tsx
│       │   │   └── StageColumn.tsx
│       │   ├── deals/
│       │   │   ├── DealDetail.tsx
│       │   │   ├── DeliverablesList.tsx
│       │   │   ├── PaymentsList.tsx
│       │   │   ├── ContractSection.tsx
│       │   │   └── ActivityTimeline.tsx
│       │   ├── calendar/
│       │   ├── finance/
│       │   └── common/
│       ├── lib/
│       │   ├── api-client.ts
│       │   ├── auth.ts
│       │   └── utils.ts
│       ├── hooks/
│       ├── types/
│       └── package.json
│
├── packages/                         # Shared code (optional)
│   └── types/                        # Shared TypeScript types
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── Dockerfile.api
│
├── .env.example
├── pnpm-workspace.yaml
├── package.json
├── turbo.json                        # Turborepo config
└── README.md
```

---

## 🗄 DATABASE SCHEMA (Prisma)

### Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== TENANT & USERS ==========

model Tenant {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users         User[]
  brands        Brand[]
  contacts      Contact[]
  deals         Deal[]
  deliverables  Deliverable[]
  payments      Payment[]
  contractFiles ContractFile[]
  invoices      Invoice[]
  reminders     Reminder[]
  notifications Notification[]
  activityLogs  ActivityLog[]

  @@map("tenants")
}

enum UserRole {
  OWNER
  ASSISTANT
}

model User {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email        String   @unique
  passwordHash String
  fullName     String?
  role         UserRole @default(ASSISTANT)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  notifications Notification[]

  @@index([tenantId])
  @@index([email])
  @@map("users")
}

// ========== BRANDS & CONTACTS ==========

model Brand {
  id             String    @id @default(uuid())
  tenantId       String
  tenant         Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name           String
  website        String?
  notes          String?
  softDeletedAt  DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  contacts Contact[]
  deals    Deal[]

  @@index([tenantId])
  @@index([tenantId, softDeletedAt])
  @@map("brands")
}

model Contact {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name      String
  email     String?
  phone     String?
  position  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tenantId])
  @@index([brandId])
  @@map("contacts")
}

// ========== DEALS ==========

enum DealStage {
  LEAD
  CONTACTED
  NEGOTIATION
  APPROVED
  IN_PRODUCTION
  SCHEDULED
  POSTED
  COMPLETED
  LOST
}

enum Platform {
  INSTAGRAM
  TIKTOK
  YOUTUBE
  TWITTER
  LINKEDIN
  OTHER
}

model Deal {
  id                  String    @id @default(uuid())
  tenantId            String
  tenant              Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  brandId             String
  brand               Brand     @relation(fields: [brandId], references: [id], onDelete: Cascade)
  title               String
  stage               DealStage @default(LEAD)
  platform            Platform?
  totalAmount         Decimal   @default(0) @db.Decimal(10, 2)
  currency            String    @default("TRY")
  deliverableDueDate  DateTime?
  publishDate         DateTime?
  paymentDueDate      DateTime?
  notes               String?
  softDeletedAt       DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  deliverables  Deliverable[]
  payments      Payment[]
  contractFiles ContractFile[]
  invoices      Invoice[]
  reminders     Reminder[]
  activityLogs  ActivityLog[]

  @@index([tenantId])
  @@index([tenantId, stage])
  @@index([tenantId, softDeletedAt])
  @@index([brandId])
  @@map("deals")
}

// ========== DELIVERABLES ==========

enum DeliverableType {
  REELS
  STORY
  POST
  YOUTUBE_VIDEO
  YOUTUBE_SHORT
  TIKTOK_VIDEO
  TWEET
  OTHER
}

enum DeliverableStatus {
  TODO
  IN_PROGRESS
  DONE
}

model Deliverable {
  id          String             @id @default(uuid())
  tenantId    String
  tenant      Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId      String
  deal        Deal               @relation(fields: [dealId], references: [id], onDelete: Cascade)
  type        DeliverableType
  description String?
  quantity    Int                @default(1)
  dueDate     DateTime?
  publishDate DateTime?
  status      DeliverableStatus  @default(TODO)
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  @@index([tenantId])
  @@index([dealId])
  @@index([tenantId, dueDate])
  @@map("deliverables")
}

// ========== PAYMENTS ==========

enum PaymentStatus {
  PENDING
  PARTIAL
  PAID
  OVERDUE
}

model Payment {
  id         String        @id @default(uuid())
  tenantId   String
  tenant     Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId     String
  deal       Deal          @relation(fields: [dealId], references: [id], onDelete: Cascade)
  amount     Decimal       @db.Decimal(10, 2)
  dueDate    DateTime
  status     PaymentStatus @default(PENDING)
  paidAt     DateTime?
  paidAmount Decimal       @default(0) @db.Decimal(10, 2)
  notes      String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@index([tenantId])
  @@index([dealId])
  @@index([tenantId, dueDate])
  @@index([tenantId, status])
  @@map("payments")
}

// ========== CONTRACTS & FILES ==========

enum ContractStatus {
  NOT_SENT
  SENT
  SIGNED
}

model ContractFile {
  id           String         @id @default(uuid())
  tenantId     String
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId       String
  deal         Deal           @relation(fields: [dealId], references: [id], onDelete: Cascade)
  fileKey      String         // S3/MinIO key
  fileName     String
  fileUrl      String?        // Optional: presigned URL or public URL
  status       ContractStatus @default(NOT_SENT)
  externalLink String?        // External signing link (DocuSign, etc.)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@index([tenantId])
  @@index([dealId])
  @@map("contract_files")
}

// ========== INVOICES ==========

model Invoice {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId      String
  deal        Deal     @relation(fields: [dealId], references: [id], onDelete: Cascade)
  invoiceNo   String?
  invoiceDate DateTime?
  link        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
  @@index([dealId])
  @@map("invoices")
}

// ========== REMINDERS ==========

enum ReminderType {
  PAYMENT_DUE
  DELIVERABLE_DUE
  PUBLISH_DATE
  INVOICE_REMINDER
}

enum ReminderChannel {
  EMAIL
  IN_APP
}

enum ReminderStatus {
  PENDING
  SENT
  CANCELLED
}

model Reminder {
  id           String          @id @default(uuid())
  tenantId     String
  tenant       Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId       String?
  deal         Deal?           @relation(fields: [dealId], references: [id], onDelete: Cascade)
  type         ReminderType
  scheduledFor DateTime
  channel      ReminderChannel
  status       ReminderStatus  @default(PENDING)
  payload      Json?           // Email template variables, etc.
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  @@index([tenantId])
  @@index([tenantId, scheduledFor, status])
  @@map("reminders")
}

// ========== NOTIFICATIONS ==========

model Notification {
  id        String    @id @default(uuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  body      String
  readAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([tenantId])
  @@index([userId])
  @@index([userId, readAt])
  @@map("notifications")
}

// ========== ACTIVITY LOG ==========

enum ActivityType {
  STAGE_CHANGED
  NOTE_ADDED
  PAYMENT_UPDATED
  FILE_UPLOADED
  DELIVERABLE_ADDED
  CONTRACT_SIGNED
}

model ActivityLog {
  id        String       @id @default(uuid())
  tenantId  String
  tenant    Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dealId    String
  deal      Deal         @relation(fields: [dealId], references: [id], onDelete: Cascade)
  type      ActivityType
  message   String
  metadata  Json?
  createdAt DateTime     @default(now())

  @@index([tenantId])
  @@index([dealId])
  @@index([tenantId, createdAt])
  @@map("activity_logs")
}
```

---

## 🚀 PHASE 1 IMPLEMENTATION ROADMAP

### SPRINT 1: PROJECT SKELETON (Day 1-4)

**Prompt to Claude Code:**

```
Create monorepo for INF CRM - multi-tenant influencer CRM.

Requirements:
1. Set up monorepo with Turborepo or pnpm workspaces
   - apps/api (NestJS)
   - apps/web (Next.js 14)
   - packages/types (shared TypeScript types)

2. Backend (apps/api):
   - Initialize NestJS project with TypeScript
   - Install dependencies:
     * @nestjs/core @nestjs/common @nestjs/platform-express
     * @nestjs/jwt @nestjs/passport passport passport-jwt
     * @prisma/client prisma
     * bcrypt argon2
     * class-validator class-transformer
     * @nestjs/bull bullmq ioredis
     * resend (or @sendgrid/mail)
     * dotenv
   
   - Set up Prisma:
     * Copy complete schema from INFCRM_CLAUDE_CODE_GUIDE.md
     * Create initial migration
   
   - Create module structure:
     * auth, tenants, users, brands, contacts
     * deals, deliverables, payments, files
     * reminders, notifications, activity-log
     * dashboard, calendar

3. Frontend (apps/web):
   - Initialize Next.js 14 with TypeScript and App Router
   - Install dependencies:
     * tailwindcss @shadcn/ui
     * @tanstack/react-query
     * zod react-hook-form @hookform/resolvers
     * date-fns
     * lucide-react (icons)
     * fullcalendar (or react-big-calendar)
     * react-beautiful-dnd (or @dnd-kit/* for Kanban)
   
   - Set up shadcn/ui with core components

4. Docker setup:
   - docker-compose.yml with:
     * postgres (14+)
     * redis (7+)
     * minio (S3-compatible storage)
   
   - docker-compose.dev.yml for development

5. Create .env.example:
   Backend:
   - DATABASE_URL
   - REDIS_URL
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - S3_ENDPOINT
   - S3_ACCESS_KEY
   - S3_SECRET_KEY
   - S3_BUCKET
   - EMAIL_PROVIDER_KEY
   - APP_BASE_URL
   
   Frontend:
   - NEXT_PUBLIC_API_URL

6. Create comprehensive README with:
   - Setup instructions
   - Docker commands
   - Database migration commands
   - Development workflow

Follow INFCRM_CLAUDE_CODE_GUIDE.md structure exactly.
```

---

### SPRINT 2: AUTH + TENANT SYSTEM (Day 4-8)

**Prompt to Claude Code:**

```
Implement authentication and multi-tenant system for INF CRM.

1. Prisma Migrations:
   - Run: npx prisma migrate dev --name init
   - Generate Prisma Client

2. Tenant Guard (apps/api/src/common/guards/tenant.guard.ts):
   ```typescript
   import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
   
   @Injectable()
   export class TenantGuard implements CanActivate {
     canActivate(context: ExecutionContext): boolean {
       const request = context.switchToHttp().getRequest();
       const user = request.user; // From JWT strategy
       
       if (!user || !user.tenantId) {
         return false;
       }
       
       // Store tenantId in request for easy access
       request.tenantId = user.tenantId;
       return true;
     }
   }
   ```

3. Tenant Decorator (apps/api/src/common/decorators/tenant.decorator.ts):
   ```typescript
   import { createParamDecorator, ExecutionContext } from '@nestjs/common';
   
   export const TenantId = createParamDecorator(
     (data: unknown, ctx: ExecutionContext) => {
       const request = ctx.switchToHttp().getRequest();
       return request.tenantId;
     },
   );
   ```

4. Auth Module (apps/api/src/modules/auth/):
   
   Implement:
   - POST /auth/register
     * Creates Tenant
     * Creates Owner User
     * Returns JWT + refresh token
   
   - POST /auth/login
     * Validates credentials
     * Returns JWT + refresh token
   
   - POST /auth/refresh
     * Validates refresh token
     * Returns new JWT + refresh token
   
   - POST /auth/logout
     * Invalidate refresh token (store in Redis blacklist)
   
   - GET /auth/me
     * Returns current user with tenant info
   
   JWT Payload:
   ```typescript
   {
     sub: userId,
     tenantId: tenantId,
     role: userRole,
     iat: timestamp,
     exp: timestamp
   }
   ```
   
   Use argon2 for password hashing.
   
   JWT Strategy:
   - Extract token from Authorization header
   - Validate and decode
   - Attach user to request

5. Create seed script (prisma/seed.ts):
   - Demo tenant
   - Demo owner user
   - Sample brand
   - Sample deal

6. Frontend Auth Pages:
   
   app/(auth)/register/page.tsx:
   - Form: full name, email, password, workspace name
   - Submit → call POST /auth/register
   - Store tokens in localStorage (or httpOnly cookie)
   - Redirect to /dashboard
   
   app/(auth)/login/page.tsx:
   - Form: email, password
   - Submit → call POST /auth/login
   - Store tokens
   - Redirect to /dashboard

7. API Client (apps/web/lib/api-client.ts):
   ```typescript
   import axios from 'axios';
   
   const apiClient = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
   });
   
   // Request interceptor: add auth token
   apiClient.interceptors.request.use((config) => {
     const token = localStorage.getItem('access_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   
   // Response interceptor: handle 401, refresh token
   apiClient.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         // Try refresh
         const refreshToken = localStorage.getItem('refresh_token');
         if (refreshToken) {
           try {
             const { data } = await axios.post('/auth/refresh', { refreshToken });
             localStorage.setItem('access_token', data.accessToken);
             // Retry original request
             error.config.headers.Authorization = `Bearer ${data.accessToken}`;
             return axios(error.config);
           } catch {
             // Refresh failed, redirect to login
             localStorage.clear();
             window.location.href = '/login';
           }
         }
       }
       return Promise.reject(error);
     }
   );
   
   export default apiClient;
   ```

8. Middleware (apps/web/middleware.ts):
   - Protect /app/* routes
   - Redirect to /login if no token

Test:
- Register new tenant → login → access /dashboard
- Logout → token cleared → redirected
- Token refresh works on 401
```

---

### SPRINT 3: BRANDS + DEALS CRUD (Day 8-13)

**Prompt to Claude Code:**

```
Implement Brands and Deals management for INF CRM.

1. Brands Module (apps/api/src/modules/brands/):
   
   Endpoints:
   - POST /brands
     * Input: name, website?, notes?
     * Always include tenantId from JWT
     * Return created brand
   
   - GET /brands
     * Filter by tenantId
     * Exclude soft-deleted
     * Return all brands for tenant
   
   - GET /brands/:id
     * Verify brand belongs to tenantId
     * Return 404 if not found or different tenant
   
   - PATCH /brands/:id
     * Verify ownership
     * Update fields
   
   - DELETE /brands/:id (soft delete)
     * Set softDeletedAt = now()
   
   All endpoints protected with TenantGuard.

2. Contacts Module (apps/api/src/modules/contacts/):
   
   Endpoints:
   - POST /brands/:brandId/contacts
   - GET /brands/:brandId/contacts
   - PATCH /contacts/:id
   - DELETE /contacts/:id
   
   Always verify brand belongs to tenant before creating contact.

3. Deals Module (apps/api/src/modules/deals/):
   
   Endpoints:
   - POST /deals
     * Input: brandId, title, stage?, platform?, totalAmount?, currency?, dates?, notes?
     * Verify brandId belongs to tenant
     * Create deal
     * Log activity: DEAL_CREATED
   
   - GET /deals
     * Query params: stage?, brandId?, from?, to?
     * Filter by tenantId
     * Exclude soft-deleted
     * Include brand, payments count, deliverables count
   
   - GET /deals/:id
     * Verify ownership
     * Include: brand, contacts, deliverables, payments, contractFiles, activityLogs
   
   - PATCH /deals/:id
     * Verify ownership
     * Update fields
     * If notes updated → log NOTE_ADDED activity
   
   - PATCH /deals/:id/stage
     * Input: { stage: DealStage }
     * Update stage
     * Log STAGE_CHANGED activity with old/new stage
   
   - DELETE /deals/:id (soft delete)

4. Activity Log Service:
   
   Create helper in deals.service.ts:
   ```typescript
   async logActivity(params: {
     dealId: string;
     tenantId: string;
     type: ActivityType;
     message: string;
     metadata?: any;
   }) {
     await this.prisma.activityLog.create({
       data: params,
     });
   }
   ```
   
   Use this when:
   - Stage changes
   - Notes added
   - Payments updated
   - Files uploaded

5. Frontend Pages:
   
   app/(dashboard)/brands/page.tsx:
   - List of brands in grid
   - "Add Brand" button → opens dialog
   - Each brand card shows name, website, deal count
   - Click → navigate to brand detail (optional for MVP)
   
   app/(dashboard)/deals/page.tsx:
   - Table view of all deals
   - Filter by stage, brand
   - Columns: Title, Brand, Stage, Amount, Due Dates, Actions
   - "Add Deal" button → opens form modal
   
   app/(dashboard)/deals/[id]/page.tsx:
   - Deal detail page (will build in next sprint)

6. Components:
   
   components/brands/BrandForm.tsx:
   - Form for creating/editing brand
   - Zod validation
   
   components/deals/DealForm.tsx:
   - Form for creating deal
   - Select brand (dropdown)
   - Select stage (dropdown)
   - Date pickers for deliverable due, publish, payment due
   
   Use TanStack Query for data fetching:
   ```typescript
   const { data: brands } = useQuery({
     queryKey: ['brands'],
     queryFn: () => apiClient.get('/brands').then(res => res.data),
   });
   
   const createDeal = useMutation({
     mutationFn: (data) => apiClient.post('/deals', data),
     onSuccess: () => {
       queryClient.invalidateQueries(['deals']);
     },
   });
   ```

Test:
- Create brand → create deal → view deal detail
- Update deal stage → see activity log
- Delete deal → soft deleted, not visible in list
```

---

### SPRINT 4: KANBAN PIPELINE (Day 13-18)

**Prompt to Claude Code:**

```
Build Kanban pipeline for deal management in INF CRM.

1. Backend: Already done (PATCH /deals/:id/stage)

2. Frontend: Kanban Board (app/(dashboard)/pipeline/page.tsx)

Components:

1. components/pipeline/KanbanBoard.tsx:
   ```typescript
   import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
   
   const stages = [
     'LEAD', 'CONTACTED', 'NEGOTIATION', 'APPROVED',
     'IN_PRODUCTION', 'SCHEDULED', 'POSTED', 'COMPLETED', 'LOST'
   ];
   
   export function KanbanBoard() {
     const { data: deals } = useQuery({
       queryKey: ['deals'],
       queryFn: () => apiClient.get('/deals').then(res => res.data),
     });
     
     const updateStageMutation = useMutation({
       mutationFn: ({ dealId, stage }) =>
         apiClient.patch(`/deals/${dealId}/stage`, { stage }),
       onSuccess: () => {
         queryClient.invalidateQueries(['deals']);
       },
     });
     
     const handleDragEnd = (result) => {
       if (!result.destination) return;
       
       const dealId = result.draggableId;
       const newStage = result.destination.droppableId;
       
       updateStageMutation.mutate({ dealId, newStage });
     };
     
     const dealsByStage = groupBy(deals, 'stage');
     
     return (
       <DragDropContext onDragEnd={handleDragEnd}>
         <div className="flex gap-4 overflow-x-auto">
           {stages.map(stage => (
             <StageColumn
               key={stage}
               stage={stage}
               deals={dealsByStage[stage] || []}
             />
           ))}
         </div>
       </DragDropContext>
     );
   }
   ```

2. components/pipeline/StageColumn.tsx:
   ```typescript
   export function StageColumn({ stage, deals }) {
     return (
       <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-semibold">{formatStage(stage)}</h3>
           <Badge>{deals.length}</Badge>
         </div>
         
         <Droppable droppableId={stage}>
           {(provided, snapshot) => (
             <div
               ref={provided.innerRef}
               {...provided.droppableProps}
               className={cn(
                 "space-y-2 min-h-[200px]",
                 snapshot.isDraggingOver && "bg-blue-50"
               )}
             >
               {deals.map((deal, index) => (
                 <Draggable
                   key={deal.id}
                   draggableId={deal.id}
                   index={index}
                 >
                   {(provided) => (
                     <div
                       ref={provided.innerRef}
                       {...provided.draggableProps}
                       {...provided.dragHandleProps}
                     >
                       <DealCard deal={deal} />
                     </div>
                   )}
                 </Draggable>
               ))}
               {provided.placeholder}
             </div>
           )}
         </Droppable>
       </div>
     );
   }
   ```

3. components/pipeline/DealCard.tsx:
   ```typescript
   export function DealCard({ deal }) {
     return (
       <Card className="cursor-move hover:shadow-md transition">
         <CardHeader className="p-4">
           <div className="flex items-start justify-between">
             <div className="flex-1">
               <CardTitle className="text-sm font-medium">
                 {deal.title}
               </CardTitle>
               <p className="text-xs text-gray-500 mt-1">
                 {deal.brand.name}
               </p>
             </div>
             {deal.platform && (
               <Badge variant="outline" className="ml-2">
                 {deal.platform}
               </Badge>
             )}
           </div>
         </CardHeader>
         
         <CardContent className="p-4 pt-0 space-y-2">
           <div className="flex items-center justify-between text-sm">
             <span className="text-gray-600">Amount</span>
             <span className="font-semibold">
               {formatCurrency(deal.totalAmount, deal.currency)}
             </span>
           </div>
           
           {deal.deliverableDueDate && (
             <div className="flex items-center text-xs text-gray-500">
               <Calendar className="w-3 h-3 mr-1" />
               Due: {formatDate(deal.deliverableDueDate)}
             </div>
           )}
           
           {deal.payments?.some(p => p.status === 'OVERDUE') && (
             <Badge variant="destructive" className="w-full justify-center">
               Payment Overdue
             </Badge>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

4. Optimistic Updates:
   ```typescript
   const updateStageMutation = useMutation({
     mutationFn: ({ dealId, stage }) =>
       apiClient.patch(`/deals/${dealId}/stage`, { stage }),
     
     onMutate: async ({ dealId, stage }) => {
       // Cancel outgoing queries
       await queryClient.cancelQueries(['deals']);
       
       // Snapshot previous value
       const previous = queryClient.getQueryData(['deals']);
       
       // Optimistically update
       queryClient.setQueryData(['deals'], (old) =>
         old.map(deal =>
           deal.id === dealId ? { ...deal, stage } : deal
         )
       );
       
       return { previous };
     },
     
     onError: (err, variables, context) => {
       // Rollback on error
       queryClient.setQueryData(['deals'], context.previous);
     },
     
     onSettled: () => {
       queryClient.invalidateQueries(['deals']);
     },
   });
   ```

5. Stage Colors:
   ```typescript
   const stageColors = {
     LEAD: 'bg-gray-100',
     CONTACTED: 'bg-blue-100',
     NEGOTIATION: 'bg-yellow-100',
     APPROVED: 'bg-green-100',
     IN_PRODUCTION: 'bg-purple-100',
     SCHEDULED: 'bg-indigo-100',
     POSTED: 'bg-pink-100',
     COMPLETED: 'bg-emerald-100',
     LOST: 'bg-red-100',
   };
   ```

Test:
- Drag deal from LEAD to CONTACTED → stage updates
- See activity log entry "Stage changed from LEAD to CONTACTED"
- Optimistic update shows immediately
- On error, card returns to original column
```

---

### SPRINT 5: PAYMENTS + FINANCE (Day 18-23)

**Prompt to Claude Code:**

```
Implement payment tracking and finance management for INF CRM.

1. Payments Module (apps/api/src/modules/payments/):
   
   Endpoints:
   - POST /deals/:id/payments
     * Input: amount, dueDate, notes?
     * Create payment with status PENDING
     * Verify deal belongs to tenant
   
   - PATCH /payments/:id
     * Update amount, dueDate, notes
     * Recalculate status based on dueDate
   
   - POST /payments/:id/mark-paid
     * Input: { paidAmount: number, paidAt?: Date }
     * Update paidAmount, paidAt
     * Update status:
       - If paidAmount >= amount → PAID
       - If 0 < paidAmount < amount → PARTIAL
       - If paidAmount === 0 && dueDate < now → OVERDUE
     * Log PAYMENT_UPDATED activity
   
   - GET /payments
     * Query: status?, from?, to?, dealId?
     * Filter by tenantId
     * Return payments with deal/brand info
   
   - GET /finance/summary
     * Total pending amount
     * Total overdue amount
     * Total paid this month
     * Payments by status counts

2. Payment Status Logic (Prisma middleware or service):
   
   Create cron job or BullMQ job:
   ```typescript
   // Run daily at midnight
   async updateOverduePayments() {
     const today = new Date();
     
     await this.prisma.payment.updateMany({
       where: {
         dueDate: { lt: today },
         status: { in: ['PENDING', 'PARTIAL'] },
         paidAmount: { lt: this.prisma.payment.fields.amount },
       },
       data: {
         status: 'OVERDUE',
       },
     });
   }
   ```

3. Frontend: Deal Detail - Payments Section
   
   components/deals/PaymentsList.tsx:
   ```typescript
   export function PaymentsList({ dealId }) {
     const { data: payments } = useQuery({
       queryKey: ['payments', dealId],
       queryFn: () =>
         apiClient.get(`/deals/${dealId}/payments`).then(res => res.data),
     });
     
     const addPaymentMutation = useMutation({
       mutationFn: (data) => apiClient.post(`/deals/${dealId}/payments`, data),
       onSuccess: () => {
         queryClient.invalidateQueries(['payments', dealId]);
       },
     });
     
     return (
       <div className="space-y-4">
         <div className="flex justify-between items-center">
           <h3 className="text-lg font-semibold">Payments</h3>
           <Button onClick={() => setShowAddForm(true)}>
             Add Payment
           </Button>
         </div>
         
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Amount</TableHead>
               <TableHead>Due Date</TableHead>
               <TableHead>Paid</TableHead>
               <TableHead>Status</TableHead>
               <TableHead>Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {payments?.map(payment => (
               <TableRow key={payment.id}>
                 <TableCell>
                   {formatCurrency(payment.amount, payment.deal.currency)}
                 </TableCell>
                 <TableCell>
                   {formatDate(payment.dueDate)}
                   {isOverdue(payment.dueDate) && (
                     <Badge variant="destructive" className="ml-2">
                       Overdue
                     </Badge>
                   )}
                 </TableCell>
                 <TableCell>
                   {formatCurrency(payment.paidAmount, payment.deal.currency)}
                 </TableCell>
                 <TableCell>
                   <PaymentStatusBadge status={payment.status} />
                 </TableCell>
                 <TableCell>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="sm">
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                       <DropdownMenuItem onClick={() => handleMarkPaid(payment)}>
                         Mark as Paid
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleEdit(payment)}>
                         Edit
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleDelete(payment.id)}>
                         Delete
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>
     );
   }
   ```

4. Mark Paid Dialog:
   ```typescript
   export function MarkPaidDialog({ payment, open, onClose }) {
     const [paidAmount, setPaidAmount] = useState(payment.amount);
     const [paidAt, setPaidAt] = useState(new Date());
     
     const markPaidMutation = useMutation({
       mutationFn: () =>
         apiClient.post(`/payments/${payment.id}/mark-paid`, {
           paidAmount,
           paidAt,
         }),
       onSuccess: () => {
         queryClient.invalidateQueries(['payments']);
         onClose();
       },
     });
     
     const isPartial = paidAmount < payment.amount;
     
     return (
       <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Mark Payment as Paid</DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4">
             <div>
               <Label>Amount Due</Label>
               <p className="text-2xl font-bold">
                 {formatCurrency(payment.amount, payment.deal.currency)}
               </p>
             </div>
             
             <div>
               <Label>Paid Amount</Label>
               <Input
                 type="number"
                 value={paidAmount}
                 onChange={(e) => setPaidAmount(Number(e.target.value))}
                 max={payment.amount}
               />
               {isPartial && (
                 <p className="text-sm text-amber-600 mt-1">
                   Partial payment. Remaining: {formatCurrency(payment.amount - paidAmount, payment.deal.currency)}
                 </p>
               )}
             </div>
             
             <div>
               <Label>Payment Date</Label>
               <DatePicker value={paidAt} onChange={setPaidAt} />
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={() => markPaidMutation.mutate()}>
               {isPartial ? 'Record Partial Payment' : 'Mark as Paid'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     );
   }
   ```

5. Finance Page (app/(dashboard)/finance/page.tsx):
   
   - Summary cards:
     * Total Pending
     * Total Overdue
     * Paid This Month
   
   - Payments table with filters:
     * Status filter
     * Date range filter
     * Deal/Brand filter
   
   - Export to CSV button:
     ```typescript
     const exportCSV = () => {
       const csv = generateCSV(payments);
       downloadFile(csv, 'payments.csv');
     };
     ```

6. Dashboard Widgets:
   
   components/dashboard/OverduePayments.tsx:
   - Show overdue payments
   - Click → navigate to deal detail
   
   components/dashboard/UpcomingPayments.tsx:
   - Show payments due in next 7 days

Test:
- Create payment plan (3 installments)
- Mark first as paid (full)
- Mark second as paid (partial)
- See third become overdue after due date
- View finance summary
```

---

### SPRINT 6: DELIVERABLES + CONTRACTS (Day 23-27)

**Prompt to Claude Code:**

```
Implement deliverables and contract management for INF CRM.

1. Deliverables Module (apps/api/src/modules/deliverables/):
   
   Endpoints:
   - POST /deals/:id/deliverables
     * Input: type, description?, quantity, dueDate?, publishDate?
     * Create deliverable
   
   - PATCH /deliverables/:id
     * Update fields
   
   - PATCH /deliverables/:id/status
     * Update status (TODO/IN_PROGRESS/DONE)
   
   - DELETE /deliverables/:id

2. Files Module (apps/api/src/modules/files/):
   
   File Upload Flow (Presigned URLs):
   
   - POST /files/presign
     * Input: { fileName: string, contentType: string }
     * Generate presigned upload URL from MinIO/S3
     * Return: { uploadUrl, fileKey }
     
     ```typescript
     async generatePresignedUpload(fileName: string, contentType: string) {
       const fileKey = `${uuid()}-${fileName}`;
       const uploadUrl = await this.s3Client.getSignedUrlPromise('putObject', {
         Bucket: process.env.S3_BUCKET,
         Key: fileKey,
         Expires: 3600,
         ContentType: contentType,
       });
       
       return { uploadUrl, fileKey };
     }
     ```
   
   - POST /deals/:id/contracts
     * Input: { fileKey, fileName, status?, externalLink? }
     * Create ContractFile record
     * Log FILE_UPLOADED activity
   
   - GET /deals/:id/contracts
     * Return all contract files for deal
   
   - PATCH /contracts/:id/status
     * Update signing status (NOT_SENT/SENT/SIGNED)
   
   - DELETE /contracts/:id

3. S3/MinIO Setup:
   
   docker-compose.yml:
   ```yaml
   minio:
     image: minio/minio
     ports:
       - "9000:9000"
       - "9001:9001"
     environment:
       MINIO_ROOT_USER: minioadmin
       MINIO_ROOT_PASSWORD: minioadmin
     command: server /data --console-address ":9001"
     volumes:
       - minio_data:/data
   ```
   
   Create bucket on startup or manually via MinIO console.

4. Frontend: Deliverables Section
   
   components/deals/DeliverablesList.tsx:
   ```typescript
   export function DeliverablesList({ dealId }) {
     const { data: deliverables } = useQuery({
       queryKey: ['deliverables', dealId],
       queryFn: () =>
         apiClient.get(`/deals/${dealId}/deliverables`).then(res => res.data),
     });
     
     return (
       <div className="space-y-4">
         <div className="flex justify-between">
           <h3 className="text-lg font-semibold">Deliverables</h3>
           <Button onClick={() => setShowAddForm(true)}>
             Add Deliverable
           </Button>
         </div>
         
         <div className="space-y-2">
           {deliverables?.map(deliverable => (
             <Card key={deliverable.id}>
               <CardContent className="p-4">
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <Badge>{deliverable.type}</Badge>
                       <span className="text-sm font-medium">
                         {deliverable.quantity}x {deliverable.type}
                       </span>
                     </div>
                     {deliverable.description && (
                       <p className="text-sm text-gray-600 mt-1">
                         {deliverable.description}
                       </p>
                     )}
                     <div className="flex gap-4 mt-2 text-xs text-gray-500">
                       {deliverable.dueDate && (
                         <span>Due: {formatDate(deliverable.dueDate)}</span>
                       )}
                       {deliverable.publishDate && (
                         <span>Publish: {formatDate(deliverable.publishDate)}</span>
                       )}
                     </div>
                   </div>
                   
                   <Select
                     value={deliverable.status}
                     onValueChange={(status) =>
                       updateStatusMutation.mutate({ id: deliverable.id, status })
                     }
                   >
                     <SelectTrigger className="w-32">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="TODO">To Do</SelectItem>
                       <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                       <SelectItem value="DONE">Done</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     );
   }
   ```

5. Frontend: Contract Upload
   
   components/deals/ContractSection.tsx:
   ```typescript
   export function ContractSection({ dealId }) {
     const [uploading, setUploading] = useState(false);
     const [uploadProgress, setUploadProgress] = useState(0);
     
     const { data: contracts } = useQuery({
       queryKey: ['contracts', dealId],
       queryFn: () =>
         apiClient.get(`/deals/${dealId}/contracts`).then(res => res.data),
     });
     
     const handleFileUpload = async (file: File) => {
       setUploading(true);
       
       try {
         // 1. Get presigned URL
         const { data: { uploadUrl, fileKey } } = await apiClient.post('/files/presign', {
           fileName: file.name,
           contentType: file.type,
         });
         
         // 2. Upload to S3/MinIO
         await axios.put(uploadUrl, file, {
           headers: { 'Content-Type': file.type },
           onUploadProgress: (e) => {
             setUploadProgress(Math.round((e.loaded * 100) / e.total));
           },
         });
         
         // 3. Save contract record
         await apiClient.post(`/deals/${dealId}/contracts`, {
           fileKey,
           fileName: file.name,
           status: 'NOT_SENT',
         });
         
         // 4. Refresh contracts list
         queryClient.invalidateQueries(['contracts', dealId]);
         
         toast.success('Contract uploaded successfully');
       } catch (error) {
         toast.error('Upload failed');
       } finally {
         setUploading(false);
         setUploadProgress(0);
       }
     };
     
     return (
       <div className="space-y-4">
         <div className="flex justify-between">
           <h3 className="text-lg font-semibold">Contracts</h3>
           <div>
             <input
               type="file"
               ref={fileInputRef}
               onChange={(e) => handleFileUpload(e.target.files[0])}
               accept=".pdf,.doc,.docx"
               className="hidden"
             />
             <Button onClick={() => fileInputRef.current?.click()}>
               Upload Contract
             </Button>
           </div>
         </div>
         
         {uploading && (
           <Progress value={uploadProgress} />
         )}
         
         <div className="space-y-2">
           {contracts?.map(contract => (
             <Card key={contract.id}>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-gray-400" />
                     <div>
                       <p className="font-medium">{contract.fileName}</p>
                       <p className="text-xs text-gray-500">
                         Uploaded {formatDate(contract.createdAt)}
                       </p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <Select
                       value={contract.status}
                       onValueChange={(status) =>
                         updateContractStatus.mutate({ id: contract.id, status })
                       }
                     >
                       <SelectTrigger className="w-32">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="NOT_SENT">Not Sent</SelectItem>
                         <SelectItem value="SENT">Sent</SelectItem>
                         <SelectItem value="SIGNED">Signed</SelectItem>
                       </SelectContent>
                     </Select>
                     
                     <Button variant="ghost" size="sm">
                       <Download className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>
                 
                 {contract.externalLink && (
                   <div className="mt-2 pt-2 border-t">
                     <a
                       href={contract.externalLink}
                       target="_blank"
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                     >
                       <ExternalLink className="w-3 h-3" />
                       View in DocuSign
                     </a>
                   </div>
                 )}
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     );
   }
   ```

Test:
- Add deliverables to deal
- Upload contract PDF
- Update contract status to SIGNED
- Download contract file
```

---

### SPRINT 7: CALENDAR & REMINDERS (Day 27-32)

**This is the most complex sprint - reminder system with BullMQ.**

**Prompt to Claude Code:**

```
Implement calendar view and automated reminder system for INF CRM.

1. Calendar Module (apps/api/src/modules/calendar/):
   
   GET /calendar/events?from=YYYY-MM-DD&to=YYYY-MM-DD
   
   Return unified events from:
   - Deliverables (dueDate, publishDate)
   - Payments (dueDate)
   
   ```typescript
   async getCalendarEvents(tenantId: string, from: Date, to: Date) {
     const [deliverables, payments] = await Promise.all([
       this.prisma.deliverable.findMany({
         where: {
           tenantId,
           OR: [
             { dueDate: { gte: from, lte: to } },
             { publishDate: { gte: from, lte: to } },
           ],
         },
         include: { deal: { include: { brand: true } } },
       }),
       this.prisma.payment.findMany({
         where: {
           tenantId,
           dueDate: { gte: from, lte: to },
         },
         include: { deal: { include: { brand: true } } },
       }),
     ]);
     
     const events = [];
     
     // Deliverable due dates
     deliverables.forEach(d => {
       if (d.dueDate) {
         events.push({
           id: `deliverable-due-${d.id}`,
           type: 'DELIVERABLE_DUE',
           title: `${d.deal.brand.name} - ${d.type} Due`,
           date: d.dueDate,
           dealId: d.dealId,
           deal: d.deal,
         });
       }
       
       if (d.publishDate) {
         events.push({
           id: `deliverable-publish-${d.id}`,
           type: 'PUBLISH_DATE',
           title: `${d.deal.brand.name} - Publish ${d.type}`,
           date: d.publishDate,
           dealId: d.dealId,
           deal: d.deal,
         });
       }
     });
     
     // Payment due dates
     payments.forEach(p => {
       events.push({
         id: `payment-due-${p.id}`,
         type: 'PAYMENT_DUE',
         title: `${p.deal.brand.name} - Payment Due`,
         date: p.dueDate,
         amount: p.amount,
         currency: p.deal.currency,
         status: p.status,
         dealId: p.dealId,
         deal: p.deal,
       });
     });
     
     return events.sort((a, b) => a.date - b.date);
   }
   ```

2. Reminder System Architecture:
   
   Install BullMQ:
   ```bash
   npm install bullmq ioredis
   ```
   
   Create queue in apps/api/src/modules/reminders/reminder.queue.ts:
   ```typescript
   import { Queue } from 'bullmq';
   
   export const reminderQueue = new Queue('reminders', {
     connection: {
       host: process.env.REDIS_HOST,
       port: Number(process.env.REDIS_PORT),
     },
   });
   ```
   
   Create worker in apps/api/src/workers/reminder-worker.ts:
   ```typescript
   import { Worker } from 'bullmq';
   import { PrismaClient } from '@prisma/client';
   import { EmailService } from '../modules/email/email.service';
   
   const prisma = new PrismaClient();
   const emailService = new EmailService();
   
   const worker = new Worker(
     'reminders',
     async (job) => {
       console.log('Processing reminder job:', job.id);
       
       // Get pending reminders
       const now = new Date();
       const reminders = await prisma.reminder.findMany({
         where: {
           scheduledFor: { lte: now },
           status: 'PENDING',
         },
         include: {
           deal: {
             include: {
               brand: true,
               tenant: true,
             },
           },
         },
         take: 100,
       });
       
       for (const reminder of reminders) {
         try {
           // Send email
           if (reminder.channel === 'EMAIL') {
             await emailService.sendReminder(reminder);
           }
           
           // Create in-app notification
           await prisma.notification.create({
             data: {
               tenantId: reminder.tenantId,
               userId: reminder.deal.tenant.ownerId, // TODO: get owner
               title: getReminderTitle(reminder.type),
               body: getReminderBody(reminder),
             },
           });
           
           // Mark as sent
           await prisma.reminder.update({
             where: { id: reminder.id },
             data: { status: 'SENT' },
           });
           
           console.log(`Reminder sent: ${reminder.id}`);
         } catch (error) {
           console.error(`Failed to send reminder ${reminder.id}:`, error);
         }
       }
     },
     {
       connection: {
         host: process.env.REDIS_HOST,
         port: Number(process.env.REDIS_PORT),
       },
     }
   );
   
   // Schedule job to run every 5 minutes
   async function scheduleReminderCheck() {
     await reminderQueue.add(
       'check-reminders',
       {},
       {
         repeat: {
           every: 5 * 60 * 1000, // 5 minutes
         },
       }
     );
   }
   
   scheduleReminderCheck();
   
   worker.on('completed', (job) => {
     console.log(`Job ${job.id} completed`);
   });
   
   worker.on('failed', (job, err) => {
     console.error(`Job ${job?.id} failed:`, err);
   });
   ```

3. Create Reminders When Deal/Payment/Deliverable Created:
   
   In deals.service.ts:
   ```typescript
   async createDeal(data: CreateDealDto, tenantId: string) {
     const deal = await this.prisma.deal.create({ data: { ...data, tenantId } });
     
     // Create reminders for dates
     if (data.deliverableDueDate) {
       await this.createDeliverableReminders(deal.id, data.deliverableDueDate, tenantId);
     }
     
     if (data.paymentDueDate) {
       await this.createPaymentReminders(deal.id, data.paymentDueDate, tenantId);
     }
     
     if (data.publishDate) {
       await this.createPublishReminders(deal.id, data.publishDate, tenantId);
     }
     
     return deal;
   }
   
   private async createDeliverableReminders(
     dealId: string,
     dueDate: Date,
     tenantId: string
   ) {
     const twoDaysBefore = subDays(dueDate, 2);
     const onTheDay = startOfDay(dueDate);
     
     await this.prisma.reminder.createMany({
       data: [
         {
           tenantId,
           dealId,
           type: 'DELIVERABLE_DUE',
           scheduledFor: twoDaysBefore,
           channel: 'EMAIL',
           status: 'PENDING',
         },
         {
           tenantId,
           dealId,
           type: 'DELIVERABLE_DUE',
           scheduledFor: onTheDay,
           channel: 'IN_APP',
           status: 'PENDING',
         },
       ],
     });
   }
   ```

4. Email Service (apps/api/src/modules/email/email.service.ts):
   
   ```typescript
   import { Resend } from 'resend';
   
   export class EmailService {
     private resend: Resend;
     
     constructor() {
       this.resend = new Resend(process.env.RESEND_API_KEY);
     }
     
     async sendReminder(reminder: Reminder) {
       const template = this.getTemplate(reminder.type);
       const subject = this.getSubject(reminder.type);
       
       await this.resend.emails.send({
         from: 'INF CRM <noreply@infcrm.com>',
         to: reminder.deal.tenant.ownerEmail, // Get from user
         subject,
         html: template(reminder),
       });
     }
     
     private getTemplate(type: ReminderType) {
       const templates = {
         PAYMENT_DUE: (reminder) => `
           <h2>Payment Due Soon</h2>
           <p>You have a payment due for <strong>${reminder.deal.title}</strong>.</p>
           <p>Amount: ${reminder.payment.amount} ${reminder.deal.currency}</p>
           <p>Due Date: ${formatDate(reminder.payment.dueDate)}</p>
           <a href="${process.env.APP_BASE_URL}/deals/${reminder.dealId}">View Deal</a>
         `,
         DELIVERABLE_DUE: (reminder) => `
           <h2>Deliverable Due Soon</h2>
           <p>Your deliverable for <strong>${reminder.deal.title}</strong> is due soon.</p>
           <p>Due Date: ${formatDate(reminder.deliverable.dueDate)}</p>
           <a href="${process.env.APP_BASE_URL}/deals/${reminder.dealId}">View Deal</a>
         `,
         // ... other templates
       };
       
       return templates[type];
     }
   }
   ```

5. Frontend: Calendar Page (app/(dashboard)/calendar/page.tsx)
   
   ```typescript
   import FullCalendar from '@fullcalendar/react';
   import dayGridPlugin from '@fullcalendar/daygrid';
   import interactionPlugin from '@fullcalendar/interaction';
   
   export default function CalendarPage() {
     const [dateRange, setDateRange] = useState({
       start: startOfMonth(new Date()),
       end: endOfMonth(new Date()),
     });
     
     const { data: events } = useQuery({
       queryKey: ['calendar-events', dateRange],
       queryFn: () =>
         apiClient.get('/calendar/events', {
           params: {
             from: format(dateRange.start, 'yyyy-MM-dd'),
             to: format(dateRange.end, 'yyyy-MM-dd'),
           },
         }).then(res => res.data),
     });
     
     const calendarEvents = events?.map(event => ({
       id: event.id,
       title: event.title,
       start: event.date,
       backgroundColor: getEventColor(event.type),
       extendedProps: event,
     }));
     
     const handleEventClick = (info) => {
       const event = info.event.extendedProps;
       router.push(`/deals/${event.dealId}`);
     };
     
     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold mb-6">Calendar</h1>
         
         <FullCalendar
           plugins={[dayGridPlugin, interactionPlugin]}
           initialView="dayGridMonth"
           events={calendarEvents}
           eventClick={handleEventClick}
           datesSet={(dateInfo) => {
             setDateRange({
               start: dateInfo.start,
               end: dateInfo.end,
             });
           }}
           height="auto"
         />
       </div>
     );
   }
   ```

6. In-App Notifications:
   
   components/layout/NotificationBell.tsx:
   ```typescript
   export function NotificationBell() {
     const { data: notifications } = useQuery({
       queryKey: ['notifications'],
       queryFn: () => apiClient.get('/notifications').then(res => res.data),
       refetchInterval: 60000, // Poll every minute
     });
     
     const unreadCount = notifications?.filter(n => !n.readAt).length || 0;
     
     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="ghost" size="icon" className="relative">
             <Bell className="w-5 h-5" />
             {unreadCount > 0 && (
               <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0">
                 {unreadCount}
               </Badge>
             )}
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-80">
           <div className="p-2">
             <h3 className="font-semibold mb-2">Notifications</h3>
             {notifications?.length === 0 ? (
               <p className="text-sm text-gray-500">No notifications</p>
             ) : (
               <div className="space-y-2">
                 {notifications?.map(notif => (
                   <div
                     key={notif.id}
                     className={cn(
                       "p-2 rounded cursor-pointer hover:bg-gray-50",
                       !notif.readAt && "bg-blue-50"
                     )}
                     onClick={() => handleMarkRead(notif.id)}
                   >
                     <p className="font-medium text-sm">{notif.title}</p>
                     <p className="text-xs text-gray-600">{notif.body}</p>
                     <p className="text-xs text-gray-400 mt-1">
                       {formatRelative(notif.createdAt)}
                     </p>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </DropdownMenuContent>
       </DropdownMenu>
     );
   }
   ```

Test:
- Create deal with payment due in 3 days
- Wait for reminder to be sent (or manually trigger worker)
- Receive email
- See in-app notification
- Click notification → navigate to deal
```

---

### SPRINT 8: DASHBOARD & POLISH (Day 32-36)

**Prompt to Claude Code:**

```
Build dashboard and final polish for INF CRM.

1. Dashboard (app/(dashboard)/dashboard/page.tsx):
   
   Layout:
   ```
   ┌────────────────────────────────────────────┐
   │  Summary Cards (4 across)                  │
   ├──────────────┬─────────────────────────────┤
   │ Today's      │ Pipeline Overview           │
   │ Tasks        │ (Counts by Stage)           │
   │              │                             │
   ├──────────────┼─────────────────────────────┤
   │ Overdue      │ Recent Activity             │
   │ Payments     │ (Timeline)                  │
   └──────────────┴─────────────────────────────┘
   ```

2. Summary Cards:
   ```typescript
   const { data: summary } = useQuery({
     queryKey: ['dashboard-summary'],
     queryFn: () => apiClient.get('/dashboard/summary').then(res => res.data),
   });
   
   // Backend: GET /dashboard/summary
   {
     todayTasks: {
       deliverablesDue: 3,
       publishToday: 2,
       paymentsDue: 1,
     },
     overduePayments: {
       count: 5,
       totalAmount: 15000,
     },
     pipeline: {
       LEAD: 10,
       CONTACTED: 5,
       NEGOTIATION: 3,
       // ... all stages
     },
     recentActivity: [
       { type, message, createdAt, dealId }
     ]
   }
   ```

3. Today's Tasks Widget:
   ```typescript
   export function TodaysTasks() {
     const { data } = useQuery({
       queryKey: ['today-tasks'],
       queryFn: async () => {
         const today = format(new Date(), 'yyyy-MM-dd');
         return apiClient.get('/calendar/events', {
           params: { from: today, to: today },
         }).then(res => res.data);
       },
     });
     
     return (
       <Card>
         <CardHeader>
           <CardTitle>Today's Tasks</CardTitle>
         </CardHeader>
         <CardContent>
           {data?.length === 0 ? (
             <p className="text-gray-500">No tasks today</p>
           ) : (
             <div className="space-y-2">
               {data?.map(event => (
                 <div
                   key={event.id}
                   className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                   onClick={() => router.push(`/deals/${event.dealId}`)}
                 >
                   <div className="flex items-center gap-2">
                     {getEventIcon(event.type)}
                     <div>
                       <p className="font-medium text-sm">{event.title}</p>
                       <p className="text-xs text-gray-500">
                         {event.deal.brand.name}
                       </p>
                     </div>
                   </div>
                   <Badge variant={getEventVariant(event.type)}>
                     {event.type}
                   </Badge>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

4. Overdue Payments Widget:
   ```typescript
   export function OverduePayments() {
     const { data: payments } = useQuery({
       queryKey: ['overdue-payments'],
       queryFn: () =>
         apiClient.get('/payments', {
           params: { status: 'OVERDUE' },
         }).then(res => res.data),
     });
     
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <AlertCircle className="w-5 h-5 text-red-500" />
             Overdue Payments
           </CardTitle>
         </CardHeader>
         <CardContent>
           {payments?.length === 0 ? (
             <p className="text-gray-500">No overdue payments</p>
           ) : (
             <div className="space-y-2">
               {payments?.map(payment => (
                 <div
                   key={payment.id}
                   className="flex items-center justify-between p-2 hover:bg-red-50 rounded cursor-pointer"
                   onClick={() => router.push(`/deals/${payment.dealId}`)}
                 >
                   <div>
                     <p className="font-medium text-sm">
                       {payment.deal.brand.name}
                     </p>
                     <p className="text-xs text-gray-500">
                       Due {formatDate(payment.dueDate)}
                     </p>
                   </div>
                   <p className="font-semibold text-red-600">
                     {formatCurrency(payment.amount, payment.deal.currency)}
                   </p>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

5. Pipeline Overview Chart:
   ```typescript
   import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
   
   export function PipelineOverview() {
     const { data } = useQuery({
       queryKey: ['pipeline-stats'],
       queryFn: () =>
         apiClient.get('/dashboard/pipeline').then(res => res.data),
     });
     
     const chartData = Object.entries(data || {}).map(([stage, count]) => ({
       stage: formatStage(stage),
       count,
     }));
     
     return (
       <Card>
         <CardHeader>
           <CardTitle>Pipeline Overview</CardTitle>
         </CardHeader>
         <CardContent>
           <BarChart width={500} height={300} data={chartData}>
             <XAxis dataKey="stage" />
             <YAxis />
             <Tooltip />
             <Bar dataKey="count" fill="#8884d8" />
           </BarChart>
         </CardContent>
       </Card>
     );
   }
   ```

6. Deal Detail Polish:
   
   Create tabs layout:
   ```typescript
   export default function DealDetailPage({ params }: { params: { id: string } }) {
     const { data: deal } = useQuery({
       queryKey: ['deal', params.id],
       queryFn: () =>
         apiClient.get(`/deals/${params.id}`).then(res => res.data),
     });
     
     return (
       <div className="p-6">
         <div className="mb-6">
           <h1 className="text-2xl font-bold">{deal?.title}</h1>
           <p className="text-gray-600">{deal?.brand.name}</p>
         </div>
         
         <Tabs defaultValue="overview">
           <TabsList>
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
             <TabsTrigger value="payments">Payments</TabsTrigger>
             <TabsTrigger value="contracts">Contracts</TabsTrigger>
             <TabsTrigger value="activity">Activity</TabsTrigger>
           </TabsList>
           
           <TabsContent value="overview">
             <DealOverview deal={deal} />
           </TabsContent>
           
           <TabsContent value="deliverables">
             <DeliverablesList dealId={params.id} />
           </TabsContent>
           
           <TabsContent value="payments">
             <PaymentsList dealId={params.id} />
           </TabsContent>
           
           <TabsContent value="contracts">
             <ContractSection dealId={params.id} />
           </TabsContent>
           
           <TabsContent value="activity">
             <ActivityTimeline dealId={params.id} />
           </TabsContent>
         </Tabs>
       </div>
     );
   }
   ```

7. Activity Timeline:
   ```typescript
   export function ActivityTimeline({ dealId }) {
     const { data: activities } = useQuery({
       queryKey: ['activity-log', dealId],
       queryFn: () =>
         apiClient.get(`/deals/${dealId}/activity`).then(res => res.data),
     });
     
     return (
       <div className="space-y-4">
         {activities?.map(activity => (
           <div key={activity.id} className="flex gap-3">
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                 {getActivityIcon(activity.type)}
               </div>
               {activity !== activities[activities.length - 1] && (
                 <div className="w-0.5 h-full bg-gray-200 mt-2" />
               )}
             </div>
             
             <div className="flex-1 pb-4">
               <p className="font-medium">{activity.message}</p>
               <p className="text-xs text-gray-500">
                 {formatRelative(activity.createdAt)}
               </p>
               {activity.metadata && (
                 <pre className="text-xs text-gray-600 mt-1">
                   {JSON.stringify(activity.metadata, null, 2)}
                 </pre>
               )}
             </div>
           </div>
         ))}
       </div>
     );
   }
   ```

8. Mobile Responsive:
   - Hamburger menu on mobile
   - Stacked cards on dashboard
   - Horizontal scroll for kanban on mobile
   - Bottom navigation (optional)

9. Loading States:
   - Skeleton loaders for all data fetching
   - Shimmer effects
   - Loading spinners for mutations

10. Error States:
    - Friendly error messages
    - "Try again" buttons
    - Error boundaries

Test complete user flow:
- Login → Dashboard → Create deal → Move in pipeline → Add payments → Upload contract → See calendar → Receive reminders
```

---

## 🎨 DESIGN SYSTEM

### Colors

```typescript
const colors = {
  primary: {
    main: '#3B82F6',      // Blue
    light: '#60A5FA',
    dark: '#2563EB',
  },
  success: {
    main: '#10B981',      // Green
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B',      // Amber
    light: '#FBBF24',
    dark: '#D97706',
  },
  danger: {
    main: '#EF4444',      // Red
    light: '#F87171',
    dark: '#DC2626',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
}
```

### Payment Status Colors

```typescript
const paymentStatusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
}
```

---

## 📊 SUCCESS METRICS

### MVP Launch (Week 6-8)
- All 5 core features working
- 0 cross-tenant data leakage
- <2s page load times
- Mobile responsive
- Email reminders sending

### Post-Launch (Month 2-3)
- 10-50 active tenants
- Avg 10+ deals per tenant
- <5% error rate
- 95%+ uptime
- Payment tracking used by 80%+ users

---

## ✅ LAUNCH CHECKLIST

### Technical
- [ ] All migrations applied
- [ ] RLS policies working
- [ ] TenantGuard on all routes
- [ ] BullMQ worker running
- [ ] Email service configured
- [ ] S3/MinIO configured
- [ ] Redis connected
- [ ] No console errors
- [ ] Mobile responsive

### Data
- [ ] Seed data for demo
- [ ] Test cross-tenant isolation
- [ ] Test soft delete works
- [ ] Test activity logging

### Features
- [ ] Can create deals
- [ ] Kanban drag-drop works
- [ ] Payments track correctly
- [ ] Overdue detection works
- [ ] Contract upload works
- [ ] Calendar shows events
- [ ] Reminders send
- [ ] Notifications appear

---

## 🎯 WHY THIS ARCHITECTURE?

### Multi-Tenant Benefits
- **One deployment** serves all customers
- **Easier maintenance** than separate instances
- **Cost efficient** for SaaS model
- **Data isolation** with proper RLS

### NestJS Benefits
- **Structure** for complex backend
- **Modularity** for team growth
- **Type safety** with TypeScript
- **Testability** built-in

### Why NOT Supabase
- Spec requires NestJS backend
- BullMQ worker needs custom server
- Complex multi-tenant logic
- Full control over tenant isolation

---

## 💡 FINAL WISDOM

### For Success

1. **Tenant isolation is critical** - test thoroughly
2. **Reminders are the killer feature** - make them reliable
3. **Pipeline UX matters** - smooth drag-drop
4. **Payment tracking must be accurate** - money is sensitive
5. **Calendar view ties it together** - make it clear

### For Quality

1. **Test cross-tenant** - user A cannot see user B data
2. **Test reminders** - trigger manually, verify emails
3. **Test payments** - partial, overdue, all cases
4. **Test activity log** - every important action logged
5. **Test on mobile** - influencers use phones

### For Scale

1. **Indexes matter** - tenantId on everything
2. **BullMQ handles load** - don't run reminders synchronously
3. **Pagination needed** - for large deal lists
4. **Caching helps** - Redis for hot data
5. **Monitoring essential** - track errors early

---

## 🎉 YOU'RE READY

This is the most complex project so far:
- Multi-tenant architecture
- Background job processing
- File uploads
- Email system
- Real-time calendar

But you have a complete roadmap.

**Next Steps:**
1. Start with SPRINT 1 (Skeleton)
2. Work through each sprint sequentially
3. Test tenant isolation thoroughly
4. Use Claude Code with prompts provided
5. Launch in 6-8 weeks

Good luck building INF CRM! 🚀

---

**Document Version:** 1.0  
**Based on:** INF CRM Technical Specification v1  
**Last Updated:** February 2026  
**Estimated Build Time:** 6-8 weeks with Claude Code  
**Complexity Level:** Advanced (Multi-Tenant SaaS)
