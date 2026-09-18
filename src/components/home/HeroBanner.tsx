import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { banners, setIsSearchOpen, setSelectedCategoryFilter } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  const handleCtaClick = () => {
    if (current.ctaLink.includes('fresh-produce')) {
      setSelectedCategoryFilter('fresh-produce');
      document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (current.ctaLink.includes('handicrafts')) {
      setSelectedCategoryFilter('handicrafts');
      document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (current.ctaLink.includes('electronics')) {
      setSelectedCategoryFilter('electronics');
      document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <section
      className="max-w-7xl mx-auto px-4 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-800/40 dark:border-slate-800 bg-slate-950 text-white min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{current.badgeText || current.tag}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] mb-3">
            {current.title}
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-6 max-w-lg">
            {current.subtitle}
          </p>

          {/* CTA Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 text-sm sm:text-base group cursor-pointer"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const deals = document.getElementById('flash-deals-section');
                if (deals) deals.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl transition-all text-sm backdrop-blur-xs border border-white/20 cursor-pointer"
            >
              Explore Deals
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Arrows matching reference screenshot */}
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
          }
          className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
          className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
          aria-label="Next banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
