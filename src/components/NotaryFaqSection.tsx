import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/notaryData';

export const NotaryFaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Notaris', 'PPAT', 'Pertanahan', 'Client Portal', 'Dokumen', 'Konsultasi'];

  const filteredFaqs = faqCategory === 'ALL'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === faqCategory);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Tanya Jawab Seputar Kenotariatan & Pertanahan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Jawaban lengkap atas pertanyaan umum seputar akta notaris, syarat jual beli tanah, biaya, dan perpajakan.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setFaqCategory(c);
                setOpenIdx(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                faqCategory === c
                  ? 'bg-[#0F172A] text-[#C9A227]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'ALL' ? 'Semua Kategori' : c}
            </button>
          ))}
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 bg-white"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-[#C9A227] font-mono">Q{idx + 1}.</span>
                    <span className="text-sm sm:text-base font-bold text-[#0F172A] font-serif-luxury">
                      {faq.question}
                    </span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#C9A227]' : ''
                    }`}
                  ></i>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p className="pl-7">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
