# Household Ops — Design Document
*2026-02-19*

## Overview

A mobile-focused household management web app for a family, managed by the household ops person. Tracks subscriptions, recurring maintenance, bills, orders/deliveries, school & activities, household inventory, and documents. Integrates with the existing Kin ticket system at kin.chasefrazier.dev.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom CSS variables (Catppuccin Mocha theme, matching Kin)
- **Fonts:** JetBrains Mono (system/label text) + Outfit (body text)
- **Backend:** Supabase (separate project from Kin) — PostgreSQL + Auth + Storage
- **Auth:** Supabase Auth — email/password + Google OAuth
- **Deployment:** Same server as Kin

## Design Language

Mirrors the Kin project closely:
- Catppuccin Mocha dark color palette (CSS variables: `--bg`, `--surface`, `--card`, `--accent`, etc.)
- JetBrains Mono for headers, labels, metadata, numbers
- Outfit for body text, descriptions, card titles
- Full-width mobile layout (no hard max-width cap), 24px side padding, max ~640px centered on larger screens
- Safe area insets for notched devices
- Left-bar color coding on cards (red/yellow/green/blue/gray) for status at a glance
- Minimal interactive states: text color change, border highlight, no heavy shadows
- Staggered fade-in animations on list items
- Bottom navigation with monospace labels, accent underline on active tab

## Authentication & Users

- Supabase Auth with email/password and Google OAuth
- First user to sign up is admin; subsequent users are members
- Invite system: admin sends invite link/email to add household members
- All data scoped to a `household_id`
- Users have a display name, avatar color (auto-assigned from palette), and role (admin/member)

## Navigation Structure

Five-tab bottom navigation:

| Tab | Label | Contents |
|-----|-------|----------|
| 1 | home | Dashboard — alert feed, upcoming items, quick stats |
| 2 | track | Subscriptions, Maintenance, Bills |
| 3 | orders | Deliveries & Orders, School & Activities |
| 4 | household | Inventory/Shopping List, Documents |
| 5 | settings | Users, Ticket link, Account |

Sticky top header with page title. Sticky filter row within Track, Orders, and Household tabs for jumping between sub-sections.

## Section Designs

### Home (Dashboard)

- **Overdue strip:** red-highlighted items across all categories that are past due/unpaid
- **Due this week:** yellow strip — items due in the next 7 days
- **Recently completed:** green — last few marked-done items
- **Quick stat cards:** counts per category (e.g. "3 bills unpaid", "2 maintenance overdue")

### Track Tab

Sub-sections: Subscriptions | Maintenance | Bills

**Subscriptions**
- Fields: name, category (streaming/meal kit/utility/other), cost, billing cycle (monthly/yearly/quarterly/etc.), next renewal date, auto-renews toggle, notes
- Card displays: name, cost/cycle, next renewal date, days until renewal, auto-renew badge
- Left bar: green = active & fine, yellow = renewing within 7 days, red = overdue/lapsed

**Maintenance**
- Fields: name, category (home/vehicle/health/other), interval (days), last completed date, notes
- Next due = last completed + interval (calculated, not stored)
- Card displays: name, interval label, last completed, next due, days remaining/overdue
- "Mark Done" button sets last_completed = today, recalculates next due
- Left bar: green = >14 days out, yellow = within 14 days, red = overdue

**Bills**
- Fields: name, amount, due date, recurring toggle, notes
- Recurring bills: marking paid auto-creates next month's bill
- Card displays: name, amount, due date, paid/unpaid badge
- One-tap "Mark Paid" with optional paid date capture
- Left bar: red = overdue & unpaid, yellow = due within 7 days & unpaid, green = paid, gray = future

### Orders Tab

Sub-sections: Deliveries & Orders | School & Activities

**Deliveries & Orders**
- Fields: name/service, type (recurring/one-time), next delivery date, frequency (weekly/biweekly/monthly — if recurring), notes/tracking info
- Card displays: name, type badge, next delivery date, countdown, status (ordered/shipped/delivered/recurring)
- Left bar: green = delivered, blue = ordered/in transit, yellow = upcoming, gray = recurring steady state

**School & Activities**
- Fields: activity name, person (which family member), event description, date, amount due (optional), notes
- Card displays: activity, person badge, event, date, paid/unpaid if amount set
- Left bar: red = overdue, yellow = this week, blue = upcoming

### Household Tab

Sub-sections: Inventory | Documents

**Inventory / Shopping List**
- Quick inline add (type + enter)
- Fields: name, quantity, category (grocery/household/personal/other), always-needed toggle, notes
- Checked off = picked up → fades, moves to bottom
- "Clear Checked" removes picked-up items
- Always-needed items auto-uncheck on a set interval
- Sort by category or date added

**Documents**
- Fields: name, type (warranty/manual/insurance/lease/other), associated item (e.g. "Samsung Washer"), expiry date (optional), link (URL to Google Drive/etc.), notes
- No file storage — link-based only
- Card displays: name, type badge, associated item, expiry date
- Left bar: red = expired, yellow = expiring within 60 days, green = valid, gray = no expiry

### Settings Tab

**Household Members**
- List of users with avatar initial, display name, role badge (admin/member)
- Admin can invite new members via invite link
- Admin can change member roles

**Ticket System**
- Prominent card: "Need help? Submit a ticket" linking to kin.chasefrazier.dev
- Opens in new tab

**Account**
- Display name, email, change password, Google OAuth link/unlink, sign out

## Database Schema (Supabase)

```
households
  id, name, created_at

users (extends Supabase auth.users)
  id, household_id, display_name, role (admin/member), avatar_color, created_at

subscriptions
  id, household_id, created_by, name, category, cost, billing_cycle,
  next_renewal_date, auto_renews, notes, created_at, updated_at

maintenance_items
  id, household_id, created_by, name, category, interval_days,
  last_completed, notes, created_at, updated_at

bills
  id, household_id, created_by, name, amount, due_date, paid,
  paid_date, recurring, notes, created_at, updated_at

orders
  id, household_id, created_by, name, type (recurring/one-time),
  next_delivery_date, frequency, status, notes, created_at, updated_at

activities
  id, household_id, person_id, name, event_description, event_date,
  amount_due, paid, notes, created_at, updated_at

inventory_items
  id, household_id, created_by, name, quantity, category,
  always_needed, checked, notes, created_at, updated_at

documents
  id, household_id, created_by, name, type, associated_item,
  expiry_date, link, notes, created_at, updated_at
```

## Key UX Patterns

- **Left-bar color coding** universally signals urgency/status across all card types
- **Mark Done / Mark Paid** are one-tap primary actions, always visible on cards
- **Auto-calculation** of next due dates happens client-side from stored intervals
- **Overdue alerts** surface on Home dashboard across all categories
- **Invite flow** for adding household members (no self-signup)
- **No file uploads** — documents are link + metadata only (keeps infra simple)
- **Stretch: push notifications** for overdue items (v2)
