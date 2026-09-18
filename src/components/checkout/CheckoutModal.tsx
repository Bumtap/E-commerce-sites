import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu } from '../../utils/format';
import { Address, Order } from '../../types';
import {
  X,
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  Plus
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    deliveryFee,
    discount,
    tax,
    grandTotal,
    appliedCoupon,
    user,
    deliveryZones,
    createOrder,
    setTrackingOrder,
    setIsTrackingOpen,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [customerName, setCustomerName] = useState(user.displayName);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+975 17 889 900');

  // Address
  const defaultAddress = user.savedAddresses[0] || {
    id: 'addr-default',
    title: 'Primary Address',
    recipientName: user.displayName,
    phone: user.phone || '+975 17 889 900',
    street: 'Building 4, GMC Lotus Avenue',
    area: 'GMC Tech & Mindfulness Sector',
    city: 'Gelephu',
    dzongkhag: 'Sarpang',
    postalCode: '31101',
    isDefault: true,
    deliveryNotes: 'Leave at security gate if not answering',
  };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddress);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bhutan_qr' | 'card' | 'bank_transfer'>('bhutan_qr');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  // Bhutan Dzongkhags list
  const BHUTAN_DZONGKHAGS = [
    'Sarpang (Gelephu)',
    'Thimphu',
    'Paro',
    'Chukha (Phuentsholing)',
    'Punakha',
    'Wangdue Phodrang',
    'Bumthang',
    'Trongsa',
    'Mongar',
    'Trashigang',
    'Samdrup Jongkhar',
    'Tsirang',
    'Dagana',
    'Zhemgang',
    'Haa',
    'Gasa',
    'Lhuentse',
    'Pemagatshel',
    'Samtse',
    'Trashiyangtse',
  ];

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const newOrder = createOrder({
        customerId: user.id,
        customerName,
        customerEmail,
        customerPhone,
        items: orderItems,
        subtotal,
        deliveryFee: deliveryMethod === 'pickup' ? 0 : deliveryFee,
        discount,
        tax,
        grandTotal: deliveryMethod === 'pickup' ? grandTotal - deliveryFee : grandTotal,
        couponCode: appliedCoupon?.code,
        deliveryAddress: {
          ...selectedAddress,
          recipientName: customerName,
          phone: customerPhone,
          deliveryNotes: deliveryInstructions || selectedAddress.deliveryNotes,
        },
        deliveryMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'confirmed',
        estimatedDelivery:
          deliveryMethod === 'express'
            ? 'Today within 2 Hours (GMC Express)'
            : 'Same-Day by 6:00 PM',
      });

      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      setStep(5); // Confirmation step
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                GMC Secure Checkout
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Step {step} of 5: {step === 1 ? 'Customer Info' : step === 2 ? 'Delivery Address' : step === 3 ? 'Delivery Method' : step === 4 ? 'Payment Option' : 'Order Confirmed!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step < 5 && (
          <div className="bg-slate-100 dark:bg-slate-850 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Payment' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 ${
                  step >= s.num ? 'text-teal-800 dark:text-teal-300 font-bold' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step > s.num
                      ? 'bg-teal-700 text-white'
                      : step === s.num
                      ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 ring-2 ring-teal-600'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* STEP 1: CUSTOMER INFORMATION */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Customer Information
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We'll use these details to send order updates and invoice receipts.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                    placeholder="e.g. Sonam Dorji"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                      placeholder="name@domain.bt"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Bhutan Phone Number
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                      placeholder="+975 17 XXX XXX"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY ADDRESS */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Delivery Address in Gelephu / Bhutan
              </h4>

              {/* Saved addresses options */}
              {user.savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Saved Addresses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress.id === addr.id
                            ? 'border-teal-700 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 font-medium ring-1 ring-teal-700 dark:ring-teal-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{addr.title}</span>
                          {selectedAddress.id === addr.id && (
                            <span className="text-teal-700 dark:text-teal-400 text-xs">● Selected</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {addr.street}, {addr.area}, {addr.city}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Street Address / Building / House No.
                  </label>
                  <input
                    type="text"
                    value={selectedAddress.street}
                    onChange={(e) =>
                      setSelectedAddress({ ...selectedAddress, street: e.target.value })
                    }
                    placeholder="e.g. Near Lotus Tower, Plot 14, Zone B"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Area / GMC Sector
                    </label>
                    <input
                      type="text"
                      value={selectedAddress.area}
                      onChange={(e) =>
                        setSelectedAddress({ ...selectedAddress, area: e.target.value })
                      }
                      placeholder="e.g. GMC Tech & Mindfulness Zone"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Dzongkhag</label>
                    <select
                      value={selectedAddress.dzongkhag}
                      onChange={(e) =>
                        setSelectedAddress({ ...selectedAddress, dzongkhag: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                    >
                      {BHUTAN_DZONGKHAGS.map((dz) => (
                        <option key={dz} value={dz}>
                          {dz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Call upon arrival or leave with reception"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERY METHOD */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Choose Delivery Option
              </h4>

              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    title: 'Standard Gelephu Local Delivery',
                    desc: 'Eco-friendly same-day dispatch by GMC green courier fleet',
                    fee: deliveryFee,
                    time: 'Same-day (within 3-5 hours)',
                  },
                  {
                    id: 'express',
                    title: 'GMC Priority Express (2-Hour)',
                    desc: 'Direct priority courier straight from seller to your door',
                    fee: deliveryFee + 70,
                    time: 'Within 2 hours guaranteed',
                  },
                  {
                    id: 'pickup',
                    title: 'Storefront Self-Pickup',
                    desc: 'Collect directly from the seller at GMC Artisan & Agro Hub',
                    fee: 0,
                    time: 'Ready in 45 minutes',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                      deliveryMethod === opt.id
                        ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 ring-1 ring-teal-700 dark:ring-teal-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={deliveryMethod === opt.id}
                        onChange={() => setDeliveryMethod(opt.id as any)}
                        className="mt-1 accent-teal-700"
                      />
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{opt.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-950/80 px-2 py-0.5 rounded">
                          {opt.time}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {opt.fee === 0 ? 'FREE' : formatNu(opt.fee)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Select Secure Payment Method
              </h4>

              <div className="space-y-3">
                {/* Bhutan QR / mBOB */}
                <div
                  onClick={() => setPaymentMethod('bhutan_qr')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bhutan_qr'
                      ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/50 ring-1 ring-teal-700 dark:ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          Bhutan QR / Mobile Banking (mBOB / B-Trowa / DrukPay)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Instant scan & pay via Bhutan National Payment Gateway
                        </p>
                      </div>
                    </div>
                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-amber-200 dark:border-amber-800">
                      Recommended
                    </span>
                  </div>

                  {paymentMethod === 'bhutan_qr' && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-1 flex items-center justify-center font-mono text-[8px] text-center shrink-0 border border-slate-700">
                        [BHUTAN QR CODE]
                      </div>
                      <p>
                        Scan with your Bhutan mobile banking app upon confirming order, or payment will be verified seamlessly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/50 ring-1 ring-teal-700 dark:ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pay cash directly to the GMC delivery courier at your doorstep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card payment */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/50 ring-1 ring-teal-700 dark:ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        Credit / Debit Card (Visa, MasterCard, RuPay)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Processed securely via 256-bit SSL encrypted gateway
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order total preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 mt-4 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Cart Items ({cart.length})</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatNu(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatNu(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery ({deliveryMethod})</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {deliveryMethod === 'pickup' || deliveryFee === 0 ? 'FREE' : formatNu(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Due</span>
                  <span className="text-teal-800 dark:text-teal-400 text-base">{formatNu(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMATION */}
          {step === 5 && confirmedOrder && (
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-teal-200 dark:border-teal-800">
                  Order Successfully Placed
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-2">
                  Thank You for Shopping Local!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your order has been transmitted directly to verified GMC merchants.
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Order Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmedOrder.estimatedDelivery}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Delivery Address:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.city}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 capitalize">
                    {confirmedOrder.paymentMethod.replace('_', ' ').toUpperCase()} • {confirmedOrder.paymentStatus}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold text-sm">
                  <span className="text-slate-800 dark:text-slate-200">Grand Total:</span>
                  <span className="text-teal-800 dark:text-teal-400">{formatNu(confirmedOrder.grandTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setTrackingOrder(confirmedOrder);
                    setIsTrackingOpen(true);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Live Track This Order</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 5 && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as any)}
                className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{isProcessing ? 'Confirming Order...' : `Place Order (${formatNu(grandTotal)})`}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
