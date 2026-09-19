export type UserRole = 'customer' | 'seller' | 'admin' | 'superAdmin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  storeId?: string; // If seller
  createdAt: string;
  savedAddresses: Address[];
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office in GMC Tech Park"
  recipientName: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  dzongkhag: string;
  postalCode?: string;
  isDefault: boolean;
  deliveryNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  order: number;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "500g", "1kg", "Size M", "Navy Blue"
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  categoryId: string;
  subCategory?: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  images: string[];
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  stock: number;
  lowStockThreshold: number;
  unit: string; // e.g. "kg", "piece", "pack", "bottle"
  weight?: string;
  origin: string; // e.g. "GMC Organic Zone", "Punakha Valley", "Bumthang"
  isOrganic?: boolean;
  isMadeInBhutan?: boolean;
  isGmcExclusive?: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  attributes?: Record<string, string>;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashDeal?: boolean;
  flashDealEndsAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified: boolean;
  joinedDate: string;
  status: 'pending' | 'approved' | 'suspended';
}

export interface CartItem {
  id: string; // unique item id (productId + variantId)
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. GMC-2026-4921
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  grandTotal: number;
  couponCode?: string;
  deliveryAddress: Address;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: 'cod' | 'bhutan_qr' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  backgroundColor?: string;
  badgeText?: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  freeDeliveryThreshold: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceNote: string;
  timestamp: string;
}

export interface SellerAccount {
  id: string;
  email: string;
  password?: string;
  storeId: string;
  storeName: string;
  ownerName: string;
  phone: string;
  location: string;
  category: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  createdAt: string;
  isVerified: boolean;
}
