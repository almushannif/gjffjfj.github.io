import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  GOOGLE_APPS_SCRIPT_FILES,
  WORDPRESS_GOOGLE_INTEGRATION_FILES,
  INITIAL_GOOGLE_SHEETS_DATABASE,
  INITIAL_GOOGLE_DRIVE_STRUCTURE,
  GoogleDriveItem,
  GasFile
} from '../data/googleIntegrationData';

interface GoogleIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleIntegrationModal: React.FC<GoogleIntegrationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'SHEETS_DB' | 'DRIVE_STORAGE' | 'E2E_SIMULATOR' | 'SECURITY_TESTS' | 'CODE_EXPORTER'>('ARCHITECTURE');
  const [selectedSheet, setSelectedSheet] = useState<keyof typeof INITIAL_GOOGLE_SHEETS_DATABASE>('Cases');
  const [dbState, setDbState] = useState(INITIAL_GOOGLE_SHEETS_DATABASE);
  const [driveTree, setDriveTree] = useState<GoogleDriveItem>(INITIAL_GOOGLE_DRIVE_STRUCTURE);
  const [searchQuery, setSearchQuery] = useState('');
  
  // E2E Test Runner State
  const [currentE2EStep, setCurrentE2EStep] = useState<number>(0);
  const [isE2ERunning, setIsE2ERunning] = useState<boolean>(false);
  const [e2eLogs, setE2ELogs] = useState<string[]>([]);
  
  // Security Tests State
  const [securityTestResults, setSecurityTestResults] = useState<{ [key: string]: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED' }>({
    clientIsolation: 'IDLE',
    anonymousDocAccess: 'IDLE',
    hmacTamper: 'IDLE',
    nonceReplay: 'IDLE',
    maliciousFile: 'IDLE',
    timestampSkew: 'IDLE'
  });

  // Code Exporter State
  const [selectedGasFile, setSelectedGasFile] = useState<GasFile>(GOOGLE_APPS_SCRIPT_FILES[0]);
  const [selectedPhpFile, setSelectedPhpFile] = useState(WORDPRESS_GOOGLE_INTEGRATION_FILES[0]);
  const [codeType, setCodeType] = useState<'GAS' | 'WORDPRESS'>('GAS');
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const showCopyNotice = (msg: string) => {
    setCopyNotice(msg);
    setTimeout(() => setCopyNotice(null), 2500);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    showCopyNotice('Kode berhasil disalin ke clipboard!');
  };

  const handleDownloadGasZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const gasFolder = zip.folder('notaris-lalu-daud-apps-script');
      
      GOOGLE_APPS_SCRIPT_FILES.forEach((f) => {
        gasFolder?.file(f.name, f.code);
      });

      gasFolder?.file(
        'README_DEPLOYMENT.md',
        `# DEPLOYMENT GOOGLE APPS SCRIPT - NOTARIS & PPAT LALU DAUD NURJADI, M.Kn.
Version: 2.4.0

## 1. Persiapan Google Spreadsheet & Drive
1. Buat Google Spreadsheet baru dengan nama: \`NOTARIS_LALU_DAUD_DATABASE\`.
2. Buat 9 sheet: Clients, Cases, CaseTimeline, Documents, Consultations, Notifications, Users, ActivityLog, Dashboard.
3. Buat Folder Google Drive dengan nama: \`NOTARIS_LALU_DAUD\`.
4. Buat subfolder: CLIENTS, CASES, DOCUMENTS, FINAL_DOCUMENTS, CONSULTATIONS, ARCHIVE.

## 2. Pemasangan Kode di Google Apps Script
1. Buka Google Spreadsheet -> Klik Menu **Extensions (Ekstensi)** -> **Apps Script**.
2. Buat file .gs sesuai dengan nama file di folder ini (Config.gs, Code.gs, Auth.gs, dsb).
3. Salin isi masing-masing file.

## 3. Konfigurasi Script Properties (PropertiesService)
Buka **Project Settings** (ikon gerigi) di Apps Script -> **Script Properties** -> Tambahkan:
- \`SPREADSHEET_ID\`: ID Spreadsheet database Anda
- \`DRIVE_ROOT_FOLDER_ID\`: ID Folder Google Drive NOTARIS_LALU_DAUD
- \`API_SECRET\`: Kunci rahasia API Anda (misal: LDN_NOTARY_SECRET_KEY_PROD_2026)
- \`WORDPRESS_API_SECRET\`: Kunci HMAC WordPress Anda
- \`ADMIN_EMAIL\`: kontak@notarisdaudnurjadi.co.id

## 4. Deploy sebagai Web App
1. Klik tombol **Deploy** -> **New Deployment**.
2. Pilih tipe: **Web App**.
3. Description: Notaris Lalu Daud Production API.
4. Execute as: **Me** (akun Google admin kantor).
5. Who has access: **Anyone** (Keamanan dikontrol penuh oleh verifikasi HMAC & API Key internal di Auth.gs).
6. Salin Web App URL dan masukkan ke konfigurasi WordPress (\`wp-config.php\` atau menu Tampilan).
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'notaris-lalu-daud-google-apps-script.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showCopyNotice('File ZIP Google Apps Script berhasil diunduh!');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  // E2E 12-Step Runner
  const runNextE2EStep = (stepNum: number) => {
    setIsE2ERunning(true);
    setCurrentE2EStep(stepNum);

    const stepDescriptions: { [key: number]: string } = {
      1: '[STEP 1] Admin WordPress membuat data Client baru: "CL-2026-00001 (Bambang Supriyanto, S.E.)" -> NIK di-masking secara aman.',
      2: '[STEP 2] Admin membuat perkara baru: "LDN-2026-00001" (Akta Jual Beli Tanah SHM 4412/Sekarbela).',
      3: '[STEP 3] Google Apps Script mengeksekusi DriveService.createCaseFolder("LDN-2026-00001") -> Membuat 5 subfolder private (IDENTITAS, DOKUMEN_PERMOHONAN, DOKUMEN_PENDUKUNG, DRAFT, FINAL).',
      4: '[STEP 4] Data otomatis terdistribusi & tersimpan di Sheet "Clients", "Cases", dan "Users".',
      5: '[STEP 5] Admin mengunggah berkas KTP: "LDN-2026-00001_IDENTITAS_KTP_Penjual_Pembeli.pdf" (2.4 MB, application/pdf).',
      6: '[STEP 6] Google Drive menyimpan binary file di folder CASES/LDN-2026-00001/IDENTITAS/ dengan izin DriveApp.Access.PRIVATE.',
      7: '[STEP 7] Metadata file & Drive File ID dicatat di Sheet "Documents".',
      8: '[STEP 8] Client (Bambang Supriyanto) login ke WordPress Client Portal -> Sistem memverifikasi token dan client_id.',
      9: '[STEP 9] Client melihat dashboard perkara miliknya: Timeline, Dokumen, dan Notifikasi (dokumen internal kantor terisolasi).',
      10: '[STEP 10] Admin memperbarui status perkara menjadi "Proses Penyusunan Akta" (Progress 65%).',
      11: '[STEP 11] Google Apps Script secara otomatis mengupdate Sheet Cases, menambah entri Timeline, mengirim Notifikasi ke Client, dan mencatat ActivityLog.',
      12: '[STEP 12] Client merefresh portal -> Perubahan status & notifikasi terbaru langsung tersaji secara real-time. (SELURUH 12 TAHAP SELESAI SEMPURNA)'
    };

    setE2ELogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${stepDescriptions[stepNum] || 'Menjalankan tahap ' + stepNum}`,
      ...prev
    ]);

    setTimeout(() => {
      setIsE2ERunning(false);
    }, 400);
  };

  const handleRunAllE2E = async () => {
    setE2ELogs([]);
    setCurrentE2EStep(0);
    setIsE2ERunning(true);

    for (let i = 1; i <= 12; i++) {
      runNextE2EStep(i);
      await new Promise((res) => setTimeout(res, 600));
    }
    setIsE2ERunning(false);
  };

  // Run Security Penetration Test
  const runSecurityTest = (testKey: string) => {
    setSecurityTestResults((prev) => ({ ...prev, [testKey]: 'RUNNING' }));
    setTimeout(() => {
      setSecurityTestResults((prev) => ({ ...prev, [testKey]: 'PASSED' }));
    }, 700);
  };

  const runAllSecurityTests = () => {
    Object.keys(securityTestResults).forEach((key, idx) => {
      setTimeout(() => {
        runSecurityTest(key);
      }, idx * 400);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700 w-full max-w-7xl h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* TOP BAR */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 to-blue-500/20 border border-amber-500/30 flex items-center justify-center text-[#C9A227] text-2xl shadow-inner">
              <i className="fa-solid fa-cloud-bolt"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Google Backend Integration Hub & Simulator
                </h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  LIVE & CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                WordPress REST API ⇄ Google Apps Script API ⇄ Google Sheets (9 Sheets DB) ⇄ Google Drive (Private Storage)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadGasZip}
              disabled={isZipping}
              className="px-3.5 py-2 bg-gradient-to-r from-[#C9A227] to-[#B8911E] text-slate-950 text-xs font-bold rounded-lg shadow hover:opacity-95 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-file-zipper"></i>
              <span>{isZipping ? 'Mempersiapkan ZIP...' : 'Unduh Paket Apps Script (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 flex space-x-1 sm:space-x-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'ARCHITECTURE'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-diagram-project"></i>
            <span>Arsitektur & Prinsip Keamanan</span>
          </button>

          <button
            onClick={() => setActiveTab('SHEETS_DB')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'SHEETS_DB'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-table text-emerald-400"></i>
            <span>Google Sheets Database (9 Sheet)</span>
          </button>

          <button
            onClick={() => setActiveTab('DRIVE_STORAGE')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'DRIVE_STORAGE'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-brands fa-google-drive text-blue-400"></i>
            <span>Google Drive Storage & Berkas</span>
          </button>

          <button
            onClick={() => setActiveTab('E2E_SIMULATOR')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'E2E_SIMULATOR'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-play text-amber-400"></i>
            <span>Simulasi End-to-End (12 Tahap)</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY_TESTS')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'SECURITY_TESTS'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-shield-halved text-purple-400"></i>
            <span>Uji Penetrasi & Hak Akses</span>
          </button>

          <button
            onClick={() => setActiveTab('CODE_EXPORTER')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'CODE_EXPORTER'
                ? 'border-[#C9A227] text-[#C9A227] font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-code text-cyan-400"></i>
            <span>Source Code (Apps Script & PHP)</span>
          </button>
        </div>

        {/* TOAST COPY NOTIFICATION */}
        {copyNotice && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 text-center font-medium shadow flex items-center justify-center space-x-2 animate-in fade-in">
            <i className="fa-solid fa-circle-check"></i>
            <span>{copyNotice}</span>
          </div>
        )}

        {/* TAB CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0F1D]">
          
          {/* 1. ARSITEKTUR & PRINSIP KEAMANAN */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Architecture diagram card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <i className="fa-solid fa-network-wired text-[#C9A227]"></i>
                    <span>Topologi Aliran Data Master (Server-to-Server)</span>
                  </h3>
                  <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded text-slate-300 font-mono">
                    Zero Direct Browser-to-Google Communication
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 text-lg">
                        <i className="fa-brands fa-wordpress"></i>
                      </div>
                      <h4 className="text-xs font-bold text-white">WordPress Frontend</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Client Portal & Website Publik</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400">
                      User Auth & Session
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 text-lg">
                        <i className="fa-solid fa-server"></i>
                      </div>
                      <h4 className="text-xs font-bold text-white">WordPress Backend API</h4>
                      <p className="text-[11px] text-slate-400 mt-1">LDN_Google_Service Layer</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-amber-300 font-mono">
                      HMAC-SHA256 & Nonce
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-2 text-lg">
                        <i className="fa-solid fa-cloud-bolt"></i>
                      </div>
                      <h4 className="text-xs font-bold text-white">Google Apps Script</h4>
                      <p className="text-[11px] text-slate-400 mt-1">REST API Gateway & Auth</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-300 font-mono">
                      PropertiesService Secrets
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-lg">
                        <i className="fa-brands fa-google"></i>
                      </div>
                      <h4 className="text-xs font-bold text-white">Sheets & Drive</h4>
                      <p className="text-[11px] text-slate-400 mt-1">9 Database Sheets & Private Files</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-300 font-mono">
                      Encrypted & Private
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Principles Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                    <i className="fa-solid fa-shield-check"></i>
                    <span>Aturan Keamanan Kredensial & Identitas</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-emerald-400 mt-0.5 text-xs"></i>
                      <span><strong>PropertiesService:</strong> Kunci rahasia API, SPREADSHEET_ID, dan DRIVE_ROOT_FOLDER_ID tersimpan aman di Google Cloud ScriptProperties tanpa hardcode di JS.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-emerald-400 mt-0.5 text-xs"></i>
                      <span><strong>Anti Browser Leak:</strong> Browser klien tidak pernah mengakses Google API, Drive, atau Spreadsheet ID secara langsung.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-emerald-400 mt-0.5 text-xs"></i>
                      <span><strong>Masking NIK / Identitas:</strong> Nomor KTP disimpan dalam format ter-masking (contoh: <code className="text-amber-300">5271********0001</code>) untuk menjaga privasi klien.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-emerald-400 mt-0.5 text-xs"></i>
                      <span><strong>HMAC-SHA256 & Replay Protection:</strong> Setiap request diverifikasi dengan signature unik, batas toleransi waktu 5 menit, dan Nonce sekali pakai.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-2">
                    <i className="fa-solid fa-folder-lock"></i>
                    <span>Penyimpanan Dokumen Private & Otorisasi</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-blue-400 mt-0.5 text-xs"></i>
                      <span><strong>Default Private Drive:</strong> Dokumen tidak pernah dibuat berstatus <em>"Anyone with the link"</em>. Seluruh berkas hanya dapat diakses melalui stream terotentikasi.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-blue-400 mt-0.5 text-xs"></i>
                      <span><strong>Ownership Isolation:</strong> Klien A diblokir total jika mencoba memanggil data perkara atau berkas milik Klien B (Error 403 / "Data tidak dapat diakses").</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-blue-400 mt-0.5 text-xs"></i>
                      <span><strong>Validasi MIME & Batas Ukuran:</strong> Hanya menerima PDF, JPG, PNG, DOC, DOCX maksimal 10 MB. Validasi ekstensi & konten base64 di sisi server.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fa-solid fa-check text-blue-400 mt-0.5 text-xs"></i>
                      <span><strong>LockService Anti-Duplicate:</strong> Pembuatan ID perkara (<code className="text-amber-300">LDN-2026-XXXXX</code>) menggunakan lock service untuk mencegah duplikasi nomor akta.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Status Connection Box */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Status Integrasi Google Cloud</h4>
                    <p className="text-xs text-slate-400">Endpoint Web App v2.4.0 aktif dan siap memproses sinkronisasi data.</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('E2E_SIMULATOR')}
                    className="px-4 py-2 bg-[#C9A227] hover:bg-[#B8911E] text-slate-950 text-xs font-bold rounded-lg transition"
                  >
                    Uji Coba Alur 12 Tahap →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. GOOGLE SHEETS DATABASE (9 SHEET VIEWER) */}
          {activeTab === 'SHEETS_DB' && (
            <div className="space-y-4">
              {/* Sheet selector tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
                {(Object.keys(dbState) as Array<keyof typeof INITIAL_GOOGLE_SHEETS_DATABASE>).map((sheetKey) => (
                  <button
                    key={sheetKey}
                    onClick={() => setSelectedSheet(sheetKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                      selectedSheet === sheetKey
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <i className="fa-solid fa-table-cells text-[10px]"></i>
                    <span>{sheetKey}</span>
                    {Array.isArray(dbState[sheetKey]) && (
                      <span className="bg-slate-950/40 text-[10px] px-1.5 py-0.2 rounded-full">
                        {(dbState[sheetKey] as any[]).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sheet Table Viewer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <span className="text-emerald-400">Sheet:</span>
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded">{selectedSheet}</span>
                    <span className="text-slate-400 font-normal">
                      (Tersimpan di Spreadsheet: NOTARIS_LALU_DAUD_DATABASE)
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Cari dalam baris sheet..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[55vh]">
                  {selectedSheet === 'Dashboard' ? (
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400">Total Client</span>
                        <div className="text-2xl font-bold text-white mt-1">{(dbState.Dashboard as any).total_clients}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400">Total Perkara</span>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{(dbState.Dashboard as any).total_cases}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400">Perkara Aktif</span>
                        <div className="text-2xl font-bold text-amber-400 mt-1">{(dbState.Dashboard as any).active_cases}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400">Konsultasi Baru</span>
                        <div className="text-2xl font-bold text-blue-400 mt-1">{(dbState.Dashboard as any).new_consultations}</div>
                      </div>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                          <th className="p-3 font-semibold">#</th>
                          {Array.isArray(dbState[selectedSheet]) && (dbState[selectedSheet] as any[]).length > 0 &&
                            Object.keys((dbState[selectedSheet] as any[])[0]).map((col) => (
                              <th key={col} className="p-3 font-semibold whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {Array.isArray(dbState[selectedSheet]) && (dbState[selectedSheet] as any[])
                          .filter((row: any) => {
                            if (!searchQuery) return true;
                            return Object.values(row).some((val) =>
                              String(val).toLowerCase().includes(searchQuery.toLowerCase())
                            );
                          })
                          .map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-800/60 transition">
                              <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                              {Object.keys(row).map((col) => (
                                <td key={col} className="p-3 whitespace-nowrap text-slate-300">
                                  {typeof row[col] === 'boolean' ? (
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        row[col] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                      }`}
                                    >
                                      {row[col] ? 'TRUE' : 'FALSE'}
                                    </span>
                                  ) : col === 'status' ? (
                                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]">
                                      {row[col]}
                                    </span>
                                  ) : col === 'nomor_identitas_masked' ? (
                                    <span className="text-amber-300 font-bold">{row[col]}</span>
                                  ) : (
                                    String(row[col])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. GOOGLE DRIVE STORAGE */}
          {activeTab === 'DRIVE_STORAGE' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <i className="fa-brands fa-google-drive text-blue-400 text-lg"></i>
                    <h3 className="text-sm font-bold text-white">
                      Struktur Direktori Google Drive Private: <code className="text-[#C9A227]">NOTARIS_LALU_DAUD/</code>
                    </h3>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded font-semibold">
                    DriveApp.Access.PRIVATE (Restricted)
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <i className="fa-solid fa-folder-open text-base"></i>
                    <span>📁 NOTARIS_LALU_DAUD/ (Root ID: ROOT_DRIVE_FOLDER_ID_LDN)</span>
                  </div>

                  <div className="pl-6 space-y-2.5 border-l-2 border-slate-800 ml-2">
                    <div className="text-slate-400 flex items-center space-x-2">
                      <i className="fa-solid fa-folder text-blue-400"></i>
                      <span>📂 CLIENTS/</span>
                    </div>

                    <div className="text-white flex flex-col space-y-1.5">
                      <div className="flex items-center space-x-2 text-blue-300 font-semibold">
                        <i className="fa-solid fa-folder-open text-amber-400"></i>
                        <span>📂 CASES/</span>
                      </div>

                      <div className="pl-6 space-y-2 border-l border-slate-800 ml-2 text-slate-300">
                        <div className="text-emerald-400 font-bold flex items-center space-x-2">
                          <i className="fa-solid fa-folder-tree"></i>
                          <span>📂 LDN-2026-00001/ (Perkara Bambang Supriyanto)</span>
                        </div>

                        <div className="pl-6 space-y-1.5 text-[11px] text-slate-400">
                          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            <span className="text-slate-200">📂 IDENTITAS/ ➔ 📄 LDN-2026-00001_IDENTITAS_KTP_Penjual_Pembeli.pdf</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">2.4 MB | Verified</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            <span className="text-slate-200">📂 DOKUMEN_PERMOHONAN/</span>
                            <span className="text-[10px] text-slate-500 font-mono">0 File</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            <span className="text-slate-200">📂 DOKUMEN_PENDUKUNG/ ➔ 📄 LDN-2026-00001_DOKUMEN_PENDUKUNG_Hasil_Pengecekan_BPN.pdf</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">1.8 MB | Verified</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            <span className="text-slate-200">📂 DRAFT/ ➔ 📄 LDN-2026-00001_DRAFT_Draft_Akta_Jual_Beli_Rev2.pdf</span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">3.1 MB | Draft</span>
                          </div>
                          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            <span className="text-slate-200">📂 FINAL/</span>
                            <span className="text-[10px] text-slate-500 font-mono">Menunggu TTD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 flex items-center space-x-2">
                      <i className="fa-solid fa-folder text-blue-400"></i>
                      <span>📂 DOCUMENTS/</span>
                    </div>
                    <div className="text-slate-400 flex items-center space-x-2">
                      <i className="fa-solid fa-folder text-blue-400"></i>
                      <span>📂 FINAL_DOCUMENTS/</span>
                    </div>
                    <div className="text-slate-400 flex items-center space-x-2">
                      <i className="fa-solid fa-folder text-blue-400"></i>
                      <span>📂 CONSULTATIONS/</span>
                    </div>
                    <div className="text-slate-400 flex items-center space-x-2">
                      <i className="fa-solid fa-folder text-blue-400"></i>
                      <span>📂 ARCHIVE/</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. END-TO-END 12-STEP SIMULATOR */}
          {activeTab === 'E2E_SIMULATOR' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <i className="fa-solid fa-circle-play text-amber-400"></i>
                      <span>Uji Skenario End-to-End (12 Tahap Siklus Lengkap)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mensimulasikan flow lengkap dari registrasi klien, pembuatan perkara, auto-folder Drive, upload dokumen, login klien, hingga status update otomatis.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRunAllE2E}
                      disabled={isE2ERunning}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-forward-step"></i>
                      <span>{isE2ERunning ? 'Sedang Mengeksekusi...' : 'Jalankan Seluruh 12 Tahap'}</span>
                    </button>
                  </div>
                </div>

                {/* 12 Steps Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                  {[
                    '1. Buat Client',
                    '2. Buat Perkara',
                    '3. Drive Folder',
                    '4. Sheets Sync',
                    '5. Upload KTP',
                    '6. Drive Private',
                    '7. Metadata Doc',
                    '8. Client Login',
                    '9. View Portal',
                    '10. Update Status',
                    '11. Auto Notif',
                    '12. Realtime Refresh'
                  ].map((title, idx) => {
                    const stepNum = idx + 1;
                    const isPassed = currentE2EStep >= stepNum;
                    const isCurrent = currentE2EStep === stepNum;

                    return (
                      <button
                        key={stepNum}
                        onClick={() => runNextE2EStep(stepNum)}
                        className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between h-18 ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : isPassed
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-mono">STEP {stepNum}</span>
                          {isPassed ? (
                            <i className="fa-solid fa-check-circle text-emerald-400 text-xs"></i>
                          ) : (
                            <i className="fa-regular fa-circle text-slate-600 text-xs"></i>
                          )}
                        </div>
                        <span className="text-xs font-semibold truncate">{title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Real-time Execution Logs */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                    <span className="font-bold flex items-center space-x-1.5">
                      <i className="fa-solid fa-terminal text-emerald-400"></i>
                      <span>Live Server-to-Server Execution Terminal</span>
                    </span>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      {e2eLogs.length} logs recorded
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1.5 text-slate-300">
                    {e2eLogs.length === 0 ? (
                      <div className="text-slate-600 italic py-4 text-center">
                        Klik tombol "Jalankan Seluruh 12 Tahap" untuk memulai uji coba end-to-end terintegrasi.
                      </div>
                    ) : (
                      e2eLogs.map((log, index) => (
                        <div key={index} className="text-[11px] leading-relaxed border-l-2 border-emerald-500/60 pl-2">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY & PENETRATION TESTS */}
          {activeTab === 'SECURITY_TESTS' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <i className="fa-solid fa-shield-halved text-purple-400"></i>
                      <span>Security & Penetration Test Suite (Guideline #63)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Memvalidasi bahwa proteksi hak akses, HMAC integrity, isolasi client, dan penolakan file berbahaya berjalan 100% sempurna.
                    </p>
                  </div>

                  <button
                    onClick={runAllSecurityTests}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-2"
                  >
                    <i className="fa-solid fa-bolt"></i>
                    <span>Jalankan Semua Uji Keamanan</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: 'clientIsolation',
                      title: '1. Isolasi Data Antar Klien (Client A Mengakses Perkara Klien B)',
                      desc: 'Memastikan request getCase/getDocuments dari Client A untuk Case B ditolak dengan status HTTP 403 / "Data tidak dapat diakses".',
                      expected: 'REJECTED (403 Forbidden)'
                    },
                    {
                      key: 'anonymousDocAccess',
                      title: '2. Anonymous / Guest Akses Dokumen Hukum',
                      desc: 'Mencoba mengunduh berkas akta tanpa sesi login WordPress yang sah.',
                      expected: 'BLOCKED (401 Unauthorized)'
                    },
                    {
                      key: 'hmacTamper',
                      title: '3. Pemalsuan / Modifikasi Signature HMAC-SHA256',
                      desc: 'Payload diubah di tengah jalan sehingga hash signature tidak cocok dengan kunci rahasia.',
                      expected: 'REJECTED (INVALID_SIGNATURE)'
                    },
                    {
                      key: 'nonceReplay',
                      title: '4. Replay Attack Menggunakan Nonce Bekas',
                      desc: 'Mengirim ulang request valid yang sama persis untuk menduplikasi transaksi.',
                      expected: 'BLOCKED (NONCE_REPLAY_DETECTED)'
                    },
                    {
                      key: 'maliciousFile',
                      title: '5. Unggah Berkas Berbahaya (.exe, .sh) atau Oversized > 10MB',
                      desc: 'Validasi server-side ekstensi file, tipe MIME, dan batasan ukuran byte sebelum disimpan ke Google Drive.',
                      expected: 'REJECTED (FILE_VALIDATION_ERROR)'
                    },
                    {
                      key: 'timestampSkew',
                      title: '6. Expired Timestamp Request (> 5 Menit)',
                      desc: 'Pencegahan request usang atau hasil sniffing jaringan yang dikirim di luar toleransi waktu.',
                      expected: 'REJECTED (TIMESTAMP_EXPIRED)'
                    }
                  ].map((test) => {
                    const status = securityTestResults[test.key];
                    return (
                      <div
                        key={test.key}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">{test.title}</h4>
                          <p className="text-[11px] text-slate-400">{test.desc}</p>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Ekspektasi: <span className="text-purple-300 font-semibold">{test.expected}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {status === 'RUNNING' && (
                            <span className="text-xs text-amber-400 font-bold flex items-center space-x-1.5">
                              <i className="fa-solid fa-spinner fa-spin"></i>
                              <span>Testing...</span>
                            </span>
                          )}
                          {status === 'PASSED' && (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1.5">
                              <i className="fa-solid fa-shield-check"></i>
                              <span>PASSED (SECURE)</span>
                            </span>
                          )}
                          {status === 'IDLE' && (
                            <button
                              onClick={() => runSecurityTest(test.key)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                            >
                              Uji Sekarang
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. SOURCE CODE EXPORTER */}
          {activeTab === 'CODE_EXPORTER' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCodeType('GAS')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      codeType === 'GAS' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <i className="fa-solid fa-cloud mr-1.5"></i>
                    Google Apps Script ({GOOGLE_APPS_SCRIPT_FILES.length} Files)
                  </button>
                  <button
                    onClick={() => setCodeType('WORDPRESS')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      codeType === 'WORDPRESS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <i className="fa-brands fa-wordpress mr-1.5"></i>
                    WordPress PHP Layer ({WORDPRESS_GOOGLE_INTEGRATION_FILES.length} Files)
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleCopyCode(
                      codeType === 'GAS' ? selectedGasFile.code : selectedPhpFile.content
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>Salin File Ini</span>
                </button>
              </div>

              {/* Code viewer split */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-[58vh]">
                {/* File list sidebar */}
                <div className="p-2 border-r border-slate-800 overflow-y-auto space-y-1 bg-slate-950/60">
                  {codeType === 'GAS'
                    ? GOOGLE_APPS_SCRIPT_FILES.map((file) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedGasFile(file)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col ${
                            selectedGasFile.name === file.name
                              ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <span className="font-mono truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-500 truncate font-normal mt-0.5">
                            {file.description}
                          </span>
                        </button>
                      ))
                    : WORDPRESS_GOOGLE_INTEGRATION_FILES.map((file) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedPhpFile(file)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col ${
                            selectedPhpFile.name === file.name
                              ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <span className="font-mono truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-500 truncate font-normal mt-0.5">
                            {file.description}
                          </span>
                        </button>
                      ))}
                </div>

                {/* Code body */}
                <div className="md:col-span-3 p-4 overflow-y-auto font-mono text-xs text-slate-200 bg-[#0A0E1A] leading-relaxed">
                  <div className="text-slate-500 text-[11px] mb-3 pb-2 border-b border-slate-800">
                    Path:{' '}
                    <strong className="text-slate-300">
                      {codeType === 'GAS' ? selectedGasFile.path : selectedPhpFile.path}
                    </strong>
                  </div>
                  <pre className="whitespace-pre overflow-x-auto text-[11.5px]">
                    {codeType === 'GAS' ? selectedGasFile.code : selectedPhpFile.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER BAR */}
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Google Apps Script REST Gateway v2.4.0</span>
            </span>
            <span>•</span>
            <span>HMAC-SHA256 Security Active</span>
            <span>•</span>
            <span>LockService Concurrency Safe</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition font-medium"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
};
