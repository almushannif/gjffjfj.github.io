import React from 'react';
import { NotaryCustomizerSettings } from '../types';

interface PrivacyTermsModalProps {
  type: 'PRIVACY' | 'TERMS' | null;
  settings: NotaryCustomizerSettings;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ type, settings, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'PRIVACY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl">
        <div className="sticky top-0 bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
          <h3 className="text-base font-bold font-serif-luxury text-[#C9A227]">
            {isPrivacy ? 'Kebijakan Privasi & Perlindungan Data' : 'Ketentuan Layanan & Disclaimer Hukum'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                <strong>Kantor Notaris & PPAT {settings.notaryName}</strong> berkomitmen penuh menjaga kerahasiaan seluruh dokumen, data identitas, informasi finansial, dan data transaksi yang dipercayakan kepada kami.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">1. Dasar Hukum Kerahasiaan</h4>
              <p>
                Berdasarkan <strong>Pasal 16 ayat (1) huruf f UU No. 2 Tahun 2014 tentang Jabatan Notaris</strong>, Notaris wajib merahasiakan segala sesuatu mengenai akta yang dibuatnya dan segala keterangan yang diperoleh guna pembuatan akta sesuai dengan sumpah/janji jabatan.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">2. Penggunaan Client Portal</h4>
              <p>
                Akses ke portal pelacakan berkas menggunakan otentikasi identitas perkara. Data pelacakan hanya berisi status administratif dan nama samaran/inisial para pihak untuk menjaga privasi publik.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">3. Penyimpanan Arsip & Minuta</h4>
              <p>
                Minuta akta disimpan dalam protokol Notaris sesuai jangka waktu yang diwajibkan peraturan perundang-undangan dan dilindungi oleh brankas tahan api serta sistem keamanan fisik kantor.
              </p>
            </>
          ) : (
            <>
              <p>
                Informasi yang disajikan pada situs web resmi <strong>Kantor Notaris {settings.notaryName}</strong> disediakan untuk tujuan informasi umum dan edukasi hukum.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">1. Bukan Merupakan Nasihat Hukum Mengikat</h4>
              <p>
                Konten artikel dan FAQ di situs web ini tidak menggantikan konsultasi hukum langsung. Hubungan hukum antara Notaris dan Klien baru tercipta setelah adanya kesepakatan perbuatan hukum dan verifikasi tatap muka.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">2. Keabsahan Akta Otentik</h4>
              <p>
                Segala akta otentik hanya memiliki kekuatan pembuktian sempurna setelah dibacakan dan ditandatangani di hadapan Notaris/PPAT bersama para saksi yang memenuhi syarat hukum perdata.
              </p>
              <h4 className="font-bold text-[#0F172A] text-sm pt-2">3. Yurisdiksi Wilayah Kerja</h4>
              <p>
                Kewenangan pembuatan akta PPAT (tanah) tunduk pada daerah kerja: <strong>{settings.jurisdiction}</strong>, sedangkan kewenangan pembuatan akta Notaris berlaku di seluruh wilayah provinsi berwenang.
              </p>
            </>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0F172A] text-[#C9A227] text-xs font-bold transition hover:bg-[#1E293B]"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
