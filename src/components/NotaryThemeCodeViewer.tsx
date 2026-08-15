import React, { useState } from 'react';
import JSZip from 'jszip';
import { NOTARY_THEME_FILES } from '../data/themeFilesMaster';
import { ThemeFile } from '../types';

interface NotaryThemeCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotaryThemeCodeViewer: React.FC<NotaryThemeCodeViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<ThemeFile>(NOTARY_THEME_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = 'notarypro-theme';
      const root = zip.folder(folderName);

      if (!root) {
        throw new Error('Failed to create folder in zip');
      }

      NOTARY_THEME_FILES.forEach((f) => {
        root.file(f.path, f.content);
      });

      // Add a clean white-label readme with instructions
      root.file(
        'README.txt',
        `================================================================================
PREMIUM WORDPRESS THEME: NOTARYPRO DIGITAL OFFICE (WHITE-LABEL READY)
================================================================================
Theme Name: NotaryPro Theme
Author: Notary & PPAT Digital Systems
Version: 3.0.0
License: GNU General Public License v2 or later

PETUNJUK INSTALASI:
1. Masuk ke Dashboard WordPress Administrator Anda.
2. Buka menu: Appearance (Tampilan) -> Themes (Tema).
3. Klik tombol "Add New Theme" (Tambah Baru) -> "Upload Theme" (Unggah Tema).
4. Pilih file "notarypro-theme.zip" ini.
5. Klik "Install Now" (Pasang Sekarang), lalu klik "Activate" (Aktifkan).
6. Sesuaikan nama kantor, logo, warna, dan SK Notaris/PPAT melalui WordPress Customizer
   atau NotaryPro Live Setup Wizard tanpa mengubah baris kode apa pun.

FITUR UNGGULAN:
- 100% White-Label: Ubah nama kantor, logo, palet warna, dan font secara instan.
- 7 Design Presets & 5 Starter Demos bawaan.
- Terintegrasi penuh dengan NotaryPro Core Plugin (19+ Layanan, Biaya, Client Portal).
- Arsitektur aman Google Apps Script Middleware (Drive & Sheets zero-key browser).
- Bebas dependensi: Kompatibel dengan Gutenberg, Elementor, Kadence, dan Classic Editor.
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'notarypro-theme-v3.0.0.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
      alert('Terjadi kendala saat menghasilkan file zip. Silakan coba lagi.');
    } finally {
      setIsZipping(false);
    }
  };

  const filteredFiles = NOTARY_THEME_FILES.filter((f) => {
    if (selectedFolder === 'ALL') return true;
    if (selectedFolder === 'ROOT') return !f.path.includes('/');
    return f.path.startsWith(selectedFolder);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl">
              <i className="fa-brands fa-wordpress"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-serif-luxury">
                  WordPress Theme Package Explorer
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  Ready to Upload
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tema: <strong className="text-slate-200 font-mono">lalu-daud-legal</strong> • Total Berkas: {NOTARY_THEME_FILES.length} Files
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-xs font-bold transition flex items-center space-x-2 shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              <i className={`fa-solid ${isZipping ? 'fa-spinner fa-spin' : 'fa-file-zipper'} text-sm`}></i>
              <span>{isZipping ? 'Membuat ZIP...' : 'Download lalu-daud-legal.zip'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* Main Body: File Sidebar + Code View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: File Tree */}
          <div className="w-full md:w-80 bg-slate-900/60 border-r border-slate-800 flex flex-col overflow-hidden">
            {/* Filter Pills */}
            <div className="p-3 border-b border-slate-800 flex flex-wrap gap-1.5 bg-slate-900/90 text-[11px]">
              {['ALL', 'ROOT', 'inc/', 'template-parts/', 'assets/'].map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    selectedFolder === folder
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-slate-800 text-[#C9A227] font-bold border border-slate-700 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <i
                        className={
                          file.language === 'php'
                            ? 'fa-brands fa-php text-blue-400'
                            : file.language === 'css'
                            ? 'fa-brands fa-css3-alt text-sky-400'
                            : file.language === 'javascript'
                            ? 'fa-brands fa-js text-yellow-400'
                            : 'fa-solid fa-code text-emerald-400'
                        }
                      ></i>
                      <span className="truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase group-hover:text-slate-400">
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Code Syntax Container */}
          <div className="flex-1 flex flex-col bg-[#0B1120] overflow-hidden">
            {/* Code Header */}
            <div className="p-3 px-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-400">Berkas:</span>
                <span className="font-bold text-[#C9A227]">{selectedFile.path}</span>
                <span className="text-slate-500">({selectedFile.description})</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-700"
              >
                <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 bg-[#0B1120] selection:bg-[#C9A227]/30 selection:text-white">
              <pre className="whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer / Installation Guide */}
        <div className="p-3 px-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-circle-info text-[#C9A227]"></i>
            <span>
              File ZIP dapat langsung diunggah via <strong>WP Admin &gt; Appearance &gt; Themes &gt; Upload Theme</strong>.
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Sesuai Standar WordPress Theme Handbook & Gutenberg FSE
          </div>
        </div>
      </div>
    </div>
  );
};
