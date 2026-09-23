import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { formatWhatsAppUrl } from '../../utils/whatsapp';
import { Product, Store, Category, Coupon, DeliveryZone } from '../../types';
import { ImageUpload } from '../common/ImageUpload';
import {
  X,
  LayoutDashboard,
  Package,
  Store as StoreIcon,
  Tag,
  Truck,
  Flame,
  CheckCircle2,
  Trash2,
  Plus,
  TrendingUp,
  Shield,
  Layers,
  Star,
  Lock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  UserCheck,
  UserPlus,
  MessageCircle,
  Phone,
  Edit2,
  Search,
  FolderPlus,
  Sparkles,
  Apple,
  Coffee,
  Shirt,
  Palette,
  Leaf,
  Heart,
  Gem,
  Check,
  AlertTriangle
} from 'lucide-react';

const CATEGORY_IMAGE_PRESETS = [
  { name: 'Red Rice & Staples', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fresh Organic Produce', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80' },
  { name: 'Bhutanese Handicrafts', url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=80' },
  { name: 'Beauty & Herbal Balms', url: '/src/assets/images/beauty_wellness_category_1789698336984.jpg' },
  { name: 'Mountain Teas & Honey', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&auto=format&fit=crop&q=80' },
  { name: 'Textiles & Yak Wool', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Mindful Books & Wisdom', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80' },
  { name: 'Eco-Living & Home', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80' },
];

const CATEGORY_ICON_OPTIONS = [
  { id: 'ShoppingBag', label: 'Shopping Bag' },
  { id: 'Apple', label: 'Fresh Produce' },
  { id: 'Sparkles', label: 'Wellness' },
  { id: 'Coffee', label: 'Beverage / Tea' },
  { id: 'Shirt', label: 'Fashion / Textile' },
  { id: 'Palette', label: 'Handicrafts' },
  { id: 'Leaf', label: 'Organic Herbs' },
  { id: 'Flame', label: 'Spices / Flavors' },
  { id: 'Package', label: 'General Goods' },
  { id: 'Heart', label: 'Health & Care' },
  { id: 'Store', label: 'Market Stall' },
  { id: 'Gem', label: 'Jewelry / Luxury' },
];

const renderCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Apple':
      return <Apple className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Leaf':
      return <Leaf className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Store':
      return <StoreIcon className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'ShoppingBag':
    default:
      return <Package className={className} />;
  }
};

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminPortalOpen,
    setIsAdminPortalOpen,
    products,
    updateProduct,
    deleteProduct,
    stores,
    updateStore,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    coupons,
    deliveryZones,
    showToast,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    sellers,
    addSellerByAdmin,
    deleteSellerByAdmin,
    deleteStoreByAdmin,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'stores' | 'categories' | 'coupons' | 'zones' | 'security'
  >('overview');

  // Admin login gate states
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Add Seller Provisioning Modal State
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [sellerFormData, setSellerFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: 'seller123',
    phone: '+975-17',
    location: 'Agro-Mindfulness Sector, Gelephu',
    category: 'Groceries & Bhutanese Staples',
    description: '',
    logo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    isVerified: true,
  });

  const handleCreateSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerFormData.storeName.trim() || !sellerFormData.ownerName.trim() || !sellerFormData.email.trim()) {
      showToast('Please fill in Store Name, Owner Name, and Email', 'error');
      return;
    }
    const res = await addSellerByAdmin(sellerFormData);
    if (res.success) {
      setShowAddSellerModal(false);
      setSellerFormData({
        storeName: '',
        ownerName: '',
        email: '',
        password: 'seller123',
        phone: '+975-17',
        location: 'Agro-Mindfulness Sector, Gelephu',
        category: categories[0]?.name || 'Groceries & Bhutanese Staples',
        description: '',
        logo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
        isVerified: true,
      });
    }
  };

  // Category management states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    iconName: 'ShoppingBag',
    image: CATEGORY_IMAGE_PRESETS[0].url,
    order: 1,
    featured: true,
    isActive: true,
  });
  const [categoryFormError, setCategoryFormError] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormError('');
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      iconName: 'ShoppingBag',
      image: CATEGORY_IMAGE_PRESETS[0].url,
      order: categories.length + 1,
      featured: true,
      isActive: true,
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormError('');
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      iconName: cat.iconName || 'Package',
      image: cat.image,
      order: cat.order ?? 1,
      featured: cat.featured ?? true,
      isActive: cat.isActive ?? true,
    });
    setShowCategoryModal(true);
  };

  const handleCategoryNameChange = (newName: string) => {
    const autoSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setCategoryFormData((prev) => ({
      ...prev,
      name: newName,
      slug: !editingCategory || prev.slug === editingCategory.slug ? autoSlug : prev.slug,
    }));
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError('');
    const trimmedName = categoryFormData.name.trim();
    if (!trimmedName) {
      setCategoryFormError('Category name is required');
      return;
    }

    const trimmedSlug = (categoryFormData.slug.trim() || trimmedName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingCategory) {
      const duplicate = categories.find(
        (c) => c.id !== editingCategory.id && c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicate) {
        setCategoryFormError(`Category name "${trimmedName}" is already in use`);
        return;
      }

      updateCategory({
        ...editingCategory,
        name: trimmedName,
        slug: trimmedSlug,
        description: categoryFormData.description.trim(),
        iconName: categoryFormData.iconName,
        image: categoryFormData.image,
        order: Number(categoryFormData.order) || 1,
        featured: categoryFormData.featured,
        isActive: categoryFormData.isActive,
      });
      setShowCategoryModal(false);
      setEditingCategory(null);
    } else {
      const res = addCategory({
        name: trimmedName,
        slug: trimmedSlug,
        description: categoryFormData.description.trim(),
        iconName: categoryFormData.iconName,
        image: categoryFormData.image,
        order: Number(categoryFormData.order) || (categories.length + 1),
        featured: categoryFormData.featured,
        isActive: categoryFormData.isActive,
      });

      if (!res.success) {
        setCategoryFormError(res.message);
        return;
      }
      setShowCategoryModal(false);
    }
  };

  const handleQuickToggleCategoryActive = (cat: Category) => {
    updateCategory({
      ...cat,
      isActive: !cat.isActive,
    });
  };

  const handleQuickToggleCategoryFeatured = (cat: Category) => {
    updateCategory({
      ...cat,
      featured: !cat.featured,
    });
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // New coupon form
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(500);

  if (!isAdminPortalOpen) return null;

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!adminPasswordInput.trim()) {
      setLoginError('Please enter the administrator password');
      return;
    }
    const res = adminLogin(adminPasswordInput.trim());
    if (res.success) {
      setAdminPasswordInput('');
    } else {
      setLoginError(res.message);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }
    const res = changeAdminPassword(currentPass, newPass);
    if (res.success) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  // Platform analytics
  const totalGMV = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalCompletedOrders = orders.filter((o) => o.status === 'delivered').length;
  const verifiedStoresCount = stores.filter((s) => s.isVerified).length;

  const handleToggleFeatured = (prod: Product) => {
    updateProduct(prod.id, { isFeatured: !prod.isFeatured });
    showToast(`Updated featured status for ${prod.name}`, 'info');
  };

  const handleToggleFlashDeal = (prod: Product) => {
    updateProduct(prod.id, { isFlashDeal: !prod.isFlashDeal });
    showToast(`Toggled deal status for ${prod.name}`, 'info');
  };

  const handleToggleStoreVerification = (store: Store) => {
    updateStore(store.id, { isVerified: !store.isVerified });
    showToast(`Updated GMC verification for ${store.name}`, 'info');
  };

  // 1. Password Protected Gate if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  Admin Authority Console
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Protected System Access
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminPortalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            This console is reserved for GMC Marketplace administrators. Enter the master administration key to unlock platform configuration, store approvals, vouchers, and catalog control.
          </p>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Master Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Enter administrator password..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {loginError}
                </p>
              )}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-amber-800 dark:text-amber-300 font-medium">
                Default Master Key: <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">admin123</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setAdminPasswordInput('admin123');
                  setLoginError('');
                }}
                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdminPortalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Key className="w-4 h-4" />
                Unlock Admin Console
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base font-display">
                  GMC Marketplace Admin CMS
                </h3>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Authority Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Gelephu Mindfulness City Digital Commerce Control Plane
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Lock Admin Console"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>
            <button
              onClick={() => setIsAdminPortalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close admin portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/70 dark:bg-slate-850/70 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Platform Stats', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'products', label: `Catalog (${products.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'stores', label: `Merchants (${stores.length})`, icon: <StoreIcon className="w-4 h-4" /> },
            { id: 'categories', label: `Categories (${categories.length})`, icon: <Layers className="w-4 h-4" /> },
            { id: 'coupons', label: `Vouchers (${coupons.length})`, icon: <Tag className="w-4 h-4" /> },
            { id: 'zones', label: 'Delivery Zones', icon: <Truck className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Access', icon: <Key className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors -mb-px cursor-pointer ${
                activeTab === tab.id
                  ? 'border-teal-700 dark:border-teal-400 text-teal-800 dark:text-teal-300'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* 1. OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                    Gross Merchandise Value
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-100 mt-1">
                    {formatNu(totalGMV)}
                  </p>
                  <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5">Across all GMC merchants</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Total Platform Orders
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {orders.length}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {totalCompletedOrders} fulfilled
                  </p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Verified GMC Sellers
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">
                    {verifiedStoresCount} / {stores.length}
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Active licensed businesses</p>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block">
                    Catalog Items
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">
                    {products.length}
                  </p>
                  <p className="text-[10px] text-indigo-700 dark:text-indigo-400 mt-0.5">In 6 marketplace sectors</p>
                </div>
              </div>

              {/* Simulated SVG Revenue Chart */}
              <div className="p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Weekly GMC Commerce Volume (Nu.)
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    +18.4% WoW
                  </span>
                </div>

                <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 px-2">
                  {[
                    { day: 'Mon', val: 12400 },
                    { day: 'Tue', val: 18200 },
                    { day: 'Wed', val: 24500 },
                    { day: 'Thu', val: 21000 },
                    { day: 'Fri', val: 32400 },
                    { day: 'Sat', val: 41800 },
                    { day: 'Sun', val: 38900 },
                  ].map((bar) => {
                    const maxVal = 45000;
                    const heightPercent = Math.round((bar.val / maxVal) * 100);

                    return (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {formatNu(bar.val).split('.')[0]}
                        </span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-teal-700 hover:bg-teal-600 transition-all rounded-t-lg"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{bar.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS CATALOG TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Manage Marketplace Products</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Feature items on homepage or activate Today's Deals countdown ribbons.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-850 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Seller</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Flash Deal?</th>
                      <th className="p-3">Featured?</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{p.sellerName}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {formatNu(p.salePrice || p.price)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleFlashDeal(p)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer ${
                              p.isFlashDeal
                                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            <Flame className="w-3 h-3" />
                            <span>{p.isFlashDeal ? 'Active Deal' : 'Off'}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              p.isFeatured
                                ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {p.isFeatured ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. STORES & MERCHANTS TAB */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    GMC Registered Businesses & Cooperatives
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Onboard new merchants, manage verification credentials, or contact store owners via WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSellerModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add New Seller / Store</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stores.map((s) => {
                  const matchedSeller = sellers.find((sel) => sel.storeId === s.id);
                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={s.logo}
                          alt={s.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">{s.name}</h5>
                            {s.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.location}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            Category: <span className="font-medium text-slate-600 dark:text-slate-300">{s.category}</span>
                          </p>
                          {matchedSeller && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Owner: {matchedSeller.ownerName} ({matchedSeller.email})
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={formatWhatsAppUrl(
                              s.phone,
                              `Kuzu Zangpo! Official communication from GMC Marketplace Admin regarding ${s.name}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            title="Chat with store owner on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${s.phone}`}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleStoreVerification(s)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                              s.isVerified
                                ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-800 dark:hover:text-rose-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-700 hover:text-white'
                            }`}
                          >
                            {s.isVerified ? '✓ Verified Partner' : 'Approve GMC'}
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove store "${s.name}"?`)) {
                                deleteStoreByAdmin(s.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Remove Store"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Marketplace Categories</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Organize store navigation, icons, and circular category filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all self-start sm:self-auto"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      c.isActive !== false
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs'
                        : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
                    } flex flex-col justify-between gap-3`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-teal-800 text-white shadow-xs">
                          {renderCategoryIcon(c.iconName || 'Package', 'w-3 h-3')}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.name}</h5>
                          {c.featured && (
                            <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-200 dark:border-amber-800/50">
                              Featured
                            </span>
                          )}
                          {c.isActive === false && (
                            <span className="text-[10px] bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-bold">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          /{c.slug}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                          {c.description || `${c.itemCount || 0} products registered`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickToggleCategoryFeatured(c)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                            c.featured
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                              : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="Toggle featured home display"
                        >
                          <Star className="w-3 h-3 inline mr-1 fill-current" />
                          <span>{c.featured ? 'Featured' : 'Regular'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickToggleCategoryActive(c)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                            c.isActive !== false
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {c.isActive !== false ? 'Active' : 'Hidden'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(c)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-slate-700 dark:text-slate-300 hover:text-teal-700 transition-colors cursor-pointer"
                          title="Edit Category Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(c)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active Discount Coupons</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Codes shoppers can apply in cart drawer or checkout.
                </p>
              </div>

              <div className="space-y-2">
                {coupons.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          {cp.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {cp.discountType === 'percentage'
                            ? `${cp.discountValue}% OFF`
                            : `Nu. ${cp.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        Min. spend: {formatNu(cp.minimumOrder)} • Status: {cp.isActive ? 'Active' : 'Expired'}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                      Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ZONES TAB */}
          {activeTab === 'zones' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Gelephu Logistics & Delivery Zones</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Flat delivery rates and free delivery thresholds.
                </p>
              </div>

              <div className="space-y-3">
                {deliveryZones.map((z) => (
                  <div
                    key={z.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{z.name}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Base Courier Fee: {formatNu(z.fee)}
                      </p>
                      <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                        Free delivery on orders over {formatNu(z.freeDeliveryThreshold)}
                      </p>
                    </div>

                    <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 text-xs font-bold px-3 py-1 rounded-xl">
                      Est. Time: {z.estimatedDays}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SECURITY & ACCESS TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              {/* Password Management */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Change Master Admin Password</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update the security key required to access this authority console
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Admin Password
                    </label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Enter current password (default: admin123)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Min. 4 characters"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save New Admin Password
                  </button>
                </form>
              </div>

              {/* Registered Merchant Credentials Summary */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Registered Merchant Logins ({sellers.length})</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Merchants with permission to manage items under their store ID
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddSellerModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Seller Account</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {sellers.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{s.storeName}</span>
                          <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {s.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          Contact: {s.ownerName} • Phone: {s.phone}
                        </p>
                        <p className="text-teal-700 dark:text-teal-300 font-mono text-[11px]">
                          Login Email: {s.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={formatWhatsAppUrl(
                            s.phone,
                            `Kuzu Zangpo! Hello ${s.ownerName}, official message from GMC Marketplace Admin regarding your store account.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="WhatsApp merchant"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete merchant login for "${s.storeName}" (${s.email})?`)) {
                              deleteSellerByAdmin(s.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove merchant login"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add New Seller / Store Provisioning */}
        {showAddSellerModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Onboard New Seller / Merchant
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Create store profile and login credentials for GMC seller
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSellerModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSellerSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store / Cooperative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gelephu Organic Honey & Spices"
                    value={sellerFormData.storeName}
                    onChange={(e) => setSellerFormData({ ...sellerFormData, storeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Owner / Representative Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karma Wangchuk"
                      value={sellerFormData.ownerName}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, ownerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+975-17123456"
                      value={sellerFormData.phone}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Login Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="merchant@gelephu.bt"
                      value={sellerFormData.email}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Initial Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="seller123"
                      value={sellerFormData.password}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      GMC Sector / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mindfulness Agri-Hub, Gelephu"
                      value={sellerFormData.location}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Category
                    </label>
                    <select
                      value={sellerFormData.category}
                      onChange={(e) => setSellerFormData({ ...sellerFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Description & Tagline
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of products offered and craft heritage..."
                    value={sellerFormData.description}
                    onChange={(e) => setSellerFormData({ ...sellerFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <ImageUpload
                    id="admin-new-seller-logo"
                    label="Store Logo / Brand Emblem"
                    sublabel="Square (1:1) merchant avatar"
                    value={sellerFormData.logo || ''}
                    onChange={(url) => setSellerFormData({ ...sellerFormData, logo: url })}
                    variant="logo"
                  />
                  <ImageUpload
                    id="admin-new-seller-cover"
                    label="Storefront Cover Banner"
                    sublabel="Landscape store header photo"
                    value={sellerFormData.coverImage || ''}
                    onChange={(url) => setSellerFormData({ ...sellerFormData, coverImage: url })}
                    variant="cover"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="verifySellerCheck"
                    checked={sellerFormData.isVerified}
                    onChange={(e) => setSellerFormData({ ...sellerFormData, isVerified: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                  />
                  <label htmlFor="verifySellerCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Grant Official GMC Verified Merchant Badge
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSellerModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Onboard Seller</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT CATEGORY MODAL */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure marketplace navigation name, slug, icon, and display banner.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {categoryFormError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{categoryFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhutanese Red Rice"
                      value={categoryFormData.name}
                      onChange={(e) => handleCategoryNameChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL Slug <span className="text-slate-400">(Auto-generated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. red-rice"
                      value={categoryFormData.slug}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of items in this category..."
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden resize-none"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category Icon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {CATEGORY_ICON_OPTIONS.map((opt) => {
                      const isSelected = categoryFormData.iconName === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCategoryFormData({ ...categoryFormData, iconName: opt.id })}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 ring-2 ring-teal-700/20 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {renderCategoryIcon(opt.id, 'w-4 h-4')}
                          <span className="text-[10px] font-semibold truncate w-full text-center">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image Upload & Presets */}
                <div className="space-y-2">
                  <ImageUpload
                    id="admin-category-image"
                    label="Category Banner / Thumbnail Image"
                    sublabel="Upload custom image or pick curated preset below"
                    value={categoryFormData.image}
                    onChange={(url) => setCategoryFormData({ ...categoryFormData, image: url })}
                    variant="cover"
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Or pick from curated Bhutanese imagery presets:
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                      {CATEGORY_IMAGE_PRESETS.map((preset) => {
                        const isChosen = categoryFormData.image === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setCategoryFormData({ ...categoryFormData, image: preset.url })}
                            className={`shrink-0 flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                              isChosen
                                ? 'border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-1 ring-teal-700'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                            <span className="text-[11px] font-bold whitespace-nowrap">{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order & Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Display Sort Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={categoryFormData.order}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, order: Number(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:pt-6">
                    <input
                      type="checkbox"
                      id="catFeaturedCheck"
                      checked={categoryFormData.featured}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                    />
                    <label htmlFor="catFeaturedCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Featured on Homepage
                    </label>
                  </div>
                  <div className="flex items-center gap-2 sm:pt-6">
                    <input
                      type="checkbox"
                      id="catActiveCheck"
                      checked={categoryFormData.isActive}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                    />
                    <label htmlFor="catActiveCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Active / Visible
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY CONFIRMATION MODAL */}
        {categoryToDelete && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delete Category?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Are you sure you want to remove &quot;{categoryToDelete.name}&quot;?
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                Products currently assigned to this category will remain available, but will no longer be filterable by this category name.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCategory}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Category</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
