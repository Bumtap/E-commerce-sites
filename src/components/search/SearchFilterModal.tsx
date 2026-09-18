import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import {
  X,
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const SearchFilterModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    categories,
    stores,
    products,
    addToCart,
    setActiveProduct,
  } = useShop();

  // Local filter states
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [onlyBhutan, setOnlyBhutan] = useState<boolean>(false);
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'newest'>('featured');

  // Filtered and sorted products
  const searchResults = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesSeller = p.sellerName.toLowerCase().includes(q);
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesCategory && !matchesSeller && !matchesTags) {
            return false;
          }
        }
        // Category filter
        if (selectedCategoryFilter && p.categoryId !== selectedCategoryFilter && p.slug !== selectedCategoryFilter) {
          return false;
        }
        // Seller filter
        if (selectedSeller !== 'all' && p.sellerId !== selectedSeller) {
          return false;
        }
        // Price filter
        const price = p.salePrice || p.price;
        if (price > maxPrice) return false;
        // Toggles
        if (onlyBhutan && !p.isMadeInBhutan) return false;
        if (onlyOrganic && !p.isOrganic) return false;
        if (onlyInStock && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedCategoryFilter,
    selectedSeller,
    maxPrice,
    onlyBhutan,
    onlyOrganic,
    onlyInStock,
    sortBy,
  ]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategoryFilter(null);
    setSelectedSeller('all');
    setMaxPrice(20000);
    setOnlyBhutan(false);
    setOnlyOrganic(false);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Search Bar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-teal-700 dark:text-teal-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, organic food, textiles, handicrafts, electronics..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 shadow-2xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Filters</span>
            </button>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Filters + Products Grid */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Left Filter Sidebar */}
          <aside className="w-full md:w-64 p-5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-5 text-xs text-slate-700 dark:text-slate-300">
            {/* Sort by */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-600 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="featured">Featured & Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Categories</label>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    !selectedCategoryFilter
                      ? 'bg-teal-700 text-white font-bold'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center cursor-pointer ${
                      selectedCategoryFilter === cat.slug
                        ? 'bg-teal-700 text-white font-bold'
                        : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                <span>Max Price</span>
                <span className="text-teal-700 dark:text-teal-400">{formatNu(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="200"
                max="25000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                <span>Nu. 200</span>
                <span>Nu. 25,000+</span>
              </div>
            </div>

            {/* Seller Filter */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">GMC Business / Seller</label>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-600 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Verified Merchants</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Badges Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyBhutan}
                  onChange={(e) => setOnlyBhutan(e.target.checked)}
                  className="rounded accent-teal-700 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-medium">🇧🇹 Made in Bhutan Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOrganic}
                  onChange={(e) => setOnlyOrganic(e.target.checked)}
                  className="rounded accent-teal-700 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-medium">🌿 100% Certified Organic</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-teal-700 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-medium">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Found <span className="text-slate-900 dark:text-white font-bold">{searchResults.length}</span>{' '}
                {searchResults.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No products match your criteria</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try adjusting keywords, price ranges, or removing filters.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-600/40 dark:hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div
                      onClick={() => {
                        setActiveProduct(product);
                        setIsSearchOpen(false);
                      }}
                      className="relative aspect-square w-full p-3 bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform"
                      />
                      {product.discountPercentage && (
                        <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-3 flex flex-col flex-1 justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mb-0.5">
                          {product.sellerName}
                        </p>
                        <h4
                          onClick={() => {
                            setActiveProduct(product);
                            setIsSearchOpen(false);
                          }}
                          className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            {formatNu(product.salePrice || product.price)}
                          </span>
                          {product.salePrice && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                              {formatNu(product.price)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="mt-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
