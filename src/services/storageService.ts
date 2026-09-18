import {
  Product,
  Category,
  Store,
  Order,
  CartItem,
  Review,
  Coupon,
  Banner,
  DeliveryZone,
  InventoryTransaction,
  UserProfile,
  Address,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_STORES,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_REVIEWS
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'gmc_products_v1',
  CATEGORIES: 'gmc_categories_v1',
  STORES: 'gmc_stores_v1',
  ORDERS: 'gmc_orders_v1',
  CART: 'gmc_cart_v1',
  WISHLIST: 'gmc_wishlist_v1',
  REVIEWS: 'gmc_reviews_v1',
  COUPONS: 'gmc_coupons_v1',
  BANNERS: 'gmc_banners_v1',
  DELIVERY_ZONES: 'gmc_delivery_zones_v1',
  INVENTORY_LOGS: 'gmc_inventory_logs_v1',
  USER_PROFILE: 'gmc_user_profile_v1',
  ANNOUNCEMENT: 'gmc_announcement_v1',
  THEME: 'gmc_theme_mode',
};

// Default current user
export const DEFAULT_USER: UserProfile = {
  id: 'usr-gmc-demo',
  email: 'infotshongla@gmail.com',
  displayName: 'Tshongla Member',
  phone: '+975 17 889 900',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00Z',
  savedAddresses: [
    {
      id: 'addr-1',
      title: 'Residence',
      recipientName: 'Tshongla Member',
      phone: '+975 17 889 900',
      street: 'Near GMC Mindfulness Tower, Building 4B',
      area: 'Lotus Sector',
      city: 'Gelephu',
      dzongkhag: 'Sarpang',
      postalCode: '31101',
      isDefault: true,
      deliveryNotes: 'Please ring bell and leave with reception if absent',
    },
    {
      id: 'addr-2',
      title: 'GMC Innovation Office',
      recipientName: 'Tshongla Member',
      phone: '+975 17 889 900',
      street: 'Tech Hub Boulevard, Floor 3',
      area: 'GMC Tech Park',
      city: 'Gelephu',
      dzongkhag: 'Sarpang',
      postalCode: '31102',
      isDefault: false,
    },
  ],
};

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error', e);
    }
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.get<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  deleteProduct(productId: string): void {
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.set(STORAGE_KEYS.PRODUCTS, products);
  }

  // --- Categories ---
  getCategories(): Category[] {
    const categories = this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const wellnessCat = categories.find((c) => c.id === 'cat-wellness' || c.slug === 'wellness');
    if (wellnessCat && (!wellnessCat.image.includes('beauty_wellness_category') || wellnessCat.image.includes('photo-1608248597359'))) {
      wellnessCat.image = '/src/assets/images/beauty_wellness_category_1789698336984.jpg';
      this.set(STORAGE_KEYS.CATEGORIES, categories);
    }
    return categories;
  }

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  // --- Stores ---
  getStores(): Store[] {
    return this.get<Store[]>(STORAGE_KEYS.STORES, INITIAL_STORES);
  }

  saveStore(store: Store): void {
    const stores = this.getStores();
    const index = stores.findIndex((s) => s.id === store.id);
    if (index >= 0) {
      stores[index] = store;
    } else {
      stores.push(store);
    }
    this.set(STORAGE_KEYS.STORES, stores);
  }

  // --- Cart ---
  getCart(): CartItem[] {
    return this.get<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  saveCart(cart: CartItem[]): void {
    this.set(STORAGE_KEYS.CART, cart);
  }

  // --- Wishlist ---
  getWishlist(): string[] {
    return this.get<string[]>(STORAGE_KEYS.WISHLIST, ['prod-honey-01', 'prod-textile-scarf-03']);
  }

  saveWishlist(ids: string[]): void {
    this.set(STORAGE_KEYS.WISHLIST, ids);
  }

  // --- Orders ---
  getOrders(): Order[] {
    return this.get<Order[]>(STORAGE_KEYS.ORDERS, [
      {
        id: 'ord-101',
        orderNumber: 'GMC-2026-1049',
        customerId: DEFAULT_USER.id,
        customerName: DEFAULT_USER.displayName,
        customerEmail: DEFAULT_USER.email,
        customerPhone: DEFAULT_USER.phone || '+975 17 889 900',
        items: [
          {
            productId: 'prod-honey-01',
            productName: 'Bhutan Pure Wild Forest Honey (500g)',
            productImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
            sellerId: 'store-himalayan-bee',
            sellerName: 'Himalayan Bee Sanctuary',
            price: 650,
            quantity: 2,
            subtotal: 1300,
          },
          {
            productId: 'prod-red-rice-02',
            productName: 'Bhutanese Organic Red Rice (2kg)',
            productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
            sellerId: 'store-gmc-organic',
            sellerName: 'GMC Organic Farm Co-op',
            price: 320,
            quantity: 1,
            subtotal: 320,
          },
        ],
        subtotal: 1620,
        deliveryFee: 0,
        discount: 150,
        tax: 73.5,
        grandTotal: 1543.5,
        couponCode: 'GMCFIRST',
        deliveryAddress: DEFAULT_USER.savedAddresses[0],
        deliveryMethod: 'standard',
        paymentMethod: 'bhutan_qr',
        paymentStatus: 'paid',
        status: 'out_for_delivery',
        statusHistory: [
          { status: 'pending', timestamp: '2025-02-27T08:30:00Z', note: 'Order placed via GMC Marketplace' },
          { status: 'confirmed', timestamp: '2025-02-27T08:45:00Z', note: 'Payment verified via mBOB QR' },
          { status: 'processing', timestamp: '2025-02-27T09:30:00Z', note: 'Packed at Gelephu Logistics Center' },
          { status: 'out_for_delivery', timestamp: '2025-02-27T11:00:00Z', note: 'Courier dispatched to Lotus Sector' },
        ],
        createdAt: '2025-02-27T08:30:00Z',
        estimatedDelivery: 'Today by 2:00 PM',
      },
    ]);
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    this.set(STORAGE_KEYS.ORDERS, orders);
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus.replace('_', ' ')}`,
    });
    this.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  // --- Reviews ---
  getReviews(): Review[] {
    return this.get<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  saveReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.set(STORAGE_KEYS.REVIEWS, reviews);
  }

  // --- Coupons ---
  getCoupons(): Coupon[] {
    return this.get<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  saveCoupon(coupon: Coupon): void {
    const coupons = this.getCoupons();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
    } else {
      coupons.push(coupon);
    }
    this.set(STORAGE_KEYS.COUPONS, coupons);
  }

  // --- Banners ---
  getBanners(): Banner[] {
    return this.get<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  }

  saveBanner(banner: Banner): void {
    const banners = this.getBanners();
    const index = banners.findIndex((b) => b.id === banner.id);
    if (index >= 0) {
      banners[index] = banner;
    } else {
      banners.push(banner);
    }
    this.set(STORAGE_KEYS.BANNERS, banners);
  }

  // --- Delivery Zones ---
  getDeliveryZones(): DeliveryZone[] {
    return this.get<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
  }

  // --- Inventory Logs ---
  getInventoryLogs(): InventoryTransaction[] {
    return this.get<InventoryTransaction[]>(STORAGE_KEYS.INVENTORY_LOGS, [
      {
        id: 'inv-1',
        productId: 'prod-honey-01',
        productName: 'Bhutan Pure Wild Forest Honey',
        type: 'stock_in',
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        referenceNote: 'Seasonal harvest delivery from Sarpang apiary',
        timestamp: '2025-02-01T09:00:00Z',
      },
      {
        id: 'inv-2',
        productId: 'prod-honey-01',
        productName: 'Bhutan Pure Wild Forest Honey',
        type: 'sale',
        quantity: -5,
        previousStock: 50,
        newStock: 45,
        referenceNote: 'Order sales #GMC-2026-1049 & retail orders',
        timestamp: '2025-02-27T08:30:00Z',
      },
    ]);
  }

  logInventoryTransaction(tx: Omit<InventoryTransaction, 'id' | 'timestamp'>): void {
    const logs = this.getInventoryLogs();
    logs.unshift({
      ...tx,
      id: `inv-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    this.set(STORAGE_KEYS.INVENTORY_LOGS, logs);
  }

  // --- User Profile ---
  getUserProfile(): UserProfile {
    return this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
  }

  saveUserProfile(profile: UserProfile): void {
    this.set(STORAGE_KEYS.USER_PROFILE, profile);
  }

  // --- Announcement Bar ---
  getAnnouncement(): string {
    return this.get<string>(
      STORAGE_KEYS.ANNOUNCEMENT,
      'Welcome to GMC Marketplace • Free delivery in Gelephu on orders over Nu. 500 • Support 100% verified Bhutanese producers'
    );
  }

  saveAnnouncement(text: string): void {
    this.set(STORAGE_KEYS.ANNOUNCEMENT, text);
  }

  // --- Theme Mode ---
  getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Reset to initial demo state
  resetAllData(): void {
    localStorage.clear();
    window.location.reload();
  }
}

export const storageService = new StorageService();
