import React, { useState } from 'react';
import { NotaryCustomizerSettings, DesignPresetKey } from '../types';
import { DESIGN_PRESETS, STARTER_SITE_DEMOS } from '../data/notaryData';

interface SetupWizardModalProps {
  isOpen: boolean;
  settings: NotaryCustomizerSettings;
  onUpdateSettings: (newSettings: NotaryCustomizerSettings) => void;
  onClose: () => void;
  onOpenPluginManager: () => void;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
  onOpenPluginManager,
}) => {
  const [step, setStep] = useState<number>(1);
  const [wizardState, setWizardState] = useState<NotaryCustomizerSettings>(settings);
  const [selectedDemo, setSelectedDemo] = useState<string>('demo-01-corporate');

  if (!isOpen) return null;

  const totalSteps = 10;

  const stepTitles = [
    'Selamat Datang di NotaryPro WP',
    'Informasi Kantor & Notaris',
    'Aset Logo & Favicon',
    'Palet Warna & Global CSS',
    'Pilih Design Preset',
    'Ruang Lingkup Layanan',
    'Integrasi Google Apps Script',
    'Client Portal & Keamanan',
    'Starter Sites & Demo Importer',
    'Selesai & Siap Digunakan',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onUpdateSettings(wizardState);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (key: keyof NotaryCustomizerSettings, val: any) => {
    setWizardState((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplyPreset = (presetKey: DesignPresetKey) => {
    const preset = DESIGN_PRESETS.find((p) => p.id === presetKey);
    if (!preset) return;
    setWizardState((prev) => ({
      ...prev,
      presetKey: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      headingColor: preset.headingColor,
      headingFont: preset.headingFont,
      bodyFont: preset.bodyFont,
      borderRadius: preset.borderRadius as any,
    }));
  };

  const handleApplyDemo = (demoId: string) => {
    setSelectedDemo(demoId);
    const demo = STARTER_SITE_DEMOS.find((d) => d.id === demoId);
    if (!demo) return;
    const preset = DESIGN_PRESETS.find((p) => p.id === demo.presetKey) || DESIGN_PRESETS[0];

    setWizardState((prev) => ({
      ...prev,
      brandName: demo.sampleOffice.brandName,
      officeName: demo.sampleOffice.officeName,
      notaryName: demo.sampleOffice.notaryName,
      notaryTitle: demo.sampleOffice.notaryTitle,
      city: demo.sampleOffice.city,
      tagline: demo.sampleOffice.tagline,
      presetKey: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      headingColor: preset.headingColor,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Header */}
        <div className="bg-[#0A192F] p-6 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-wide">NotaryPro Setup Wizard</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A192F]">
                  Langkah {step} dari {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{stepTitles[step - 1]}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-[#D4AF37] h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 text-sm space-y-4">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#D4AF37] flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Selamat Datang di NotaryPro WP Suite</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Platform digital komprehensif untuk kantor Notaris & Pejabat Pembuat Akta Tanah (PPAT). Wizard 1-Click
                ini akan memandu konfigurasi identitas kantor, visual theme, integrasi Google Drive/Sheets, hingga
                portal klien.
              </p>

              <div className="grid grid-cols-3 gap-3 text-left pt-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <i className="fa-solid fa-shield-halved text-[#D4AF37] text-lg mb-1.5 block"></i>
                  <h4 className="font-bold text-xs text-slate-900">White-Label & Safe</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Dapat diubah untuk nama kantor & logo mana pun.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <i className="fa-brands fa-google-drive text-emerald-600 text-lg mb-1.5 block"></i>
                  <h4 className="font-bold text-xs text-slate-900">Google Apps Script</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Private Drive Vault & 9 Sheets Database.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <i className="fa-solid fa-calculator text-blue-600 text-lg mb-1.5 block"></i>
                  <h4 className="font-bold text-xs text-slate-900">Kalkulator Akta</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Perhitungan PNBP, Bea, dan Jasa otomatis.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OFFICE INFO */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nama Brand / Kantor Singkat:</label>
                <input
                  type="text"
                  value={wizardState.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nama Lengkap Kantor Notaris & PPAT:</label>
                <input
                  type="text"
                  value={wizardState.officeName}
                  onChange={(e) => handleChange('officeName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Nama Notaris:</label>
                  <input
                    type="text"
                    value={wizardState.notaryName}
                    onChange={(e) => handleChange('notaryName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">Gelar (S.H., M.Kn.):</label>
                  <input
                    type="text"
                    value={wizardState.notaryDegrees}
                    onChange={(e) => handleChange('notaryDegrees', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nomor SK Kemenkumham (Notaris):</label>
                <input
                  type="text"
                  value={wizardState.skNotaryNo}
                  onChange={(e) => handleChange('skNotaryNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Nomor SK ATR/BPN (PPAT):</label>
                <input
                  type="text"
                  value={wizardState.skPpatNo}
                  onChange={(e) => handleChange('skPpatNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: LOGO & ASSETS */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Atur URL logo desktop, logo mobile, dan favicon kantor Anda.
              </p>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">URL Logo Desktop (Header Utama):</label>
                <input
                  type="text"
                  placeholder="https://domain-anda.com/wp-content/uploads/logo.png"
                  value={wizardState.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">URL Foto Pejabat Notaris:</label>
                <input
                  type="text"
                  value={wizardState.notaryPhotoUrl}
                  onChange={(e) => handleChange('notaryPhotoUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">URL Foto Gedung / Resepsionis:</label>
                <input
                  type="text"
                  value={wizardState.officePhotoUrl}
                  onChange={(e) => handleChange('officePhotoUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 4: COLORS */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Tentukan palet warna CSS variables utama untuk elemen tombol, navbar, dan background.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="block font-bold text-slate-700 text-xs mb-1">Warna Utama (Primary):</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={wizardState.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={wizardState.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="block font-bold text-slate-700 text-xs mb-1">Aksen Emas / Sorotan:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={wizardState.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={wizardState.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRESET SELECTION */}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Pilih 1 dari 7 preset visual yang paling cocok dengan karakter kantor Anda:</p>
              <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto">
                {DESIGN_PRESETS.map((preset) => {
                  const isCurrent = wizardState.presetKey === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        isCurrent
                          ? 'border-[#0A192F] bg-blue-50/50 ring-2 ring-[#0A192F]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{preset.name}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{preset.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 ml-3">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: preset.primaryColor }}
                        ></span>
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: preset.accentColor }}
                        ></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: SERVICES */}
          {step === 6 && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                <span className="font-bold block text-xs">19+ Layanan Notaris & PPAT Aktif</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Sistem otomatis mengaktifkan modul layanan: Akta Pendirian PT/CV, RUPS, Jual Beli Tanah (AJB), APHT,
                  Roya, Hibah, Waris, hingga Wasiat & Perjanjian Kawin.
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Layanan dan struktur biaya dapat diubah kapan saja melalui menu NotaryPro &rarr; Services & Calculator di
                dashboard admin.
              </p>
            </div>
          )}

          {/* STEP 7: GOOGLE INTEGRATION */}
          {step === 7 && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <i className="fa-brands fa-google-drive text-emerald-600 text-lg"></i>
                  <h4 className="font-bold text-xs text-slate-900">Google Apps Script Middleware Suite</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Arsitektur zero credential browser memastikan Google API Keys & Service Account tetap aman.
                  WordPress berkomunikasi dengan Apps Script menggunakan HMAC-SHA256 signature server-side.
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Anda dapat menyalin file Apps Script (<code className="bg-slate-100 px-1 py-0.5 rounded">Code.gs</code>,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">Security.gs</code>, dll.) di Plugin Manager.
              </p>
            </div>
          )}

          {/* STEP 8: CLIENT PORTAL */}
          {step === 8 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Aktifkan Client Portal Digital</h4>
                  <p className="text-[11px] text-slate-500">
                    Memungkinkan klien memantau status warkah dan berkas secara real-time.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={wizardState.clientPortalActive}
                  onChange={(e) => handleChange('clientPortalActive', e.target.checked)}
                  className="w-4 h-4 rounded text-[#0A192F]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 mb-1">Email Dukungan Klien:</label>
                <input
                  type="email"
                  value={wizardState.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 9: STARTER SITES / DEMO IMPORTER */}
          {step === 9 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Pilih starter demo untuk mengimpor teks dan profil kantor contoh (opsional):
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {STARTER_SITE_DEMOS.map((demo) => (
                  <div
                    key={demo.id}
                    onClick={() => handleApplyDemo(demo.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      selectedDemo === demo.id
                        ? 'border-[#0A192F] bg-blue-50/50 ring-2 ring-[#0A192F]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{demo.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                          {demo.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{demo.sampleOffice.officeName}</p>
                    </div>
                    {selectedDemo === demo.id && (
                      <i className="fa-solid fa-circle-check text-[#0A192F] text-base"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: FINISH */}
          {step === 10 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                <i className="fa-solid fa-check-double"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Konfigurasi Berhasil Disimpan!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Website kantor digital Notaris & PPAT Anda telah siap digunakan dengan identitas{' '}
                <strong className="text-slate-900">{wizardState.officeName}</strong>.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Brand:</span>
                  <span className="font-bold text-slate-800">{wizardState.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preset Theme:</span>
                  <span className="font-bold text-slate-800">{wizardState.presetKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Portal:</span>
                  <span className="font-bold text-emerald-600">Aktif</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
            <span>Kembali</span>
          </button>

          <div className="flex items-center space-x-2">
            {step === 10 ? (
              <>
                <button
                  onClick={() => {
                    onUpdateSettings(wizardState);
                    onClose();
                    onOpenPluginManager();
                  }}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
                >
                  <i className="fa-solid fa-box-archive mr-1.5"></i>
                  Unduh ZIP Plugin
                </button>
                <button
                  onClick={() => {
                    onUpdateSettings(wizardState);
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-[#D4AF37] text-xs font-bold hover:bg-[#1E293B] transition shadow-md"
                >
                  <i className="fa-solid fa-rocket mr-1.5"></i>
                  Selesai & Buka Website
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-[#D4AF37] text-xs font-bold hover:bg-[#1E293B] transition flex items-center space-x-1.5"
              >
                <span>Lanjut</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
