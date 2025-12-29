-- 1. Create a secure function to check admin status (bypasses RLS)
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

-- 2. Drop the recursive policies on PROFILES
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins can update all profiles" on profiles;

-- 3. Re-create them using the secure function
create policy "Admins can view all profiles"
  on profiles for select
  using ( is_admin() );

create policy "Admins can update all profiles"
  on profiles for update
  using ( is_admin() );

-- 4. Update PRODUCTS policies to use the function (safer)
drop policy if exists "Admins can management products" on products;
create policy "Admins can manage products"
  on products for all
  using ( is_admin() );

-- 5. Update CATEGORIES policies
drop policy if exists "Admins can insert categories" on categories;
drop policy if exists "Admins can update categories" on categories;
drop policy if exists "Admins can delete categories" on categories;

create policy "Admins can insert categories" on categories for insert with check ( is_admin() );
create policy "Admins can update categories" on categories for update using ( is_admin() );
create policy "Admins can delete categories" on categories for delete using ( is_admin() );

-- 6. Update VARIANTS policies
drop policy if exists "Admins can manage variants" on product_variants;
create policy "Admins can manage variants" on product_variants for all using ( is_admin() );

-- 7. Update ORDERS policies
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;

create policy "Admins can view all orders" on orders for select using ( is_admin() );
create policy "Admins can update orders" on orders for update using ( is_admin() );

-- 8. Update ORDER ITEMS policies
drop policy if exists "Admins can view all order items" on order_items;
create policy "Admins can view all order items" on order_items for select using ( is_admin() );
