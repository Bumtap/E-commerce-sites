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
  Address
} from '../types';
import { storageService, DEFAULT_USER } from '../services/storageService';

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

  // Management actions
  refreshData: () => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (productOrId: Product | string, updates?: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
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
  };

  useEffect(() => {
    refreshData();
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

    // Save to storage
    storageService.saveOrder(newOrder);

    // Reduce stock and log transaction
    newOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const prevStock = prod.stock;
        const nextStock = Math.max(0, prevStock - item.quantity);
        const updated = { ...prod, stock: nextStock };
        storageService.saveProduct(updated);
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
      setOrders(storageService.getOrders());
      if (trackingOrder?.id === orderId) {
        setTrackingOrder(updated);
      }
      showToast(`Order status updated to ${status.replace('_', ' ')}`, 'success');
    }
  };

  // Management CRUD
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    storageService.saveProduct(newProduct);
    setProducts(storageService.getProducts());
    showToast(`Product "${newProduct.name}" listed successfully`, 'success');
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
    storageService.saveProduct(target);
    setProducts(storageService.getProducts());
    showToast(`Product "${target.name}" updated`, 'success');
  };

  const deleteProduct = (productId: string) => {
    storageService.deleteProduct(productId);
    setProducts(storageService.getProducts());
    showToast('Product deleted', 'info');
  };

  const updateCategory = (category: Category) => {
    storageService.saveCategory(category);
    setCategories(storageService.getCategories());
    showToast(`Category "${category.name}" saved`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    storageService.deleteCategory(categoryId);
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
    storageService.saveStore(target);
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
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
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
