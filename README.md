# MegaSoft Enterprise Service & Asset Management System

A full-stack internal tool for managing **users, assets, service requests, and maintenance logs**. Built as a clean, modern dashboard with full CRUD on every module and a service-request assignment + status workflow.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components
- **Supabase** (PostgreSQL) — accessed directly via `@supabase/supabase-js` / `@supabase/ssr` (no ORM)
- **Server Actions** for all mutations (no separate API layer)

## Features

| Module | Capabilities |
|--------|--------------|
| **Dashboard** | Live counts (users, assets, open requests, logs) + recent open requests |
| **Users** | Create / edit / delete, role & department |
| **Assets** | Create / edit / delete, status & user assignment |
| **Service Requests** | Create / edit / delete, **assign technician**, **update status** (Open → In Progress → Resolved → Closed) |
| **Maintenance Logs** | Create / edit / delete, linked to asset + technician |

## Data Model (ERD)

Five tables already provisioned on the Supabase project:

- `department` — departments
- `user` — employees, technicians, admins (FK → department)
- `asset` — hardware/equipment (FK → assigned user)
- `serviceRequest` — tickets (FKs → creator, assignee, asset)
- `maintenancelog` — maintenance history (FKs → asset, technician)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The database schema already lives on the Supabase project. Copy the example file and fill in your project values (found in **Project Settings → API**):

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> If the environment variables are missing, the app still runs and each page shows a clear setup message instead of crashing.

## Project Structure

```
src/
  actions/                 Server actions (data fetching + mutations)
    users.ts
    assets.ts
    service-requests.ts
    maintenance-logs.ts
    dashboard.ts
  app/
    (dashboard)/           Dashboard layout + module pages
    page.tsx               Landing page
  components/
    <module>/              Tables + form dialogs per module
    shared/                StatusBadge, DataTableShell
    layout/                Sidebar, page header
    ui/                    shadcn primitives
  lib/
    supabase/              Browser + server clients, config helper
    types/database.ts      Shared types
    constants/statuses.ts  Enums + badge variants
```

## Architecture Notes

- **Server Components** fetch data on the server; **Client Components** handle interactive tables, dialogs, and forms.
- All writes go through **Server Actions** that call `revalidatePath` to refresh affected pages.
- RLS policies are intentionally permissive for this demo (no auth layer).
