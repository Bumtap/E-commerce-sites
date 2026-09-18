import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Store } from '../../types';
import { CheckCircle2, Star, MapPin, Package, ArrowRight } from 'lucide-react';

export const FeaturedStores: React.FC = () => {
  const { stores, setActiveStore, setIsSellerPortalOpen } = useShop();

  const approvedStores = stores.filter((s) => s.status === 'approved');

  return (
    <section id="featured-stores-section" className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Discover <span className="text-teal-700 dark:text-teal-400">GMC Businesses</span>
            </h2>
            <span className="bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 uppercase">
              Verified Partners
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Support local enterprises, master artisan guilds, and organic cooperatives based in Gelephu
          </p>
        </div>

        <button
          onClick={() => setIsSellerPortalOpen(true)}
          className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white flex items-center gap-1 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 transition-colors w-fit cursor-pointer"
        >
          <span>Become a Seller / Open Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {approvedStores.map((store) => (
          <div
            key={store.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden hover:border-teal-500/40 dark:hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Store Cover Image */}
            <div className="relative h-28 w-full overflow-hidden bg-slate-900">
              <img
                src={store.coverImage}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Category tag */}
              <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                {store.category}
              </span>
            </div>

            {/* Store Body & Details */}
            <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
              {/* Logo overlapping the cover */}
              <div className="flex items-end justify-between -mt-7 mb-2">
                <div className="w-14 h-14 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-md shrink-0">
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{store.rating}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({store.reviewCount})</span>
                </div>
              </div>

              {/* Name & Tagline */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {store.name}
                  </h3>
                  {store.isVerified && (
                    <span title="Verified GMC Business">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {store.tagline}
                </p>

                {/* Location and Products count */}
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="truncate">{store.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{store.productCount} Products Listed</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveStore(store)}
                className="mt-4 w-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 dark:hover:bg-teal-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Visit Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
