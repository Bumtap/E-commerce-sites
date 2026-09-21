-- ==============================================================================
-- GMC MARKETPLACE SUPABASE SCHEMA INITIALIZATION
-- Run this script in your Supabase Project: SQL Editor -> New Query -> Run
-- Project: GMC marketplace (gcrshkpaxiytbmifqujo)
-- ==============================================================================

-- 1. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  tagline TEXT,
  description TEXT,
  logo TEXT,
  "coverImage" TEXT,
  category TEXT,
  location TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  "openingHours" TEXT,
  rating NUMERIC DEFAULT 5,
  "reviewCount" INT DEFAULT 0,
  "productCount" INT DEFAULT 0,
  "isVerified" BOOLEAN DEFAULT true,
  "joinedDate" TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  "iconName" TEXT,
  image TEXT,
  "itemCount" INT DEFAULT 0,
  featured BOOLEAN DEFAULT true,
  "order" INT DEFAULT 1,
  "isActive" BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  "shortDescription" TEXT,
  category TEXT,
  "categoryId" TEXT,
  "subCategory" TEXT,
  "sellerId" TEXT,
  "sellerName" TEXT,
  "sellerVerified" BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  price NUMERIC NOT NULL,
  "salePrice" NUMERIC,
  "discountPercentage" NUMERIC,
  stock INT DEFAULT 10,
  "lowStockThreshold" INT DEFAULT 5,
  unit TEXT DEFAULT 'piece',
  weight TEXT,
  origin TEXT,
  "isOrganic" BOOLEAN DEFAULT false,
  "isMadeInBhutan" BOOLEAN DEFAULT true,
  "isGmcExclusive" BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5,
  "reviewCount" INT DEFAULT 0,
  variants JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  attributes JSONB DEFAULT '{}'::jsonb,
  "isFeatured" BOOLEAN DEFAULT false,
  "isBestSeller" BOOLEAN DEFAULT false,
  "isNewArrival" BOOLEAN DEFAULT false,
  "isFlashDeal" BOOLEAN DEFAULT false,
  "flashDealEndsAt" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SELLERS TABLE
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT,
  "storeId" TEXT NOT NULL,
  "storeName" TEXT NOT NULL,
  "ownerName" TEXT,
  phone TEXT,
  location TEXT,
  "joinedDate" TEXT,
  "isVerified" BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT NOT NULL,
  "customerId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "customerPhone" TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  "deliveryFee" NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  "grandTotal" NUMERIC NOT NULL,
  "couponCode" TEXT,
  "deliveryAddress" JSONB,
  "deliveryMethod" TEXT,
  "paymentMethod" TEXT,
  "paymentStatus" TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'confirmed',
  "statusHistory" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TEXT,
  "estimatedDelivery" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and public read/write access policies for client applet
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public write access on stores" ON public.stores FOR ALL USING (true);

CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public write access on categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write access on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read access on sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Allow public write access on sellers" ON public.sellers FOR ALL USING (true);

CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access on orders" ON public.orders FOR ALL USING (true);

-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.stores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sellers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
