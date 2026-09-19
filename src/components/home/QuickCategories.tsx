import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ChevronRight } from 'lucide-react';

export const QuickCategories: React.FC = () => {
  const { categories, selectedCategoryFilter, setSelectedCategoryFilter, setIsSearchOpen } = useShop();

  const handleSelect = (cat: typeof categories[0]) => {
    if (selectedCategoryFilter === cat.id || selectedCategoryFilter === cat.slug) {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(cat.id);
      document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header matching Reference Image */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
            Shop From <span className="text-teal-700 dark:text-teal-400">Top Categories</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Explore curated collections from Gelephu Mindfulness City & across Bhutan
          </p>
        </div>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold text-xs sm:text-sm flex items-center gap-1 group transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Circular Category Row matching Reference Template */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1">
        {categories.map((cat) => {
          const isSelected = selectedCategoryFilter === cat.id || selectedCategoryFilter === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className="flex flex-col items-center group shrink-0 w-20 sm:w-24 text-center focus:outline-none cursor-pointer"
            >
              {/* Circular Container with double ring effect like reference image */}
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-teal-600 dark:ring-teal-400 ring-offset-2 dark:ring-offset-slate-950 scale-105 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 group-hover:ring-2 group-hover:ring-teal-500/50 group-hover:scale-105 shadow-xs'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {isSelected && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-teal-600 dark:bg-teal-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white dark:bg-slate-900 rounded-full" />
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-xs font-semibold leading-tight line-clamp-2 transition-colors ${
                  isSelected
                    ? 'text-teal-700 dark:text-teal-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 group-hover:text-teal-800 dark:group-hover:text-teal-400'
                }`}
              >
                {cat.name.split('&')[0]}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{cat.itemCount} items</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
