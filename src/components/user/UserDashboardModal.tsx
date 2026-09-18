import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatNu, formatDateTime } from '../../utils/format';
import { Address } from '../../types';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Shield,
  Trash2,
  ExternalLink,
  Plus,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export const UserDashboardModal: React.FC = () => {
  const {
    isUserDashboardOpen,
    setIsUserDashboardOpen,
    userDashboardTab,
    setUserDashboardTab,
    user,
    userRole,
    setUserRole,
    orders,
    wishlist,
    products,
    removeFromWishlist,
    addToCart,
    setActiveProduct,
    setTrackingOrder,
    setIsTrackingOpen,
    addAddress,
    deleteAddress,
  } = useShop();

  // Address modal form inside dashboard
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('Gelephu');
  const [newDzongkhag, setNewDzongkhag] = useState('Sarpang');

  if (!isUserDashboardOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim()) return;
    addAddress({
      title: newTitle.trim() || 'Other Address',
      recipientName: user.displayName,
      phone: user.phone || '+975 17 000 000',
      street: newStreet.trim(),
      area: newArea.trim(),
      city: newCity,
      dzongkhag: newDzongkhag,
      postalCode: '31101',
      isDefault: false,
    });
    setIsAddingAddress(false);
    setNewTitle('');
    setNewStreet('');
    setNewArea('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                {user.displayName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.email} • Gelephu, Bhutan
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUserDashboardOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close user dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/70 dark:bg-slate-850/70 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: 'My Account & Roles', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'orders', label: `Order History (${orders.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: <Heart className="w-4 h-4" /> },
            { id: 'addresses', label: `Saved Addresses (${user.savedAddresses.length})`, icon: <MapPin className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUserDashboardTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors -mb-px cursor-pointer ${
                userDashboardTab === tab.id
                  ? 'border-teal-700 dark:border-teal-400 text-teal-800 dark:text-teal-300'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* 1. PROFILE TAB */}
          {userDashboardTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Account Information</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your personal profile and test role-based portal permissions.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.displayName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Email Address</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Bhutan Contact</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.phone || '+975 17 889 900'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Active Role</span>
                  <span className="font-extrabold text-teal-800 dark:text-teal-300 uppercase bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded text-[11px]">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="p-4 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2">
                <h5 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span>Platform Role Simulation</span>
                </h5>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  Quickly switch between personas to test different marketplace capabilities:
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(['customer', 'seller', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRole(role)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        userRole === role
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50'
                      }`}
                    >
                      {role === 'customer' ? 'Customer' : role === 'seller' ? 'Seller Merchant' : 'Admin CMS'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {userDashboardTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Your Orders</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Track delivery status, review purchases, and download receipts.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <p className="text-slate-500 dark:text-slate-400">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-teal-500/40 transition-colors shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">
                            {formatDateTime(ord.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold text-[11px] px-2.5 py-0.5 rounded-full capitalize">
                            {ord.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => {
                              setTrackingOrder(ord);
                              setIsTrackingOpen(true);
                            }}
                            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Live Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-9 h-9 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
                              />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{item.productName}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                  Qty: {item.quantity} • {item.sellerName}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {formatNu(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order total & Destination */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Destination: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Total: {formatNu(ord.grandTotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. WISHLIST TAB */}
          {userDashboardTab === 'wishlist' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Saved Wishlist</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Items you marked to purchase later.</p>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <p className="text-slate-500 dark:text-slate-400">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <h5
                            onClick={() => {
                              setActiveProduct(p);
                              setIsUserDashboardOpen(false);
                            }}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer truncate"
                          >
                            {p.name}
                          </h5>
                          <p className="text-xs font-bold text-teal-800 dark:text-teal-300 mt-0.5">
                            {formatNu(p.salePrice || p.price)}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{p.sellerName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(p.id)}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. ADDRESSES TAB */}
          {userDashboardTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delivery Addresses</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Save multiple locations for home, office, and family across Gelephu.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Add address form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleCreateAddress}
                  className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-3 animate-fadeIn"
                >
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">New Address Details</h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Address Title (e.g. Home, Office)
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. GMC Tech Park Office"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Street / Building / Plot
                      </label>
                      <input
                        type="text"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="e.g. Plot 12, Bamboo Way"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Area / Sector
                      </label>
                      <input
                        type="text"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        placeholder="e.g. Lotus Sector"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        Dzongkhag
                      </label>
                      <input
                        type="text"
                        value={newDzongkhag}
                        onChange={(e) => setNewDzongkhag(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* List of saved addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{addr.street}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {addr.area}, {addr.city} ({addr.dzongkhag})
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Phone: {addr.phone}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
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
