# Household Ops Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Model note:** Use claude-opus-4-6 for all code generation steps. Use the frontend-design skill when building UI components.

**Goal:** Build a mobile-focused household management web app with subscriptions, maintenance, bills, orders, inventory, and document tracking — styled identically to the Kin project.

**Architecture:** Next.js 15 App Router with Supabase for auth + database. All data scoped to a `household_id`. Five-tab bottom navigation with a dashboard home, category-specific tabs, and settings. Design mirrors Kin's Catppuccin Mocha dark theme exactly.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, Supabase (separate project), JetBrains Mono + Outfit fonts, lucide-react icons.

**Reference project:** `/home/pi/projects/web/kin` — copy design tokens, font setup, and component patterns directly.

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `.env.local.example`
- Create: `.gitignore`

**Step 1: Initialize project**

```bash
cd /home/pi/projects/web/household-ops
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```

When prompted, answer: No to ESLint, No to experimental `--turbopack` if asked separately.

**Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js lucide-react clsx tailwind-merge
npm install --save-dev @types/node
```

**Step 3: Update `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Copy to `.env.local` and fill in real values from your Supabase project dashboard.

**Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000 with no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Supabase dependencies"
```

---

### Task 2: Design system — CSS variables, Tailwind config, global styles

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`

**Reference:** Copy from `/home/pi/projects/web/kin/app/globals.css` and `/home/pi/projects/web/kin/tailwind.config.ts` exactly, then adapt.

**Step 1: Replace `app/globals.css` entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Catppuccin Mocha */
  --bg: #1e1e2e;
  --surface: #181825;
  --crust: #11111b;
  --card: #313244;
  --card-hover: #45475a;
  --border: #45475a;
  --border-light: #585b70;

  --text-1: #cdd6f4;
  --text-2: #a6adc8;
  --text-3: #585b70;

  --accent: #cba6f7;
  --accent-dim: rgba(203, 166, 247, 0.12);
  --accent-border: rgba(203, 166, 247, 0.35);

  --green: #a6e3a1;
  --green-dim: rgba(166, 227, 161, 0.15);
  --blue: #89b4fa;
  --blue-dim: rgba(137, 180, 250, 0.15);
  --yellow: #f9e2af;
  --yellow-dim: rgba(249, 226, 175, 0.15);
  --red: #f38ba8;
  --red-dim: rgba(243, 139, 168, 0.15);
  --peach: #fab387;
  --peach-dim: rgba(250, 179, 135, 0.15);

  --radius: 8px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  height: 100%;
  background-color: var(--bg);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

body {
  overflow-x: hidden;
}

::selection {
  background: var(--accent-dim);
  color: var(--accent);
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* Animations */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes skeletonPulse {
  0%, 100% { background-color: var(--surface); }
  50%       { background-color: var(--card); }
}

.animate-fade-slide-up { animation: fadeSlideUp 200ms ease-out forwards; }
.animate-fade-in       { animation: fadeIn 250ms ease forwards; }
.animate-toast-in      { animation: toastIn 300ms ease forwards; }
.skeleton              { animation: skeletonPulse 1.4s infinite; border-radius: var(--radius); }

/* Staggered list delays */
.item-0 { animation-delay: 0ms; }
.item-1 { animation-delay: 40ms; }
.item-2 { animation-delay: 80ms; }
.item-3 { animation-delay: 120ms; }
.item-4 { animation-delay: 160ms; }
.item-5 { animation-delay: 200ms; }
.item-6 { animation-delay: 240ms; }
.item-7 { animation-delay: 280ms; }
```

**Step 2: Replace `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        crust:   'var(--crust)',
        card:    'var(--card)',
        border:  'var(--border)',
        accent:  'var(--accent)',
        text1:   'var(--text-1)',
        text2:   'var(--text-2)',
        text3:   'var(--text-3)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      animation: {
        'slide-up':  'fadeSlideUp 0.35s ease both',
        'fade-in':   'fadeIn 0.25s ease both',
        'toast-in':  'toastIn 0.3s ease both',
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 3: Update `app/layout.tsx` with fonts**

```typescript
import type { Metadata } from 'next'
import { JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Household Ops',
  description: 'Household management dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${outfit.variable}`}>
      <body className="font-sans bg-bg text-text1 min-h-screen">
        {children}
      </body>
    </html>
  )
}
```

**Step 4: Verify fonts and colors load**

```bash
npm run dev
```

Open http://localhost:3000 — background should be dark (`#1e1e2e`), no font errors in console.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Catppuccin Mocha design system and fonts"
```

---

### Task 3: Supabase schema

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`

**Step 1: Create `supabase/schema.sql`**

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Households
create table households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now()
);

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  household_id uuid references households(id) on delete cascade,
  display_name text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  avatar_color text not null default '#cba6f7',
  created_at timestamptz default now()
);

-- Invites
create table invites (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  email text,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  used boolean not null default false,
  created_at timestamptz default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  category text not null default 'other' check (category in ('streaming','meal_kit','utility','other')),
  cost numeric(10,2),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('weekly','monthly','quarterly','yearly','other')),
  next_renewal_date date,
  auto_renews boolean not null default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Maintenance items
create table maintenance_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  category text not null default 'home' check (category in ('home','vehicle','health','other')),
  interval_days int not null,
  last_completed date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bills
