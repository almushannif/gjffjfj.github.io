import React from 'react';
import { NotaryCustomizerSettings } from '../types';

interface NotaryTopBarProps {
  settings: NotaryCustomizerSettings;
  onOpenCustomizer: () => void;
  onOpenThemeViewer: () => void;
  onOpenGoogleIntegration: () => void;
  onOpenPluginManager?: () => void;
  onOpenSetupWizard?: () => void;
  onOpenSystemStatus?: () => void;
  onOpenShortcodes?: () => void;
  onOpenLicenseManager?: () => void;
}

export const NotaryTopBar: React.FC<NotaryTopBarProps> = ({
  settings,
  onOpenCustomizer,
  onOpenThemeViewer,
  onOpenGoogleIntegration,
  onOpenPluginManager,
  onOpenSetupWizard,
  onOpenSystemStatus,
  onOpenShortcodes,
  onOpenLicenseManager,
}) => {
  return (
    <div className="bg-[#0A192F] text-slate-300 text-xs border-b border-slate-800 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-6 overflow-x-auto max-w-full">
          <div className="flex items-center space-x-2 shrink-0">
            <i className="fa-solid fa-building-columns text-[#D4AF37]"></i>
            <span className="font-bold text-white">{settings.brandName || 'NotaryPro WP'}</span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="truncate max-w-[240px] sm:max-w-md text-slate-300">{settings.officeAddress}</span>
          </div>
          <div className="hidden lg:flex items-center space-x-2 border-l border-slate-700 pl-4 shrink-0">
            <i className="fa-solid fa-clock text-[#D4AF37]"></i>
            <span>{settings.workingHours}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 overflow-x-auto max-w-full py-1">
          {/* Quick simulator buttons */}
          <div className="flex items-center space-x-1.5">
            {onOpenSetupWizard && (
              <button
                onClick={onOpenSetupWizard}
                className="px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A192F] font-bold text-[11px] transition flex items-center space-x-1 shadow-sm"
                title="Jalankan 10-Step Setup Wizard 1-Click"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Setup Wizard</span>
              </button>
            )}

            <button
              onClick={onOpenCustomizer}
              className="px-2.5 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold transition flex items-center space-x-1"
              title="Kustomisasi Tema, Palet Warna CSS & White-Label"
            >
              <i className="fa-solid fa-palette"></i>
              <span>Customizer</span>
            </button>

            {onOpenSystemStatus && (
              <button
                onClick={onOpenSystemStatus}
                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center space-x-1"
                title="System Status & Health Check"
              >
                <i className="fa-solid fa-heart-pulse"></i>
                <span className="hidden md:inline">Status</span>
              </button>
            )}

            {onOpenShortcodes && (
              <button
                onClick={onOpenShortcodes}
                className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition flex items-center space-x-1"
                title="Daftar 12 Shortcodes & Gutenberg Blocks"
              >
                <i className="fa-solid fa-code"></i>
                <span className="hidden md:inline">Shortcodes</span>
              </button>
            )}

            {onOpenLicenseManager && (
              <button
                onClick={onOpenLicenseManager}
                className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition flex items-center space-x-1"
                title="Pengaturan Lisensi & Agency White-Label Mode"
              >
                <i className="fa-solid fa-key"></i>
                <span className="hidden lg:inline">License</span>
              </button>
            )}

            {onOpenPluginManager && (
              <button
                onClick={onOpenPluginManager}
                className="px-2.5 py-1 rounded bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/50 text-[11px] font-bold transition flex items-center space-x-1"
                title="Buka Plugin Manager & Unduh notarypro-plugin.zip"
              >
                <i className="fa-brands fa-wordpress"></i>
                <span>Plugin ZIP</span>
              </button>
            )}

            <button
              onClick={onOpenThemeViewer}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[11px] font-bold transition flex items-center space-x-1"
              title="Lihat Source Code Tema & Unduh notarypro-theme.zip"
            >
              <i className="fa-solid fa-layer-group text-sky-400"></i>
              <span>Theme ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
