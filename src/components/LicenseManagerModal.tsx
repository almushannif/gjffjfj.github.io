import React, { useState } from 'react';
import { NotaryCustomizerSettings, LicenseTier, LicenseStatus } from '../types';

interface LicenseManagerModalProps {
  isOpen: boolean;
  settings: NotaryCustomizerSettings;
  onUpdateSettings: (newSettings: NotaryCustomizerSettings) => void;
  onClose: () => void;
}

export const LicenseManagerModal: React.FC<LicenseManagerModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [licensing, setLicensing] = useState(settings.licensing);
  const [agency, setAgency] = useState(settings.agencyWhiteLabel);
  const [activeTab, setActiveTab] = useState<'LICENSE' | 'TIERS' | 'AGENCY_RESELLER'>('LICENSE');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      licensing,
      agencyWhiteLabel: agency,
    });
    setSuccessNotice('Konfigurasi lisensi & white-label berhasil disimpan!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleActivateMock = () => {
    setLicensing((prev) => ({
      ...prev,
      status: 'ACTIVE',
      licensedDomain: window.location.hostname || 'notaris-indonesia.id',
    }));
    setSuccessNotice('Domain berhasil diaktifkan dengan lisensi resmi!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A192F] p-5 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <i className="fa-solid fa-key text-lg"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-wide">NotaryPro License & Agency Manager</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A192F]">
                  Tier: {licensing.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Domain Activation, Feature Flags, and Reseller White-Label Controls
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('LICENSE')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'LICENSE'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-certificate text-xs"></i>
            <span>Lisensi & Domain</span>
          </button>

          <button
            onClick={() => setActiveTab('TIERS')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'TIERS'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-layer-group text-xs"></i>
            <span>Feature Flags & Paket</span>
          </button>

          <button
            onClick={() => setActiveTab('AGENCY_RESELLER')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'AGENCY_RESELLER'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-user-tie text-xs"></i>
            <span>White-Label Agency Mode</span>
          </button>
        </div>

        {successNotice && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: LICENSE & DOMAIN */}
          {activeTab === 'LICENSE' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Status Lisensi Produk</span>
                    <span className="text-[11px] text-slate-500">Masa berlaku dan otorisasi domain WordPress</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      licensing.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {licensing.status}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">License Key:</label>
                  <input
                    type="text"
                    value={licensing.licenseKey}
                    onChange={(e) => setLicensing({ ...licensing, licenseKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-500 block">Domain Terdaftar:</span>
                    <strong className="text-slate-800 font-mono text-xs">{licensing.licensedDomain}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Versi Terinstal:</span>
                    <strong className="text-slate-800 font-mono text-xs">v{licensing.productVersion}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={handleActivateMock}
                    className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#D4AF37] font-bold text-xs hover:bg-[#1E293B] transition"
                  >
                    <i className="fa-solid fa-arrows-rotate mr-1.5"></i>
                    Verifikasi Lisensi Domain
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <span className="font-bold block">Safe Offline Protection Guarantee</span>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  Jika koneksi lisensi gagal atau kedaluwarsa, core security, data klien, warkah perkara, dan dokumen
                  lokal tetap aman 100% dan tidak akan pernah dihapus.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TIERS & FEATURE FLAGS */}
          {activeTab === 'TIERS' && (
            <div className="space-y-4">
              <p className="text-slate-500">Pilih tier lisensi untuk mengaktifkan kumpulan modul bisnis:</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    tier: 'BASIC',
                    name: 'Paket Basic',
                    badge: 'Standard',
                    desc: 'Theme, Core Plugin, 19+ Layanan, Kalkulator Biaya & Kontak.',
                  },
                  {
                    tier: 'PROFESSIONAL',
                    name: 'Paket Professional',
                    badge: 'Popular',
                    desc: 'Semua Basic + Client Portal, Case Management, Document Vault & Google Sync.',
                  },
                  {
                    tier: 'BUSINESS',
                    name: 'Paket Business',
                    badge: 'Full Suite',
                    desc: 'Semua Pro + Invoicing, Multi-Staff Roles, Appointment & Audit Trail.',
                  },
                  {
                    tier: 'AGENCY',
                    name: 'Paket Agency / Reseller',
                    badge: 'White-Label',
                    desc: 'Multi-Domain, Full Custom Branding, Custom Author & Resale Rights.',
                  },
                ].map((pkg) => (
                  <div
                    key={pkg.tier}
                    onClick={() => setLicensing({ ...licensing, tier: pkg.tier as LicenseTier })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      licensing.tier === pkg.tier
                        ? 'border-[#0A192F] bg-blue-50/50 ring-2 ring-[#0A192F]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-900">{pkg.name}</h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                        {pkg.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{pkg.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHITE-LABEL AGENCY MODE */}
          {activeTab === 'AGENCY_RESELLER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Aktifkan White-Label Reseller Mode</h4>
                  <p className="text-[11px] text-slate-500">
                    Sembunyikan brand NotaryPro dan ganti dengan brand software agensi Anda sendiri.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={agency.enabled}
                  onChange={(e) => setAgency({ ...agency, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0A192F]"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Plugin Name:</label>
                  <input
                    type="text"
                    value={agency.pluginName}
                    onChange={(e) => setAgency({ ...agency, pluginName: e.target.value })}
                    placeholder="Contoh: Digital Notary Office Suite"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Plugin Author / Agency:</label>
                  <input
                    type="text"
                    value={agency.pluginAuthor}
                    onChange={(e) => setAgency({ ...agency, pluginAuthor: e.target.value })}
                    placeholder="Contoh: Apex Legal Tech Solutions"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Theme Name:</label>
                  <input
                    type="text"
                    value={agency.themeName}
                    onChange={(e) => setAgency({ ...agency, themeName: e.target.value })}
                    placeholder="Contoh: Apex Notary Theme"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Support URL:</label>
                    <input
                      type="text"
                      value={agency.supportUrl}
                      onChange={(e) => setAgency({ ...agency, supportUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Documentation URL:</label>
                    <input
                      type="text"
                      value={agency.documentationUrl}
                      onChange={(e) => setAgency({ ...agency, documentationUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Enterprise Multi-Tenant Ready</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#0A192F] text-[#D4AF37] font-bold hover:bg-[#1E293B] transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Lisensi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
