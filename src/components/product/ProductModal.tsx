import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductVariant } from '../../types';
import { formatNu } from '../../utils/format';
import {
  X,
  Star,
  CheckCircle2,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Sparkles,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    activeProduct,
    setActiveProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveStore,
    stores,
    setIsCheckoutOpen,
    addReview,
    products,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'seller' | 'reviews' | 'shipping'>('desc');

  // Review form state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewName, setNewReviewName] = useState('');

  if (!activeProduct) return null;

  const currentPrice = selectedVariant
    ? (selectedVariant.salePrice ?? selectedVariant.price)
    : (activeProduct.salePrice ?? activeProduct.price);

  const originalPrice = selectedVariant ? selectedVariant.price : activeProduct.price;
  const hasDiscount = Boolean(activeProduct.salePrice || (selectedVariant && selectedVariant.salePrice));
  const wishlisted = isWishlisted(activeProduct.id);
  const seller = stores.find((s) => s.id === activeProduct.sellerId);

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.categoryId === activeProduct.categoryId && p.id !== activeProduct.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, quantity, selectedVariant);
    setActiveProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    addReview({
      productId: activeProduct.id,
      userId: 'usr-guest',
      userName: newReviewName.trim() || 'Verified GMC Shopper',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    });
    setNewReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setActiveProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Top section: Gallery + Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Product Images Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={activeProduct.images[selectedImageIndex] || activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-300"
                />

                {activeProduct.discountPercentage && (
                  <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                    {activeProduct.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {activeProduct.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {activeProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 dark:bg-slate-850 overflow-hidden transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-teal-600 ring-2 ring-teal-600/30'
                          : 'border-slate-200 dark:border-slate-750 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeProduct.isMadeInBhutan && (
                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      🇧🇹 Made in Bhutan
                    </span>
                  )}
                  {activeProduct.isOrganic && (
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/80 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      🌿 Certified Organic
                    </span>
                  )}
                  {activeProduct.isGmcExclusive && (
                    <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-teal-700/80 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      GMC Exclusive
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
                  {activeProduct.name}
                </h2>

                {/* Seller & Verification */}
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2">
                  <span>Sold by:</span>
                  <button
                    onClick={() => {
                      if (seller) {
                        setActiveStore(seller);
                        setActiveProduct(null);
                      }
                    }}
                    className="font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{activeProduct.sellerName}</span>
                    {activeProduct.sellerVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    )}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(activeProduct.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeProduct.rating}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">({activeProduct.reviewCount} reviews)</span>
                </div>

                {/* Price Display in Nu. */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-sans">
                    {formatNu(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                      {formatNu(originalPrice)}
                    </span>
                  )}
                  {activeProduct.discountPercentage && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                      Save {activeProduct.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                  {activeProduct.shortDescription}
                </p>

                {/* Variants if available */}
                {activeProduct.variants && activeProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Select Option / Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeProduct.variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-1 ring-teal-700 dark:ring-teal-500'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <span>{variant.name}</span>
                            <span className="ml-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-400">
                              ({formatNu(variant.salePrice ?? variant.price)})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock status */}
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeProduct.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {activeProduct.stock > 0
                      ? `In Stock (${activeProduct.stock} available)`
                      : 'Currently Out of Stock'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">• Origin: {activeProduct.origin}</span>
                </div>
              </div>

              {/* Quantity Stepper + Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(activeProduct.stock, q + 1))}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(activeProduct.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      wishlisted
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-rose-600 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={activeProduct.stock === 0}
                    className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={activeProduct.stock === 0}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description, Specs, Seller, Reviews */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar pb-px">
              {[
                { id: 'desc', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'seller', label: 'Seller & GMC Verification' },
                { id: 'reviews', label: `Reviews (${activeProduct.reviewCount})` },
                { id: 'shipping', label: 'Shipping & Returns' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-teal-700 dark:border-teal-400 text-teal-800 dark:text-teal-300'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="py-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p>{activeProduct.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {activeProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-w-xl">
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">SKU</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeProduct.sku}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Origin / Valley</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeProduct.origin}</span>
                  </div>
                  {activeProduct.weight && (
                    <div className="py-2 flex justify-between">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Weight / Unit</span>
                      <span className="font-bold text-slate-900 dark:text-white">{activeProduct.weight}</span>
                    </div>
                  )}
                  {activeProduct.attributes &&
                    Object.entries(activeProduct.attributes).map(([key, val]) => (
                      <div key={key} className="py-2 flex justify-between">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'seller' && seller && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.logo}
                      alt={seller.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{seller.name}</h4>
                        {seller.isVerified && (
                          <span className="bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-teal-200 dark:border-teal-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified GMC Partner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{seller.location}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{seller.tagline}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveStore(seller);
                      setActiveProduct(null);
                    }}
                    className="bg-slate-900 dark:bg-slate-700 hover:bg-teal-800 dark:hover:bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Visit Storefront
                  </button>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Write a review form */}
                  <form
                    onSubmit={handleReviewSubmit}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Write a Customer Review</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          placeholder="e.g. Sonam Dorji"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                          Rating (1 - 5 Stars)
                        </label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-600"
                        >
                          <option value="5">★★★★★ 5 Stars - Excellent</option>
                          <option value="4">★★★★☆ 4 Stars - Very Good</option>
                          <option value="3">★★★☆☆ 3 Stars - Average</option>
                          <option value="2">★★☆☆☆ 2 Stars - Fair</option>
                          <option value="1">★☆☆☆☆ 1 Star - Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        rows={2}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share your experience with this GMC product..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">Gelephu Local Delivery</h5>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                        Same-day dispatch for orders placed before 3:00 PM. Free delivery on orders over Nu. 500 within Gelephu Core and GMC Tech Sector.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">7-Day Mindful Return Policy</h5>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                        We guarantee the authenticity and freshness of all Bhutanese goods. If you are dissatisfied, return in original packaging within 7 days for a replacement or full refund.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Related Products in this Category</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setActiveProduct(rel);
                      setSelectedImageIndex(0);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{rel.name}</p>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-bold mt-0.5">
                        {formatNu(rel.salePrice || rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
