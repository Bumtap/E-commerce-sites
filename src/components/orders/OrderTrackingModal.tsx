import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { OrderStatus } from '../../types';
import {
  X,
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'confirmed', label: 'Order Confirmed', desc: 'Verified by merchant' },
  { status: 'processing', label: 'Processing & Packed', desc: 'Packed with eco-packaging' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'GMC courier en route' },
  { status: 'delivered', label: 'Delivered', desc: 'Received at destination' },
];

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    trackingOrder,
    setTrackingOrder,
    trackOrderById,
    orders,
  } = useShop();

  const [inputNumber, setInputNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isTrackingOpen) return null;

  const currentOrder = trackingOrder || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputNumber.trim()) return;
    const found = trackOrderById(inputNumber);
    if (!found) {
      setErrorMsg('No order found matching that number. Try "GMC-2026-1049"');
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    const map: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      processing: 1,
      packed: 1,
      shipped: 2,
      out_for_delivery: 2,
      delivered: 3,
      cancelled: -1,
    };
    return map[status] ?? 0;
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Live Order Tracking
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Real-time delivery progress across Gelephu Mindfulness City
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search by Order ID */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                placeholder="Enter order # (e.g. GMC-2026-1049)"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-xs sm:text-sm uppercase text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
            >
              Track
            </button>
          </form>
          {errorMsg && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">{errorMsg}</p>}
        </div>

        {/* Tracking Details Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {currentOrder ? (
            <>
              {/* Top Order Meta */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    Order Number
                  </span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {currentOrder.orderNumber}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Placed on {formatDateTime(currentOrder.createdAt)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    Estimated Delivery
                  </span>
                  <p className="text-sm font-bold text-teal-800 dark:text-teal-300">
                    {currentOrder.estimatedDelivery}
                  </p>
                  <span className="inline-block mt-0.5 bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize">
                    {currentOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                  Shipment Status
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                  {STATUS_STEPS.map((s, idx) => {
                    const isDone = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div
                        key={s.status}
                        className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                          isCurrent
                            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-200 ring-2 ring-teal-600/30'
                            : isDone
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                            : 'bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold text-xs ${
                            isDone
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <p className="font-bold text-xs leading-tight">{s.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Driver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span>Destination Address</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentOrder.deliveryAddress.recipientName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{currentOrder.deliveryAddress.street}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {currentOrder.deliveryAddress.area}, {currentOrder.deliveryAddress.city} (
                    {currentOrder.deliveryAddress.dzongkhag})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phone: {currentOrder.deliveryAddress.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs mb-1">
                    <Truck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span>Courier & Logistics</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    GMC Green Delivery Fleet (Zone S-4)
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Method: {currentOrder.deliveryMethod.toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Payment: {currentOrder.paymentMethod.replace('_', ' ').toUpperCase()} (
                    {currentOrder.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Items in this Order ({currentOrder.items.length})
                </h4>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-850">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Qty: {item.quantity} • Seller: {item.sellerName}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white shrink-0">
                        {formatNu(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-xs">No active order to track.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
