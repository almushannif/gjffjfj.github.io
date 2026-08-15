import React, { useState } from 'react';
import { NotaryCustomizerSettings } from '../types';
import { PrivacyTermsModal } from './PrivacyTermsModal';

interface NotaryFooterProps {
  settings: NotaryCustomizerSettings;
  onNavigate: (sectionId: string) => void;
  onOpenPortal: () => void;
}

export const NotaryFooter: React.FC<NotaryFooterProps> = ({
  settings,
  onNavigate,
  onOpenPortal,
}) => {
  const [modalType, setModalType] = useState<'PRIVACY' | 'TERMS' | null>(null);

  return (
    <footer className="bg-[#0A0F1D] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Identity & SK */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                <i className="fa-solid fa-scale-balanced text-lg"></i>
              </div>
              <div>
                <h4 className="text-white font-bold font-serif-luxury text-base">
                  {settings.notaryName}
                </h4>
                <p className="text-[10px] text-[#C9A227] uppercase tracking-wider font-bold">
                  {settings.notaryTitle}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Memberikan layanan kenotariatan dan ke-PPAT-an dengan integritas tinggi, kepatuhan regulasi, serta transparansi alur administrasi demi kepastian hukum para pihak.
            </p>

            <div className="space-y-1 text-[11px] text-slate-400 pt-2 font-mono">
              <div>SK Notaris: <span className="text-slate-300">{settings.skNotaryNo}</span></div>
              <div>SK PPAT: <span className="text-slate-300">{settings.skPpatNo}</span></div>
              <div>Wilayah: <span className="text-[#C9A227]">{settings.jurisdiction}</span></div>
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              Navigasi Cepat
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-[#C9A227] transition"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profil')}
                  className="hover:text-[#C9A227] transition"
                >
                  Profil Notaris
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition"
                >
                  19+ Layanan Akta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cara-kerja')}
                  className="hover:text-[#C9A227] transition"
                >
                  Cara Kerja & SOP
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  Client Portal 24/7
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('artikel')}
                  className="hover:text-[#C9A227] transition"
                >
                  Artikel & Edukasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Services */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              Layanan Utama
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Akta Pendirian PT & CV
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Akta Jual Beli (AJB) Tanah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Akta Hibah & Pembagian Hak Bersama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Hak Tanggungan Elektronik (HT-el)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Legalitas Yayasan & Koperasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('layanan')}
                  className="hover:text-[#C9A227] transition text-left"
                >
                  Legalisasi & Waarmerking Dokumen
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              Alamat Kantor
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.officeAddress}
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-phone text-[#C9A227]"></i>
                <span>{settings.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-envelope text-[#C9A227]"></i>
                <span>{settings.officeEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-clock text-[#C9A227]"></i>
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong>{settings.officeName} {settings.notaryName}</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setModalType('PRIVACY')}
              className="hover:text-slate-300 transition"
            >
              Kebijakan Privasi
            </button>
            <span>•</span>
            <button
              onClick={() => setModalType('TERMS')}
              className="hover:text-slate-300 transition"
            >
              Ketentuan & Disclaimer Hukum
            </button>
            <span>•</span>
            <span className="text-[#C9A227]">WordPress Theme Edition</span>
          </div>
        </div>
      </div>

      <PrivacyTermsModal
        type={modalType}
        settings={settings}
        onClose={() => setModalType(null)}
      />
    </footer>
  );
};
