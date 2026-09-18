import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const SpecialCollections: React.FC = () => {
  const { setSelectedCategoryFilter, setIsSearchOpen } = useShop();

  const collections = [
    {
      id: 'col-1',
      title: 'Authentic Made in Bhutan',
      subtitle: 'Certified handwoven silk-cotton textiles, traditional crafts & sacred incense',
      image: 'https://images.unsplash.com/photo-1606744888344-493238955dea?w=800&auto=format&fit=crop&q=80',
      badge: '100% HERITAGE',
      category: 'handicrafts',
      color: 'from-amber-950/90 via-slate-900/80 to-transparent',
    },
    {
      id: 'col-2',
      title: 'Mindful Valley Organic',
      subtitle: 'Glacial red rice, raw forest honey & sacred Himalayan cordyceps tea',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      badge: 'CERTIFIED ORGANIC',
      category: 'food-beverage',
      color: 'from-emerald-950/90 via-slate-900/80 to-transparent',
    },
    {
      id: 'col-3',
      title: 'GMC Eco-Tech & Wearables',
      subtitle: 'Solar arrays, mindfulness HRV wellness trackers & sustainable accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      badge: 'FUTURE LIVING',
      category: 'electronics',
      color: 'from-sky-950/90 via-slate-900/80 to-transparent',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
            Bhutan & GMC <span className="text-teal-700 dark:text-teal-400">Curated Collections</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Specially highlighted assortments celebrating Bhutanese craftsmanship & mindful innovation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => {
              setSelectedCategoryFilter(col.category);
              document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-64 sm:h-72 cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            {/* Background image */}
            <img
              src={col.image}
              alt={col.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${col.color}`} />

            {/* Content inside card */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
                  {col.badge}
                </span>
                <h3 className="text-xl font-bold font-display leading-snug drop-shadow-xs">
                  {col.title}
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-3 drop-shadow-xs">
                  {col.subtitle}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
