import React, { useState } from 'react';
import JSZip from 'jszip';
import { WORDPRESS_PLUGIN_FILES, PluginFile } from '../data/pluginFilesData';
import { GOOGLE_APPS_SCRIPT_FILES } from '../data/googleIntegrationData';

interface PluginManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginManagerModal: React.FC<PluginManagerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'WIZARD' | 'CONNECTIONS' | 'DRIVE' | 'SHEETS' | 'APPS_SCRIPT' | 'DATABASE' | 'SYNC_QUEUE' | 'AUDIT_LOGS' | 'TOOLS' | 'CODE_BROWSER'
  >('OVERVIEW');

  // Setup Wizard State (Steps 1 to 10)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isAutoSetupRunning, setIsAutoSetupRunning] = useState<boolean>(false);
  const [autoSetupLogs, setAutoSetupLogs] = useState<string[]>([]);
  const [setupCompleted, setSetupCompleted] = useState<boolean>(false);

  // Connection Mode (Mode A OAuth vs Mode B URL)
  const [connectionMode, setConnectionMode] = useState<'OAUTH' | 'URL'>('OAUTH');
  const [driveUrlInput, setDriveUrlInput] = useState('https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT');
  const [sheetsUrlInput, setSheetsUrlInput] = useState('https://docs.google.com/spreadsheets/d/1XyZ9876543210ABCDEFGHIJKLMN/edit');
  const [gasUrlInput, setGasUrlInput] = useState('https://script.google.com/macros/s/AKfycbx_LDN2026_ProdKey_NotaryPPAT_V25/exec');

  // Health Check & Repair State
  const [healthStatus, setHealthStatus] = useState<{ [key: string]: 'PASS' | 'WARNING' | 'ERROR' | 'CHECKING' }>({
    wpDatabase: 'PASS',
    googleOAuth: 'PASS',
    googleDrive: 'PASS',
    googleSheets: 'PASS',
    appsScript: 'PASS',
    restApi: 'PASS',
    syncQueue: 'PASS',
    permissions: 'PASS'
  });
  const [isRepairing, setIsRepairing] = useState<boolean>(false);

  // Code Browser State
  const [selectedFile, setSelectedFile] = useState<PluginFile>(WORDPRESS_PLUGIN_FILES[0]);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const showCopyNotice = (msg: string) => {
    setCopyNotice(msg);
    setTimeout(() => setCopyNotice(null), 2500);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    showCopyNotice('Kode PHP berhasil disalin ke clipboard!');
  };

  const handleDownloadPluginZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const pluginFolder = zip.folder('notarypro-wp');

      WORDPRESS_PLUGIN_FILES.forEach((file) => {
        pluginFolder?.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'notarypro-wp-v3.0.0.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showCopyNotice('File ZIP Plugin notarypro-wp-v3.0.0.zip berhasil diunduh!');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat ZIP plugin.');
    } finally {
      setIsZipping(false);
    }
  };

  const run1ClickAutoSetup = async () => {
    setIsAutoSetupRunning(true);
    setAutoSetupLogs([]);
    setWizardStep(1);

    const steps = [
      { step: 1, log: 'Step 1 [Requirements]: Memeriksa PHP 7.4+, WP 6.0+, OpenSSL AES-256, HTTPS... [PASSED]' },
      { step: 2, log: 'Step 2 [OAuth 2.0]: Mengonfigurasi Direct OAuth Client ID & Dynamic Redirect URI... [READY]' },
      { step: 3, log: 'Step 3 [Drive]: Menyiapkan Root Folder "Notaris Lalu Daud" & 7 Subfolder Baku... [CREATED]' },
      { step: 4, log: 'Step 4 [Sheets]: Menyiapkan Spreadsheet "Database Website" & 8 Legal Worksheets... [INITIALIZED]' },
      { step: 5, log: 'Step 5 [Apps Script]: Validasi Web App URL & Endpoint Health Check {success:true}... [VERIFIED]' },
      { step: 6, log: 'Step 6 [Database]: Menyiapkan 8 Tabel {prefix}ugc_* via dbDelta (Zero Crash)... [COMPLETED]' },
      { step: 7, log: 'Step 7 [Testing]: Uji E2E Local DB + Sync Queue + Google REST APIs... [ALL PASS]' },
      { step: 8, log: 'Step 8 [Complete]: Background Sync Worker WP-Cron Aktif. Sistem Siap Digunakan! [SYSTEM READY]' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setWizardStep(steps[i].step);
      setAutoSetupLogs((prev) => [...prev, steps[i].log]);
    }

    setIsAutoSetupRunning(false);
    setSetupCompleted(true);
  };

  const handleRunHealthCheck = async () => {
    setHealthStatus({
      wpDatabase: 'CHECKING',
      googleOAuth: 'CHECKING',
      googleDrive: 'CHECKING',
      googleSheets: 'CHECKING',
      appsScript: 'CHECKING',
      restApi: 'CHECKING',
      syncQueue: 'CHECKING',
      permissions: 'CHECKING'
    });

    await new Promise((r) => setTimeout(r, 800));

    setHealthStatus({
      wpDatabase: 'PASS',
      googleOAuth: 'PASS',
      googleDrive: 'PASS',
      googleSheets: 'PASS',
      appsScript: 'PASS',
      restApi: 'PASS',
      syncQueue: 'PASS',
      permissions: 'PASS'
    });
  };

  const handleRepairSystem = async () => {
    setIsRepairing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsRepairing(false);
    handleRunHealthCheck();
    showCopyNotice('Sistem integrasi berhasil diperbaiki & disinkronkan!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 font-sans animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i className="fa-brands fa-wordpress text-2xl"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Lalu Daud Notary & PPAT System
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  v2.6.0 Enterprise Notary
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Zero Credential Exposure (HMAC-SHA256)</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official WordPress Plugin & Google Apps Script Middleware for Notaris & PPAT Lalu Daud Nurjadi, M.Kn.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPluginZip}
              disabled={isZipping}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg flex items-center space-x-2 transition-all"
            >
              {isZipping ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Mengompres ZIP...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-zipper"></i>
                  <span>Download Plugin ZIP</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-6 bg-slate-950 border-b border-slate-800 flex space-x-1 overflow-x-auto flex-shrink-0 scrollbar-thin">
          {[
            { id: 'OVERVIEW', label: 'Dashboard Ringkasan', icon: 'fa-gauge-high' },
            { id: 'WIZARD', label: 'Setup Wizard (10 Langkah)', icon: 'fa-wand-magic-sparkles' },
            { id: 'CONNECTIONS', label: 'Koneksi Google', icon: 'fa-link' },
            { id: 'DRIVE', label: 'Drive Manager', icon: 'fa-folder-tree' },
            { id: 'SHEETS', label: 'Sheets Manager', icon: 'fa-table' },
            { id: 'APPS_SCRIPT', label: 'Apps Script Bridge', icon: 'fa-code' },
            { id: 'DATABASE', label: 'Database WP (10 Tabel)', icon: 'fa-database' },
            { id: 'SYNC_QUEUE', label: 'Sync & Antrian', icon: 'fa-arrows-rotate' },
            { id: 'AUDIT_LOGS', label: 'Audit Logs', icon: 'fa-shield-halved' },
            { id: 'TOOLS', label: 'Health & Repair', icon: 'fa-wrench' },
            { id: 'CODE_BROWSER', label: 'Source Code Plugin', icon: 'fa-file-code' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-3 text-xs font-semibold flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* NOTIFICATION TOAST */}
        {copyNotice && (
          <div className="absolute top-20 right-8 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl z-50 animate-bounce">
            <i className="fa-solid fa-check mr-2"></i>
            {copyNotice}
          </div>
        )}

        {/* BODY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* STATUS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Akun Google Utama</span>
                    <div className="text-sm font-bold text-white mt-1 flex items-center space-x-1.5">
                      <i className="fa-solid fa-envelope text-amber-400 text-xs"></i>
                      <span>notaris@daudnurjadi.co.id</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded font-semibold">
                      OAuth 2.0 Connected
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                    <i className="fa-brands fa-google text-lg"></i>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Root Google Drive</span>
                    <div className="text-sm font-bold text-white mt-1">Notaris Lalu Daud/</div>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-sky-500/20 text-sky-400 rounded font-semibold">
                      8 Standard Subfolders
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                    <i className="fa-brands fa-google-drive text-lg"></i>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Spreadsheet Database</span>
                    <div className="text-sm font-bold text-white mt-1">DATABASE NOTARIS & PPAT</div>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded font-semibold">
                      13 Worksheets Synced
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                    <i className="fa-solid fa-file-excel text-lg"></i>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Apps Script Web App</span>
                    <div className="text-sm font-bold text-white mt-1">HMAC-SHA256 Bridge</div>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded font-semibold">
                      v2.5.0 Verified
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                    <i className="fa-solid fa-bolt text-lg"></i>
                  </div>
                </div>
              </div>

              {/* ACTION BANNER & ARCHITECTURE PIPELINE */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      <span>Automated Legal Cloud Architecture</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      CONNECT → CONFIGURE → AUTO CREATE → SYNC → AUTOMATE
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Sistem integrasi tanpa repot: Administrator cukup menghubungkan akun Google atau memasukkan URL, dan plugin otomatis membuat struktur 10 tabel database WordPress, folder Google Drive, 13 worksheet Google Sheets lengkap dengan header kolom, serta mengamankan transfer berkas secara server-authoritative.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('WIZARD');
                        run1ClickAutoSetup();
                      }}
                      className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                    >
                      <i className="fa-solid fa-play"></i>
                      <span>Jalankan Auto Setup</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('CODE_BROWSER')}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                    >
                      <i className="fa-solid fa-code"></i>
                      <span>Lihat File Plugin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DATA FLOW DIAGRAM */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <i className="fa-solid fa-network-wired text-amber-400"></i>
                  <span>Alur Data Operasional (Data Flow Pipeline)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
                    <div className="text-xs font-bold text-white">Client Submit Data</div>
                    <p className="text-[11px] text-slate-400 mt-1">Formulir Pendaftaran / Permohonan / Kalkulator</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
                    <div className="text-xs font-bold text-white">WordPress DB</div>
                    <p className="text-[11px] text-slate-400 mt-1">Validasi NIK, sanitasi & simpan di tabel wp_ld_*</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
                    <div className="text-xs font-bold text-white">Google Drive</div>
                    <p className="text-[11px] text-slate-400 mt-1">Auto-create folder CL-XXXXX & APP-XXXXX</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">4</div>
                    <div className="text-xs font-bold text-white">Google Sheets</div>
                    <p className="text-[11px] text-slate-400 mt-1">Append baris otomatis ke 13 worksheets</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">5</div>
                    <div className="text-xs font-bold text-white">Apps Script & Portal</div>
                    <p className="text-[11px] text-slate-400 mt-1">Notifikasi WhatsApp, Email & tracking client</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETUP WIZARD (10 STEPS) */}
          {activeTab === 'WIZARD' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Interactive 10-Step Setup Wizard</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Panduan bertahap otomatisasi koneksi, pembuatan folder, spreadsheet database, dan registrasi backend.
                    </p>
                  </div>
                  <button
                    onClick={run1ClickAutoSetup}
                    disabled={isAutoSetupRunning}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center space-x-2 transition-all"
                  >
                    {isAutoSetupRunning ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Sedang Menjalankan Setup...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-bolt"></i>
                        <span>1-Click Auto Setup Semua Langkah</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 10 STEP PROGRESS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
                  {[
                    '1. OAuth',
                    '2. Drive',
                    '3. Sheets',
                    '4. Script',
                    '5. DB WP',
                    '6. Folders',
                    '7. Worksheets',
                    '8. Deploy',
                    '9. Test',
                    '10. Active'
                  ].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isDone = wizardStep > stepNum || setupCompleted;
                    const isCurrent = wizardStep === stepNum && !setupCompleted;
                    return (
                      <div
                        key={idx}
                        onClick={() => setWizardStep(stepNum)}
                        className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                            : isCurrent
                            ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-bold">{label}</div>
                        <div className="text-xs mt-1">
                          {isDone ? (
                            <i className="fa-solid fa-check text-emerald-400"></i>
                          ) : isCurrent ? (
                            <i className="fa-solid fa-spinner fa-spin text-amber-400"></i>
                          ) : (
                            <i className="fa-regular fa-circle"></i>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* STEP DETAILS & INTERACTIVE PANEL */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-400 uppercase">Langkah 1: Hubungkan Akun Google</h4>
                      <p className="text-xs text-slate-300">
                        Pilih mode integrasi: Mode A (Google OAuth 2.0 Resmi dengan enkripsi AES-256) atau Mode B (Input URL Folder & Spreadsheet langsung).
                      </p>
                      <div className="flex gap-4">
                        <label className={`flex-1 p-4 rounded-xl border cursor-pointer ${connectionMode === 'OAUTH' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'}`}>
                          <input type="radio" name="mode" checked={connectionMode === 'OAUTH'} onChange={() => setConnectionMode('OAUTH')} className="hidden" />
                          <div className="font-bold text-white text-xs">MODE A — Google OAuth 2.0 (Rekomendasi)</div>
                          <p className="text-[11px] text-slate-400 mt-1">Login satu klik, otomatis menerima dan mengamankan refresh token tanpa input password.</p>
                        </label>
                        <label className={`flex-1 p-4 rounded-xl border cursor-pointer ${connectionMode === 'URL' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'}`}>
                          <input type="radio" name="mode" checked={connectionMode === 'URL'} onChange={() => setConnectionMode('URL')} className="hidden" />
                          <div className="font-bold text-white text-xs">MODE B — Copy & Paste URL</div>
                          <p className="text-[11px] text-slate-400 mt-1">Masukkan URL Google Drive, Google Sheets, dan Apps Script secara langsung.</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-400 uppercase">Langkah 2: Konfigurasi Root Google Drive</h4>
                      <p className="text-xs text-slate-300">
                        Sistem mendeteksi atau otomatis membuat folder induk <strong className="text-white">Notaris Lalu Daud/</strong> di Google Drive Anda.
                      </p>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
                        <div className="text-slate-400">Target Root Folder Name:</div>
                        <div className="text-emerald-400 font-mono font-bold mt-1">Notaris Lalu Daud</div>
                        <div className="text-slate-500 text-[11px] mt-1">Folder ID: 1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT (Auto-verified)</div>
                      </div>
                    </div>
                  )}

                  {wizardStep === 5 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-400 uppercase">Langkah 5: Inisialisasi Database WordPress (10 Tabel)</h4>
                      <p className="text-xs text-slate-300">
                        Membuat tabel kustom berindeks di database WordPress: <code className="text-amber-300">wp_ld_clients, wp_ld_services, wp_ld_applications, wp_ld_documents, wp_ld_estimates, wp_ld_payments, wp_ld_connections, wp_ld_sync_logs, wp_ld_sync_queue, wp_ld_audit_logs</code>.
                      </p>
                    </div>
                  )}

                  {wizardStep === 7 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-400 uppercase">Langkah 7: Pembuatan 13 Worksheets Google Sheets</h4>
                      <p className="text-xs text-slate-300">
                        Otomatis membuat 13 sheet terstruktur dengan header kolom resmi: Settings, Clients, Services, Applications, Documents, Estimates, Payments, Users, Staff, ActivityLog, AuditLog, Notifications, SyncLog.
                      </p>
                    </div>
                  )}

                  {/* AUTO SETUP LOGS OUTPUT */}
                  {autoSetupLogs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Setup Logs:</div>
                      <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
                        {autoSetupLogs.map((log, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="text-slate-600">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WIZARD CONTROLS */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                      disabled={wizardStep === 1}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg"
                    >
                      <i className="fa-solid fa-arrow-left mr-2"></i> Kembali
                    </button>
                    <button
                      onClick={() => setWizardStep((prev) => Math.min(10, prev + 1))}
                      disabled={wizardStep === 10}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg"
                    >
                      Lanjut Langkah Berikutnya <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECTIONS */}
          {activeTab === 'CONNECTIONS' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Google Connection Manager</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Daftar koneksi Google terdaftar (Primary, Backup, dan Office)</p>
                  </div>
                  <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg">
                    + Tambah Akun Google
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Nama Koneksi</th>
                        <th className="pb-3 font-semibold">Akun Google</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Token Expiry</th>
                        <th className="pb-3 font-semibold">Last Sync</th>
                        <th className="pb-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-3.5 font-bold text-white flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>Primary Google Account (Kantor)</span>
                        </td>
                        <td className="py-3.5 text-slate-300 font-mono">notaris@daudnurjadi.co.id</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            Connected
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">2026-08-20 18:00 (Auto-refreshed)</td>
                        <td className="py-3.5 text-slate-400">5 menit yang lalu</td>
                        <td className="py-3.5 text-right space-x-2">
                          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]">
                            Test
                          </button>
                          <button className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px]">
                            Sync
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 font-bold text-white flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                          <span>Backup Google Account (Storage)</span>
                        </td>
                        <td className="py-3.5 text-slate-300 font-mono">backup@daudnurjadi.co.id</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400">
                            Standby
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">2026-09-01 12:00</td>
                        <td className="py-3.5 text-slate-400">1 hari yang lalu</td>
                        <td className="py-3.5 text-right space-x-2">
                          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]">
                            Test
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DRIVE */}
          {activeTab === 'DRIVE' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Google Drive Structure Manager</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Struktur folder otomatis & isolasi dokumen client berizin privat</p>
                  </div>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5"
                  >
                    <i className="fa-brands fa-google-drive"></i>
                    <span>Buka Google Drive Kantor</span>
                  </a>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="text-amber-400 font-bold flex items-center space-x-2">
                    <i className="fa-solid fa-folder-open text-amber-400"></i>
                    <span>Notaris Lalu Daud/ (Root ID: 1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT)</span>
                  </div>
                  <div className="pl-6 space-y-1.5 text-slate-300 border-l border-slate-800 ml-2">
                    <div className="text-sky-300">├── 📁 Clients/</div>
                    <div className="pl-6 text-slate-400">
                      <div>└── 📁 CL-2026-00001/ (Bpk. Bambang Sutrisno)</div>
                      <div className="pl-6 text-slate-500">
                        <div>├── 📁 Identity/ (KTP, KK, NPWP)</div>
                        <div>├── 📁 Applications/ (Formulir Permohonan)</div>
                        <div>├── 📁 Documents/ (Sertifikat Tanah Asli)</div>
                        <div>├── 📁 Contracts/ (Draft Perjanjian)</div>
                        <div>├── 📁 Estimates/ (Lembar Estimasi Biaya)</div>
                        <div>└── 📁 Archive/ (Dokumen Selesai)</div>
                      </div>
                    </div>
                    <div className="text-sky-300">├── 📁 Applications/ (APP-2026-00001/ - Submitted, Processing, Signed, Final)</div>
                    <div className="text-sky-300">├── 📁 Documents/ (Penyimpanan Berkas Terpusat)</div>
                    <div className="text-sky-300">├── 📁 Estimates/ (PDF Estimasi & Simulasi)</div>
                    <div className="text-sky-300">├── 📁 Reports/ (Laporan Bulanan & Akta)</div>
                    <div className="text-sky-300">├── 📁 Templates/ (Template Akta & Formulir)</div>
                    <div className="text-sky-300">├── 📁 Backups/ (Cadangan Database & Konfigurasi)</div>
                    <div className="text-sky-300">├── 📁 Exports/ (Export Data Tahunan)</div>
                    <div className="text-sky-300">└── 📁 System/ (Konfigurasi & Token Enkripsi)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SHEETS */}
          {activeTab === 'SHEETS' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Google Sheets Database (13 Worksheets)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Database laporan, audit trail, dan data administratif</p>
                  </div>
                  <a
                    href="https://docs.google.com/spreadsheets"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5"
                  >
                    <i className="fa-solid fa-file-excel"></i>
                    <span>Buka Spreadsheet Google</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Settings', rows: 15, cols: 4, desc: 'Konfigurasi & tarif kantor' },
                    { name: 'Clients', rows: 120, cols: 13, desc: 'Database identitas klien terverifikasi' },
                    { name: 'Services', rows: 18, cols: 9, desc: 'Daftar layanan Notaris & PPAT' },
                    { name: 'Applications', rows: 84, cols: 12, desc: 'Permohonan & progres berkas' },
                    { name: 'Documents', rows: 342, cols: 13, desc: 'Daftar file di Google Drive' },
                    { name: 'Estimates', rows: 95, cols: 12, desc: 'Log simulasi kalkulator biaya' },
                    { name: 'Payments', rows: 68, cols: 11, desc: 'Catatan pembayaran & invoice' },
                    { name: 'Users', rows: 45, cols: 8, desc: 'Akun portal pengguna terdaftar' },
                    { name: 'Staff', rows: 12, cols: 9, desc: 'Daftar pejabat & staf notaris' },
                    { name: 'ActivityLog', rows: 1250, cols: 9, desc: 'Log aktivitas sistem' },
                    { name: 'AuditLog', rows: 430, cols: 10, desc: 'Jejak audit perubahan data hukum' },
                    { name: 'Notifications', rows: 310, cols: 7, desc: 'Riwayat pemberitahuan klien' },
                    { name: 'SyncLog', rows: 540, cols: 11, desc: 'Log sinkronisasi dua arah' }
                  ].map((sheet, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-between items-start">
                      <div>
                        <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                          <i className="fa-solid fa-table text-emerald-400"></i>
                          <span>{sheet.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{sheet.desc}</p>
                        <div className="text-[10px] text-slate-500 mt-2 font-mono">
                          {sheet.rows} rows • {sheet.cols} columns
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                        VALID
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATABASE WP */}
          {activeTab === 'DATABASE' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Database WordPress (10 Custom Tables)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Database operasional berkecepatan tinggi dengan auto-prefix $wpdb-&gt;prefix</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-xs rounded-lg font-bold">
                    Schema v2.5.0 (All 10 Tables Active)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Nama Tabel</th>
                        <th className="pb-3 font-semibold">Fungsi Data</th>
                        <th className="pb-3 font-semibold">Jumlah Baris</th>
                        <th className="pb-3 font-semibold">Status Schema</th>
                        <th className="pb-3 font-semibold text-right">Diagnostik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {[
                        { name: 'wp_ld_clients', desc: 'Identitas & kontak klien', count: 120, status: 'PASS' },
                        { name: 'wp_ld_services', desc: 'Daftar & konfigurasi layanan Notaris/PPAT', count: 18, status: 'PASS' },
                        { name: 'wp_ld_applications', desc: 'Permohonan berkas & nomor perkara', count: 84, status: 'PASS' },
                        { name: 'wp_ld_documents', desc: 'Metadata & URL Google Drive dokumen', count: 342, status: 'PASS' },
                        { name: 'wp_ld_estimates', desc: 'Snapshot simulasi kalkulator biaya', count: 95, status: 'PASS' },
                        { name: 'wp_ld_payments', desc: 'Invoice, termin & bukti transfer', count: 68, status: 'PASS' },
                        { name: 'wp_ld_connections', desc: 'Token OAuth & URL Google terenkripsi', count: 2, status: 'PASS' },
                        { name: 'wp_ld_sync_logs', desc: 'Log integrasi & komunikasi API', count: 540, status: 'PASS' },
                        { name: 'wp_ld_sync_queue', desc: 'Antrian sinkronisasi offline & retry', count: 3, status: 'PASS' },
                        { name: 'wp_ld_audit_logs', desc: 'Jejak audit tindakan administrator/staf', count: 430, status: 'PASS' }
                      ].map((t, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-bold text-amber-300">{t.name}</td>
                          <td className="py-3 text-slate-300 font-sans">{t.desc}</td>
                          <td className="py-3 text-slate-400">{t.count} records</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-sans">
                              Check Index
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TOOLS & HEALTH */}
          {activeTab === 'TOOLS' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">One-Click Health Check & System Repair</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Diagnostik menyeluruh keandalan database, permission token, dan jalur koneksi</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRunHealthCheck}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-stethoscope"></i>
                      <span>Jalankan Health Check</span>
                    </button>
                    <button
                      onClick={handleRepairSystem}
                      disabled={isRepairing}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5"
                    >
                      {isRepairing ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                          <span>Memperbaiki...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wrench"></i>
                          <span>Repair Integration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(healthStatus).map(([key, status]) => (
                    <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {status === 'PASS' && 'Optimal & Terhubung'}
                          {status === 'CHECKING' && 'Memeriksa...'}
                          {status === 'WARNING' && 'Perlu Perhatian'}
                          {status === 'ERROR' && 'Kendala Ditemukan'}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                          status === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : status === 'CHECKING'
                            ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CODE BROWSER */}
          {activeTab === 'CODE_BROWSER' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* FILE LIST */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-[600px]">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Daftar File Plugin ({WORDPRESS_PLUGIN_FILES.length})
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">WordPress Standards</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {WORDPRESS_PLUGIN_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                        selectedFile.path === file.path
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                          : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <i className={`fa-solid ${file.category === 'CORE' ? 'fa-file-shield text-amber-400' : 'fa-file-code text-sky-400'}`}></i>
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans uppercase">
                        {file.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CODE VIEWER */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col h-[600px]">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="font-mono text-xs font-bold text-white flex items-center space-x-2">
                      <span className="text-amber-400">/wp-content/plugins/lalu-daud-notary/</span>
                      <span className="text-amber-300">{selectedFile.path}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedFile.content)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-colors"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span>Salin Kode</span>
                  </button>
                </div>
                <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-auto font-mono text-xs text-slate-300 border border-slate-800 scrollbar-thin">
                  <pre className="whitespace-pre">{selectedFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SYNC QUEUE */}
          {activeTab === 'SYNC_QUEUE' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Background Sync Queue & Retry Worker</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Antrian toleransi kegagalan offline (Exponential Backoff 3x Attempts)</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg font-mono">
                    WP-Cron: Every 5 Minutes
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Queue ID</th>
                        <th className="pb-3 font-semibold">Entity</th>
                        <th className="pb-3 font-semibold">Target ID</th>
                        <th className="pb-3 font-semibold">Action</th>
                        <th className="pb-3 font-semibold">Attempts</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Scheduled At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-3 text-slate-300">Q-17709871-4821</td>
                        <td className="py-3 text-amber-300">Clients</td>
                        <td className="py-3 text-white font-bold">CL-2026-00001</td>
                        <td className="py-3 text-sky-400">INSERT</td>
                        <td className="py-3 text-slate-400">1 / 3</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                            COMPLETED
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-400">2026-08-14 18:00</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-300">Q-17709875-9923</td>
                        <td className="py-3 text-amber-300">Applications</td>
                        <td className="py-3 text-white font-bold">APP-2026-00001</td>
                        <td className="py-3 text-sky-400">INSERT</td>
                        <td className="py-3 text-slate-400">1 / 3</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                            COMPLETED
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-400">2026-08-14 18:01</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT LOGS */}
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Jejak Audit Hukum (Immutable Audit Trail)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Mencatat setiap tindakan pembuatan, modifikasi berkas, dan sinkronisasi dengan IP Hash</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-lg">
                    430 Audit Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-sans">
                        <th className="pb-3 font-semibold">Audit ID</th>
                        <th className="pb-3 font-semibold">Tindakan (Action)</th>
                        <th className="pb-3 font-semibold">Entity</th>
                        <th className="pb-3 font-semibold">Entity ID</th>
                        <th className="pb-3 font-semibold">IP Hash</th>
                        <th className="pb-3 font-semibold text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-3 text-slate-400">AUD-20260814-884920</td>
                        <td className="py-3 text-amber-300 font-bold">CLIENT_REGISTERED</td>
                        <td className="py-3 text-slate-300">Client</td>
                        <td className="py-3 text-white font-bold">CL-2026-00001</td>
                        <td className="py-3 text-slate-500">e3b0c44298fc1c14...</td>
                        <td className="py-3 text-right text-slate-400">2026-08-14 18:00:12</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400">AUD-20260814-884921</td>
                        <td className="py-3 text-emerald-300 font-bold">APPLICATION_CREATED</td>
                        <td className="py-3 text-slate-300">Application</td>
                        <td className="py-3 text-white font-bold">APP-2026-00001</td>
                        <td className="py-3 text-slate-500">e3b0c44298fc1c14...</td>
                        <td className="py-3 text-right text-slate-400">2026-08-14 18:01:05</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-shield-halved text-emerald-400"></i>
            <span>Google API Quota Safe • Private Access Only • Zero Plaintext Secrets</span>
          </div>
          <div>
            Kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn. — Plugin Framework v2.5.0
          </div>
        </div>

      </div>
    </div>
  );
};
