import React from 'react';
import { ShieldCheck, QrCode, Truck, Leaf, HeadphonesIcon } from 'lucide-react';

export const CustomerBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      title: 'Verified GMC Businesses',
      description: 'Every seller is rigorously vetted and licensed in Gelephu Mindfulness City.',
    },
    {
      icon: <QrCode className="w-6 h-6 text-teal-600" />,
      title: 'Bhutan QR & COD',
      description: 'Instant secure payments with mBOB, B-Trowa, Cards or Cash on Delivery.',
    },
    {
      icon: <Truck className="w-6 h-6 text-teal-600" />,
      title: 'Fast Local Delivery',
      description: 'Same-day delivery across Gelephu core and express inter-district dispatch.',
    },
    {
      icon: <Leaf className="w-6 h-6 text-teal-600" />,
      title: '100% Mindful & Organic',
      description: 'Pristine Himalayan ingredients, sustainable packaging, and zero harmful chemicals.',
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-teal-600" />,
      title: 'Local GMC Support',
      description: 'Dedicated support team ready to assist customers and merchants in Gelephu.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest block mb-1">
            The GMC Marketplace Promise
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold font-display">
            Built for Mindful, Trustworthy Commerce
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 dark:bg-slate-850/80 rounded-2xl p-4 border border-slate-700/60 dark:border-slate-800 flex flex-col items-start hover:border-teal-500/50 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-950/70 dark:bg-teal-950/90 border border-teal-600/30 flex items-center justify-center mb-3">
                {b.icon}
              </div>
              <h3 className="font-bold text-sm text-white mb-1">{b.title}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-300 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
