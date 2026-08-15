import React from 'react';
import { LegalArticle } from '../types';

interface ArticleModalProps {
  article: LegalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] px-2.5 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/30">
              {article.category}
            </span>
            <span className="text-xs text-slate-400">• {article.readTime}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif-luxury leading-tight">
            {article.title}
          </h2>

          <div className="flex items-center space-x-4 py-3 border-y border-slate-100 text-xs text-slate-500">
            <span>Penulis: <strong className="text-slate-800">{article.author}</strong></span>
            <span>•</span>
            <span>Diterbitkan: {article.date}</span>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 max-h-80">
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
            {article.content.split('\n\n').map((para, idx) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-bold text-[#0F172A] font-serif-luxury mt-6 mb-2">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-500">Tag:</span>
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#0F172A] text-[#C9A227] text-xs font-bold transition hover:bg-[#1E293B]"
          >
            Tutup Artikel
          </button>
        </div>
      </div>
    </div>
  );
};
