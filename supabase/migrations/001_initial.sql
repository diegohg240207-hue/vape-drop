-- ============================================================
--  VAPE DROP — Initial Schema
--  Run in: Supabase > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- 1. products
-- ──────────────────────────────────────────────────────────────
create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text        not null,
  brand      text        not null default '',
  flavor     text        not null default '',
  puffs      integer     not null default 0,
  price      numeric(10,2) not null default 0,
  stock      integer     not null default 0,
  image_url  text        not null default '',
  category   text        not null default '',
  active     boolean     not null default true
);

-- ──────────────────────────────────────────────────────────────
-- 2. orders
-- ──────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  status           text        not null default 'pending'
                   check (status in ('pending','processing','shipped','delivered','cancelled')),
  total            numeric(10,2) not null default 0,
  customer_name    text        not null,
  customer_email   text        not null,
  customer_phone   text        not null default '',
  customer_address text        not null default ''
);

-- ──────────────────────────────────────────────────────────────
-- 3. order_items
-- ──────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id)   on delete cascade,
  product_id uuid not null references public.products(id) on delete set null,
  quantity   integer       not null default 1,
  unit_price numeric(10,2) not null default 0
);

-- ──────────────────────────────────────────────────────────────
-- 4. Indexes
-- ──────────────────────────────────────────────────────────────
create index if not exists idx_products_active   on public.products(active);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brand    on public.products(brand);
create index if not exists idx_orders_status     on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ──────────────────────────────────────────────────────────────
-- 5. RLS (Row Level Security)
-- ──────────────────────────────────────────────────────────────
alter table public.products   enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;

-- Products: anyone can read active products
create policy "public read active products"
  on public.products for select
  using (active = true);

-- Products: authenticated users (admin) can do everything
create policy "admin full access products"
  on public.products for all
  using     (auth.role() = 'authenticated')
  with check(auth.role() = 'authenticated');

-- Orders: anyone can insert (place order)
create policy "public insert orders"
  on public.orders for insert
  with check (true);

-- Orders: authenticated users can read/update all
create policy "admin read orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

create policy "admin update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');

-- Order items: anyone can insert
create policy "public insert order_items"
  on public.order_items for insert
  with check (true);

-- Order items: authenticated users can read all
create policy "admin read order_items"
  on public.order_items for select
  using (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────
-- 6. Sample seed data (optional — comment out if not needed)
-- ──────────────────────────────────────────────────────────────
insert into public.products (name, brand, flavor, puffs, price, stock, category, active) values
  ('Elf Bar BC5000 Mango',        'Elf Bar',   'Mango',           5000,  8500, 20, 'Frutas',  true),
  ('Lost Mary OS5000 Watermelon', 'Lost Mary', 'Sandia',          5000,  9200, 15, 'Frutas',  true),
  ('Vozol Star 9000 Blueberry',   'Vozol',     'Arandanos',       9000, 11500, 10, 'Frutas',  true),
  ('Elf Bar T600 Mint',           'Elf Bar',   'Menta',            600,  4900, 30, 'Menta',   true),
  ('HQD Cuvie Mars Lychee',       'HQD',       'Lichi',           4000,  7800, 12, 'Frutas',  true),
  ('Puff Bar Plus Grape',         'Puff Bar',  'Uva',              800,  4500, 25, 'Frutas',  true),
  ('Smok Novo Bar G15 Cola',      'Smok',      'Coca-Cola',      15000, 18900,  8, 'Bebidas', true),
  ('Geek Bar Pulse Passion Fruit','Geek Bar',  'Maracuya',        9000, 12500,  5, 'Frutas',  true)
on conflict do nothing;
