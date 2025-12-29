-- Rename 'price' to 'selling_price' to match your preferred naming
alter table public.products rename column price to selling_price;

-- Add the new columns requested
alter table public.products
add column if not exists sku text,
add column if not exists barcode text,
add column if not exists cost_price numeric,
add column if not exists stock_quantity integer default 0,
add column if not exists min_stock integer default 5;

-- Note: 'Name' is already 'name'.
-- Note: 'Category' is currently 'category_id' (Foreign Key). 
-- If you want to denormalize and just store text, uncomment below, but using ID is better for relations.
-- alter table public.products add column if not exists category text; 
