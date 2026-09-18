import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { Product, Store, Category, Coupon, DeliveryZone } from '../../types';
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
  Star
} from 'lucide-react';

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
    orders,
    coupons,
    deliveryZones,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'stores' | 'categories' | 'coupons' | 'zones'
  >('overview');

  // New coupon form
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(500);

  if (!isAdminPortalOpen) return null;

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
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  Authority Console
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Gelephu Mindfulness City Digital Commerce Control Plane
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPortalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close admin portal"
          >
            <X className="w-5 h-5" />
          </button>
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
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  GMC Registered Businesses & Cooperatives
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Grant or revoke official Gelephu Mindfulness City verification credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stores.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={s.logo}
                        alt={s.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">{s.name}</h5>
                          {s.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.location}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Rating: {s.rating} ★ • {s.productCount} items
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">GMC Verified:</span>
                      <button
                        onClick={() => handleToggleStoreVerification(s)}
                        className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                          s.isVerified
                            ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-800 dark:hover:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-700 hover:text-white'
                        }`}
                      >
                        {s.isVerified ? '✓ Verified Partner' : 'Approve GMC Partner'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Marketplace Categories</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize store navigation and circular category chips.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center gap-3"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{c.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {c.itemCount} products • Slug: {c.slug}
                      </p>
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
        </div>
      </div>
    </div>
  );
};
