import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Menu,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Apple,
  Palette,
  Coffee,
  Shirt,
  Home,
  Cpu,
  Gift,
  Flame,
  Sun,
  Moon,
  Store,
  Check,
  X,
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Apple: <Apple className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
};

// Concise display labels to prevent long, cluttered header bars
const SHORT_LABELS: Record<string, string> = {
  'groceries': 'Groceries',
  'fresh-produce': 'Fresh Produce',
  'handicrafts': 'Handicrafts',
  'wellness': 'Wellness',
  'food-beverage': 'Beverages & Tea',
  'fashion': 'Fashion & Silk',
  'home-living': 'Home Living',
  'electronics': 'Eco-Tech',
  'souvenirs': 'GMC Souvenirs',
};

export const Navbar: React.FC = () => {
  const {
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    isDarkMode,
    toggleDarkMode
  } = useShop();

  const [showAllDropdown, setShowAllDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const allCatRef = useRef<HTMLDivElement>(null);
  const moreCatRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allCatRef.current && !allCatRef.current.contains(event.target as Node)) {
        setShowAllDropdown(false);
      }
      if (moreCatRef.current && !moreCatRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (slug: string) => {
    if (selectedCategoryFilter === slug) {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(slug);
      const gridElem = document.getElementById('featured-products-section');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Split categories: top 4 prominent ones, remaining in "More Categories" dropdown
  const PRIMARY_COUNT = 4;
  const primaryCategories = categories.slice(0, PRIMARY_COUNT);
  const overflowCategories = categories.slice(PRIMARY_COUNT);

  // Check if an overflow category is currently active
  const activeOverflowCat = overflowCategories.find(
    (cat) => cat.slug === selectedCategoryFilter
  );

  const activeCategoryObj = categories.find(
    (cat) => cat.slug === selectedCategoryFilter
  );

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold relative transition-colors duration-200 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2">
        {/* Left Section: All Categories Dropdown + Shortened Quick Categories */}
        <div className="flex items-center gap-1 sm:gap-1.5 py-2 overflow-x-auto no-scrollbar">
          {/* 1. All Categories Dropdown Menu */}
          <div ref={allCatRef} className="relative shrink-0">
            <button
              onClick={() => {
                setShowAllDropdown(!showAllDropdown);
                setShowMoreDropdown(false);
              }}
              aria-expanded={showAllDropdown}
              aria-label="Browse all categories"
              className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-xs font-bold text-xs cursor-pointer"
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">All Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showAllDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-68 sm:w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>GMC Departments</span>
                  <span>{categories.length} Categories</span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryFilter === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleCategoryClick(cat.slug);
                          setShowAllDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-colors text-xs ${
                          isSelected
                            ? 'text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 font-bold'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-teal-700 dark:text-teal-400 shrink-0">
                            {ICON_MAP[cat.iconName] || <ShoppingBag className="w-4 h-4" />}
                          </span>
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                            {cat.itemCount}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Top Shortened Categories (Clean, concise links) */}
          <div className="hidden sm:flex items-center gap-1">
            {primaryCategories.map((cat) => {
              const isSelected = selectedCategoryFilter === cat.slug;
              const shortLabel = SHORT_LABELS[cat.slug] || cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  title={cat.name}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 dark:bg-teal-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}

            {/* 3. "More Categories ▾" Dropdown List */}
            {overflowCategories.length > 0 && (
              <div ref={moreCatRef} className="relative">
                <button
                  onClick={() => {
                    setShowMoreDropdown(!showMoreDropdown);
                    setShowAllDropdown(false);
                  }}
                  aria-expanded={showMoreDropdown}
                  aria-label="More category options"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs cursor-pointer ${
                    activeOverflowCat
                      ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold border border-teal-300/80 dark:border-teal-700/80'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {activeOverflowCat
                      ? SHORT_LABELS[activeOverflowCat.slug] || activeOverflowCat.name
                      : 'More'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMoreDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMoreDropdown && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      More Categories
                    </div>
                    {overflowCategories.map((cat) => {
                      const isSelected = selectedCategoryFilter === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            handleCategoryClick(cat.slug);
                            setShowMoreDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-colors text-xs ${
                            isSelected
                              ? 'text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 font-bold'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-teal-700 dark:text-teal-400 shrink-0">
                              {ICON_MAP[cat.iconName] || <ShoppingBag className="w-4 h-4" />}
                            </span>
                            <span className="truncate">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                              {cat.itemCount}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Active Category Pill / Clear Filter */}
          {selectedCategoryFilter && (
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              title="Click to clear filter"
              className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap text-[11px] font-bold shrink-0 ml-1 cursor-pointer"
            >
              <span>
                Filtered: {SHORT_LABELS[selectedCategoryFilter] || activeCategoryObj?.name || selectedCategoryFilter}
              </span>
              <X className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            </button>
          )}
        </div>

        {/* Right Section: Quick Directory Links & Dark Mode Toggle */}
        <div className="flex items-center gap-2 pl-2 py-2 shrink-0">
          {/* All Sellers & Merchants Directory Link */}
          <button
            onClick={() => {
              const storesElem = document.getElementById('featured-stores-section');
              if (storesElem) storesElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer"
            title="Explore all registered GMC sellers and local merchants"
          >
            <Store className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>All Sellers</span>
          </button>

          {/* Today's Deals quick button */}
          <button
            onClick={() => {
              const dealsElem = document.getElementById('flash-deals-section');
              if (dealsElem) dealsElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-800/60 px-2.5 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Deals</span>
          </button>

          {/* Global Dark Mode Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            id="theme-toggle-btn"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode theme"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-semibold shadow-2xs cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-amber-300"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="font-bold hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="font-bold hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