create table bills (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  amount numeric(10,2),
  due_date date not null,
  paid boolean not null default false,
  paid_date date,
  recurring boolean not null default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  type text not null default 'one_time' check (type in ('recurring','one_time')),
  next_delivery_date date,
  frequency text check (frequency in ('weekly','biweekly','monthly')),
  status text not null default 'upcoming' check (status in ('upcoming','ordered','shipped','delivered','recurring')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities (school, extracurriculars)
create table activities (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  person_id uuid references profiles(id),
  name text not null,
  event_description text,
  event_date date,
  amount_due numeric(10,2),
  paid boolean not null default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Inventory items
create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  quantity text,
  category text not null default 'grocery' check (category in ('grocery','household','personal','other')),
  always_needed boolean not null default false,
  checked boolean not null default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  created_by uuid references profiles(id),
  name text not null,
  type text not null default 'other' check (type in ('warranty','manual','insurance','lease','other')),
  associated_item text,
  expiry_date date,
  link text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table households       enable row level security;
alter table profiles         enable row level security;
alter table invites          enable row level security;
alter table subscriptions    enable row level security;
alter table maintenance_items enable row level security;
alter table bills            enable row level security;
alter table orders           enable row level security;
alter table activities       enable row level security;
alter table inventory_items  enable row level security;
alter table documents        enable row level security;

-- RLS Policies: users can only see their household's data
create policy "household members" on households
  for all using (
    id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on profiles
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on subscriptions
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on maintenance_items
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on bills
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on orders
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on activities
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on inventory_items
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

create policy "household members" on documents
  for all using (
    household_id in (select household_id from profiles where id = auth.uid())
  );

-- Invites: anyone with the token can read it (for registration flow)
create policy "invite by token" on invites
  for select using (true);

create policy "admin manage invites" on invites
  for insert using (
    household_id in (
      select household_id from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

create trigger update_maintenance_updated_at
  before update on maintenance_items
  for each row execute function update_updated_at();

create trigger update_bills_updated_at
  before update on bills
  for each row execute function update_updated_at();

create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

create trigger update_activities_updated_at
  before update on activities
  for each row execute function update_updated_at();

create trigger update_inventory_updated_at
  before update on inventory_items
  for each row execute function update_updated_at();

create trigger update_documents_updated_at
  before update on documents
  for each row execute function update_updated_at();
```

**Step 2: Run schema in Supabase**

Go to your Supabase project → SQL Editor → paste the entire contents of `supabase/schema.sql` → Run.

Verify in Table Editor that all 10 tables were created.

**Step 3: Enable Google OAuth in Supabase (optional but recommended now)**

Supabase Dashboard → Authentication → Providers → Google → enable and configure with your Google OAuth credentials.

**Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase schema with RLS policies"
```

---

### Task 4: TypeScript types and utilities

**Files:**
- Create: `lib/types.ts`
- Create: `lib/utils.ts`
- Create: `lib/constants.ts`
- Create: `lib/supabase.ts`

**Step 1: Create `lib/types.ts`**

```typescript
export type Role = 'admin' | 'member'
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'other'
export type SubscriptionCategory = 'streaming' | 'meal_kit' | 'utility' | 'other'
export type MaintenanceCategory = 'home' | 'vehicle' | 'health' | 'other'
export type OrderType = 'recurring' | 'one_time'
export type OrderFrequency = 'weekly' | 'biweekly' | 'monthly'
export type OrderStatus = 'upcoming' | 'ordered' | 'shipped' | 'delivered' | 'recurring'
export type InventoryCategory = 'grocery' | 'household' | 'personal' | 'other'
export type DocumentType = 'warranty' | 'manual' | 'insurance' | 'lease' | 'other'

export interface Household {
  id: string
  name: string
  created_at: string
}

export interface Profile {
  id: string
  household_id: string
  display_name: string
  role: Role
  avatar_color: string
  created_at: string
}

export interface Subscription {
  id: string
  household_id: string
  created_by: string | null
  name: string
  category: SubscriptionCategory
  cost: number | null
  billing_cycle: BillingCycle
  next_renewal_date: string | null
  auto_renews: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceItem {
  id: string
  household_id: string
  created_by: string | null
  name: string
  category: MaintenanceCategory
  interval_days: number
  last_completed: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  household_id: string
  created_by: string | null
  name: string
  amount: number | null
  due_date: string
  paid: boolean
  paid_date: string | null
  recurring: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  household_id: string
  created_by: string | null
  name: string
  type: OrderType
  next_delivery_date: string | null
  frequency: OrderFrequency | null
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  household_id: string
  person_id: string | null
  name: string
  event_description: string | null
  event_date: string | null
  amount_due: number | null
  paid: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // joined
  person?: Profile
}

export interface InventoryItem {
  id: string
  household_id: string
  created_by: string | null
  name: string
  quantity: string | null
  category: InventoryCategory
  always_needed: boolean
  checked: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  household_id: string
  created_by: string | null
  name: string
  type: DocumentType
  associated_item: string | null
  expiry_date: string | null
  link: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Invite {
  id: string
  household_id: string
  email: string | null
  token: string
  used: boolean
  created_at: string
}
```

**Step 2: Create `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns days between today and a target date. Negative = overdue. */
export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** Calculates next due date from last completed + interval */
export function calcNextDue(lastCompleted: string | null, intervalDays: number): string | null {
  if (!lastCompleted) return null
  const last = new Date(lastCompleted)
  last.setDate(last.getDate() + intervalDays)
  return last.toISOString().split('T')[0]
}

/** Formats a date string to a human-readable label */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Returns relative label like "in 3 days", "2 days ago", "today" */
export function relativeDays(days: number | null): string {
  if (days === null) return '—'
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  if (days > 0) return `in ${days}d`
  return `${Math.abs(days)}d ago`
}

/** Status color for left bar based on days remaining */
export function urgencyColor(days: number | null, thresholdWarn = 14): string {
  if (days === null) return 'var(--text-3)'
  if (days < 0) return 'var(--red)'
  if (days <= thresholdWarn) return 'var(--yellow)'
  return 'var(--green)'
}

/** Gets initials from a display name */
export function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Formats currency */
export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
```

**Step 3: Create `lib/constants.ts`**

```typescript
export const AVATAR_COLORS = [
  '#cba6f7', // mauve (accent)
  '#89b4fa', // blue
  '#a6e3a1', // green
  '#f9e2af', // yellow
  '#fab387', // peach
  '#f38ba8', // red
  '#94e2d5', // teal
  '#f5c2e7', // pink
]

export const BILLING_CYCLE_LABELS: Record<string, string> = {
  weekly: 'weekly',
  monthly: 'monthly',
  quarterly: 'quarterly',
  yearly: 'yearly',
  other: 'other',
}

export const SUBSCRIPTION_CATEGORY_LABELS: Record<string, string> = {
  streaming: 'streaming',
  meal_kit: 'meal kit',
  utility: 'utility',
  other: 'other',
}

export const MAINTENANCE_CATEGORY_LABELS: Record<string, string> = {
  home: 'home',
  vehicle: 'vehicle',
  health: 'health',
  other: 'other',
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  warranty: 'warranty',
  manual: 'manual',
  insurance: 'insurance',
  lease: 'lease',
  other: 'other',
}

export const INVENTORY_CATEGORY_LABELS: Record<string, string> = {
  grocery: 'grocery',
  household: 'household',
  personal: 'personal',
  other: 'other',
}

export const TICKET_URL = 'https://kin.chasefrazier.dev'
```

**Step 4: Create `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add TypeScript types, utils, and Supabase client"
```

---

## Phase 2: Auth & Layout

### Task 5: Session context and toast context

**Files:**
- Create: `contexts/SessionContext.tsx`
- Create: `contexts/ToastContext.tsx`

**Reference:** Mirror `/home/pi/projects/web/kin/contexts/` exactly, adapting for this app's Profile type.

**Step 1: Create `contexts/ToastContext.tsx`**

```typescript
'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })
export const useToast = () => useContext(ToastContext)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 16px)',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-toast-in" style={{
            background: t.type === 'error' ? 'var(--red-dim)' : 'var(--card)',
            border: `1px solid ${t.type === 'error' ? 'var(--red)' : 'var(--border)'}`,
            color: t.type === 'error' ? 'var(--red)' : 'var(--text-1)',
            padding: '10px 16px',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '13px',
            maxWidth: '280px',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
```

**Step 2: Create `contexts/SessionContext.tsx`**

```typescript
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

interface SessionContextValue {
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue>({
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useSession = () => useContext(SessionContext)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data ?? null)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
        if (event === 'SIGNED_OUT') router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <SessionContext.Provider value={{ profile, loading, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}
```

**Step 3: Wrap layout with providers in `app/layout.tsx`**

Add `SessionProvider` and `ToastProvider` wrapping `{children}`:

```typescript
import { SessionProvider } from '@/contexts/SessionContext'
import { ToastProvider } from '@/contexts/ToastContext'

// In body:
<SessionProvider>
  <ToastProvider>
    {children}
  </ToastProvider>
</SessionProvider>
```

**Step 4: Commit**

```bash
git add contexts/ app/layout.tsx
git commit -m "feat: add session and toast contexts"
```

---

### Task 6: Login / registration pages

**Files:**
- Modify: `app/page.tsx` (login)
- Create: `app/register/page.tsx` (first-time household setup)
- Create: `app/join/[token]/page.tsx` (invite accept)

**Step 1: Build login page `app/page.tsx`**

Use the frontend-design skill. The page should match kin's login aesthetic:
- Large centered "household ops" title in JetBrains Mono
- Email + password fields (transparent bg, border-bottom only)
- "sign in" button (monospace, accent color)
- Google OAuth button below
- "create household" link for first-time setup
- Background: `var(--bg)`, centered content

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showToast(error.message, 'error')
    } else {
      router.push('/home')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    })
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '48px',
        fontWeight: 700,
        color: 'var(--text-1)',
        letterSpacing: '-1px',
        marginBottom: '48px',
      }}>
        household ops
      </h1>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-1)',
              fontFamily: 'var(--font-outfit)',
              fontSize: '15px',
              padding: '8px 0',
              outline: 'none',
              width: '100%',
            }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-1)',
              fontFamily: 'var(--font-outfit)',
              fontSize: '15px',
              padding: '8px 0',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          background: 'transparent',
          border: 'none',
          color: loading ? 'var(--text-3)' : 'var(--accent)',
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '14px',
          cursor: loading ? 'default' : 'pointer',
          textAlign: 'left',
          padding: 0,
        }}>
          {loading ? 'signing in...' : 'sign in →'}
        </button>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        <button type="button" onClick={handleGoogle} style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-1)',
          fontFamily: 'var(--font-outfit)',
          fontSize: '14px',
          padding: '10px 16px',
          cursor: 'pointer',
          width: '100%',
        }}>
          continue with Google
        </button>

        <a href="/register" style={{
          color: 'var(--text-3)',
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '12px',
          textDecoration: 'none',
          textAlign: 'center',
        }}>
          create a household
        </a>
      </form>
    </div>
  )
}
```

**Step 2: Build household registration page `app/register/page.tsx`**

Form for new households: household name + admin display name + email + password. On submit:
1. Create Supabase auth user
2. Create household row
3. Create profile row with role='admin'
4. Redirect to /home

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { AVATAR_COLORS } from '@/lib/constants'

export default function RegisterPage() {
  const [householdName, setHouseholdName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError || !authData.user) throw authError ?? new Error('signup failed')

      const { data: household, error: hhError } = await supabase
        .from('households')
        .insert({ name: householdName })
        .select()
        .single()
      if (hhError || !household) throw hhError ?? new Error('household creation failed')

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          household_id: household.id,
          display_name: displayName,
          role: 'admin',
          avatar_color: AVATAR_COLORS[0],
        })
      if (profileError) throw profileError

      router.push('/home')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'something went wrong', 'error')
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-1)',
    fontFamily: 'var(--font-outfit)',
    fontSize: '15px',
    padding: '8px 0',
    outline: 'none',
    width: '100%',
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '32px',
        fontWeight: 700,
        color: 'var(--text-1)',
        marginBottom: '8px',
      }}>
        create household
      </h1>
      <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', marginBottom: '40px' }}>
        you'll be the admin
      </p>

      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input style={inputStyle} placeholder="household name (e.g. the smiths)" value={householdName} onChange={e => setHouseholdName(e.target.value)} required />
        <input style={inputStyle} placeholder="your name" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
        <input style={inputStyle} type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading} style={{
          background: 'transparent', border: 'none',
          color: loading ? 'var(--text-3)' : 'var(--accent)',
          fontFamily: 'var(--font-jetbrains)', fontSize: '14px',
          cursor: loading ? 'default' : 'pointer', textAlign: 'left', padding: 0,
        }}>
          {loading ? 'creating...' : 'create household →'}
        </button>

        <a href="/" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', textDecoration: 'none', textAlign: 'center' }}>
          ← back to sign in
        </a>
      </form>
    </div>
  )
}
```

