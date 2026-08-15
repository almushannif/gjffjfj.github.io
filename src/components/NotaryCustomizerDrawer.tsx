import React, { useState, useRef } from 'react';
import {
  NotaryCustomizerSettings,
  DesignPresetKey,
  HeadingFontOption,
  BodyFontOption,
  HeaderStyleOption,
  FooterStyleOption,
  ButtonStyleOption,
  CardStyleOption,
} from '../types';
import { DEFAULT_NOTARY_SETTINGS, DESIGN_PRESETS, STARTER_SITE_DEMOS } from '../data/notaryData';

interface NotaryCustomizerDrawerProps {
  isOpen: boolean;
  settings: NotaryCustomizerSettings;
  onUpdateSettings: (newSettings: NotaryCustomizerSettings) => void;
  onClose: () => void;
}

export const NotaryCustomizerDrawer: React.FC<NotaryCustomizerDrawerProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<NotaryCustomizerSettings>(settings);
  const [activeTab, setActiveTab] = useState<
    'PRESETS' | 'BRANDING' | 'COLORS' | 'TYPO_LAYOUT' | 'CONTACT' | 'DEMO_IMPORT' | 'EXPORT_IMPORT'
  >('PRESETS');
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (key: keyof NotaryCustomizerSettings, val: any) => {
    const updated = { ...localSettings, [key]: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleApplyPreset = (presetKey: DesignPresetKey) => {
    const preset = DESIGN_PRESETS.find((p) => p.id === presetKey);
    if (!preset) return;
    const updated: NotaryCustomizerSettings = {
      ...localSettings,
      presetKey: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      headingColor: preset.headingColor,
      borderColor: preset.borderColor,
      buttonColor: preset.buttonColor,
      headingFont: preset.headingFont,
      bodyFont: preset.bodyFont,
      borderRadius: preset.borderRadius as any,
      headerStyle: preset.headerStyle,
      footerStyle: preset.footerStyle,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleImportDemo = (demoId: string) => {
    const demo = STARTER_SITE_DEMOS.find((d) => d.id === demoId);
    if (!demo) return;
    const preset = DESIGN_PRESETS.find((p) => p.id === demo.presetKey) || DESIGN_PRESETS[0];

    const updated: NotaryCustomizerSettings = {
      ...localSettings,
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
      borderColor: preset.borderColor,
      buttonColor: preset.buttonColor,
      headingFont: preset.headingFont,
      bodyFont: preset.bodyFont,
      borderRadius: preset.borderRadius as any,
      headerStyle: preset.headerStyle,
      footerStyle: preset.footerStyle,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    setImportNotice(`Berhasil mengimpor konfigurasi: ${demo.name}. Data perkara lokal tetap aman!`);
    setTimeout(() => setImportNotice(null), 4000);
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua pengaturan visual & identitas ke default NotaryPro WP?')) {
      setLocalSettings(DEFAULT_NOTARY_SETTINGS);
      onUpdateSettings(DEFAULT_NOTARY_SETTINGS);
    }
  };

  const handleExportJson = () => {
    // Sanitized JSON export without secret tokens or passwords
    const exportData = {
      product: 'NotaryPro WP',
      export_version: '3.0.0',
      exported_at: new Date().toISOString(),
      branding: {
        brandName: localSettings.brandName,
        officeName: localSettings.officeName,
        notaryName: localSettings.notaryName,
        notaryTitle: localSettings.notaryTitle,
        notaryDegrees: localSettings.notaryDegrees,
        skNotaryNo: localSettings.skNotaryNo,
        skPpatNo: localSettings.skPpatNo,
        jurisdiction: localSettings.jurisdiction,
        tagline: localSettings.tagline,
        motto: localSettings.motto,
      },
      design: {
        presetKey: localSettings.presetKey,
        primaryColor: localSettings.primaryColor,
        secondaryColor: localSettings.secondaryColor,
        accentColor: localSettings.accentColor,
        backgroundColor: localSettings.backgroundColor,
        textColor: localSettings.textColor,
        headingColor: localSettings.headingColor,
        borderColor: localSettings.borderColor,
        buttonColor: localSettings.buttonColor,
        headingFont: localSettings.headingFont,
        bodyFont: localSettings.bodyFont,
        containerWidth: localSettings.containerWidth,
        headerStyle: localSettings.headerStyle,
        footerStyle: localSettings.footerStyle,
        borderRadius: localSettings.borderRadius,
        buttonStyle: localSettings.buttonStyle,
        cardStyle: localSettings.cardStyle,
        customCss: localSettings.customCss,
      },
      contact: {
        officeAddress: localSettings.officeAddress,
        city: localSettings.city,
        province: localSettings.province,
        whatsappNumber: localSettings.whatsappNumber,
        phoneNumber: localSettings.phoneNumber,
        officeEmail: localSettings.officeEmail,
        workingHours: localSettings.workingHours,
      },
      agency: {
        enabled: localSettings.agencyWhiteLabel.enabled,
        pluginName: localSettings.agencyWhiteLabel.pluginName,
        pluginAuthor: localSettings.agencyWhiteLabel.pluginAuthor,
        themeName: localSettings.agencyWhiteLabel.themeName,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notarypro-settings-${localSettings.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (!parsed || typeof parsed !== 'object') throw new Error('Format JSON tidak valid');

        const updated: NotaryCustomizerSettings = {
          ...localSettings,
          brandName: parsed.branding?.brandName || localSettings.brandName,
          officeName: parsed.branding?.officeName || localSettings.officeName,
          notaryName: parsed.branding?.notaryName || localSettings.notaryName,
          notaryTitle: parsed.branding?.notaryTitle || localSettings.notaryTitle,
          skNotaryNo: parsed.branding?.skNotaryNo || localSettings.skNotaryNo,
          skPpatNo: parsed.branding?.skPpatNo || localSettings.skPpatNo,
          tagline: parsed.branding?.tagline || localSettings.tagline,
          motto: parsed.branding?.motto || localSettings.motto,
          presetKey: parsed.design?.presetKey || localSettings.presetKey,
          primaryColor: parsed.design?.primaryColor || localSettings.primaryColor,
          secondaryColor: parsed.design?.secondaryColor || localSettings.secondaryColor,
          accentColor: parsed.design?.accentColor || localSettings.accentColor,
          backgroundColor: parsed.design?.backgroundColor || localSettings.backgroundColor,
          textColor: parsed.design?.textColor || localSettings.textColor,
          headingColor: parsed.design?.headingColor || localSettings.headingColor,
          headingFont: parsed.design?.headingFont || localSettings.headingFont,
          bodyFont: parsed.design?.bodyFont || localSettings.bodyFont,
          borderRadius: parsed.design?.borderRadius || localSettings.borderRadius,
          headerStyle: parsed.design?.headerStyle || localSettings.headerStyle,
          footerStyle: parsed.design?.footerStyle || localSettings.footerStyle,
          customCss: parsed.design?.customCss || localSettings.customCss,
        };

        setLocalSettings(updated);
        onUpdateSettings(updated);
        setImportNotice('File pengaturan berhasil diimpor!');
        setTimeout(() => setImportNotice(null), 3000);
      } catch (err) {
        alert('Gagal mengimpor file JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#0A192F] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <i className="fa-solid fa-palette text-base"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold tracking-wide">NotaryPro Live Customizer</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A192F]">
                  White-Label Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Live Styling, CSS Variables & Multi-Brand Switcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2 overflow-x-auto scrollbar-thin">
          {[
            { id: 'PRESETS', label: 'Presets (7)', icon: 'fa-wand-magic-sparkles' },
            { id: 'BRANDING', label: 'Branding', icon: 'fa-building-columns' },
            { id: 'COLORS', label: 'CSS Colors', icon: 'fa-droplet' },
            { id: 'TYPO_LAYOUT', label: 'Typo & Layout', icon: 'fa-font' },
            { id: 'CONTACT', label: 'Kontak', icon: 'fa-address-book' },
            { id: 'DEMO_IMPORT', label: 'Demo Starter', icon: 'fa-download' },
            { id: 'EXPORT_IMPORT', label: 'Export/CSS', icon: 'fa-file-code' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'border-[#0A192F] text-[#0A192F] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {importNotice && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <i className="fa-solid fa-circle-check text-emerald-600"></i>
              <span>{importNotice}</span>
            </span>
            <button onClick={() => setImportNotice(null)} className="text-emerald-700 hover:text-emerald-900">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* TAB 1: 7 DESIGN PRESETS */}
          {activeTab === 'PRESETS' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <i className="fa-solid fa-bolt text-amber-600"></i>
                  <span>1-Click Theme Preset</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Pilih salah satu dari 7 preset visual untuk merubah palet warna CSS variables, typography, border
                  radius, dan layout secara instan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {DESIGN_PRESETS.map((preset) => {
                  const isCurrent = localSettings.presetKey === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#0A192F] bg-blue-50/40 ring-2 ring-[#0A192F]/20'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{preset.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A192F] text-white">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1">{preset.description}</p>
                        </div>
                      </div>

                      {/* Color Palette Preview Swatches */}
                      <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: preset.primaryColor }}
                            title="Primary"
                          ></span>
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: preset.secondaryColor }}
                            title="Secondary"
                          ></span>
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: preset.accentColor }}
                            title="Accent"
                          ></span>
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: preset.backgroundColor }}
                            title="Background"
                          ></span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 ml-auto">
                          Font: <span className="font-bold text-slate-700">{preset.headingFont}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & IDENTITAS */}
          {activeTab === 'BRANDING' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Brand / Produk:</label>
                <input
                  type="text"
                  value={localSettings.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  placeholder="NotaryPro WP / Kantor Notaris Mandiri"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nama brand utama yang muncul di title website dan copyright.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Kantor Notaris & PPAT:</label>
                <input
                  type="text"
                  value={localSettings.officeName}
                  onChange={(e) => handleChange('officeName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pejabat Notaris:</label>
                  <input
                    type="text"
                    value={localSettings.notaryName}
                    onChange={(e) => handleChange('notaryName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gelar Akademik:</label>
                  <input
                    type="text"
                    value={localSettings.notaryDegrees}
                    onChange={(e) => handleChange('notaryDegrees', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Resmi:</label>
                <input
                  type="text"
                  value={localSettings.notaryTitle}
                  onChange={(e) => handleChange('notaryTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SK Kemenkumham RI (Notaris):</label>
                <input
                  type="text"
                  value={localSettings.skNotaryNo}
                  onChange={(e) => handleChange('skNotaryNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SK Menteri ATR/BPN (PPAT):</label>
                <input
                  type="text"
                  value={localSettings.skPpatNo}
                  onChange={(e) => handleChange('skPpatNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wilayah Kerja / Yurisdiksi:</label>
                <input
                  type="text"
                  value={localSettings.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline Kantor:</label>
                <input
                  type="text"
                  value={localSettings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motto / Visi:</label>
                <textarea
                  rows={2}
                  value={localSettings.motto}
                  onChange={(e) => handleChange('motto', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#D4AF37]"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: CSS VARIABLES & COLORS */}
          {activeTab === 'COLORS' && (
            <div className="space-y-4">
              <p className="text-slate-500 text-[11px]">
                Ubah palet warna global melalui CSS Variables. Perubahan berlaku langsung ke seluruh komponen.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-primary (Warna Utama):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-secondary (Sekunder):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-accent (Aksen / Emas):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-background (Background):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-text (Teks Body):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    --notary-heading (Heading):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localSettings.headingColor}
                      onChange={(e) => handleChange('headingColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.headingColor}
                      onChange={(e) => handleChange('headingColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY & LAYOUT */}
          {activeTab === 'TYPO_LAYOUT' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Heading Font Family:</label>
                <select
                  value={localSettings.headingFont}
                  onChange={(e) => handleChange('headingFont', e.target.value as HeadingFontOption)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="Cinzel">Cinzel (Klasik Formal Kenotariatan)</option>
                  <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                  <option value="Merriweather">Merriweather (Legal Editorial Serif)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Sans-Serif)</option>
                  <option value="Inter">Inter (Clean Monospace Modern)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Body Font Family:</label>
                <select
                  value={localSettings.bodyFont}
                  onChange={(e) => handleChange('bodyFont', e.target.value as BodyFontOption)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Inter">Inter</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lora">Lora (Editorial Serif)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Header Style:</label>
                  <select
                    value={localSettings.headerStyle}
                    onChange={(e) => handleChange('headerStyle', e.target.value as HeaderStyleOption)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="classic">Classic (Top Bar + Logo)</option>
                    <option value="modern">Modern (Floating Glass)</option>
                    <option value="minimal">Minimal (Single Row)</option>
                    <option value="corporate">Corporate (Full Width)</option>
                    <option value="legal">Legal (Formal Badges)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Footer Style:</label>
                  <select
                    value={localSettings.footerStyle}
                    onChange={(e) => handleChange('footerStyle', e.target.value as FooterStyleOption)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="classic">Classic (4 Kolom)</option>
                    <option value="corporate">Corporate (3 Kolom + Legal)</option>
                    <option value="three-column">Three Column</option>
                    <option value="four-column">Four Column</option>
                    <option value="minimal">Minimal (Simple)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Border Radius:</label>
                  <select
                    value={localSettings.borderRadius}
                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="0px">0px (Tajam / Formal)</option>
                    <option value="4px">4px (Subtle)</option>
                    <option value="8px">8px (Standard Notary)</option>
                    <option value="12px">12px (Modern Soft)</option>
                    <option value="16px">16px (Rounded)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Style:</label>
                  <select
                    value={localSettings.buttonStyle}
                    onChange={(e) => handleChange('buttonStyle', e.target.value as ButtonStyleOption)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <option value="luxury-border">Luxury Gold Border</option>
                    <option value="solid">Solid Accent</option>
                    <option value="outline">Clean Outline</option>
                    <option value="pill">Pill Rounded</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KONTAK & OPERASIONAL */}
          {activeTab === 'CONTACT' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Kantor:</label>
                <textarea
                  rows={2}
                  value={localSettings.officeAddress}
                  onChange={(e) => handleChange('officeAddress', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten:</label>
                  <input
                    type="text"
                    value={localSettings.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provinsi:</label>
                  <input
                    type="text"
                    value={localSettings.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp (62...):</label>
                  <input
                    type="text"
                    value={localSettings.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telepon Kantor:</label>
                  <input
                    type="text"
                    value={localSettings.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi:</label>
                <input
                  type="email"
                  value={localSettings.officeEmail}
                  onChange={(e) => handleChange('officeEmail', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jam Operasional:</label>
                <input
                  type="text"
                  value={localSettings.workingHours}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>
            </div>
          )}

          {/* TAB 6: DEMO STARTER IMPORTER */}
          {activeTab === 'DEMO_IMPORT' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <i className="fa-solid fa-cloud-arrow-down text-blue-600"></i>
                  <span>Starter Sites / Demo Importer</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Impor konfigurasi kantor notaris/PPAT contoh berikut. Sistem tidak akan menghapus data klien & perkara
                  yang telah ada di database.
                </p>
              </div>

              <div className="space-y-3">
                {STARTER_SITE_DEMOS.map((demo) => (
                  <div key={demo.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{demo.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {demo.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mb-3">{demo.description}</p>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-3 space-y-1 text-[11px]">
                      <div>
                        <span className="text-slate-400">Kantor:</span>{' '}
                        <strong className="text-slate-800">{demo.sampleOffice.officeName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Notaris:</span>{' '}
                        <strong className="text-slate-800">{demo.sampleOffice.notaryName}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImportDemo(demo.id)}
                      className="w-full py-2 px-3 rounded-lg bg-[#0A192F] hover:bg-[#1E293B] text-[#D4AF37] font-bold text-xs flex items-center justify-center space-x-2 transition"
                    >
                      <i className="fa-solid fa-file-import"></i>
                      <span>Impor Demo Ini</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EXPORT / IMPORT JSON & CUSTOM CSS */}
          {activeTab === 'EXPORT_IMPORT' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <i className="fa-solid fa-file-export text-[#D4AF37]"></i>
                  <span>Export Konfigurasi NotaryPro</span>
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Unduh seluruh konfigurasi branding, warna, typography, dan layout sebagai file JSON bersih (tanpa
                  rahasia/password).
                </p>
                <button
                  onClick={handleExportJson}
                  className="w-full py-2 px-4 rounded-lg bg-[#0A192F] text-white hover:bg-slate-800 font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-download"></i>
                  <span>Export Settings (.json)</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <i className="fa-solid fa-file-import text-blue-600"></i>
                  <span>Import Konfigurasi JSON</span>
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Unggah file JSON konfigurasi NotaryPro untuk menerapkan branding kantor lain.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJsonFile}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-upload"></i>
                  <span>Pilih File JSON untuk Import</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Custom CSS Editor:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sanitized & Scoped</span>
                </label>
                <textarea
                  rows={5}
                  value={localSettings.customCss}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0A192F] text-emerald-400 font-mono text-[11px] focus:outline-none"
                  placeholder="/* Tulis CSS tambahan di sini */"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg text-slate-600 hover:text-red-600 text-xs font-semibold transition"
          >
            <i className="fa-solid fa-arrow-rotate-left mr-1.5"></i>
            Reset Default
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-[#D4AF37] text-xs font-bold transition hover:bg-[#1E293B] shadow-sm flex items-center space-x-2"
          >
            <i className="fa-solid fa-check"></i>
            <span>Terapkan & Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
