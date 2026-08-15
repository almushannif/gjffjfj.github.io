import React, { useState } from 'react';
import { LegalArticle } from '../types';
import { LEGAL_ARTICLES } from '../data/notaryData';
import { ArticleModal } from './ArticleModal';

export const NotaryArticlesSection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<LegalArticle | null>(null);

  const categories = ['ALL', 'Notaris', 'PPAT', 'Pertanahan', 'Badan Usaha', 'Tips Dokumen'];

  const filteredArticles = selectedCat === 'ALL'
    ? LEGAL_ARTICLES
    : LEGAL_ARTICLES.filter((a) => a.category === selectedCat);

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200" id="artikel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Wawasan & Edukasi Hukum
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
            Artikel & Informasi Hukum Terkini
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Panduan hukum praktis mengenai transaksi tanah, pendirian badan usaha, dan kepatuhan administrasi hukum perdata.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCat === cat
                  ? 'bg-[#0F172A] text-[#C9A227] shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#C9A227]/60 transition duration-200 group"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0F172A]/90 text-[#C9A227] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-[#C9A227]/30">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury leading-snug group-hover:text-[#C9A227] transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveArticle(art)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#0F172A] text-[#0F172A] hover:text-[#C9A227] border border-slate-200 hover:border-[#0F172A] text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <span>Baca Artikel Lengkap</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </section>
  );
};