**Step 3: Build invite join page `app/join/[token]/page.tsx`**

Validates invite token, shows join form (display name + email + password). On submit: creates user, creates profile linked to household.

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { AVATAR_COLORS } from '@/lib/constants'
import type { Invite } from '@/lib/types'

export default function JoinPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [invite, setInvite] = useState<Invite | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase
      .from('invites')
      .select('*')
      .eq('token', params.token)
      .eq('used', false)
      .single()
      .then(({ data }) => {
        setInvite(data)
        if (data?.email) setEmail(data.email)
        setChecking(false)
      })
  }, [params.token])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invite) return
    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError || !authData.user) throw authError ?? new Error('signup failed')

      const colorIndex = Math.floor(Math.random() * AVATAR_COLORS.length)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          household_id: invite.household_id,
          display_name: displayName,
          role: 'member',
          avatar_color: AVATAR_COLORS[colorIndex],
        })
      if (profileError) throw profileError

      await supabase.from('invites').update({ used: true }).eq('id', invite.id)
      router.push('/home')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'something went wrong', 'error')
    }
    setLoading(false)
  }

  if (checking) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>checking invite...</span>
    </div>
  )

  if (!invite) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: '16px' }}>
      <span style={{ color: 'var(--red)', fontFamily: 'var(--font-jetbrains)', fontSize: '14px' }}>invite invalid or already used</span>
      <a href="/" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', textDecoration: 'none' }}>← sign in</a>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-1)', fontFamily: 'var(--font-outfit)',
    fontSize: '15px', padding: '8px 0', outline: 'none', width: '100%',
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <h1 style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '28px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>you're invited</h1>
      <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', marginBottom: '40px' }}>join the household</p>
      <form onSubmit={handleJoin} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input style={inputStyle} placeholder="your name" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
        <input style={inputStyle} type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} style={{ background: 'transparent', border: 'none', color: loading ? 'var(--text-3)' : 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontSize: '14px', cursor: loading ? 'default' : 'pointer', textAlign: 'left', padding: 0 }}>
          {loading ? 'joining...' : 'join household →'}
        </button>
      </form>
    </div>
  )
}
```

**Step 4: Verify login flow**

```bash
npm run dev
```

- Go to http://localhost:3000/register → fill form → submit
- Should redirect to /home (will 404 for now, that's fine)
- Check Supabase → Authentication → Users — new user should appear
- Check profiles table — profile row should exist

**Step 5: Commit**

```bash
git add app/
git commit -m "feat: add login, register, and invite join pages"
```

---

### Task 7: Header and BottomNav components

**Files:**
- Create: `components/Header.tsx`
- Create: `components/BottomNav.tsx`

**Step 1: Create `components/Header.tsx`**

```typescript
'use client'
import { useSession } from '@/contexts/SessionContext'
import { initials } from '@/lib/utils'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { profile } = useSession()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      padding: `calc(14px + env(safe-area-inset-top, 0px)) 24px 14px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--text-1)',
        letterSpacing: '-0.3px',
      }}>
        {title}
      </span>

      {profile && (
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: profile.avatar_color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--bg)',
        }}>
          {initials(profile.display_name)}
        </div>
      )}
    </header>
  )
}
```

