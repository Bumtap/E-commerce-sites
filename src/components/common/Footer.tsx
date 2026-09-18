import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    categories,
    setSelectedCategoryFilter,
    setIsSellerPortalOpen,
    setIsAdminPortalOpen,
    setIsUserDashboardOpen,
    setUserDashboardTab,
    setIsTrackingOpen,
  } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid matching Reference Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3c-1.5 3-4 6-8 7 4 1 6.5 4 8 7 1.5-3 4-6 8-7-4-1-6.5-4-8-7z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white font-display">
                  GMC<span className="text-teal-400 font-bold ml-1">Marketplace</span>
                </span>
                <p className="text-[11px] text-slate-400">Gelephu Mindfulness City, Bhutan</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The official commercial e-commerce bridge for Gelephu Mindfulness City, connecting mindful consumers with verified Bhutanese growers, master artisans, and sustainable innovators.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>GMC Innovation Hub, Gelephu, Sarpang Dzongkhag, Bhutan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>WhatsApp / Phone: +975 6 251 088</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@gmcmarketplace.bt</span>
              </div>
            </div>

            {/* Mobile App Download Badges like reference screenshot */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Download GMC App
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-teal-500 transition-colors">
                  <span className="text-lg">🍎</span>
                  <div className="text-left">
                    <p className="text-[8px] uppercase text-slate-400 leading-tight">Download on the</p>
                    <p className="text-xs font-bold text-white leading-tight">App Store</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-teal-500 transition-colors">
                  <span className="text-lg">🤖</span>
                  <div className="text-left">
                    <p className="text-[8px] uppercase text-slate-400 leading-tight">Get it on</p>
                    <p className="text-xs font-bold text-white leading-tight">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(cat.slug);
                      document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-teal-300 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setUserDashboardTab('profile');
                    setIsUserDashboardOpen(true);
                  }}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  My Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserDashboardTab('orders');
                    setIsUserDashboardOpen(true);
                  }}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Order History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserDashboardTab('wishlist');
                    setIsUserDashboardOpen(true);
                  }}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Wishlist
                </button>
              </li>
              <li>
                <span className="hover:text-teal-300 cursor-pointer">GMC Delivery Rates</span>
              </li>
              <li>
                <span className="hover:text-teal-300 cursor-pointer">Mindful Return Policy</span>
              </li>
            </ul>
          </div>

          {/* Column 4: For Sellers & Admin */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Merchant & Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setIsSellerPortalOpen(true)}
                  className="hover:text-teal-300 text-teal-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Become a Verified Seller</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSellerPortalOpen(true)}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Seller Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminPortalOpen(true)}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Marketplace Admin CMS
                </button>
              </li>
              <li>
                <span className="hover:text-teal-300 cursor-pointer">GMC Business Criteria</span>
              </li>
              <li>
                <span className="hover:text-teal-300 cursor-pointer">Packaging & Sustainability</span>
              </li>
              <li>
                <span className="hover:text-teal-300 cursor-pointer">Terms & Conditions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GMC Marketplace. All rights reserved. Gelephu Mindfulness City, Kingdom of Bhutan.</p>

          <div className="flex items-center gap-4">
            <span>Currency: <strong>Bhutanese Ngultrum (Nu.)</strong></span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-300 transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
