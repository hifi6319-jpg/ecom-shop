-- ==========================================
-- 1. FIX RLS INFINITE RECURSION
-- ==========================================

-- Create secure function
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

-- Drop recursive policies and re-create safe ones
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins can update all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using ( is_admin() );
create policy "Admins can update all profiles" on profiles for update using ( is_admin() );

drop policy if exists "Admins can management products" on products;
drop policy if exists "Admins can manage products" on products;
create policy "Admins can manage products" on products for all using ( is_admin() );

drop policy if exists "Admins can insert categories" on categories;
drop policy if exists "Admins can update categories" on categories;
drop policy if exists "Admins can delete categories" on categories;
create policy "Admins can insert categories" on categories for insert with check ( is_admin() );
create policy "Admins can update categories" on categories for update using ( is_admin() );
create policy "Admins can delete categories" on categories for delete using ( is_admin() );

drop policy if exists "Admins can manage variants" on product_variants;
create policy "Admins can manage variants" on product_variants for all using ( is_admin() );

drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;
create policy "Admins can view all orders" on orders for select using ( is_admin() );
create policy "Admins can update orders" on orders for update using ( is_admin() );

drop policy if exists "Admins can view all order items" on order_items;
create policy "Admins can view all order items" on order_items for select using ( is_admin() );

drop policy if exists "Admins can manage invoices" on invoices;
create policy "Admins can manage invoices" on invoices for all using ( is_admin() );


-- ==========================================
-- 2. UPDATE TABLE STRUCTURE (Columns)
-- ==========================================

-- Products Table
do $$
begin
  if exists(select * from information_schema.columns where table_name = 'products' and column_name = 'price') then
    alter table public.products rename column price to selling_price;
  end if;
end $$;

alter table public.products add column if not exists sku text;
alter table public.products add column if not exists barcode text;
alter table public.products add column if not exists cost_price numeric;
alter table public.products add column if not exists selling_price numeric; -- access safety if rename happened or didn't exist
alter table public.products add column if not exists stock_quantity integer default 0;
alter table public.products add column if not exists min_stock integer default 5;

-- Product Variants
alter table public.product_variants add column if not exists min_stock integer default 5;
