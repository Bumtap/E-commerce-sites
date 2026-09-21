import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Store } from '../../types';
import { formatWhatsAppUrl } from '../../utils/whatsapp';
import {
  CheckCircle2,
  Star,
  MapPin,
  Package,
  ArrowRight,
  MessageCircle,
  Search,
  Building2,
  User,
  ShoppingBag,
} from 'lucide-react';

export const FeaturedStores: React.FC = () => {
  const { stores, sellers, products, setActiveStore, setIsSellerPortalOpen } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Combine and normalize all stores and sellers so NO merchant is ever omitted on the customers page
  const allSellersAndStores: (Store & { ownerName?: string; email?: string })[] = useMemo(() => {
    const storeMap = new Map<string, Store & { ownerName?: string; email?: string }>();

    // 1. Add all existing stores
    stores.forEach((store) => {
      // Find matching seller account to enrich with ownerName and contact info
      const matchingSeller = sellers.find(
        (s) =>
          s.storeId === store.id ||
          s.id === store.id ||
          s.storeName.toLowerCase().trim() === store.name.toLowerCase().trim()
      );

      storeMap.set(store.id, {
        ...store,
        ownerName: matchingSeller?.ownerName || 'Verified Merchant',
        email: store.email || matchingSeller?.email || 'merchant@gmc-bhutan.bt',
        phone: store.phone || matchingSeller?.phone || '+975 17123456',
      });
    });

    // 2. Add any sellers from `sellers` that might not have an entry in `stores`
    sellers.forEach((seller) => {
      const storeId = seller.storeId || seller.id;
      if (!storeMap.has(storeId)) {
        storeMap.set(storeId, {
          id: storeId,
          name: seller.storeName,
          slug: seller.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tagline: `Certified Bhutanese goods & craftsmanship from ${seller.storeName}`,
          description: `Authentic local enterprise in Gelephu Mindfulness City managed by ${seller.ownerName}. Committed to sustainability, traditional artisan heritage, and high quality.`,
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
          coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
          category: seller.category || 'General Merchant',
          rating: 5.0,
          reviewCount: 4,
          productCount: 0,
          isVerified: seller.isVerified ?? true,
          location: 'GMC Central District, Gelephu',
          address: 'GMC Central Mindfulness Sector, Gelephu, Bhutan',
          phone: seller.phone || '+975 17123456',
          email: seller.email || 'seller@gmc-bhutan.bt',
          openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
          joinedDate: seller.createdAt || '2024-01-01',
          status: 'approved',
          ownerName: seller.ownerName,
        });
      }
    });

    return Array.from(storeMap.values());
  }, [stores, sellers]);

  // Extract categories for filter pills
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allSellersAndStores.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['All', ...Array.from(cats)];
  }, [allSellersAndStores]);

  // Filter sellers by search query and category
  const filteredStores = useMemo(() => {
    return allSellersAndStores.filter((store) => {
      if (selectedCategory !== 'All' && store.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = store.name.toLowerCase().includes(q);
        const matchOwner = (store.ownerName || '').toLowerCase().includes(q);
        const matchLocation = (store.location || '').toLowerCase().includes(q);
        const matchCategory = (store.category || '').toLowerCase().includes(q);
        const matchTagline = (store.tagline || '').toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchLocation && !matchCategory && !matchTagline) {
          return false;
        }
      }
      return true;
    });
  }, [allSellersAndStores, selectedCategory, searchQuery]);

  return (
    <section id="featured-stores-section" className="max-w-7xl mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              All GMC Sellers & <span className="text-teal-700 dark:text-teal-400">Local Merchants</span>
            </h2>
            <span className="bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              {allSellersAndStores.length} Registered Sellers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Explore authentic Bhutanese producers, organic farm cooperatives, and craft guilds in Gelephu. Explore their storefronts or message directly on WhatsApp.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSellerPortalOpen(true)}
            className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 px-3.5 py-2 rounded-xl border border-teal-200 dark:border-teal-800 transition-colors w-fit cursor-pointer shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Merchant Portal / Register</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sellers by shop name, craft, or location..."
            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">
            No sellers match your search "{searchQuery}".
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Try searching for a different keyword or reset filters to see all {allSellersAndStores.length} registered GMC sellers.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Show All Sellers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredStores.map((store) => {
            // Calculate live product count for this seller from active catalog
            const liveStoreProducts = products.filter(
              (p) =>
                p.sellerId === store.id ||
                (store.id && p.sellerId === store.id.replace('store-', 'seller-')) ||
                (store.id && p.sellerId === store.id.replace('seller-', 'store-')) ||
                (store.slug && p.sellerId?.includes(store.slug)) ||
                (p.sellerName && store.name && p.sellerName.toLowerCase().trim() === store.name.toLowerCase().trim())
            );

            return (
              <div
                key={store.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden hover:border-teal-500/40 dark:hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Store Cover Image */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img
                    src={store.coverImage}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Category tag */}
                  <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
                    {store.category}
                  </span>
                </div>

                {/* Store Body & Details */}
                <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
                  {/* Logo overlapping the cover banner */}
                  <div className="flex items-end justify-between -mt-8 mb-2">
                    <div className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-md shrink-0">
                      <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{store.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        ({store.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Store Information */}
                  <div>
                    {/* Name & Verified Badge */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3
                        onClick={() => setActiveStore(store)}
                        className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors cursor-pointer"
                      >
                        {store.name}
                      </h3>
                      {store.isVerified && (
                        <span title="Verified GMC Business Partner">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Owner Name */}
                    {store.ownerName && (
                      <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold flex items-center gap-1 mb-1">
                        <User className="w-3 h-3" />
                        <span>Managed by {store.ownerName}</span>
                      </p>
                    )}

                    {/* Tagline */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {store.tagline}
                    </p>

                    {/* Location and Live Product Count */}
                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate">{store.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Package className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>
                          {liveStoreProducts.length} {liveStoreProducts.length === 1 ? 'Product' : 'Products'} Available to Order
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    {/* Primary Button: Explore Storefront & Products */}
                    <button
                      onClick={() => setActiveStore(store)}
                      className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explore Storefront ({liveStoreProducts.length} items)</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>

                    {/* Secondary Button: WhatsApp Message */}
                    <a
                      href={formatWhatsAppUrl(
                        store.phone,
                        `Kuzu Zangpo! Hello ${store.name}, I am browsing your store on GMC Marketplace and would like to inquire about your products.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>WhatsApp Seller</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
