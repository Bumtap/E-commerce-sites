import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { Product, OrderStatus } from '../../types';
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
  Truck
} from 'lucide-react';

export const SellerPortalModal: React.FC = () => {
  const {
    isSellerPortalOpen,
    setIsSellerPortalOpen,
    stores,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    showToast,
  } = useShop();

  // Current active seller (defaulting to the first store, e.g. Gelephu Organic Cooperative)
  const [activeSellerId, setActiveSellerId] = useState<string>(stores[0]?.id || 'store-1');
  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'settings'>('kpi');

  // Add Product Form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries & Organic Produce');
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
  const [editCategory, setEditCategory] = useState('Groceries & Organic Produce');
  const [editPrice, setEditPrice] = useState(450);
  const [editSalePrice, setEditSalePrice] = useState<number | undefined>(undefined);
  const [editStock, setEditStock] = useState(25);
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsMadeInBhutan, setEditIsMadeInBhutan] = useState(true);
  const [editIsOrganic, setEditIsOrganic] = useState(true);
  const [editIsGmcExclusive, setEditIsGmcExclusive] = useState(false);

  const startEditingProduct = (p: Product) => {
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

  if (!isSellerPortalOpen) return null;

  const currentStore = stores.find((s) => s.id === activeSellerId) || stores[0];
  const sellerProducts = products.filter((p) => p.sellerId === currentStore?.id);

  // Orders that contain items from this seller
  const sellerOrders = orders.filter((o) =>
    o.items.some((item) => item.sellerId === currentStore?.id)
  );

  const totalSellerSales = sellerOrders.reduce((sum, ord) => {
    const sellerItems = ord.items.filter((item) => item.sellerId === currentStore?.id);
    return sum + sellerItems.reduce((s, i) => s + i.subtotal, 0);
  }, 0);

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
      sellerId: currentStore.id,
      sellerName: currentStore.name,
      sellerVerified: currentStore.isVerified,
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

              {/* Store selector dropdown for testing */}
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Managing:</span>
                <select
                  value={activeSellerId}
                  onChange={(e) => setActiveSellerId(e.target.value)}
                  className="font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer hover:underline"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100">
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSellerPortalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close seller portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/70 dark:bg-slate-850/70 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'kpi', label: 'Store Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'products', label: `Catalog (${sellerProducts.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'orders', label: `Customer Orders (${sellerOrders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'settings', label: 'Store Details & Settings', icon: <Store className="w-4 h-4" /> },
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Your Product Inventory</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage prices in Nu., update stock levels/quantities, and configure Bhutan authenticity badges.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProduct(!isAddingProduct);
                    if (!isAddingProduct) setEditingProduct(null);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingProduct ? 'Cancel' : 'New Product'}</span>
                </button>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
