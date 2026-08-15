import React, { useState } from 'react';
import { LegalService, ServiceCategory, NotaryCustomizerSettings } from '../types';
import { LEGAL_SERVICES } from '../data/notaryData';
import { ServiceDetailModal } from './ServiceDetailModal';

interface NotaryServicesSectionProps {
  settings: NotaryCustomizerSettings;
}

export const NotaryServicesSection: React.FC<NotaryServicesSectionProps> = ({ settings }) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ServiceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalService, setActiveModalService] = useState<LegalService | null>(null);

  const filteredServices = LEGAL_SERVICES.filter((srv) => {
    const matchesCategory = selectedCategory === 'ALL' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200" id="layanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Ruang Lingkup Pelayanan Hukum
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
            Layanan Notaris & Pejabat Pembuat Akta Tanah (PPAT)
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Menyediakan lebih dari 19 jenis pembuatan akta otentik, legalitas perusahaan, serta peralihan dan pembebanan hak atas tanah dengan transparansi dan kepastian hukum.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-[#0F172A] text-[#C9A227] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Layanan ({LEGAL_SERVICES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('NOTARIS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'NOTARIS'
                  ? 'bg-[#0F172A] text-[#C9A227] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-building-columns text-[10px]"></i>
              <span>Kenotariatan</span>
            </button>
            <button
              onClick={() => setSelectedCategory('PPAT')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 flex items-center space-x-1.5 ${
                selectedCategory === 'PPAT'
                  ? 'bg-[#0F172A] text-[#C9A227] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-house-chimney-user text-[10px]"></i>
              <span>PPAT / Pertanahan</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis akta / layanan..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
            />
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C9A227] hover:bg-white transition-all duration-200 shadow-sm flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shadow group-hover:scale-105 transition-transform">
                    <i className={service.iconClass}></i>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      service.category === 'NOTARIS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {service.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] font-serif-luxury group-hover:text-[#C9A227] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">
                    {service.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <i className="fa-solid fa-clock text-slate-400"></i>
                  <span>{service.estimatedTime.split(' ')[0]} {service.estimatedTime.split(' ')[1]}</span>
                </span>

                <button
                  onClick={() => setActiveModalService(service)}
                  className="font-bold text-[#0F172A] group-hover:text-[#C9A227] flex items-center space-x-1.5 transition"
                >
                  <span>Persyaratan & Detail</span>
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
            <i className="fa-solid fa-folder-open text-3xl text-slate-400"></i>
            <p className="text-sm font-semibold text-slate-600">Layanan tidak ditemukan</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ServiceDetailModal
        service={activeModalService}
        settings={settings}
        onClose={() => setActiveModalService(null)}
      />
    </section>
  );
};
