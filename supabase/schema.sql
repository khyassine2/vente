-- Fil & Ligne — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent where Postgres allows it.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  details text[] not null default '{}',
  fabric text not null default '',
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  is_new boolean not null default false,
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- product_variants — one row per size/colour combination, with real stock
-- ---------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  color_name text not null,
  color_hex text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx
  on public.product_variants (product_id);

-- ---------------------------------------------------------------------------
-- product_images — ordered gallery, first row (sort_order = 0) is the cover
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx
  on public.product_images (product_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — public read, writes restricted to service_role
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read product_variants" on public.product_variants;
create policy "Public read product_variants"
  on public.product_variants for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read product_images" on public.product_images;
create policy "Public read product_images"
  on public.product_images for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies are defined for anon/authenticated, so
-- those operations are rejected for them by default with RLS enabled.
-- The service_role key bypasses RLS entirely and is used for all admin writes.

-- ---------------------------------------------------------------------------
-- Storage bucket for product photography, public read
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product-images bucket" on storage.objects;
create policy "Public read product-images bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Uploads/deletes to this bucket are performed by the admin app using the
-- service_role key, which bypasses storage RLS as well.
