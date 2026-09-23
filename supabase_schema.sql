-- ==============================================================================
-- GMC MARKETPLACE SUPABASE SCHEMA (WITHOUT RLS)
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
  category TEXT,
  description TEXT,
  logo TEXT,
  "coverImage" TEXT,
  "createdAt" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure seller columns exist if table was created previously
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS "createdAt" TEXT;

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

-- Remove previous RLS policies if any existed
DROP POLICY IF EXISTS "Allow public read access on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public write access on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public write access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public write access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access on sellers" ON public.sellers;
DROP POLICY IF EXISTS "Allow public write access on sellers" ON public.sellers;
DROP POLICY IF EXISTS "Allow public read access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public write access on orders" ON public.orders;

-- Disable Row Level Security on all tables for full, direct access
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
