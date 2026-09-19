import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  ChevronDown,
  Store,
  ShieldCheck,
  Package,
  Globe,
  SlidersHorizontal,
  X,
  Menu,
  Check
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    subtotal,
    wishlistCount,
    setIsCartOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    categories,
    products,
    setActiveProduct,
    announcement,
    user,
    setUserRole,
    setIsUserDashboardOpen,
    setUserDashboardTab,
    setIsSellerPortalOpen,
    setIsAdminPortalOpen,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    setIsTrackingOpen,
  } = useShop();

  const [selectedSearchCat, setSelectedSearchCat] = useState<string>('all');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAnnouncementDropdown, setShowAnnouncementDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnnouncementIdx, setSelectedAnnouncementIdx] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Parse announcement into concise dropdown items
  const announcementItems = React.useMemo(() => {
    if (!announcement || !announcement.trim()) {
      return [
        'Free delivery in Gelephu on orders over Nu. 500',
        '100% verified local Bhutanese producers & artisans',
        'Mindfulness City zero-emission green logistics'
      ];
    }
    const items = announcement
      .split(/[•|\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return items.length > 0 ? items : [announcement];
  }, [announcement]);

  // Subtle auto-rotate every 6 seconds if multiple notices exist
  useEffect(() => {
    if (announcementItems.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedAnnouncementIdx((prev) => (prev + 1) % announcementItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcementItems.length]);

  // Suggestions
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => {
        const matchesCategory = selectedSearchCat === 'all' || p.categoryId === selectedSearchCat;
        const matchesText =
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.sellerName.toLowerCase().includes(q);
        return matchesCategory && matchesText;
      })
      .slice(0, 5);
  }, [searchQuery, selectedSearchCat, products]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        announcementRef.current &&
        !announcementRef.current.contains(e.target as Node)
      ) {
        setShowAnnouncementDropdown(false);
      }
      if (
        roleRef.current &&
        !roleRef.current.contains(e.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
      if (
        langRef.current &&
        !langRef.current.contains(e.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* 1. TOP ANNOUNCEMENT BAR (Shortened, Compact, with Dropdown List) */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 dark:border-slate-850">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          {/* Announcement Dropdown - Shortened & Expandable */}
          <div ref={announcementRef} className="relative flex-1 min-w-0">
            <button
              onClick={() => {
                setShowAnnouncementDropdown(!showAnnouncementDropdown);
                setShowRoleDropdown(false);
                setShowLanguageDropdown(false);
              }}
              className="flex items-center gap-2 group text-left max-w-full cursor-pointer"
              title="Click to view all GMC announcements and offers"
              aria-expanded={showAnnouncementDropdown}
            >
              <span className="bg-teal-700 hover:bg-teal-600 text-teal-100 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1 transition-colors">
                <span>Notice</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showAnnouncementDropdown ? 'rotate-180' : ''}`} />
              </span>
              <span className="text-slate-300 group-hover:text-white font-medium text-xs truncate transition-colors">
                {announcementItems[selectedAnnouncementIdx] || announcement}
              </span>
            </button>

            {showAnnouncementDropdown && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 flex items-center justify-between">
                  <span>GMC Announcements & Offers</span>
                  <span className="text-slate-400 font-normal">{announcementItems.length} notices</span>
                </div>
                <div className="py-1 space-y-1">
                  {announcementItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedAnnouncementIdx(idx);
                        setShowAnnouncementDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer ${
                        selectedAnnouncementIdx === idx
                          ? 'bg-teal-950/80 text-teal-200 border border-teal-800 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-teal-400 font-bold mt-0.5 text-sm">•</span>
                      <span className="leading-snug">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right controls: Track Order, Seller Portal, Admin Panel, Language Dropdown & Role Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Track Order Link */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors text-xs cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">Track Order</span>
              <span className="lg:hidden">Track</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Seller Portal Quick Link */}
            <button
              onClick={() => {
                setUserRole('seller');
                setIsSellerPortalOpen(true);
              }}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors text-xs font-semibold cursor-pointer"
              title="Seller Portal: Register or login to manage your store"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Seller Portal</span>
              <span className="sm:hidden">Sell</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Admin Panel Quick Link */}
            <button
              onClick={() => {
                setUserRole('admin');
                setIsAdminPortalOpen(true);
              }}
              className="text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors text-xs font-semibold cursor-pointer"
              title="Admin Panel: Password protected GMC marketplace control"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Language Selector Dropdown */}
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowAnnouncementDropdown(false);
                  setShowRoleDropdown(false);
                }}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 rounded-lg shadow-xl py-1 z-50 text-xs border border-slate-700 animate-fadeIn">
                  {['English', 'རྫོང་ཁ (Dzongkha)', 'हिन्दी (Hindi)', 'नेपाली (Nepali)'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setCurrentLang(l.split(' ')[0]);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-800 text-slate-200 cursor-pointer"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Role Switcher Dropdown - Explicit Customer, Seller, and Admin options */}
            <div ref={roleRef} className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowAnnouncementDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-full border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title="Select user role: Customer, Seller, or Admin"
                aria-expanded={showRoleDropdown}
              >
                <span className="text-slate-400 text-[10px] hidden sm:inline">Role:</span>
                <span className="text-teal-300 font-bold capitalize text-xs">{user.role}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs text-slate-200 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span>Select User Role</span>
                    <span className="text-teal-400 font-bold capitalize">{user.role} active</span>
                  </div>

                  <div className="p-1 space-y-1">
                    {/* 1. Customer Role */}
                    <button
                      onClick={() => {
                        setUserRole('customer');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        user.role === 'customer'
                          ? 'bg-teal-950/80 text-teal-200 border border-teal-800 font-semibold'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-900/60 border border-teal-700/50 flex items-center justify-center text-teal-300 shrink-0">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-100">Customer</p>
                          <p className="text-[10px] text-slate-400 font-normal">Browse, shop & checkout</p>
                        </div>
                      </div>
                      {user.role === 'customer' && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                    </button>

                    {/* 2. Seller Role */}
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setIsSellerPortalOpen(true);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        user.role === 'seller'
                          ? 'bg-amber-950/80 text-amber-200 border border-amber-800 font-semibold'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-900/60 border border-amber-700/50 flex items-center justify-center text-amber-300 shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-xs text-slate-100">Seller</p>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">Portal</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-normal">Post items, edit price & stock</p>
                        </div>
                      </div>
                      {user.role === 'seller' ? (
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-teal-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded">Open →</span>
                      )}
                    </button>

                    {/* 3. Admin Role */}
                    <button
                      onClick={() => {
                        setUserRole('admin');
                        setIsAdminPortalOpen(true);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        user.role === 'admin'
                          ? 'bg-purple-950/80 text-purple-200 border border-purple-800 font-semibold'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-xs text-slate-100">Admin</p>
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-bold border border-purple-500/30">CMS</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-normal">Approve sellers, CMS & settings</p>
                        </div>
                      </div>
                      {user.role === 'admin' ? (
                        <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-teal-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded">Open →</span>
                      )}
                    </button>
                  </div>

                  {/* Direct Action Links at the bottom of the dropdown */}
                  <div className="mt-1 pt-1.5 border-t border-slate-800 px-2 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setIsSellerPortalOpen(true);
                        setShowRoleDropdown(false);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 py-1 px-1.5 rounded hover:bg-slate-800 cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Seller Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('admin');
                        setIsAdminPortalOpen(true);
                        setShowRoleDropdown(false);
                      }}
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 py-1 px-1.5 rounded hover:bg-slate-800 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin CMS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          {/* Logo & City Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-left group"
            >
              {/* Custom SVG Mindfulness Lotus Emblem */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 via-slate-900 to-slate-950 flex items-center justify-center text-white shadow-md shadow-teal-900/10 border border-teal-600/30 group-hover:scale-105 transition-transform">
                <svg
                  className="w-6 h-6 text-teal-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c-1.5 3-4 6-8 7 4 1 6.5 4 8 7 1.5-3 4-6 8-7-4-1-6.5-4-8-7z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white font-display">
                    GMC<span className="text-teal-700 dark:text-teal-400 font-bold ml-1">Marketplace</span>
                  </span>
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/60 uppercase">
                    Bhutan
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                  Gelephu Mindfulness City • Official Platform
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar with live autocomplete */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-xl border border-slate-300/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/90 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition-all shadow-xs"
            >
              {/* Category selector in search */}
              <div className="relative border-r border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  <span className="max-w-[100px] truncate">
                    {selectedSearchCat === 'all'
                      ? 'All'
                      : categories.find((c) => c.id === selectedSearchCat)?.name || 'Category'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showCatDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 text-xs max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSearchCat('all');
                        setShowCatDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/70 font-medium ${
                        selectedSearchCat === 'all' ? 'text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedSearchCat(c.id);
                          setShowCatDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/70 ${
                          selectedSearchCat === c.id ? 'text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/40 font-semibold' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input field */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search red rice, wild honey, textiles, eco-tech, stores..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-850 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 font-medium px-3 bg-slate-50/50 dark:bg-slate-800/80">
                  <span>Suggested Products</span>
                  <span>{suggestions.length} results</span>
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveProduct(item);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span>{item.sellerName}</span>
                        <span>•</span>
                        <span className="font-semibold text-teal-700 dark:text-teal-400">
                          {formatNu(item.salePrice || item.price)}
                        </span>
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowSuggestions(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full text-center py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-teal-800 dark:text-teal-400 transition-colors"
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            )}
          </div>

          {/* Delivery Location Selector */}
          <div className="relative hidden xl:block shrink-0">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-medium">
                  Deliver to
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="max-w-[130px] truncate">{selectedZone.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
              </div>
            </button>

            {showLocationDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 border-b border-slate-100 dark:border-slate-750">
                  Select Delivery Zone
                </p>
                <div className="py-1 space-y-1">
                  {deliveryZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selectedZone.id === zone.id
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{zone.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatNu(zone.fee)} delivery • {zone.estimatedDays}
                        </p>
                      </div>
                      {selectedZone.id === zone.id && (
                        <Check className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 md:hidden text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="User account"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">Hello,</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[90px]">
                    {user.displayName.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">{user.displayName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{user.email}</p>
                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">
                        Active Role
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {(['customer', 'seller', 'admin'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setUserRole(r)}
                            className={`py-1 px-1.5 rounded-md text-[10px] font-bold capitalize transition-colors cursor-pointer text-center ${
                              user.role === r
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDashboardTab('profile');
                        setIsUserDashboardOpen(true);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile & Addresses</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDashboardTab('orders');
                        setIsUserDashboardOpen(true);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDashboardTab('wishlist');
                        setIsUserDashboardOpen(true);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setIsSellerPortalOpen(true);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Seller Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('admin');
                        setIsAdminPortalOpen(true);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Marketplace Admin Panel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setUserDashboardTab('wishlist');
                setIsUserDashboardOpen(true);
              }}
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Subtotal */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow group"
              aria-label={`Cart (${cartCount} items)`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-slate-800">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase font-semibold text-teal-200 dark:text-teal-100 block leading-none">
                  Cart
                </span>
                <span className="text-xs font-bold font-sans">
                  {cartCount > 0 ? formatNu(subtotal) : 'Nu. 0'}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer if toggled */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-2 animate-fadeIn">
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full bg-slate-100 dark:bg-slate-800 px-3 py-2 pl-9 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setIsSellerPortalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/60 font-semibold flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Seller Portal</span>
              </button>
              <button
                onClick={() => {
                  setIsAdminPortalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