**Step 2: Create `components/BottomNav.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, RefreshCw, Package, Layers, Settings } from 'lucide-react'

const tabs = [
  { href: '/home',      label: 'home',      Icon: Home },
  { href: '/track',     label: 'track',     Icon: RefreshCw },
  { href: '/orders',    label: 'orders',    Icon: Package },
  { href: '/household', label: 'household', Icon: Layers },
  { href: '/settings',  label: 'settings',  Icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
    }}>
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link key={href} href={href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: active ? 'var(--accent)' : 'var(--text-3)',
            transition: 'color 150ms',
          }}>
            <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
            <span style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '10px',
              fontWeight: active ? 700 : 400,
              borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
              paddingBottom: '1px',
            }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
```

**Step 3: Commit**

```bash
git add components/
git commit -m "feat: add Header and BottomNav components"
```

---

### Task 8: App shell layout and page stubs

**Files:**
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/home/page.tsx` (stub)
- Create: `app/(app)/track/page.tsx` (stub)
- Create: `app/(app)/orders/page.tsx` (stub)
- Create: `app/(app)/household/page.tsx` (stub)
- Create: `app/(app)/settings/page.tsx` (stub)

**Step 1: Create route group layout `app/(app)/layout.tsx`**

This layout wraps all authenticated pages — adds auth guard, Header, BottomNav, and scroll container.

```typescript
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profile) router.push('/')
  }, [loading, profile, router])

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>loading...</span>
    </div>
  )

  if (!profile) return null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <main style={{
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
```

**Step 2: Create stub pages**

For each of the 5 tabs, create a minimal stub that renders with a Header so navigation can be verified:

`app/(app)/home/page.tsx`:
```typescript
import Header from '@/components/Header'
export default function HomePage() {
  return <><Header title="household ops" /><div style={{ padding: '24px' }}>home — coming soon</div></>
}
```

Repeat for `/track`, `/orders`, `/household`, `/settings` with appropriate titles.

**Step 3: Redirect old `/home` route**

If `app/home/` exists from the stub earlier, move it to `app/(app)/home/`. The route group `(app)` is invisible to the URL — `/home` still works.

**Step 4: Verify navigation**

```bash
npm run dev
```

- Register a new account → should land on /home
- Click all 5 bottom nav tabs → should navigate without errors
- Refresh on /track → should stay (auth guard keeps logged-in user)
- Open a private window → /home should redirect to /

**Step 5: Commit**

```bash
git add app/
git commit -m "feat: add auth-guarded app shell with stub pages"
```

---

## Phase 3: Track Tab

### Task 9: Shared card component pattern

**Files:**
- Create: `components/ItemCard.tsx`
- Create: `components/Modal.tsx`
- Create: `components/SectionFilter.tsx`

**Step 1: Create `components/ItemCard.tsx`**

Reusable card with left status bar, used by all item types.

```typescript
interface ItemCardProps {
  barColor: string
  title: string
  subtitle?: string
  meta?: string
  rightBadge?: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
  index?: number
}

export default function ItemCard({ barColor, title, subtitle, meta, rightBadge, actions, onClick, index = 0 }: ItemCardProps) {
  return (
    <div
      className={`animate-fade-slide-up item-${Math.min(index, 7)}`}
      onClick={onClick}
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        opacity: 0,
      }}
    >
      {/* Left status bar */}
      <div style={{ width: '3px', background: barColor, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '14px', fontWeight: 500, color: 'var(--text-1)', flex: 1 }}>
            {title}
          </span>
          {rightBadge}
        </div>
        {subtitle && (
          <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '13px', color: 'var(--text-2)' }}>{subtitle}</span>
        )}
        {meta && (
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-3)' }}>{meta}</span>
        )}
        {actions && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>{actions}</div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Create `components/Modal.tsx`**

Slide-up sheet modal for add/edit forms.

```typescript
'use client'
import { useEffect } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '12px 12px 0 0',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        maxHeight: '85dvh',
        overflowY: 'auto',
        padding: '24px 24px calc(24px + env(safe-area-inset-bottom, 0px))',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>
            {title}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

**Step 3: Create `components/SectionFilter.tsx`**

Sticky horizontal filter tabs for within-page sub-sections.

```typescript
interface SectionFilterProps {
  sections: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}

export default function SectionFilter({ sections, active, onChange }: SectionFilterProps) {
  return (
    <div style={{
      position: 'sticky',
      top: '57px', // below header
      zIndex: 50,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      gap: '0',
      overflowX: 'auto',
      padding: '0 24px',
    }}>
      {sections.map(s => (
        <button key={s.key} onClick={() => onChange(s.key)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '12px 16px 11px',
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '12px',
          color: active === s.key ? 'var(--accent)' : 'var(--text-3)',
          fontWeight: active === s.key ? 700 : 400,
          borderBottom: active === s.key ? '2px solid var(--accent)' : '2px solid transparent',
          whiteSpace: 'nowrap',
          transition: 'color 150ms',
        }}>
          {s.label}
        </button>
      ))}
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add components/
git commit -m "feat: add ItemCard, Modal, and SectionFilter shared components"
```

---

### Task 10: Subscriptions section

**Files:**
- Create: `components/track/SubscriptionCard.tsx`
- Create: `components/track/SubscriptionForm.tsx`
- Create: `hooks/useSubscriptions.ts`

**Step 1: Create `hooks/useSubscriptions.ts`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Subscription } from '@/lib/types'

export function useSubscriptions() {
  const { profile } = useSession()
  const [items, setItems] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('next_renewal_date', { ascending: true, nullsFirst: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [profile])

  const add = async (item: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('subscriptions').insert({ ...item, household_id: profile.household_id, created_by: profile.id })
    load()
  }

  const update = async (id: string, item: Partial<Subscription>) => {
    await supabase.from('subscriptions').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('subscriptions').delete().eq('id', id)
    load()
  }

  return { items, loading, add, update, remove, reload: load }
}
```

**Step 2: Create `components/track/SubscriptionCard.tsx`**

```typescript
import ItemCard from '@/components/ItemCard'
import { daysUntil, urgencyColor, relativeDays, formatCurrency, formatDate } from '@/lib/utils'
import { BILLING_CYCLE_LABELS, SUBSCRIPTION_CATEGORY_LABELS } from '@/lib/constants'
import type { Subscription } from '@/lib/types'

interface Props {
  item: Subscription
  index: number
  onClick: () => void
}

export default function SubscriptionCard({ item, index, onClick }: Props) {
  const days = daysUntil(item.next_renewal_date)
  const barColor = item.next_renewal_date ? urgencyColor(days, 7) : 'var(--text-3)'

  const badge = (
    <span style={{
      fontFamily: 'var(--font-jetbrains)', fontSize: '11px',
      color: barColor, whiteSpace: 'nowrap',
    }}>
      {item.next_renewal_date ? relativeDays(days) : '—'}
    </span>
  )

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={`${formatCurrency(item.cost)} / ${BILLING_CYCLE_LABELS[item.billing_cycle]}`}
      meta={`${SUBSCRIPTION_CATEGORY_LABELS[item.category]}${item.auto_renews ? ' · auto-renews' : ''} · renews ${formatDate(item.next_renewal_date)}`}
      rightBadge={badge}
      onClick={onClick}
    />
  )
}
```

**Step 3: Create `components/track/SubscriptionForm.tsx`**

Form for adding/editing subscriptions. Fields: name, category, cost, billing_cycle, next_renewal_date, auto_renews, notes.

```typescript
'use client'
import { useState } from 'react'
import type { Subscription } from '@/lib/types'

interface Props {
  initial?: Partial<Subscription>
  onSave: (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
  onDelete?: () => void
  saving?: boolean
}

const inputStyle: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text-1)', fontFamily: 'var(--font-outfit)',
  fontSize: '15px', padding: '8px 0', outline: 'none', width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains)', fontSize: '11px',
  color: 'var(--text-3)', marginBottom: '4px', display: 'block',
}

export default function SubscriptionForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'streaming')
  const [cost, setCost] = useState(initial?.cost?.toString() ?? '')
  const [billingCycle, setBillingCycle] = useState(initial?.billing_cycle ?? 'monthly')
  const [nextRenewal, setNextRenewal] = useState(initial?.next_renewal_date ?? '')
  const [autoRenews, setAutoRenews] = useState(initial?.auto_renews ?? true)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      category: category as Subscription['category'],
      cost: cost ? parseFloat(cost) : null,
      billing_cycle: billingCycle as Subscription['billing_cycle'],
      next_renewal_date: nextRenewal || null,
      auto_renews: autoRenews,
      notes: notes || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={labelStyle}># name</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Netflix" required />
      </div>
      <div>
        <label style={labelStyle}># category</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="streaming">streaming</option>
          <option value="meal_kit">meal kit</option>
          <option value="utility">utility</option>
          <option value="other">other</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}># cost ($)</label>
          <input style={inputStyle} type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="15.99" />
        </div>
        <div>
          <label style={labelStyle}># billing cycle</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
            <option value="quarterly">quarterly</option>
            <option value="yearly">yearly</option>
            <option value="other">other</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}># next renewal date</label>
        <input style={inputStyle} type="date" value={nextRenewal} onChange={e => setNextRenewal(e.target.value)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="auto-renews" checked={autoRenews} onChange={e => setAutoRenews(e.target.checked)} />
        <label htmlFor="auto-renews" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>auto-renews</label>
      </div>
      <div>
        <label style={labelStyle}># notes</label>
        <input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="optional notes" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
        {onDelete && (
          <button type="button" onClick={onDelete} style={{ background: 'none', border: 'none', color: 'var(--red)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
            delete
          </button>
        )}
        <button type="submit" disabled={saving} style={{ background: 'none', border: 'none', color: saving ? 'var(--text-3)' : 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontSize: '14px', cursor: saving ? 'default' : 'pointer', padding: 0, marginLeft: 'auto' }}>
          {saving ? 'saving...' : 'save →'}
        </button>
      </div>
    </form>
  )
}
```

**Step 4: Commit**

```bash
git add components/track/ hooks/
git commit -m "feat: add subscription card, form, and data hook"
```

---

### Task 11: Maintenance section

**Files:**
- Create: `hooks/useMaintenanceItems.ts`
- Create: `components/track/MaintenanceCard.tsx`
- Create: `components/track/MaintenanceForm.tsx`

Follow the exact same pattern as Task 10, adapted for maintenance:

- `useMaintenanceItems.ts` — same CRUD pattern, sorted by next due date (calculated: last_completed + interval_days)
- `MaintenanceCard.tsx` — shows name, interval label (e.g. "every 90 days"), last done date, next due (calculated client-side with `calcNextDue`), days remaining
- Primary action: "mark done" button that calls `update(id, { last_completed: today })`
- `MaintenanceForm.tsx` — fields: name, category, interval_days, last_completed, notes

Key difference from subscriptions: next due is **never stored** — always computed from `calcNextDue(last_completed, interval_days)`.

**Step 1: Create `hooks/useMaintenanceItems.ts`**

Same pattern as `useSubscriptions`, table: `maintenance_items`, ordered by `last_completed` ascending nulls first (longest overdue first).

**Step 2: Create `components/track/MaintenanceCard.tsx`**

```typescript
import ItemCard from '@/components/ItemCard'
import { calcNextDue, daysUntil, urgencyColor, relativeDays, formatDate } from '@/lib/utils'
import type { MaintenanceItem } from '@/lib/types'

interface Props {
  item: MaintenanceItem
  index: number
  onMarkDone: () => void
  onClick: () => void
}

export default function MaintenanceCard({ item, index, onMarkDone, onClick }: Props) {
  const nextDue = calcNextDue(item.last_completed, item.interval_days)
  const days = daysUntil(nextDue)
  const barColor = item.last_completed ? urgencyColor(days) : 'var(--red)'

  const actions = (
    <button onClick={e => { e.stopPropagation(); onMarkDone() }} style={{
      background: 'none', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', color: 'var(--text-2)',
      fontFamily: 'var(--font-jetbrains)', fontSize: '11px',
      padding: '4px 10px', cursor: 'pointer',
    }}>
      mark done
    </button>
  )

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={`every ${item.interval_days} days`}
      meta={`last done: ${formatDate(item.last_completed)} · next: ${nextDue ? relativeDays(days) : 'never done'}`}
      actions={actions}
      onClick={onClick}
    />
  )
}
```

**Step 3: Create `components/track/MaintenanceForm.tsx`**

Same structure as SubscriptionForm. Fields: name, category (home/vehicle/health/other), interval_days (number input), last_completed (date), notes.

**Step 4: Commit**

```bash
git add components/track/Maintenance* hooks/useMaintenance*
git commit -m "feat: add maintenance card, form, and data hook"
```

---

### Task 12: Bills section

**Files:**
- Create: `hooks/useBills.ts`
- Create: `components/track/BillCard.tsx`
- Create: `components/track/BillForm.tsx`

Follow same pattern. Bills have a "mark paid" primary action.

- `useBills.ts` — on mark paid: update `{ paid: true, paid_date: today }`. If bill is `recurring`, also insert a new bill for next month (`due_date + 1 month`).
- `BillCard.tsx` — shows name, amount, due date, paid status. Bar: red=overdue+unpaid, yellow=due soon+unpaid, green=paid.
- `BillForm.tsx` — fields: name, amount, due_date, recurring toggle, notes.

**Step 1: Create `hooks/useBills.ts`**

Key addition — `markPaid` function:

```typescript
const markPaid = async (bill: Bill) => {
  const today = new Date().toISOString().split('T')[0]
  await supabase.from('bills').update({ paid: true, paid_date: today }).eq('id', bill.id)

  if (bill.recurring) {
    const nextDue = new Date(bill.due_date)
    nextDue.setMonth(nextDue.getMonth() + 1)
    await supabase.from('bills').insert({
      household_id: bill.household_id,
      created_by: bill.created_by,
      name: bill.name,
      amount: bill.amount,
      due_date: nextDue.toISOString().split('T')[0],
      paid: false,
      recurring: true,
      notes: bill.notes,
    })
  }
  load()
}
```

**Step 2: Create `components/track/BillCard.tsx`**

Primary action: "mark paid" button. Shows paid badge when paid.

**Step 3: Create `components/track/BillForm.tsx`**

Fields: name, amount ($), due_date, recurring (checkbox), notes.

**Step 4: Commit**

```bash
git add components/track/Bill* hooks/useBills*
git commit -m "feat: add bill card, form, and data hook with recurring auto-create"
```

---

### Task 13: Assemble Track page

**Files:**
- Modify: `app/(app)/track/page.tsx`

**Step 1: Build the full Track page**

```typescript
'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import SectionFilter from '@/components/SectionFilter'
import Modal from '@/components/Modal'
import { Plus } from 'lucide-react'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useMaintenanceItems } from '@/hooks/useMaintenanceItems'
import { useBills } from '@/hooks/useBills'
import SubscriptionCard from '@/components/track/SubscriptionCard'
import SubscriptionForm from '@/components/track/SubscriptionForm'
import MaintenanceCard from '@/components/track/MaintenanceCard'
import MaintenanceForm from '@/components/track/MaintenanceForm'
import BillCard from '@/components/track/BillCard'
import BillForm from '@/components/track/BillForm'
import type { Subscription, MaintenanceItem, Bill } from '@/lib/types'

const SECTIONS = [
  { key: 'subscriptions', label: 'subscriptions' },
  { key: 'maintenance', label: 'maintenance' },
  { key: 'bills', label: 'bills' },
]

export default function TrackPage() {
  const [section, setSection] = useState('subscriptions')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editItem, setEditItem] = useState<Subscription | MaintenanceItem | Bill | null>(null)
  const [saving, setSaving] = useState(false)

  const subs = useSubscriptions()
  const maint = useMaintenanceItems()
  const bills = useBills()

  const openEdit = (item: Subscription | MaintenanceItem | Bill) => {
    setEditItem(item)
    setModal('edit')
  }

  return (
    <>
      <Header title="track" />
      <SectionFilter sections={SECTIONS} active={section} onChange={setSection} />

      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Add button */}
        <button onClick={() => { setEditItem(null); setModal('add') }} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', color: 'var(--accent)',
          fontFamily: 'var(--font-jetbrains)', fontSize: '12px',
          cursor: 'pointer', padding: 0, marginBottom: '8px', alignSelf: 'flex-end',
        }}>
          <Plus size={14} /> add {section.slice(0, -1)}
        </button>

        {/* Subscriptions */}
        {section === 'subscriptions' && (
          subs.loading ? <SkeletonList /> :
          subs.items.length === 0 ? <EmptyState label="no subscriptions yet" /> :
          subs.items.map((item, i) => (
            <SubscriptionCard key={item.id} item={item} index={i} onClick={() => openEdit(item)} />
          ))
        )}

        {/* Maintenance */}
        {section === 'maintenance' && (
          maint.loading ? <SkeletonList /> :
          maint.items.length === 0 ? <EmptyState label="no maintenance items yet" /> :
          maint.items.map((item, i) => (
            <MaintenanceCard
              key={item.id} item={item} index={i}
              onClick={() => openEdit(item)}
              onMarkDone={async () => {
                const today = new Date().toISOString().split('T')[0]
                await maint.update(item.id, { last_completed: today })
              }}
            />
          ))
        )}

        {/* Bills */}
        {section === 'bills' && (
          bills.loading ? <SkeletonList /> :
          bills.items.length === 0 ? <EmptyState label="no bills yet" /> :
          bills.items.map((item, i) => (
            <BillCard
              key={item.id} item={item} index={i}
              onClick={() => openEdit(item)}
              onMarkPaid={() => bills.markPaid(item)}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal
          title={modal === 'add' ? `add ${section.slice(0, -1)}` : 'edit'}
          onClose={() => { setModal(null); setEditItem(null) }}
        >
          {section === 'subscriptions' && (
            <SubscriptionForm
              initial={editItem as Subscription | undefined}
              saving={saving}
              onDelete={editItem ? async () => { await subs.remove(editItem.id); setModal(null) } : undefined}
              onSave={async data => {
                setSaving(true)
                if (editItem) await subs.update(editItem.id, data)
                else await subs.add(data)
                setSaving(false)
                setModal(null)
              }}
            />
          )}
          {section === 'maintenance' && (
            <MaintenanceForm
              initial={editItem as MaintenanceItem | undefined}
              saving={saving}
              onDelete={editItem ? async () => { await maint.remove(editItem.id); setModal(null) } : undefined}
              onSave={async data => {
                setSaving(true)
                if (editItem) await maint.update(editItem.id, data)
                else await maint.add(data)
                setSaving(false)
                setModal(null)
              }}
            />
          )}
          {section === 'bills' && (
            <BillForm
              initial={editItem as Bill | undefined}
              saving={saving}
              onDelete={editItem ? async () => { await bills.remove(editItem.id); setModal(null) } : undefined}
              onSave={async data => {
                setSaving(true)
                if (editItem) await bills.update(editItem.id, data)
                else await bills.add(data)
                setSaving(false)
                setModal(null)
              }}
            />
          )}
        </Modal>
      )}
    </>
  )
}

function SkeletonList() {
  return <>{[0,1,2].map(i => <div key={i} className="skeleton" style={{ height: '72px', borderRadius: 'var(--radius)' }} />)}</>
}

function EmptyState({ label }: { label: string }) {
  return <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px', textAlign: 'center', padding: '32px 0' }}>{label}</p>
}
```

**Step 2: Verify Track tab end-to-end**

```bash
npm run dev
```

- Navigate to /track
- Add a subscription → appears in list
- Edit it → modal pre-fills
- Delete it → removed
- Switch to maintenance → separate list
- Add maintenance item → mark done → next due recalculates
- Switch to bills → add bill → mark paid on recurring bill → new bill auto-created

**Step 3: Commit**

```bash
git add app/\(app\)/track/
git commit -m "feat: complete Track tab with subscriptions, maintenance, and bills"
```

---

## Phase 4: Orders Tab

### Task 14: Orders and Activities

**Files:**
- Create: `hooks/useOrders.ts`
- Create: `hooks/useActivities.ts`
- Create: `components/orders/OrderCard.tsx`
- Create: `components/orders/OrderForm.tsx`
- Create: `components/orders/ActivityCard.tsx`
- Create: `components/orders/ActivityForm.tsx`
- Modify: `app/(app)/orders/page.tsx`

Follow the identical pattern from Phase 3.

**Orders hook (`useOrders.ts`):** CRUD on `orders` table, sorted by `next_delivery_date` ascending.

**OrderCard:** Shows name, type badge (recurring/one-time), next delivery date, countdown, status. Bar: green=delivered, blue=ordered/shipped, yellow=upcoming, gray=recurring.

**OrderForm:** Fields: name, type (recurring/one-time), next_delivery_date, frequency (if recurring), status, notes.

**Activities hook (`useActivities.ts`):** CRUD on `activities` table, join on profiles for person name, sorted by `event_date` ascending.

**ActivityCard:** Shows activity name, person badge (avatar color + initials), event description, event date, paid badge if amount_due set. Bar: red=overdue, yellow=this week, blue=upcoming.

**ActivityForm:** Fields: activity name, person (select from household members), event_description, event_date, amount_due (optional), paid (checkbox if amount set), notes.

**Orders page (`app/(app)/orders/page.tsx`):** Same structure as Track page — SectionFilter with `deliveries` and `activities` sections.

**Commit after each component:**

```bash
git commit -m "feat: add order card, form, and hook"
git commit -m "feat: add activity card, form, and hook"
git commit -m "feat: complete Orders tab"
```

---

## Phase 5: Household Tab

### Task 15: Inventory (shopping list)

**Files:**
- Create: `hooks/useInventory.ts`
- Create: `components/household/InventoryItem.tsx`
- Create: `components/household/InventoryQuickAdd.tsx`

**`useInventory.ts`:** CRUD on `inventory_items`. Extra functions:
- `toggleChecked(id, checked)` — toggle checked state
- `clearChecked()` — delete all where checked=true (unless always_needed, which resets to checked=false)

**`InventoryItem.tsx`:** Checkbox-style row. Checked items have strikethrough text and reduced opacity. Tap checkbox = toggle. Tap text = open edit modal. Category label on right.

**`InventoryQuickAdd.tsx`:** Inline text input at top of list. Enter key adds item with default category 'grocery'. Small and unobtrusive.

**Sorting:** Unchecked items first (by category), then checked items at bottom.

**Commit:**

```bash
git commit -m "feat: add inventory shopping list with quick-add"
```

---

### Task 16: Documents

**Files:**
- Create: `hooks/useDocuments.ts`
- Create: `components/household/DocumentCard.tsx`
- Create: `components/household/DocumentForm.tsx`

**`useDocuments.ts`:** CRUD on `documents`, sorted by expiry_date ascending nulls last.

**`DocumentCard.tsx`:** Shows name, type badge, associated item, expiry date. If link present, show external link icon. Bar: red=expired, yellow=expiring <60 days, green=valid, gray=no expiry.

**`DocumentForm.tsx`:** Fields: name, type, associated_item, expiry_date, link, notes.

**Commit:**

```bash
git commit -m "feat: add documents card, form, and hook"
```

---

### Task 17: Assemble Household page

**Files:**
- Modify: `app/(app)/household/page.tsx`

Same assembly pattern as Track page. Two sections: `inventory` and `documents`.

Inventory section renders `InventoryQuickAdd` at top, then the sorted item list. "Clear checked" button appears when any items are checked.

**Commit:**

```bash
git commit -m "feat: complete Household tab with inventory and documents"
```

---

## Phase 6: Dashboard & Settings

### Task 18: Home dashboard

**Files:**
- Modify: `app/(app)/home/page.tsx`
- Create: `components/home/AlertStrip.tsx`
- Create: `components/home/StatCard.tsx`

The dashboard aggregates data across all categories and surfaces urgency.

**Step 1: Aggregate overdue/upcoming items**

In `home/page.tsx`, load all hooks in parallel: `useSubscriptions`, `useMaintenanceItems`, `useBills`, `useOrders`, `useActivities`.

Derive three lists:
- `overdue` — any item where days < 0 (and not paid/delivered)
- `thisWeek` — any item where 0 ≤ days ≤ 7
- `recentlyDone` — bills paid in last 7 days, maintenance completed in last 7 days

**Step 2: Create `components/home/AlertStrip.tsx`**

A collapsible section with a red/yellow/green header bar showing count.

```typescript
interface AlertStripProps {
  label: string
  count: number
  color: string
  children: React.ReactNode
}
```

Header: "# 3 overdue" in monospace, colored, with chevron for expand/collapse.

**Step 3: Create `components/home/StatCard.tsx`**

```typescript
interface StatCardProps {
  label: string
  value: number | string
  color?: string
}
```

Small card with large monospace number and label below. Used in a 2-column grid at top of home page showing: subscriptions count, maintenance overdue, bills unpaid, deliveries this week.

**Step 4: Assemble `home/page.tsx`**

```
Header "household ops"
↓ 2x2 stat grid
↓ AlertStrip: overdue (red)
↓ AlertStrip: due this week (yellow)
↓ AlertStrip: recently completed (green, collapsed by default)
```

Each AlertStrip renders simplified item rows (not full cards — just name + type + date/days).

**Commit:**

```bash
git add app/\(app\)/home/ components/home/
git commit -m "feat: add home dashboard with overdue alerts and stats"
```

---

### Task 19: Settings page

**Files:**
- Modify: `app/(app)/settings/page.tsx`
- Create: `components/settings/MemberList.tsx`
- Create: `components/settings/InviteModal.tsx`

**Step 1: `MemberList.tsx`**

Load all profiles with same `household_id`. Display each as a row: avatar circle (color + initials) + display name + role badge. Admin sees a "change role" toggle on non-admin members.

**Step 2: `InviteModal.tsx`**

Admin-only. Form: optional email field. On submit: insert invite row, display the generated invite URL (`/join/[token]`). Show copyable link.

**Step 3: Assemble `settings/page.tsx`**

Three sections:
1. **household members** — MemberList + "invite member" button (admin only)
2. **ticket system** — card with description + link to kin.chasefrazier.dev
3. **account** — display name edit, sign out button

Ticket card example:
```typescript
<a href="https://kin.chasefrazier.dev" target="_blank" rel="noopener" style={{
  display: 'block',
  background: 'var(--card)',
  border: '1px solid var(--accent-border)',
  borderRadius: 'var(--radius)',
  padding: '14px',
  textDecoration: 'none',
}}>
  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px', color: 'var(--accent)', marginBottom: '4px' }}>
    need help? submit a ticket →
  </p>
  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '12px', color: 'var(--text-3)' }}>
    Chase can help with household issues via kin
  </p>
</a>
```

Sign out:
```typescript
const { signOut } = useSession()
// button with color var(--red), calls signOut()
```

**Commit:**

```bash
git add app/\(app\)/settings/ components/settings/
git commit -m "feat: add settings page with members, invite, and ticket link"
```

---

## Phase 7: Polish & Deploy

### Task 20: Error boundaries and loading states

**Files:**
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`
- Audit all pages for missing loading/empty states

Add minimal error boundary and 404 pages matching the dark theme. Review every page for:
- Skeleton loading while data fetches
- Empty state message when no items
- Error toast on failed operations

**Commit:**

```bash
git commit -m "feat: add error boundary and 404 page"
```

---

### Task 21: Final verification and deploy

**Step 1: Full app walkthrough**

Test every feature end-to-end:
- [ ] Register → create household → land on /home
- [ ] Invite second member → join via link
- [ ] Add subscription, maintenance item, bill in /track
- [ ] Mark maintenance done → next due recalculates
- [ ] Mark bill paid (recurring) → new bill created
- [ ] Add order, activity in /orders
- [ ] Add inventory items → check off → clear checked
- [ ] Add document → external link works
- [ ] Home dashboard shows overdue/upcoming items
- [ ] Settings shows members, invite link generates, ticket link opens

**Step 2: Build check**

```bash
npm run build
```

Expected: No TypeScript or build errors.

**Step 3: Deploy**

Deploy to the same server as kin. Set environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the new Supabase project.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: production-ready household ops app"
```
