# 🚀 INF CRM - The Ultimate Influencer Management Platform

A modern, high-performance, **Multi-tenant SaaS CRM** tailored specifically for influencer management agencies and individuals. INF CRM streamlines operations by centralizing deal tracking, payment processing, contract management, and scheduling.

## 🌟 Key Features
- **📊 Deal Pipeline (Kanban):** Drag-and-drop interface powered by `@dnd-kit` to visually track negotiation stages and closing statuses.
- **💰 Payment Tracking:** Seamlessly integrated with **Stripe** for reliable transaction processing, invoicing, and revenue monitoring.
- **📝 Contract Management:** Built-in tools for generating, reviewing, and securely storing influencer agreements leveraging **AWS S3 / MinIO**.
- **📅 Calendar & Reminders:** Interactive scheduling with `@fullcalendar`, including automated background job reminders using **BullMQ** and **Redis**.
- **🏢 Multi-tenant Architecture:** Total data isolation and robust security ensuring each agency or brand has a dedicated, secure workspace.
- **✉️ Automated Emails:** High-deliverability transactional emails and notifications powered by **Resend**.

## 🛠️ Cutting-Edge Tech Stack

We've built INF CRM using a robust, highly scalable, and modern technology stack to ensure performance and maintainability:

### **Backend Architecture**
- 🚀 **Next-Gen Framework:** [NestJS 11](https://nestjs.com/) for a highly modular, scalable, and maintainable enterprise architecture.
- 🗄️ **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/) ensuring typesafe database access.
- ⚡ **Caching & Queues:** [Redis](https://redis.io/) paired with [BullMQ](https://docs.nestjs.com/techniques/queues) for high-performance background job processing and scheduling.
- 🔒 **Security:** Solid authentication using `passport-jwt` and secure password hashing with `argon2/bcrypt`.
- ☁️ **Cloud Storage:** Amazon S3 / MinIO integration via `@aws-sdk` for reliable media and document storage.
- 🤖 **AI Integration:** Leveraging **OpenAI API** capabilities.

### **Frontend Excellence**
- ⚛️ **Framework:** [Next.js 16](https://nextjs.org/) (React 19) offering blazing fast server-side rendering and an optimal developer experience.
- 🎨 **Styling & UI:** Gorgeous, accessible components built with [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
- 🔄 **State Management:** [TanStack Query v5](https://tanstack.com/query) for powerful, declarative server-state management.
- 🛡️ **Validation:** [Zod](https://zod.dev/) and `react-hook-form` ensuring robust, type-safe client-side data validation.
- 📈 **Data Visualization:** Interactive charts using [Recharts](https://recharts.org/).

## 🚀 Getting Started

Experience the platform by running it locally with ease.

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for infrastructure)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Spin up the infrastructure (Database, Redis, MinIO):**
   ```bash
   docker compose up -d
   ```

3. **Initialize the Database:**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Launch Development Servers:**
   ```bash
   npm run dev
   ```

## 🏗️ Development Services
Once running, you can access the various parts of the ecosystem:
- **Frontend Web Dashboard:** `http://localhost:3000`
- **Backend API Server:** `http://localhost:3001`
- **MinIO Storage Console:** `http://localhost:9001`
