import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  Category,
  Store,
  CartItem,
  Order,
  Coupon,
  Banner,
  DeliveryZone,
  UserProfile,
  UserRole,
  ProductVariant,
  Review,
  Address,
  SellerAccount
} from '../types';
import { storageService, DEFAULT_USER } from '../services/storageService';
import { supabaseService } from '../services/supabaseService';
import { firestoreService } from '../services/firestoreService';

// Utility helper to merge cloud arrays with local arrays without losing newly added items
const mergeById = <T extends { id: string }>(primary: T[], fallback: T[]): T[] => {
  const map = new Map<string, T>();
  (fallback || []).forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  (primary || []).forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  return Array.from(map.values());
};

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ShopContextType {
  // Data
  products: Product[];
  categories: Category[];
  stores: Store[];
  banners: Banner[];
  coupons: Coupon[];
  deliveryZones: DeliveryZone[];
  announcement: string;
  user: UserProfile;
  orders: Order[];

  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  selectedZone: DeliveryZone;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setSelectedZone: (zone: DeliveryZone) => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Modals & Navigation
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
  activeStore: Store | null;
  setActiveStore: (store: Store | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (categorySlug: string | null) => void;

  // Dashboards & Portals
  isUserDashboardOpen: boolean;
  setIsUserDashboardOpen: (open: boolean) => void;
  userDashboardTab: 'profile' | 'orders' | 'wishlist' | 'addresses';
  setUserDashboardTab: (tab: 'profile' | 'orders' | 'wishlist' | 'addresses') => void;
  isSellerPortalOpen: boolean;
  setIsSellerPortalOpen: (open: boolean) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;

  // Order Tracking
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackOrderById: (orderIdOrNumber: string) => boolean;

  // Role switching
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Seller Auth & Profiles
  sellers: SellerAccount[];
  currentSeller: SellerAccount | null;
  isSellerLoggedIn: boolean;
  sellerLogin: (email: string, password: string) => { success: boolean; message: string; seller?: SellerAccount };
  sellerRegister: (data: {
    storeName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    category: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  }) => Promise<{ success: boolean; message: string; seller?: SellerAccount; store?: Store }>;
  sellerLogout: () => void;
  addSellerByAdmin: (data: {
    storeName: string;
    ownerName: string;
    email: string;
    password?: string;
    phone: string;
    location: string;
    category: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    isVerified?: boolean;
  }) => Promise<{ success: boolean; message: string; seller?: SellerAccount; store?: Store }>;
  deleteSellerByAdmin: (sellerId: string) => { success: boolean; message: string };
  deleteStoreByAdmin: (storeId: string) => { success: boolean; message: string };

  // Admin Auth & Security
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => { success: boolean; message: string };
  adminLogout: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Management actions
  refreshData: () => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (productOrId: Product | string, updates?: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (categoryData: {
    name: string;
    slug?: string;
    description?: string;
    iconName?: string;
    image?: string;
    featured?: boolean;
    order?: number;
    isActive?: boolean;
  }) => { success: boolean; message: string; category?: Category };
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateStore: (storeOrId: Store | string, updates?: Partial<Store>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>) => Order;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  removeFromWishlist: (productId: string) => void;
  addAddress: (addressData: Omit<Address, 'id'>) => void;
  deleteAddress: (addressId: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;

  // Notifications
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [announcement, setAnnouncement] = useState<string>('');
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [orders, setOrders] = useState<Order[]>([]);

  // Seller Auth State
  const [sellers, setSellers] = useState<SellerAccount[]>(() => storageService.getSellers());
  const [currentSeller, setCurrentSeller] = useState<SellerAccount | null>(() => storageService.getCurrentSeller());
  const isSellerLoggedIn = Boolean(currentSeller);

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => storageService.isAdminAuthenticated());

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedZone, setSelectedZoneState] = useState<DeliveryZone>({
    id: 'zone-gelephu-core',
    name: 'Gelephu Town & Core Area',
    fee: 50,
    freeDeliveryThreshold: 500,
    estimatedDays: 'Same-Day (within 3-5 hours)',
    isActive: true,
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Dashboards state
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [userDashboardTab, setUserDashboardTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('profile');
  const [isSellerPortalOpen, setIsSellerPortalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Tracking state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return storageService.getTheme() === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      storageService.saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      storageService.saveTheme('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Dark mode activated' : 'Light mode activated', 'info');
      return next;
    });
  };

  const setDarkMode = (val: boolean) => {
    setIsDarkMode(val);
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial data loading
  const refreshData = () => {
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setStores(storageService.getStores());
    setBanners(storageService.getBanners());
    setCoupons(storageService.getCoupons());
    const zones = storageService.getDeliveryZones();
    setDeliveryZones(zones);
    if (zones.length > 0 && !selectedZone) {
      setSelectedZoneState(zones[0]);
    }
    setAnnouncement(storageService.getAnnouncement());
    setUser(storageService.getUserProfile());
    setOrders(storageService.getOrders());
    setCart(storageService.getCart());
    setWishlist(storageService.getWishlist());
    setSellers(storageService.getSellers());
    setCurrentSeller(storageService.getCurrentSeller());
    setIsAdminAuthenticated(storageService.isAdminAuthenticated());
  };

  useEffect(() => {
    refreshData();

    // 1. Initialize Firestore & seed if empty, plus sync any locally created stores/products to cloud
    const initializeCloud = async () => {
      try {
        await firestoreService.initializeAndSeed();
        await firestoreService.syncLocalDataToFirestore(
          storageService.getStores(),
          storageService.getSellers(),
          storageService.getProducts()
        );
      } catch (e) {
        console.warn('Cloud initial setup note:', e);
      }

      // Safe secondary seed for Supabase
      supabaseService.initializeAndSeed();
    };
    initializeCloud();

    // 2. Active fetch for fast cloud hydration across all browsers and devices
    const syncFromCloud = async () => {
      try {
        const [cloudProducts, cloudStores, cloudSellers, cloudCategories, cloudOrders] = await Promise.all([
          firestoreService.fetchProducts(),
          firestoreService.fetchStores(),
          firestoreService.fetchSellers(),
          firestoreService.fetchCategories(),
          firestoreService.fetchOrders(),
        ]);

        if (cloudStores.length > 0) {
          const mergedStores = mergeById(cloudStores, storageService.getStores());
          setStores(mergedStores);
          storageService.setStores(mergedStores);
        }
        if (cloudProducts.length > 0) {
          const mergedProducts = mergeById(cloudProducts, storageService.getProducts());
          setProducts(mergedProducts);
          storageService.setProducts(mergedProducts);
        }
        if (cloudSellers.length > 0) {
          const mergedSellers = mergeById(cloudSellers, storageService.getSellers());
          setSellers(mergedSellers);
          storageService.setSellers(mergedSellers);
        }
        if (cloudCategories.length > 0) {
          const mergedCategories = mergeById(cloudCategories, storageService.getCategories());
          setCategories(mergedCategories);
          storageService.setCategories(mergedCategories);
        }
        if (cloudOrders.length > 0) {
          const mergedOrders = mergeById(cloudOrders, storageService.getOrders());
          setOrders(mergedOrders);
          storageService.setOrders(mergedOrders);
        }
      } catch (e) {
        console.warn('Initial cloud hydration note:', e);
      }
    };
    syncFromCloud();

    // 3. Firestore Real-time subscriptions for all public visitors across devices
    const unsubProducts = firestoreService.subscribeProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts((prev) => {
          const merged = mergeById(cloudProducts, prev);
          storageService.setProducts(merged);
          return merged;
        });
      }
    });

    const unsubStores = firestoreService.subscribeStores((cloudStores) => {
      if (cloudStores && cloudStores.length > 0) {
        setStores((prev) => {
          const merged = mergeById(cloudStores, prev);
          storageService.setStores(merged);
          return merged;
        });
      }
    });

    const unsubCategories = firestoreService.subscribeCategories((cloudCategories) => {
      if (cloudCategories && cloudCategories.length > 0) {
        setCategories((prev) => {
          const merged = mergeById(cloudCategories, prev);
          storageService.setCategories(merged);
          return merged;
        });
      }
    });

    const unsubSellers = firestoreService.subscribeSellers((cloudSellers) => {
      if (cloudSellers && cloudSellers.length > 0) {
        setSellers((prev) => {
          const merged = mergeById(cloudSellers, prev);
          storageService.setSellers(merged);
          return merged;
        });
      }
    });

    const unsubOrders = firestoreService.subscribeOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders((prev) => {
          const merged = mergeById(cloudOrders, prev);
          storageService.setOrders(merged);
          return merged;
        });
      }
    });

    // Secondary Supabase listeners for backup
    const unsubSubaProducts = supabaseService.subscribeProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts((prev) => mergeById(cloudProducts, prev));
      }
    });
    const unsubSubaStores = supabaseService.subscribeStores((cloudStores) => {
      if (cloudStores && cloudStores.length > 0) {
        setStores((prev) => mergeById(cloudStores, prev));
      }
    });

    return () => {
      unsubProducts();
      unsubStores();
      unsubCategories();
      unsubSellers();
      unsubOrders();
      unsubSubaProducts();
      unsubSubaStores();
    };
  }, []);

  // Save cart changes
  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  // Save wishlist changes
  useEffect(() => {
    storageService.saveWishlist(wishlist);
  }, [wishlist]);

  // Calculations
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const wishlistCount = wishlist.length;

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (selectedZone && subtotal >= selectedZone.freeDeliveryThreshold) {
      return 0;
    }
    return selectedZone ? selectedZone.fee : 50;
  }, [cart.length, subtotal, selectedZone]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minimumOrder) return 0;

    if (appliedCoupon.discountType === 'percentage') {
      const calc = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      return appliedCoupon.discountValue;
    }
  }, [appliedCoupon, subtotal]);

  const tax = useMemo(() => {
    // 5% Bhutan sales tax estimate on taxable goods
    return Math.round((subtotal - discount) * 0.05 * 100) / 100;
  }, [subtotal, discount]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, subtotal - discount + deliveryFee + tax);
  }, [cart.length, subtotal, discount, deliveryFee, tax]);

  // Cart actions
  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    const itemPrice = variant ? (variant.salePrice ?? variant.price) : (product.salePrice ?? product.price);
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          variantId: variant?.id,
          variantName: variant?.name,
          price: itemPrice,
          quantity,
        },
      ];
    });

    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (subtotal < found.minimumOrder) {
      return {
        success: false,
        message: `Minimum order amount of Nu. ${found.minimumOrder} required for this coupon`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied!`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const setSelectedZone = (zone: DeliveryZone) => {
    setSelectedZoneState(zone);
    showToast(`Delivery area set to: ${zone.name}`, 'info');
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const updated = exists
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);
    showToast(
      exists ? 'Removed from wishlist' : 'Saved to wishlist',
      exists ? 'info' : 'success'
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Role switching
  const setUserRole = (role: UserRole) => {
    const updated = { ...user, role };
    setUser(updated);
    storageService.saveUserProfile(updated);
    showToast(`Switched view to ${role.toUpperCase()} mode`, 'info');
  };

  // Seller Authentication & Registration
  const sellerLogin = (email: string, pass: string) => {
    const res = storageService.authenticateSeller(email, pass);
    if (res.success && res.seller) {
      setCurrentSeller(res.seller);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  const sellerRegister = async (data: {
    storeName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    category: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  }) => {
    const res = storageService.registerSeller(data);
    if (res.success && res.seller && res.store) {
      try {
        await Promise.allSettled([
          firestoreService.saveStore(res.store),
          firestoreService.saveSeller(res.seller),
        ]);
      } catch (err) {
        console.warn('Firestore sync note on seller registration:', err);
      }
      supabaseService.saveStore(res.store);
      supabaseService.saveSeller(res.seller);
      setSellers(storageService.getSellers());
      setStores(storageService.getStores());
      setCurrentSeller(res.seller);
      showToast(`Welcome! Store "${data.storeName}" registered successfully`, 'success');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  const sellerLogout = () => {
    storageService.logoutSeller();
    setCurrentSeller(null);
    showToast('Signed out of Merchant Portal', 'info');
  };

  const addSellerByAdmin = async (data: {
    storeName: string;
    ownerName: string;
    email: string;
    password?: string;
    phone: string;
    location: string;
    category: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    isVerified?: boolean;
  }) => {
    const res = storageService.registerSeller(
      {
        ...data,
        password: data.password || 'seller123',
      },
      false // Keep admin in their session, do not auto-login as seller
    );
    if (res.success && res.seller && res.store) {
      try {
        await Promise.allSettled([
          firestoreService.saveStore(res.store),
          firestoreService.saveSeller(res.seller),
        ]);
      } catch (err) {
        console.warn('Firestore sync note on admin seller onboarding:', err);
      }
      supabaseService.saveStore(res.store);
      supabaseService.saveSeller(res.seller);
      setSellers(storageService.getSellers());
      setStores(storageService.getStores());
      showToast(`Merchant "${data.storeName}" onboarded successfully`, 'success');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  const deleteSellerByAdmin = (sellerId: string) => {
    if (!isAdminAuthenticated) {
      showToast('Access Restricted: Only administrators have rights to delete sellers.', 'error');
      return { success: false, message: 'Administrator authentication required.' };
    }
    const seller = sellers.find((s) => s.id === sellerId);
    if (seller?.storeId) {
      firestoreService.deleteStore(seller.storeId);
      supabaseService.deleteStore(seller.storeId);
    }
    firestoreService.deleteSeller(sellerId);
    supabaseService.deleteSeller(sellerId);
    const res = storageService.deleteSeller(sellerId);
    if (res.success) {
      setSellers(storageService.getSellers());
      showToast(res.message, 'info');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  const deleteStoreByAdmin = (storeId: string) => {
    if (!isAdminAuthenticated) {
      showToast('Access Restricted: Only administrators have rights to delete stores.', 'error');
      return { success: false, message: 'Administrator authentication required.' };
    }
    firestoreService.deleteStore(storeId);
    supabaseService.deleteStore(storeId);
    const res = storageService.deleteStore(storeId);
    if (res.success) {
      setStores(storageService.getStores());
      showToast(res.message, 'info');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  // Admin Authentication & Security
  const adminLogin = (password: string) => {
    const valid = storageService.verifyAdminPassword(password);
    if (valid) {
      storageService.setAdminAuthenticated(true);
      setIsAdminAuthenticated(true);
      showToast('Admin Authority verified. Welcome to GMC Admin CMS', 'success');
      return { success: true, message: 'Authenticated successfully' };
    } else {
      showToast('Incorrect admin password. (Hint: default is admin123)', 'error');
      return { success: false, message: 'Incorrect admin password' };
    }
  };

  const adminLogout = () => {
    storageService.logoutAdmin();
    setIsAdminAuthenticated(false);
    showToast('Admin session locked', 'info');
  };

  const changeAdminPassword = (oldPass: string, newPass: string) => {
    if (!storageService.verifyAdminPassword(oldPass)) {
      showToast('Current password incorrect', 'error');
      return { success: false, message: 'Current password incorrect' };
    }
    if (newPass.length < 4) {
      showToast('Password must be at least 4 characters', 'error');
      return { success: false, message: 'Password must be at least 4 characters' };
    }
    storageService.setAdminPassword(newPass);
    showToast('Admin password successfully updated', 'success');
    return { success: true, message: 'Admin password updated' };
  };

  // Tracking
  const trackOrderById = (orderIdOrNumber: string): boolean => {
    const trimmed = orderIdOrNumber.trim().toUpperCase();
    const order = orders.find(
      (o) => o.id.toUpperCase() === trimmed || o.orderNumber.toUpperCase() === trimmed
    );
    if (order) {
      setTrackingOrder(order);
      setIsTrackingOpen(true);
      return true;
    }
    showToast('Order not found with that number', 'error');
    return false;
  };

  // Place Order
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>
  ): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GMC-2026-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          note: `Order placed via GMC Marketplace (${orderData.paymentMethod.replace('_', ' ').toUpperCase()})`,
        },
      ],
    };

    // Save to storage, Firestore and Supabase
    storageService.saveOrder(newOrder);
    firestoreService.saveOrder(newOrder);
    supabaseService.saveOrder(newOrder);

    // Reduce stock and log transaction
    newOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const prevStock = prod.stock;
        const nextStock = Math.max(0, prevStock - item.quantity);
        const updated = { ...prod, stock: nextStock };
        storageService.saveProduct(updated);
        firestoreService.saveProduct(updated);
        supabaseService.saveProduct(updated);
        storageService.logInventoryTransaction({
          productId: prod.id,
          productName: prod.name,
          type: 'sale',
          quantity: -item.quantity,
          previousStock: prevStock,
          newStock: nextStock,
          referenceNote: `Order #${newOrder.orderNumber}`,
        });
      }
    });

    // Clear cart
    clearCart();
    setOrders((prev) => [newOrder, ...prev]);
    setProducts(storageService.getProducts());

    // Celebrate!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    const updated = storageService.updateOrderStatus(orderId, status, note);
    if (updated) {
      firestoreService.saveOrder(updated);
      supabaseService.saveOrder(updated);
      setOrders(storageService.getOrders());
      if (trackingOrder?.id === orderId) {
        setTrackingOrder(updated);
      }
      showToast(`Order status updated to ${status.replace('_', ' ')}`, 'success');
    }
  };

  // Management CRUD - Restricted rights: only authenticated merchants and admins can add or edit
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    let targetSellerId = productData.sellerId;
    let targetSellerName = productData.sellerName;
    let targetSellerVerified = productData.sellerVerified;

    if (currentSeller) {
      targetSellerId = currentSeller.storeId;
      targetSellerName = currentSeller.storeName;
      targetSellerVerified = currentSeller.isVerified;
    } else if (!isAdminAuthenticated) {
      showToast('Access Restricted: Customers cannot add products. Only registered merchants and administrators have rights to list products.', 'error');
      return null as unknown as Product;
    }

    const newProduct: Product = {
      ...productData,
      sellerId: targetSellerId,
      sellerName: targetSellerName,
      sellerVerified: targetSellerVerified ?? true,
      id: `prod-${Date.now()}`,
    };
    storageService.saveProduct(newProduct);
    firestoreService.saveProduct(newProduct);
    supabaseService.saveProduct(newProduct);
    setProducts(storageService.getProducts());
    showToast(`Product "${newProduct.name}" listed under ${targetSellerName}`, 'success');
    return newProduct;
  };

  const updateProduct = (productOrId: Product | string, updates?: Partial<Product>) => {
    let target: Product | undefined;
    if (typeof productOrId === 'string') {
      const current = products.find((p) => p.id === productOrId);
      if (!current) return;
      target = { ...current, ...(updates || {}) };
    } else {
      target = productOrId;
    }

    // Strict Authorization: Customers cannot edit. Only admins or the owning merchant can edit.
    if (!isAdminAuthenticated) {
      if (!currentSeller) {
        showToast('Access Restricted: Customers cannot edit products. Only registered merchants can edit their listings.', 'error');
        return;
      }
      if (target.sellerId !== currentSeller.storeId) {
        showToast(`Access Denied: You can only edit items belonging to ${currentSeller.storeName}`, 'error');
        return;
      }
    }

    storageService.saveProduct(target);
    firestoreService.saveProduct(target);
    supabaseService.saveProduct(target);
    setProducts(storageService.getProducts());
    showToast(`Product "${target.name}" updated`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    // Strict Authorization: Customers cannot delete. Only admins or owning merchant can delete.
    if (!isAdminAuthenticated) {
      if (!currentSeller) {
        showToast('Access Restricted: Customers cannot delete products.', 'error');
        return;
      }
      if (target.sellerId !== currentSeller.storeId) {
        showToast(`Access Denied: You can only delete items belonging to ${currentSeller.storeName}`, 'error');
        return;
      }
    }

    storageService.deleteProduct(productId);
    firestoreService.deleteProduct(productId);
    supabaseService.deleteProduct(productId);
    setProducts(storageService.getProducts());
    showToast('Product deleted', 'info');
  };

  const addCategory = (categoryData: {
    name: string;
    slug?: string;
    description?: string;
    iconName?: string;
    image?: string;
    featured?: boolean;
    order?: number;
    isActive?: boolean;
  }): { success: boolean; message: string; category?: Category } => {
    if (!isAdminAuthenticated) {
      showToast('Access Restricted: Only administrators have rights to add categories.', 'error');
      return { success: false, message: 'Administrator rights required' };
    }

    const trimmedName = categoryData.name.trim();
    if (!trimmedName) {
      return { success: false, message: 'Category name is required' };
    }

    const currentCats = storageService.getCategories();
    if (currentCats.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      return { success: false, message: `Category "${trimmedName}" already exists` };
    }

    const slug = (categoryData.slug?.trim() || trimmedName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory: Category = {
      id: `cat-${slug || Date.now()}`,
      name: trimmedName,
      slug: slug || `cat-${Date.now()}`,
      description: categoryData.description?.trim() || '',
      iconName: categoryData.iconName || 'Package',
      image: categoryData.image?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      itemCount: 0,
      featured: categoryData.featured ?? true,
      order: categoryData.order ?? (currentCats.length + 1),
      isActive: categoryData.isActive ?? true,
    };

    storageService.saveCategory(newCategory);
    firestoreService.saveCategory(newCategory);
    supabaseService.saveCategory(newCategory);
    setCategories(storageService.getCategories());
    showToast(`Category "${newCategory.name}" added successfully`, 'success');
    return { success: true, message: 'Category added successfully', category: newCategory };
  };

  const updateCategory = (category: Category) => {
    if (!isAdminAuthenticated) {
      showToast('Access Restricted: Only administrators have rights to edit categories.', 'error');
      return;
    }

    const oldCategories = storageService.getCategories();
    const oldCat = oldCategories.find((c) => c.id === category.id);

    storageService.saveCategory(category);
    firestoreService.saveCategory(category);
    supabaseService.saveCategory(category);
    setCategories(storageService.getCategories());

    // If category name changed, synchronize associated products
    if (oldCat && oldCat.name !== category.name) {
      const allProducts = storageService.getProducts();
      let changed = false;
      allProducts.forEach((p) => {
        if (p.categoryId === category.id || p.category === oldCat.name) {
          p.category = category.name;
          p.categoryId = category.id;
          changed = true;
          firestoreService.saveProduct(p);
          supabaseService.saveProduct(p);
        }
      });
      if (changed) {
        storageService.setProducts(allProducts);
        setProducts(allProducts);
      }
    }

    showToast(`Category "${category.name}" updated`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    if (!isAdminAuthenticated) {
      showToast('Access Restricted: Only administrators have rights to delete categories.', 'error');
      return;
    }

    storageService.deleteCategory(categoryId);
    firestoreService.deleteCategory(categoryId);
    supabaseService.deleteCategory(categoryId);
    setCategories(storageService.getCategories());
    showToast('Category deleted', 'info');
  };

  const updateStore = (storeOrId: Store | string, updates?: Partial<Store>) => {
    let target: Store | undefined;
    if (typeof storeOrId === 'string') {
      const current = stores.find((s) => s.id === storeOrId);
      if (!current) return;
      target = { ...current, ...(updates || {}) };
    } else {
      target = storeOrId;
    }

    // Strict Authorization: Customers cannot edit stores. Only admins or owning merchant can edit.
    if (!isAdminAuthenticated) {
      if (!currentSeller || currentSeller.storeId !== target.id) {
        showToast('Access Restricted: Only authenticated merchants and administrators have rights to edit store settings.', 'error');
        return;
      }
    }

    storageService.saveStore(target);
    firestoreService.saveStore(target);
    supabaseService.saveStore(target);
    setStores(storageService.getStores());
    showToast(`Store "${target.name}" updated`, 'success');
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((id) => id !== productId);
      storageService.saveWishlist(next);
      return next;
    });
    showToast('Removed from wishlist', 'info');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updatedUser = {
      ...user,
      savedAddresses: [...user.savedAddresses, newAddr],
    };
    setUser(updatedUser);
    storageService.saveUserProfile(updatedUser);
    showToast('New delivery address saved', 'success');
  };

  const deleteAddress = (addressId: string) => {
    const updatedUser = {
      ...user,
      savedAddresses: user.savedAddresses.filter((a) => a.id !== addressId),
    };
    setUser(updatedUser);
    storageService.saveUserProfile(updatedUser);
    showToast('Address removed', 'info');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    storageService.saveReview(newReview);
    showToast('Thank you! Your verified review has been submitted.', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        stores,
        banners,
        coupons,
        deliveryZones,
        announcement,
        user,
        orders,
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        tax,
        grandTotal,
        appliedCoupon,
        selectedZone,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSelectedZone,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeProduct,
        setActiveProduct,
        activeStore,
        setActiveStore,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        isUserDashboardOpen,
        setIsUserDashboardOpen,
        userDashboardTab,
        setUserDashboardTab,
        isSellerPortalOpen,
        setIsSellerPortalOpen,
        isAdminPortalOpen,
        setIsAdminPortalOpen,
        trackingOrder,
        setTrackingOrder,
        isTrackingOpen,
        setIsTrackingOpen,
        trackOrderById,
        userRole: user.role,
        setUserRole,
        sellers,
        currentSeller,
        isSellerLoggedIn,
        sellerLogin,
        sellerRegister,
        sellerLogout,
        addSellerByAdmin,
        deleteSellerByAdmin,
        deleteStoreByAdmin,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        changeAdminPassword,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateStore,
        updateOrderStatus,
        createOrder,
        addReview,
        removeFromWishlist,
        addAddress,
        deleteAddress,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
