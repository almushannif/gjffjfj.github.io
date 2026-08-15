import React from 'react';
import { NotaryCustomizerSettings } from '../types';

interface NotaryHeroProps {
  settings: NotaryCustomizerSettings;
  onOpenPortal: () => void;
  onNavigateToServices: () => void;
  onNavigateToContact: () => void;
  onOpenGoogleIntegration?: () => void;
}

export const NotaryHero: React.FC<NotaryHeroProps> = ({
  settings,
  onOpenPortal,
  onNavigateToServices,
  onNavigateToContact,
  onOpenGoogleIntegration,
}) => {
  return (
    <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
      {/* Background patterned mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold tracking-wide">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Kantor Notaris & PPAT Berizin Resmi Kemenkumham & ATR/BPN</span>
              </div>
              {onOpenGoogleIntegration && (
                <button
                  onClick={onOpenGoogleIntegration}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Google Backend Active</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] ml-0.5"></i>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-serif-luxury">
              Kepastian Hukum & Pelayanan Akta Otentik{' '}
              <span className="text-[#C9A227]">Profesional, Cepat, dan Berintegritas</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              {settings.motto}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20hukum`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-sm font-bold shadow-lg shadow-[#C9A227]/20 transition-all flex items-center space-x-2 hover:scale-[1.02]"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>Konsultasi Sekarang</span>
              </a>

              <button
                onClick={onOpenPortal}
                className="px-6 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white text-sm font-bold transition-all flex items-center space-x-2 hover:border-[#C9A227]"
              >
                <i className="fa-solid fa-laptop-file text-[#C9A227]"></i>
                <span>Akses Client Portal</span>
              </button>

              <button
                onClick={onNavigateToServices}
                className="px-5 py-3.5 rounded-lg text-slate-300 hover:text-white text-sm font-semibold transition flex items-center space-x-1.5"
              >
                <span>Jelajahi Layanan</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>19+ Layanan Notaris & PPAT</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Tracking Berkas Online 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Kerahasiaan Jabatan Terjamin</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prestigious Notary Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#C9A227] to-amber-600 opacity-25 blur-lg"></div>
              
              <div className="relative bg-slate-900/95 rounded-2xl border border-slate-700/80 p-6 shadow-2xl space-y-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={settings.notaryPhotoUrl}
                    alt={settings.notaryName}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#C9A227] shadow-md shrink-0"
                  />
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-[#C9A227]">
                      Profil Pejabat Umum
                    </div>
                    <h3 className="text-lg font-bold text-white font-serif-luxury">
                      {settings.notaryName}
                    </h3>
                    <p className="text-xs text-slate-400">{settings.notaryTitle}</p>
                  </div>
                </div>

                {/* SK & Jurisdiction Info */}
                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex flex-col sm:flex-row sm:justify-between pb-2 border-b border-slate-700/60 gap-1">
                    <span className="text-slate-400">SK Notaris:</span>
                    <span className="font-semibold text-white font-mono text-[11px]">{settings.skNotaryNo}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between pb-2 border-b border-slate-700/60 gap-1">
                    <span className="text-slate-400">SK PPAT:</span>
                    <span className="font-semibold text-white font-mono text-[11px]">{settings.skPpatNo}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-slate-400">Wilayah Kerja:</span>
                    <span className="font-semibold text-[#C9A227]">{settings.jurisdiction}</span>
                  </div>
                </div>

                {/* Live Status Pill */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center space-x-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>Pelayanan Hari Ini Buka: 08.00 – 16.00 WITA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
