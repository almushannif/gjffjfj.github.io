import React, { useState } from 'react';
import { NotaryCustomizerSettings } from '../types';

interface NotaryHeaderProps {
  settings: NotaryCustomizerSettings;
  activeNav: string;
  onNavigate: (sectionId: string) => void;
  onOpenPortal: () => void;
  onOpenPluginManager?: () => void;
}

export const NotaryHeader: React.FC<NotaryHeaderProps> = ({
  settings,
  activeNav,
  onNavigate,
  onOpenPortal,
  onOpenPluginManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center space-x-3.5 group text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0F172A] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] shadow-sm group-hover:scale-105 transition-transform duration-300">
              <i className="fa-solid fa-scale-balanced text-xl"></i>
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-bold text-[#C9A227]">
                {settings.officeName}
              </div>
              <div className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight font-serif-luxury tracking-wide group-hover:text-[#C9A227] transition-colors">
                {settings.notaryName}
              </div>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                SK Kemenkumham & SK BPN Resmi
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-6">
            <button
              onClick={() => handleNavClick('beranda')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'beranda' ? 'text-[#C9A227]' : 'text-[#0F172A] hover:text-[#C9A227]'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('profil')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'profil' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              Profil Notaris
            </button>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('layanan')}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className="flex items-center space-x-1 text-sm font-semibold text-slate-700 hover:text-[#C9A227] transition-colors py-2"
              >
                <span>Layanan</span>
                <i className="fa-solid fa-chevron-down text-xs ml-1 group-hover:rotate-180 transition-transform duration-200"></i>
              </button>

              <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-1">
                  <button
                    onClick={() => handleNavClick('layanan-notaris')}
                    className="w-full text-left flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition"
                  >
                    <i className="fa-solid fa-building-columns text-[#C9A227] w-6"></i>
                    <span>Layanan Kenotariatan</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('layanan-ppat')}
                    className="w-full text-left flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition"
                  >
                    <i className="fa-solid fa-house-chimney-user text-[#C9A227] w-6"></i>
                    <span>Layanan PPAT (Tanah)</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('layanan')}
                    className="w-full text-left flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C9A227] transition border-t border-slate-100 mt-1"
                  >
                    <i className="fa-solid fa-list-check text-slate-400 w-6"></i>
                    <span>Semua 19+ Layanan</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('cara-kerja')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'cara-kerja' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              Cara Kerja
            </button>

            {/* Kalkulator Biaya */}
            <button
              onClick={() => handleNavClick('kalkulator-biaya')}
              className={`text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                activeNav === 'kalkulator-biaya' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              <i className="fa-solid fa-calculator text-amber-500 text-xs"></i>
              <span>Kalkulator Biaya</span>
            </button>

            <button
              onClick={onOpenPortal}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center space-x-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Client Portal</span>
            </button>

            <button
              onClick={() => handleNavClick('artikel')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'artikel' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              Artikel Hukum
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'faq' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              FAQ
            </button>

            <button
              onClick={() => handleNavClick('kontak')}
              className={`text-sm font-semibold transition-colors ${
                activeNav === 'kontak' ? 'text-[#C9A227]' : 'text-slate-700 hover:text-[#C9A227]'
              }`}
            >
              Kontak
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {onOpenPluginManager && (
              <button
                onClick={onOpenPluginManager}
                className="px-3.5 py-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs font-bold text-amber-800 hover:bg-amber-500/20 hover:border-amber-500 transition-all flex items-center space-x-1.5"
                title="Buka WordPress Plugin Manager"
              >
                <i className="fa-brands fa-wordpress text-amber-600 text-sm"></i>
                <span>Plugin Google</span>
              </button>
            )}
            <button
              onClick={onOpenPortal}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0F172A] hover:bg-slate-50 hover:border-[#C9A227] transition-all flex items-center space-x-2"
            >
              <i className="fa-solid fa-lock text-[#C9A227]"></i>
              <span>Portal Klien</span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20hukum`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#C9A227] border border-[#C9A227]/40 text-xs font-bold shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02]"
            >
              <i className="fa-brands fa-whatsapp text-sm text-emerald-400"></i>
              <span>Konsultasi Cepat</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenPortal}
              className="p-2 rounded-lg bg-slate-100 text-[#0F172A] text-xs font-bold"
              aria-label="Portal Klien"
            >
              <i className="fa-solid fa-lock text-[#C9A227]"></i>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Buka Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('beranda')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-slate-50"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('profil')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Profil Notaris & PPAT
            </button>
            <button
              onClick={() => handleNavClick('layanan')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Layanan Notaris & PPAT (19+ Layanan)
            </button>
            <button
              onClick={() => handleNavClick('cara-kerja')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cara Kerja & Prosedur
            </button>
            <button
              onClick={() => handleNavClick('kalkulator-biaya')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-calculator text-amber-600"></i>
                <span>Kalkulator Estimasi Biaya</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">Simulasi</span>
            </button>
            <button
              onClick={() => {
                onOpenPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 flex items-center justify-between"
            >
              <span>Client Portal (Pelacakan Berkas)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">24/7</span>
            </button>
            <button
              onClick={() => handleNavClick('artikel')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Artikel & Wawasan Hukum
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pertanyaan Umum (FAQ)
            </button>
            <button
              onClick={() => handleNavClick('kontak')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kontak Kantor & Peta Lokasi
            </button>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {onOpenPluginManager && (
              <button
                onClick={() => {
                  onOpenPluginManager();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-800 text-center text-xs font-bold flex items-center justify-center space-x-2"
              >
                <i className="fa-brands fa-wordpress text-base text-amber-600"></i>
                <span>WordPress Plugin Manager</span>
              </button>
            )}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xs font-bold flex items-center justify-center space-x-2 shadow"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
