import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Mail, CheckCircle2, Send } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to GMC Marketplace updates!', 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 dark:from-teal-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden border border-transparent dark:border-slate-800">
        {/* Background decorative mindfulness motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <svg className="w-80 h-80 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-teal-700/60 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-bold text-teal-200 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Stay Connected with GMC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display mb-2">
            Get Special Offers & Mindfulness City News
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Subscribe to receive exclusive promotions, seasonal harvest alerts, and stories from our local Bhutanese artisans and producers.
          </p>

          {subscribed ? (
            <div className="bg-teal-700/80 border border-teal-500 p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <p className="font-bold text-sm">You are subscribed!</p>
                <p className="text-xs text-teal-100">
                  Welcome to the community. We've sent a welcome confirmation to {email}.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-300 dark:placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                required
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm shrink-0 active:scale-[0.98] cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400 mt-3">
            We respect your privacy. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  );
};
