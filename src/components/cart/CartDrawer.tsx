import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    discount,
    tax,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    selectedZone,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free delivery progress calculation
  const freeThreshold = selectedZone?.freeDeliveryThreshold || 500;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          {/* 1. Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">Shopping Cart</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors mr-1 cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-teal-50/80 dark:bg-teal-950/40 px-5 py-3 border-b border-teal-100 dark:border-teal-900/60 text-xs">
              <div className="flex items-center justify-between mb-1.5 font-semibold text-teal-900 dark:text-teal-200">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  {remainingForFree === 0
                    ? '🎉 You unlocked FREE Gelephu Delivery!'
                    : `Add ${formatNu(remainingForFree)} more for FREE delivery`}
                </span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-teal-200/60 dark:bg-teal-900/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-700 dark:bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Discover fresh organic valley produce, authentic handicrafts, and Bhutanese products across GMC.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-teal-700 dark:bg-teal-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-teal-800 dark:hover:bg-teal-500 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-750 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                          Variant: {item.variantName}
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Seller: {item.product.sellerName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {/* Price */}
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatNu(item.price * item.quantity)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Coupon <strong>{appliedCoupon.code}</strong> applied ({formatNu(discount)} off)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-800 font-bold ml-2 text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. GMCFIRST)"
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs uppercase placeholder-normal outline-none focus:ring-2 focus:ring-teal-600"
                      />
                      <button
                        type="submit"
                        className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>
                    )}
                    {/* Handy hints */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                      <span>Try:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput('GMCFIRST');
                        }}
                        className="font-mono underline text-teal-700 dark:text-teal-400 font-bold cursor-pointer"
                      >
                        GMCFIRST
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput('MINDFUL20');
                        }}
                        className="font-mono underline text-teal-700 dark:text-teal-400 font-bold cursor-pointer"
                      >
                        MINDFUL20
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Order Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatNu(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatNu(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery ({selectedZone?.name.split('&')[0]})</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">Free</span>
                    ) : (
                      formatNu(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax & Logistics Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatNu(tax)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                  <span className="text-base">Grand Total</span>
                  <span className="text-lg text-teal-800 dark:text-teal-400">{formatNu(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
