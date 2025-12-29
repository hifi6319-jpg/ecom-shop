-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Helper Function for Admin Check (Prevents Infinite Recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 3. PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );
-- Admin policies using secure function
create policy "Admins can view all profiles" on profiles for select using ( is_admin() );
create policy "Admins can update all profiles" on profiles for update using ( is_admin() );

-- Trigger for new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone." on categories for select using ( true );
create policy "Admins can insert categories" on categories for insert with check ( is_admin() );
create policy "Admins can update categories" on categories for update using ( is_admin() );
create policy "Admins can delete categories" on categories for delete using ( is_admin() );

-- 5. PRODUCTS (Updated with new columns)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  selling_price numeric not null, -- Renamed from price
  cost_price numeric,             -- New
  sku text,                       -- New
  barcode text,                   -- New
  category_id uuid references public.categories(id),
  image_url text, 
  images text[], 
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone." on products for select using ( true );
create policy "Admins can manage products" on products for all using ( is_admin() );

-- 6. PRODUCT VARIANTS (Updated with stock fields)
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  size text not null, 
  color text not null,
  stock integer default 0,      
  min_stock integer default 5,   -- New
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.product_variants enable row level security;

create policy "Variants are viewable by everyone." on product_variants for select using ( true );
create policy "Admins can manage variants" on product_variants for all using ( is_admin() );

-- 7. CART
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  variant_id uuid references public.product_variants(id) not null,
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, variant_id)
);

alter table public.cart_items enable row level security;

create policy "Users can view own cart items" on cart_items for select using ( auth.uid() = user_id );
create policy "Users can insert own cart items" on cart_items for insert with check ( auth.uid() = user_id );
create policy "Users can update own cart items" on cart_items for update using ( auth.uid() = user_id );
create policy "Users can delete own cart items" on cart_items for delete using ( auth.uid() = user_id );

-- 8. ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, 
  customer_name text, 
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Users can view own orders" on orders for select using ( auth.uid() = user_id );
create policy "Admins can view all orders" on orders for select using ( is_admin() );
create policy "Admins can update orders" on orders for update using ( is_admin() );
create policy "Users can create orders" on orders for insert with check ( auth.uid() = user_id );

-- 9. ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id),
  product_name text,
  size text,
  color text,
  quantity integer not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.order_items enable row level security;

create policy "Users can view own order items via order" on order_items for select using ( exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() ) );
create policy "Admins can view all order items" on order_items for select using ( is_admin() );
create policy "Users can insert order items" on order_items for insert with check ( exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() ) );

-- 10. INVOICES
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.invoices enable row level security;

create policy "Users can view own invoices" on invoices for select using ( exists ( select 1 from orders where orders.id = invoices.order_id and orders.user_id = auth.uid() ) );
create policy "Admins can manage invoices" on invoices for all using ( is_admin() );
