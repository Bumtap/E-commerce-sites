import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { formatNu } from '../../utils/format';
import { Star, ShoppingBag, Eye, Heart, Sparkles, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title = 'All Marketplace Products',
  subtitle = 'Discover and order authentic Bhutanese goods directly from Gelephu merchants',
}) => {
  const {
    products,
    stores,
    categories,
    addToCart,
    setActiveProduct,
    setActiveStore,
    toggleWishlist,
    isWishlisted,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'made_in_bhutan' | 'organic' | 'new' | 'best_seller'>('all');
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('all');

  // Find active category object for clean name display
  const activeCategory = selectedCategoryFilter
    ? categories.find(
        (c) =>
          c.id === selectedCategoryFilter ||
          c.slug === selectedCategoryFilter ||
          c.slug === selectedCategoryFilter.replace(/^cat-/, '') ||
          c.id === `cat-${selectedCategoryFilter}`
      )
    : null;

  // Extract unique sellers for the quick seller filter
  const uniqueSellers = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    products.forEach((p) => {
      const id = p.sellerId || p.sellerName;
      if (!map.has(id)) {
        map.set(id, { id, name: p.sellerName });
      }
    });
    return Array.from(map.values());
  }, [products]);

  // All products are visible to customers so they can browse and order every item
  const filteredProducts = products.filter((p) => {
    // Seller filter
    if (selectedSellerFilter !== 'all') {
      const matchSeller =
        p.sellerId === selectedSellerFilter ||
        p.sellerName.toLowerCase().trim() === selectedSellerFilter.toLowerCase().trim();
      if (!matchSeller) return false;
    }

    if (selectedCategoryFilter) {
      const filterLower = selectedCategoryFilter.toLowerCase();
      const filterClean = filterLower.replace(/^cat-/, '');
      const pCatIdClean = (p.categoryId || '').toLowerCase().replace(/^cat-/, '');
      const pCatName = (p.category || '').toLowerCase();

      const matchesDirectId = p.categoryId === selectedCategoryFilter;
      const matchesCleanId = pCatIdClean === filterClean;
      const matchesCategoryObj =
        activeCategory &&
        (p.categoryId === activeCategory.id ||
          pCatIdClean === activeCategory.slug ||
          pCatName === activeCategory.name.toLowerCase());
      const matchesText = pCatName.includes(filterClean.replace(/-/g, ' '));

      if (!matchesDirectId && !matchesCleanId && !matchesCategoryObj && !matchesText) {
        return false;
      }
    }

    if (activeTab === 'made_in_bhutan') return p.isMadeInBhutan;
    if (activeTab === 'organic') return p.isOrganic;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'best_seller') return p.isBestSeller;
    return true;
  });

  return (
    <section id="featured-products-section" className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {selectedCategoryFilter
                ? `Category: ${activeCategory?.name || products.find((p) => p.categoryId === selectedCategoryFilter)?.category || 'Selected'}`
                : title}
            </h2>
            <span className="bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              {filteredProducts.length} Available to Order
            </span>
            {selectedCategoryFilter && (
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                Clear Category ✕
              </button>
            )}
            {selectedSellerFilter !== 'all' && (
              <button
                onClick={() => setSelectedSellerFilter('all')}
                className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                Seller Filter Active ✕
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>
        </div>

        {/* Filter Pills and Seller Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Seller Filter Dropdown */}
          <select
            value={selectedSellerFilter}
            onChange={(e) => setSelectedSellerFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs"
            title="Filter products by merchant"
          >
            <option value="all">All Sellers ({uniqueSellers.length})</option>
            {uniqueSellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                Store: {seller.name}
              </option>
            ))}
          </select>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: `All Items (${products.length})` },
              { id: 'made_in_bhutan', label: '🇧🇹 Made in Bhutan' },
              { id: 'organic', label: '🌿 100% Organic' },
              { id: 'best_seller', label: '🔥 Best Sellers' },
              { id: 'new', label: '✨ New Arrivals' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid: 5 cols on lg/xl, 3 on md, 2 on mobile */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">
            No products currently match this combination of filters.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
            All authentic GMC goods are listed by registered merchants. Click below to view all items available in our marketplace.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategoryFilter(null);
                setSelectedSellerFilter('all');
              }}
              className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters & Show All Products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
          {filteredProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            const isLowStock = product.stock <= product.lowStockThreshold && product.stock > 0;
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-600/40 dark:hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Badges in top corners */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                  {product.isMadeInBhutan && (
                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span>Made in Bhutan</span>
                    </span>
                  )}
                  {product.isOrganic && (
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/80 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                      Organic
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs flex items-center justify-center border transition-all cursor-pointer ${
                    wishlisted
                      ? 'text-rose-600 border-rose-200 dark:border-rose-900/50 shadow-sm'
                      : 'text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Image Container with Quick View */}
                <div
                  onClick={() => setActiveProduct(product)}
                  className="relative aspect-square w-full p-4 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Stock Status Badge */}
                  {isOutOfStock ? (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-300 dark:border-rose-800">
                        Out of Stock
                      </span>
                    </div>
                  ) : isLowStock ? (
                    <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                      Only {product.stock} left!
                    </span>
                  ) : null}

                  {/* Hover Quick View Button */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
                    <span className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Eye className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Seller Name & Verified Badge - Clickable to explore seller storefront */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const matchedStore = stores.find(
                          (s) =>
                            s.id === product.sellerId ||
                            s.name.toLowerCase().trim() === product.sellerName.toLowerCase().trim() ||
                            (product.sellerId && s.id.includes(product.sellerId.replace('seller-', '')))
                        );
                        if (matchedStore) {
                          setActiveStore(matchedStore);
                        } else {
                          setSelectedSellerFilter(product.sellerId || product.sellerName);
                        }
                      }}
                      className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold mb-1 transition-colors text-left group/seller cursor-pointer w-fit"
                      title={`Explore seller: ${product.sellerName}`}
                    >
                      <span className="truncate group-hover/seller:underline">{product.sellerName}</span>
                      {product.sellerVerified && (
                        <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                      <span className="text-[9px] text-teal-600 dark:text-teal-400 opacity-0 group-hover/seller:opacity-100 transition-opacity">↗</span>
                    </button>

                    {/* Product Name */}
                    <h3
                      onClick={() => setActiveProduct(product)}
                      className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer transition-colors leading-snug"
                    >
                      {product.name}
                    </h3>

                    {/* Rating & Review Count */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Pricing and Add to Cart button */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline justify-between gap-1 flex-wrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {formatNu(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                            {formatNu(product.price)}
                          </span>
                        )}
                      </div>

                      {product.discountPercentage && (
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          : 'bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
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
