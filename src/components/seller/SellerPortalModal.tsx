import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { Product, OrderStatus } from '../../types';
import { ImageUpload } from '../common/ImageUpload';
import {
  X,
  Store,
  Package,
  Plus,
  DollarSign,
  ShoppingBag,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  Clock,
  TrendingUp,
  Truck,
  Lock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  UserPlus,
  LogIn,
  Sparkles,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

const STORE_LOGO_PRESETS = [
  { name: 'Heritage Seal', url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=200&auto=format&fit=crop&q=80' },
  { name: 'Organic Harvest', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=200&auto=format&fit=crop&q=80' },
  { name: 'Weaving Emblem', url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Himalayan Bee', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80' },
];

const STORE_COVER_PRESETS = [
  { name: 'GMC Terraces', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Himalayan Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Traditional Loom', url: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Zen Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80' },
];

export const SellerPortalModal: React.FC = () => {
  const {
    isSellerPortalOpen,
    setIsSellerPortalOpen,
    stores,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    showToast,
    sellers,
    currentSeller,
    isSellerLoggedIn,
    sellerLogin,
    sellerRegister,
    sellerLogout,
    addSellerByAdmin,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'settings' | 'addSeller'>('kpi');

  // Seller Auth Modal States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Seller Registration States
  const [regStoreName, setRegStoreName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('+975-17');
  const [regLocation, setRegLocation] = useState('Agro-Mindfulness Sector, Gelephu');
  const [regCategory, setRegCategory] = useState('Groceries & Staples');
  const [regDescription, setRegDescription] = useState('');
  const [regLogo, setRegLogo] = useState('');
  const [regCoverImage, setRegCoverImage] = useState('');
  const [regError, setRegError] = useState('');

  // Add Product Form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries & Staples');
  const [price, setPrice] = useState(450);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState(25);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isMadeInBhutan, setIsMadeInBhutan] = useState(true);
  const [isOrganic, setIsOrganic] = useState(true);
  const [isGmcExclusive, setIsGmcExclusive] = useState(false);

  // Edit Product Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Groceries & Staples');
  const [editPrice, setEditPrice] = useState(450);
  const [editSalePrice, setEditSalePrice] = useState<number | undefined>(undefined);
  const [editStock, setEditStock] = useState(25);
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsMadeInBhutan, setEditIsMadeInBhutan] = useState(true);
  const [editIsOrganic, setEditIsOrganic] = useState(true);
  const [editIsGmcExclusive, setEditIsGmcExclusive] = useState(false);

  // Inner Add Seller state (when logged in)
  const [innerStoreName, setInnerStoreName] = useState('');
  const [innerOwnerName, setInnerOwnerName] = useState('');
  const [innerEmail, setInnerEmail] = useState('');
  const [innerPassword, setInnerPassword] = useState('seller123');
  const [innerPhone, setInnerPhone] = useState('+975-17');
  const [innerLocation, setInnerLocation] = useState('Mindfulness Crafts Quarter, Gelephu');
  const [innerCategory, setInnerCategory] = useState('Handicrafts & Textiles');
  const [innerDescription, setInnerDescription] = useState('');
  const [innerLogo, setInnerLogo] = useState('');
  const [innerCoverImage, setInnerCoverImage] = useState('');
  const [innerSwitchImmediate, setInnerSwitchImmediate] = useState(false);
  const [innerError, setInnerError] = useState('');

  if (!isSellerPortalOpen) return null;

  const handleInnerAddSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInnerError('');
    if (!innerStoreName.trim() || !innerOwnerName.trim() || !innerEmail.trim() || !innerPassword.trim()) {
      setInnerError('Please fill in Store Name, Owner Name, Email, and Password');
      return;
    }
    if (innerSwitchImmediate) {
      const res = sellerRegister({
        storeName: innerStoreName.trim(),
        ownerName: innerOwnerName.trim(),
        email: innerEmail.trim(),
        password: innerPassword.trim(),
        phone: innerPhone.trim(),
        location: innerLocation.trim(),
        category: innerCategory,
        description: innerDescription.trim(),
        logo: innerLogo,
        coverImage: innerCoverImage,
      });
      if (res.success) {
        setActiveTab('kpi');
        setInnerStoreName('');
        setInnerOwnerName('');
        setInnerEmail('');
        setInnerPassword('seller123');
        setInnerDescription('');
        setInnerLogo('');
        setInnerCoverImage('');
      } else {
        setInnerError(res.message);
      }
    } else {
      const res = addSellerByAdmin({
        storeName: innerStoreName.trim(),
        ownerName: innerOwnerName.trim(),
        email: innerEmail.trim(),
        password: innerPassword.trim(),
        phone: innerPhone.trim(),
        location: innerLocation.trim(),
        category: innerCategory,
        description: innerDescription.trim(),
        logo: innerLogo,
        coverImage: innerCoverImage,
        isVerified: true,
      });
      if (res.success) {
        setActiveTab('kpi');
        setInnerStoreName('');
        setInnerOwnerName('');
        setInnerEmail('');
        setInnerPassword('seller123');
        setInnerDescription('');
        setInnerLogo('');
        setInnerCoverImage('');
      } else {
        setInnerError(res.message);
      }
    }
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password');
      return;
    }
    const res = sellerLogin(loginEmail.trim(), loginPassword.trim());
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleQuickDemoLogin = (email: string) => {
    setLoginError('');
    sellerLogin(email, 'seller123');
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regStoreName.trim() || !regOwnerName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields marked *');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters');
      return;
    }
    const res = sellerRegister({
      storeName: regStoreName.trim(),
      ownerName: regOwnerName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      phone: regPhone.trim(),
      location: regLocation.trim(),
      category: regCategory,
      description: regDescription.trim(),
      logo: regLogo,
      coverImage: regCoverImage,
    });
    if (!res.success) {
      setRegError(res.message);
    }
  };

  // 1. If seller is NOT logged in, show the Seller Login & Registration Portal
  if (!isSellerLoggedIn || !currentSeller) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-md">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                  GMC Merchant Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authorized Storefront Access & Registration
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSellerPortalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In to Storefront
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register New Store
            </button>
          </div>

          {/* TAB 1: MERCHANT SIGN IN */}
          {authMode === 'login' && (
            <div className="space-y-5">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Registered merchants can add new products, adjust pricing in Nu., update inventory quantities, and manage fulfillment for their store.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Merchant Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="e.g. contact@gmcorganic.bt"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                      autoFocus
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="Enter your seller password..."
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginError && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {loginError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Merchant Storefront
                </button>
              </form>

              {/* Quick Demo Sellers */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Instant Demo Merchant Logins:
                  </span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                    Password: seller123
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: 'GMC Organic Farm Co-op', email: 'contact@gmcorganic.bt', tag: 'Fresh Produce' },
                    { name: 'Himalayan Bee Sanctuary', email: 'honey@himalayanbee.bt', tag: 'Organic Honey' },
                    { name: 'Gelephu Textile Arts', email: 'weavers@gelephutextiles.bt', tag: 'Handicrafts' },
                    { name: 'Druk Herbal & Wellness', email: 'info@drukherbal.bt', tag: 'Herbal & Balms' },
                  ].map((s) => (
                    <button
                      key={s.email}
                      type="button"
                      onClick={() => handleQuickDemoLogin(s.email)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-teal-800 dark:group-hover:text-teal-300">
                          {s.name}
                        </span>
                        <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                          {s.tag}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                        {s.email}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER NEW STORE */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Join the Gelephu Mindfulness City digital marketplace. Complete your store registration to begin listing your authentic Bhutanese products.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store / Business Name *
                  </label>
                  <input
                    type="text"
                    value={regStoreName}
                    onChange={(e) => setRegStoreName(e.target.value)}
                    placeholder="e.g. Sarpang Mountain Tea Estate"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Owner / Representative Name *
                  </label>
                  <input
                    type="text"
                    value={regOwnerName}
                    onChange={(e) => setRegOwnerName(e.target.value)}
                    placeholder="e.g. Tashi Pelden"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Merchant Email Address *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. tea@sarpangestate.bt"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 characters"
                      className="w-full px-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bhutan Phone Number
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+975-17123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location / GMC Sector
                </label>
                <input
                  type="text"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. Zone B - Artisan Hub, Gelephu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Store Description
                </label>
                <textarea
                  rows={2}
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                  placeholder="Briefly describe your craft, harvest, or products..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              {/* Store Branding & Imagery Upload */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Store Branding & Images
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload your store logo emblem and storefront cover banner (or select a Bhutanese preset)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <ImageUpload
                    id="reg-store-logo"
                    label="Store Logo / Brand Emblem"
                    sublabel="Square photo (1:1) for your storefront"
                    value={regLogo}
                    onChange={setRegLogo}
                    variant="logo"
                    presets={STORE_LOGO_PRESETS}
                  />

                  <ImageUpload
                    id="reg-store-cover"
                    label="Store Banner / Cover Photo"
                    sublabel="Landscape photo for your store header"
                    value={regCoverImage}
                    onChange={setRegCoverImage}
                    variant="cover"
                    presets={STORE_COVER_PRESETS}
                  />
                </div>
              </div>

              {regError && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {regError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                Register Store & Open Merchant Console
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 2. Authenticated Merchant Store State
  const currentStore = stores.find((s) => s.id === currentSeller.storeId) || {
    id: currentSeller.storeId,
    name: currentSeller.storeName,
    slug: currentSeller.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    tagline: 'Authentic Bhutanese Merchant Store',
    description: currentSeller.description || 'Verified local merchant in Gelephu Mindfulness City.',
    logo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    category: currentSeller.category,
    location: currentSeller.location,
    address: currentSeller.location,
    phone: currentSeller.phone,
    email: currentSeller.email,
    openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    rating: 5.0,
    reviewCount: 12,
    productCount: 0,
    isVerified: currentSeller.isVerified,
    joinedDate: '2025-01-01',
    status: 'approved',
  };

  // Match products belonging to THIS seller (supporting storeId, sellerId, or storeName)
  const isSellerProduct = (p: Product) =>
    p.sellerId === currentSeller.storeId ||
    p.sellerId === currentSeller.id ||
    (currentSeller.storeName && p.sellerName?.toLowerCase().trim() === currentSeller.storeName.toLowerCase().trim());

  const sellerProducts = products.filter(isSellerProduct);

  // Orders that contain items from this seller
  const sellerOrders = orders.filter((o) =>
    o.items.some((item) =>
      item.sellerId === currentSeller.storeId ||
      item.sellerId === currentSeller.id ||
      (currentSeller.storeName && item.sellerName?.toLowerCase().trim() === currentSeller.storeName.toLowerCase().trim())
    )
  );

  const totalSellerSales = sellerOrders.reduce((sum, ord) => {
    const sellerItems = ord.items.filter((item) =>
      item.sellerId === currentSeller.storeId ||
      item.sellerId === currentSeller.id ||
      (currentSeller.storeName && item.sellerName?.toLowerCase().trim() === currentSeller.storeName.toLowerCase().trim())
    );
    return sum + sellerItems.reduce((s, i) => s + i.subtotal, 0);
  }, 0);

  const startEditingProduct = (p: Product) => {
    if (!isSellerProduct(p)) {
      showToast('Unauthorized: You can only edit products from your own store', 'error');
      return;
    }
    setEditingProduct(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditPrice(p.price);
    setEditSalePrice(p.salePrice);
    setEditStock(p.stock);
    setEditDescription(p.description || '');
    setEditImageUrl(p.images[0] || '');
    setEditIsMadeInBhutan(p.isMadeInBhutan ?? true);
    setEditIsOrganic(p.isOrganic ?? false);
    setEditIsGmcExclusive(p.isGmcExclusive ?? false);
    setIsAddingProduct(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName.trim()) return;

    if (editingProduct.sellerId !== currentSeller.storeId) {
      showToast('Access Denied: You can only update products belonging to your store', 'error');
      return;
    }

    const discountPercentage =
      editSalePrice && editSalePrice < editPrice
        ? Math.round(((editPrice - editSalePrice) / editPrice) * 100)
        : undefined;

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      category: editCategory,
      categoryId: editCategory.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      price: Number(editPrice),
      salePrice: editSalePrice ? Number(editSalePrice) : undefined,
      discountPercentage,
      stock: Number(editStock),
      description: editDescription.trim(),
      images: editImageUrl.trim()
        ? [editImageUrl.trim(), ...editingProduct.images.slice(1)]
        : editingProduct.images,
      isMadeInBhutan: editIsMadeInBhutan,
      isOrganic: editIsOrganic,
      isGmcExclusive: editIsGmcExclusive,
    });

    setEditingProduct(null);
    showToast(`Updated "${editName}" pricing & stock levels!`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd = addProduct({
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description.trim() || 'Mindful quality product directly from Gelephu, Bhutan.',
      shortDescription: description.trim().slice(0, 100) || 'Quality authentic product.',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      discountPercentage: salePrice ? Math.round(((price - salePrice) / price) * 100) : undefined,
      category,
      categoryId: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      sellerId: currentSeller.storeId,
      sellerName: currentSeller.storeName,
      sellerVerified: currentSeller.isVerified,
      images: [
        imageUrl.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      ],
      rating: 5.0,
      reviewCount: 1,
      stock: Number(stock),
      lowStockThreshold: 5,
      unit: 'item',
      sku: `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: currentStore.location,
      isMadeInBhutan,
      isOrganic,
      isGmcExclusive,
      isFeatured: false,
      isNewArrival: true,
      tags: ['local', 'bhutan', 'gmc'],
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    setIsAddingProduct(false);
    setName('');
    setDescription('');
    setImageUrl('');
    showToast(`Added ${newProd.name} to your GMC storefront!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  GMC Merchant Portal
                </h3>
                <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-teal-200 dark:border-teal-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Merchant
                </span>
              </div>

              {/* Authenticated store info & sign out */}
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentSeller.storeName}
                </span>
                <span>•</span>
                <span>Owner: {currentSeller.ownerName}</span>
                <span>•</span>
                <span>{currentSeller.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('addSeller')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Add or onboard another seller store"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>+ Add Seller</span>
            </button>

            <button
              onClick={sellerLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Sign out of seller account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              onClick={() => setIsSellerPortalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close seller portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/70 dark:bg-slate-850/70 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'kpi', label: 'Store Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'products', label: `Catalog (${sellerProducts.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'orders', label: `Customer Orders (${sellerOrders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'settings', label: 'Store Details & Settings', icon: <Store className="w-4 h-4" /> },
            { id: 'addSeller', label: '+ Add / Register Seller', icon: <UserPlus className="w-4 h-4" /> },
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

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* 1. OVERVIEW & KPIS */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-100 mt-1">
                    {formatNu(totalSellerSales)}
                  </p>
                  <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5">Direct merchant payouts</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Active Catalog
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {sellerProducts.length} items
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Listed in marketplace</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Incoming Orders
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">
                    {sellerOrders.length}
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Gelephu area orders</p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    Store Rating
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{currentStore?.rating || '4.9'}</span>
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {currentStore?.reviewCount || 42} verified customer reviews
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 bg-gradient-to-r from-slate-900 dark:from-slate-950 to-teal-950 dark:to-slate-900 border border-transparent dark:border-slate-800 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base font-display">Expand Your Catalog</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    List new harvest produce, handicrafts, or mindfulness goods for Gelephu residents.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setIsAddingProduct(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. CATALOG PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Your Product Inventory</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage prices in Nu., stock levels, and badges. Want to onboard another store or seller?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('addSeller')}
                      className="text-teal-700 dark:text-teal-300 font-bold underline hover:text-teal-800 cursor-pointer"
                    >
                      + Register Seller Store
                    </button>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('addSeller')}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>+ Add Seller</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(!isAddingProduct);
                      if (!isAddingProduct) setEditingProduct(null);
                    }}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingProduct ? 'Cancel' : '+ New Product'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Product Form */}
              {editingProduct && (
                <form
                  onSubmit={handleUpdateProduct}
                  className="p-5 bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl border-2 border-teal-500/50 dark:border-teal-700/60 space-y-4 animate-fadeIn shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                        <Edit2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">
                          Edit Product: Pricing & Quantities
                        </h5>
                        <p className="text-[11px] text-teal-800 dark:text-teal-300">
                          SKU: {editingProduct.sku} • {editingProduct.name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-teal-100/50 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="Groceries & Organic Produce">Groceries & Organic Produce</option>
                        <option value="Bhutanese Handicrafts & Textiles">Bhutanese Handicrafts & Textiles</option>
                        <option value="Mindful Living & Wellness">Mindful Living & Wellness</option>
                        <option value="Daily Essentials & Fresh Foods">Daily Essentials & Fresh Foods</option>
                        <option value="Eco-Tech & Smart Living">Eco-Tech & Smart Living</option>
                      </select>
                    </div>
                  </div>

                  {/* PRICE AND QUANTITY CONTROLS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-teal-200 dark:border-teal-800">
                    <div>
                      <label className="text-[11px] font-bold text-teal-900 dark:text-teal-300 block mb-1">
                        Regular Price (Nu.) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-teal-900 dark:text-teal-300 block mb-1">
                        Sale Discount Price (Nu.) (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editSalePrice || ''}
                        onChange={(e) =>
                          setEditSalePrice(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="Leave empty for no sale"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      />
                      {editSalePrice && editSalePrice < editPrice && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          {Math.round(((editPrice - editSalePrice) / editPrice) * 100)}% Discount Ribbon
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-teal-900 dark:text-teal-300 block mb-1">
                        Inventory Quantity (Units in Stock) *
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          value={editStock}
                          onChange={(e) => setEditStock(Math.max(0, Number(e.target.value)))}
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setEditStock((s) => s + 10)}
                          className="px-2 py-2 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer whitespace-nowrap"
                          title="Quick add 10 units"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Describe origins, ingredients, mindful attributes..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={editIsMadeInBhutan}
                        onChange={(e) => setEditIsMadeInBhutan(e.target.checked)}
                        className="rounded accent-teal-700 cursor-pointer"
                      />
                      <span>🇧🇹 Made in Bhutan Certified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={editIsOrganic}
                        onChange={(e) => setEditIsOrganic(e.target.checked)}
                        className="rounded accent-teal-700 cursor-pointer"
                      />
                      <span>🌿 100% Organic</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={editIsGmcExclusive}
                        onChange={(e) => setEditIsGmcExclusive(e.target.checked)}
                        className="rounded accent-teal-700 cursor-pointer"
                      />
                      <span>GMC Exclusive</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Price & Stock Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Add Product Form */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-4 animate-fadeIn"
                >
                  <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Add New Product to GMC</h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bhutanese Wild Forest Honey (500g)"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="Groceries & Organic Produce">Groceries & Organic Produce</option>
                        <option value="Bhutanese Handicrafts & Textiles">Bhutanese Handicrafts & Textiles</option>
                        <option value="Mindful Living & Wellness">Mindful Living & Wellness</option>
                        <option value="Daily Essentials & Fresh Foods">Daily Essentials & Fresh Foods</option>
                        <option value="Eco-Tech & Smart Living">Eco-Tech & Smart Living</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Regular Price (Nu.)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Sale Price (Nu.) (Optional)
                      </label>
                      <input
                        type="number"
                        value={salePrice || ''}
                        onChange={(e) =>
                          setSalePrice(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="e.g. 380"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Available Stock
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe origins, ingredients, mindful attributes..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Image URL (Unsplash or image link)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isMadeInBhutan}
                        onChange={(e) => setIsMadeInBhutan(e.target.checked)}
                        className="rounded accent-teal-700"
                      />
                      <span>🇧🇹 Made in Bhutan Certified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isOrganic}
                        onChange={(e) => setIsOrganic(e.target.checked)}
                        className="rounded accent-teal-700"
                      />
                      <span>🌿 100% Organic</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isGmcExclusive}
                        onChange={(e) => setIsGmcExclusive(e.target.checked)}
                        className="rounded accent-teal-700"
                      />
                      <span>GMC Exclusive</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Publish to GMC Storefront
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-850 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock / Quantity</th>
                      <th className="p-3">Badges</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sellerProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.sku}</p>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            <span>{formatNu(p.salePrice || p.price)}</span>
                            {p.salePrice && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                                {formatNu(p.price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                p.stock > 5
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400 font-bold'
                              }`}
                            >
                              {p.stock} units
                            </span>
                            {/* Quick Quantity Adjustment Buttons */}
                            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-750 overflow-hidden bg-slate-50 dark:bg-slate-800">
                              <button
                                type="button"
                                onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })}
                                className="px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] cursor-pointer"
                                title="Quick decrease stock by 1"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                onClick={() => updateProduct(p.id, { stock: p.stock + 5 })}
                                className="px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-400 font-bold text-[10px] border-l border-slate-200 dark:border-slate-750 cursor-pointer"
                                title="Quick add 5 units to stock"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {p.isMadeInBhutan && (
                              <span className="text-[9px] bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded">
                                Bhutan
                              </span>
                            )}
                            {p.isOrganic && (
                              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded">
                                Organic
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEditingProduct(p)}
                              className="p-1.5 rounded-lg text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors cursor-pointer"
                              title="Edit Price, Quantity & Details"
                              aria-label="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {sellerProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                            No products listed for {currentSeller.storeName} yet
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-sm mx-auto">
                            As a registered seller, you can add and edit items for your store. Click &quot;New Product&quot; above to list your first item.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ORDERS RECEIVED TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Incoming Orders for Fulfillment</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update statuses as you prepare items for courier pickup in Gelephu.
                </p>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <p className="text-slate-500 dark:text-slate-400">No customer orders for this store yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sellerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                            by {ord.customerName} ({ord.customerPhone})
                          </span>
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5">
                        {ord.items
                          .filter((i) => i.sellerId === currentStore.id)
                          .map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300">
                                {item.quantity}x {item.productName}
                              </span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {formatNu(item.subtotal)}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>
                          Delivery Address: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Courier: {ord.deliveryMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. STORE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Store Profile & Licensing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified credentials filed under Gelephu Mindfulness City Commercial Authority.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Business Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentStore.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Tagline</span>
                  <span className="text-slate-800 dark:text-slate-200">{currentStore.tagline}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Physical Location</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{currentStore.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Contact Email</span>
                  <span className="font-mono text-slate-900 dark:text-white">{currentStore.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">GMC Verified Partner</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Approved & Certified Active</span>
                </div>
              </div>

              {/* Onboard Another Seller Card */}
              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-sm text-teal-950 dark:text-teal-200">
                    Onboard Another Business or Cooperative
                  </h5>
                  <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
                    Register and manage multiple storefronts or craft operations across Gelephu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('addSeller')}
                  className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Seller</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. ADD / REGISTER SELLER TAB */}
          {activeTab === 'addSeller' && (
            <div className="max-w-2xl space-y-5 animate-fadeIn">
              <div className="p-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base font-display">
                      Add & Register New Merchant
                    </h4>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Provision a new seller store and credentials to sell on GMC Marketplace.
                    </p>
                  </div>
                </div>
              </div>

              {innerError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{innerError}</span>
                </div>
              )}

              <form onSubmit={handleInnerAddSellerSubmit} className="space-y-4 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store / Cooperative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gelephu Organic Honey & Spices"
                    value={innerStoreName}
                    onChange={(e) => setInnerStoreName(e.target.value)}
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
                      placeholder="e.g. Tshering Lhamo"
                      value={innerOwnerName}
                      onChange={(e) => setInnerOwnerName(e.target.value)}
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
                      value={innerPhone}
                      onChange={(e) => setInnerPhone(e.target.value)}
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
                      placeholder="seller@gelephu.bt"
                      value={innerEmail}
                      onChange={(e) => setInnerEmail(e.target.value)}
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
                      value={innerPassword}
                      onChange={(e) => setInnerPassword(e.target.value)}
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
                      placeholder="e.g. Mindfulness Crafts Quarter, Gelephu"
                      value={innerLocation}
                      onChange={(e) => setInnerLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Category
                    </label>
                    <select
                      value={innerCategory}
                      onChange={(e) => setInnerCategory(e.target.value)}
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
                    Store Tagline & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the goods or craft tradition of this store..."
                    value={innerDescription}
                    onChange={(e) => setInnerDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-700 outline-hidden resize-none"
                  />
                </div>

                {/* Store Branding & Imagery Upload */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Store Branding & Imagery
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Upload custom store logo emblem and storefront cover banner
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                    <ImageUpload
                      id="inner-store-logo"
                      label="Store Logo / Brand Emblem"
                      sublabel="Square photo (1:1) for merchant listing"
                      value={innerLogo}
                      onChange={setInnerLogo}
                      variant="logo"
                      presets={STORE_LOGO_PRESETS}
                    />

                    <ImageUpload
                      id="inner-store-cover"
                      label="Store Banner / Cover Photo"
                      sublabel="Landscape photo for storefront header"
                      value={innerCoverImage}
                      onChange={setInnerCoverImage}
                      variant="cover"
                      presets={STORE_COVER_PRESETS}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="switchImmediateCheck"
                    checked={innerSwitchImmediate}
                    onChange={(e) => setInnerSwitchImmediate(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 cursor-pointer"
                  />
                  <label htmlFor="switchImmediateCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Switch to this new seller session immediately after registration
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kpi')}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Register Seller</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
