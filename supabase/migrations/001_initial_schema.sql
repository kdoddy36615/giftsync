-- GiftWise Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Gift Lists (people you're shopping for)
create table gift_lists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gift Items
create table gift_items (
  id uuid default uuid_generate_v4() primary key,
  list_id uuid references gift_lists(id) on delete cascade not null,
  name text not null,
  status text check (status in ('required', 'optional')) default 'optional',
  priority boolean default false,
  price_low decimal(10,2),
  price_high decimal(10,2),
  notes text,
  value_tag text,
  product_images text[] default '{}',
  research_content text,
  sort_order integer default 0,
  is_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Retailer Links
create table retailer_links (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references gift_items(id) on delete cascade not null,
  store_name text not null,
  url text not null,
  price decimal(10,2),
  is_best_price boolean default false,
  is_highend boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table gift_lists enable row level security;
alter table gift_items enable row level security;
alter table retailer_links enable row level security;

-- Policies: Users can only access their own data
create policy "Users can view own gift lists"
  on gift_lists for select
  using (auth.uid() = user_id);

create policy "Users can create own gift lists"
  on gift_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own gift lists"
  on gift_lists for update
  using (auth.uid() = user_id);

create policy "Users can delete own gift lists"
  on gift_lists for delete
  using (auth.uid() = user_id);

-- Gift items policies (via list ownership)
create policy "Users can view own gift items"
  on gift_items for select
  using (list_id in (select id from gift_lists where user_id = auth.uid()));

create policy "Users can create gift items in own lists"
  on gift_items for insert
  with check (list_id in (select id from gift_lists where user_id = auth.uid()));

create policy "Users can update own gift items"
  on gift_items for update
  using (list_id in (select id from gift_lists where user_id = auth.uid()));

create policy "Users can delete own gift items"
  on gift_items for delete
  using (list_id in (select id from gift_lists where user_id = auth.uid()));

-- Retailer links policies (via item -> list ownership)
create policy "Users can view own retailer links"
  on retailer_links for select
  using (item_id in (
    select gi.id from gift_items gi
    join gift_lists gl on gi.list_id = gl.id
    where gl.user_id = auth.uid()
  ));

create policy "Users can create retailer links for own items"
  on retailer_links for insert
  with check (item_id in (
    select gi.id from gift_items gi
    join gift_lists gl on gi.list_id = gl.id
    where gl.user_id = auth.uid()
  ));

create policy "Users can update own retailer links"
  on retailer_links for update
  using (item_id in (
    select gi.id from gift_items gi
    join gift_lists gl on gi.list_id = gl.id
    where gl.user_id = auth.uid()
  ));

create policy "Users can delete own retailer links"
  on retailer_links for delete
  using (item_id in (
    select gi.id from gift_items gi
    join gift_lists gl on gi.list_id = gl.id
    where gl.user_id = auth.uid()
  ));

-- Indexes for performance
create index gift_lists_user_id_idx on gift_lists(user_id);
create index gift_items_list_id_idx on gift_items(list_id);
create index retailer_links_item_id_idx on retailer_links(item_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gift_lists_updated_at
  before update on gift_lists
  for each row execute function update_updated_at();

create trigger gift_items_updated_at
  before update on gift_items
  for each row execute function update_updated_at();
