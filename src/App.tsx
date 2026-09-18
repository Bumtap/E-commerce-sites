import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

import { HeroBanner } from './components/home/HeroBanner';
import { QuickCategories } from './components/home/QuickCategories';
import { FlashDeals } from './components/home/FlashDeals';
import { SpecialCollections } from './components/home/SpecialCollections';
import { ProductGrid } from './components/home/ProductGrid';
import { FeaturedStores } from './components/home/FeaturedStores';
import { CustomerBenefits } from './components/home/CustomerBenefits';
import { Newsletter } from './components/home/Newsletter';

import { ProductModal } from './components/product/ProductModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { SearchFilterModal } from './components/search/SearchFilterModal';
import { UserDashboardModal } from './components/user/UserDashboardModal';
import { StoreFrontModal } from './components/store/StoreFrontModal';
import { SellerPortalModal } from './components/seller/SellerPortalModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';

const ShopAppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-700 selection:text-white antialiased transition-colors duration-200">
      {/* 1. Global Header & Navigation */}
      <Header />
      <Navbar />

      {/* 2. Main Page Content */}
      <main className="flex-1 space-y-2 pb-12">
        {/* A. Hero Banner Carousel */}
        <HeroBanner />

        {/* B. Circular Top Categories (matches reference screenshot) */}
        <QuickCategories />

        {/* C. Flash Deals with Live Countdown */}
        <FlashDeals />

        {/* D. Bhutan & GMC Visual Collections */}
        <SpecialCollections />

        {/* E. Main Featured Products Grid with Filter Tabs */}
        <ProductGrid />

        {/* F. GMC Local Businesses & Artisan Guilds */}
        <FeaturedStores />

        {/* G. Trust & Customer Benefits */}
        <CustomerBenefits />

        {/* H. Newsletter Subscription */}
        <Newsletter />
      </main>

      {/* 3. Multi-Column Footer */}
      <Footer />

      {/* 4. Interactive Drawers and Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <SearchFilterModal />
      <UserDashboardModal />
      <StoreFrontModal />
      <SellerPortalModal />
      <AdminDashboardModal />

      {/* 5. Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopAppContent />
    </ShopProvider>
  );
}
