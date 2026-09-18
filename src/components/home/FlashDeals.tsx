import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import { Clock, Flame, ShoppingBag, Eye, Heart, ChevronRight } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const { products, addToCart, setActiveProduct, toggleWishlist, isWishlisted, setIsSearchOpen } = useShop();

  // Flash deal products
  const dealProducts = products.filter((p) => p.isFlashDeal || (p.discountPercentage && p.discountPercentage >= 15)).slice(0, 5);

  // Real-time countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0) return null;

  return (
    <section id="flash-deals-section" className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Grab The Best Deals on <span className="text-teal-700 dark:text-teal-400">GMC Specials</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Limited-time discounts directly from verified local producers
            </p>
          </div>
        </div>

        {/* Live Timer and View All */}
        <div className="flex items-center gap-4">
          {/* Countdown Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
            <span className="bg-slate-800 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-slate-500">:</span>
            <span className="bg-slate-800 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-slate-500">:</span>
            <span className="bg-slate-800 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold text-xs sm:text-sm flex items-center gap-1 group transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Deals Cards Row matching Reference Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {dealProducts.map((product) => {
          const savings = product.salePrice ? product.price - product.salePrice : 0;
          const wishlisted = isWishlisted(product.id);

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 dark:hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Top Discount Badge in Cyan/Teal like reference image */}
              {product.discountPercentage && (
                <div className="absolute top-2.5 right-2.5 z-10 bg-teal-600 text-white font-extrabold text-[11px] px-2 py-1 rounded-lg shadow-sm flex flex-col items-center leading-none">
                  <span>{product.discountPercentage}%</span>
                  <span className="text-[9px] uppercase tracking-tighter">OFF</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs flex items-center justify-center border transition-all ${
                  wishlisted
                    ? 'text-rose-600 border-rose-200 dark:border-rose-900/50'
                    : 'text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Image Container with Hover Quick View */}
              <div
                onClick={() => setActiveProduct(product)}
                className="relative aspect-square w-full p-4 bg-slate-50 dark:bg-slate-850 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Quick View Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </span>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider truncate mb-1">
                    {product.sellerName}
                  </p>
                  <h3
                    onClick={() => setActiveProduct(product)}
                    className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer transition-colors leading-snug"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {/* Price Row: Nu. salePrice and original price */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {formatNu(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                        {formatNu(product.price)}
                      </span>
                    )}
                  </div>

                  {/* "Save Nu. X" in green tag matching reference screenshot */}
                  {savings > 0 && (
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Save • {formatNu(savings)}
                    </p>
                  )}

                  {/* Add to Cart button */}
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="mt-3 w-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 dark:hover:bg-teal-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
