import React from 'react';
import { TRUST_INDICATORS } from '../data/notaryData';

export const NotaryTrustIndicators: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_INDICATORS.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-white hover:border-[#C9A227]/50 transition-all duration-200 shadow-sm flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0 shadow-sm">
                <i className={item.iconClass}></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
