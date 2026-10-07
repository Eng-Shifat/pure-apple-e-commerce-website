# Pure Apple — Setup Guide

## 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

## 2. Supabase Database Schema
Run this SQL in your Supabase SQL Editor:

```sql
-- Products
create table products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  variant       text,
  price         numeric not null,
  original_price numeric,
  rating        numeric default 0,
  review_count  integer default 0,
  image         text not null,
  slug          text unique not null,
  badge         text,
  badge_color   text,
  spec_screen   text,
  spec_ram      text,
  spec_camera   text,
  is_featured   boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Cart items (for logged-in users)
create table cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  product_id  uuid references products(id) on delete cascade,
  quantity    integer not null default 1,
  created_at  timestamptz default now(),
  unique(user_id, product_id)
);

-- Orders
create table orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  status           text default 'pending',
  total            numeric not null,
  shipping_name    text not null,
  shipping_phone   text not null,
  shipping_address text not null,
  shipping_city    text not null,
  payment_method   text default 'cod',
  note             text,
  created_at       timestamptz default now()
);

-- Order items
create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  quantity    integer not null,
  price       numeric not null
);

-- RLS Policies
alter table products   enable row level security;
alter table cart_items enable row level security;
alter table orders     enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read
create policy "Public read products" on products for select using (true);
create policy "Admin insert products" on products for insert with check (auth.jwt()->'user_metadata'->>'role' = 'admin');
create policy "Admin update products" on products for update using (auth.jwt()->'user_metadata'->>'role' = 'admin');
create policy "Admin delete products" on products for delete using (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Cart: users own their rows
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Orders: users see own orders
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Anyone create order" on orders for insert with check (true);
create policy "Admin update orders" on orders for update using (auth.jwt()->'user_metadata'->>'role' = 'admin');

create policy "Users see own order items" on order_items for select
  using (order_id in (select id from orders where user_id = auth.uid()));
create policy "Anyone insert order items" on order_items for insert with check (true);
```

## 3. Make a user Admin
In Supabase Dashboard → Authentication → Users → click user → User Metadata:
```json
{ "role": "admin" }
```

## 4. Install & Run
```bash
npm install
npm run dev
```
