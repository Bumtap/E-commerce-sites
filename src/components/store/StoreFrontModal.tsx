import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import { formatWhatsAppUrl } from '../../utils/whatsapp';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ShoppingBag,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react';

export const StoreFrontModal: React.FC = () => {
  const {
    activeStore,
    setActiveStore,
    products,
    addToCart,
    setActiveProduct,
  } = useShop();

  if (!activeStore) return null;

  // Products belonging to this store
  const storeProducts = products.filter((p) => p.sellerId === activeStore.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={() => setActiveStore(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
          aria-label="Close storefront"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Banner */}
          <div className="relative h-44 sm:h-60 w-full bg-slate-900">
            <img
              src={activeStore.coverImage}
              alt={activeStore.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>

          {/* Store Info Bar */}
          <div className="px-6 sm:px-10 pb-6 relative -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xl overflow-hidden shrink-0">
                  <img
                    src={activeStore.logo}
                    alt={activeStore.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                      {activeStore.name}
                    </h2>
                    {activeStore.isVerified && (
                      <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-teal-200 dark:border-teal-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        Verified GMC Merchant
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {activeStore.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{activeStore.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{activeStore.rating}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">({activeStore.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{storeProducts.length} Items Listed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Seller via WhatsApp or Call */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={formatWhatsAppUrl(
                    activeStore.phone,
                    `Kuzu Zangpo! Hello ${activeStore.name}, I am visiting your store on GMC Marketplace and would like to inquire about your products.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                  title="Direct WhatsApp chat with seller"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </a>
                <a
                  href={`tel:${activeStore.phone}`}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>
              </div>
            </div>

            {/* About Merchant */}
            <div className="py-6 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">About This Producer</h4>
              <p>{activeStore.description}</p>
            </div>

            {/* Store Products Grid */}
            <div className="py-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">
                Products from {activeStore.name} ({storeProducts.length})
              </h3>

              {storeProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">No active products currently listed for this store.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storeProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-600/40 dark:hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div
                        onClick={() => {
                          setActiveProduct(product);
                        }}
                        className="relative aspect-square w-full p-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
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

                      <div className="p-3.5 flex flex-col flex-1 justify-between">
                        <div>
                          <h4
                            onClick={() => setActiveProduct(product)}
                            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer"
                          >
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {formatNu(product.salePrice || product.price)}
                            </span>
                            {product.salePrice && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                                {formatNu(product.price)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product, 1)}
                            className="mt-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
