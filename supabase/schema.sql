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
alter table households        enable row level security;
alter table profiles          enable row level security;
alter table invites           enable row level security;
alter table subscriptions     enable row level security;
alter table maintenance_items enable row level security;
alter table bills             enable row level security;
alter table orders            enable row level security;
alter table activities        enable row level security;
alter table inventory_items   enable row level security;
alter table documents         enable row level security;

-- RLS Policies
create policy "household members" on households
  for all using (id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on profiles
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on subscriptions
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on maintenance_items
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on bills
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on orders
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on activities
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on inventory_items
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "household members" on documents
  for all using (household_id in (select household_id from profiles where id = auth.uid()));

create policy "invite by token" on invites
  for select using (true);

create policy "admin manage invites" on invites
  for insert using (
    household_id in (
      select household_id from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-update updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_subscriptions_updated_at
  before update on subscriptions for each row execute function update_updated_at();

create trigger update_maintenance_updated_at
  before update on maintenance_items for each row execute function update_updated_at();

create trigger update_bills_updated_at
  before update on bills for each row execute function update_updated_at();

create trigger update_orders_updated_at
  before update on orders for each row execute function update_updated_at();

create trigger update_activities_updated_at
  before update on activities for each row execute function update_updated_at();

create trigger update_inventory_updated_at
  before update on inventory_items for each row execute function update_updated_at();

create trigger update_documents_updated_at
  before update on documents for each row execute function update_updated_at();
