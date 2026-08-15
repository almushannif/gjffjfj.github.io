import React, { useState } from 'react';

interface ShortcodesGutenbergModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcodesGutenbergModal: React.FC<ShortcodesGutenbergModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'SHORTCODES' | 'GUTENBERG' | 'HOOKS'>('SHORTCODES');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const shortcodeList = [
    {
      code: '[notary_services]',
      description: 'Menampilkan grid seluruh layanan Notaris & PPAT aktif dengan filter kategori & pop-up rincian persyaratan.',
      args: 'category="all|notaris|ppat" columns="3" style="card|list"',
    },
    {
      code: '[notary_service id="akta-pendirian-badan-usaha"]',
      description: 'Menampilkan detail spesifik 1 jenis layanan akta lengkap dengan SOP, estimasi waktu, dan FAQ.',
      args: 'id="slug-layanan" show_faq="true"',
    },
    {
      code: '[notary_calculator]',
      description: 'Kalkulator estimasi biaya jasa akta, PNBP resmi, Bea Pajak (PPh/BPHTB) & meterai interaktif.',
      args: 'theme="navy|gold|light" default_service="ajb" show_disclaimer="true"',
    },
    {
      code: '[notary_client_login]',
      description: 'Formulir login Client Portal yang aman dengan verifikasi NIK/Nomor Berkas & proteksi Rate-Limit.',
      args: 'redirect="/portal-klien" show_help="true"',
    },
    {
      code: '[notary_client_dashboard]',
      description: 'Dashboard utama warkah perkara, riwayat status berkas, dan unduh salinan akta terverifikasi.',
      args: 'allow_upload="true" max_file_mb="10"',
    },
    {
      code: '[notary_case_list]',
      description: 'Daftar ringkasan perkara aktif yang ditangani kantor notaris (khusus user terautentikasi).',
      args: 'limit="10" status="all|proses|selesai"',
    },
    {
      code: '[notary_case_detail id="LDN-2026-0001"]',
      description: 'Menampilkan detail progres tahapan 6 langkah, timeline warkah, dan catatan legalitas.',
      args: 'id="CASE_ID" show_timeline="true"',
    },
    {
      code: '[notary_document_list]',
      description: 'Vault dokumen berkas dengan streaming download aman dan validasi magic-byte binary.',
      args: 'category="identitas|akta|pendukung"',
    },
    {
      code: '[notary_payment_list]',
      description: 'Rincian invoice tagihan biaya akta, tanda terima resmi, dan status pembayaran.',
      args: 'show_unpaid_first="true"',
    },
    {
      code: '[notary_contact]',
      description: 'Widget informasi kantor, peta Google Maps interaktif, jam operasional, dan WhatsApp direct link.',
      args: 'show_map="true" show_hours="true"',
    },
    {
      code: '[notary_appointment]',
      description: 'Formulir konsultasi dan permohonan temu muka pembuatan akta terjadwal.',
      args: 'service_prefill="true" notify_admin_email="true"',
    },
    {
      code: '[notary_progress]',
      description: 'Tracking status berkas publik instan berdasarkan nomor perkara dan 4 digit NIK.',
      args: 'masked_nik="true"',
    },
  ];

  const gutenbergBlocks = [
    {
      name: 'Notary Services Grid',
      handle: 'notarypro/services-grid',
      description: 'Blok visual grid layanan dengan penyesuaian kolom, warna aksen, dan filter kategori.',
    },
    {
      name: 'Notary Fee Calculator',
      handle: 'notarypro/cost-calculator',
      description: 'Blok kalkulator interaktif dengan rumus dinamis PNBP, BPHTB, PPh & Jasa Kenotariatan.',
    },
    {
      name: 'Notary Client Portal',
      handle: 'notarypro/client-portal',
      description: 'Blok login dan dashboard pelacakan status warkah terenkripsi.',
    },
    {
      name: 'Notary Case Timeline',
      handle: 'notarypro/case-timeline',
      description: 'Blok timeline tahapan berkas 6-langkah sesuai standar ISO kepatuhan notaris.',
    },
    {
      name: 'Notary Trust Badges',
      handle: 'notarypro/trust-indicators',
      description: 'Indikator legalitas resmi SK Kemenkumham, SK BPN, dan sertifikasi INI/IPPAT.',
    },
  ];

  const developerHooks = [
    {
      name: 'notarypro_before_case_create',
      type: 'Action',
      description: 'Dipicu sebelum nomor perkara baru digenerate dan disimpan ke database lokal / Google Sheets.',
      example: `add_action('notarypro_before_case_create', function($case_data) {\n    // Logika verifikasi khusus sebelum insert\n});`,
    },
    {
      name: 'notarypro_after_case_create',
      type: 'Action',
      description: 'Dipicu setelah perkara sukses dibuat dan folder Google Drive terbuat secara otomatis.',
      example: `add_action('notarypro_after_case_create', function($case_id, $folder_url) {\n    // Kirim notifikasi WhatsApp ke staf\n}, 10, 2);`,
    },
    {
      name: 'notarypro_service_price',
      type: 'Filter',
      description: 'Memodifikasi perhitungan biaya jasa akta dinamis sebelum ditampilkan ke klien.',
      example: `add_filter('notarypro_service_price', function($price, $service_id, $tx_value) {\n    if ($tx_value > 5000000000) {\n        return $price * 0.9; // Diskon volume korporasi\n    }\n    return $price;\n}, 10, 3);`,
    },
    {
      name: 'notarypro_template_path',
      type: 'Filter',
      description: 'Memungkinkan child theme meng-override template HTML tampilan tanpa menyentuh core plugin.',
      example: `add_filter('notarypro_template_path', function($default_path, $template_name) {\n    $child_path = get_stylesheet_directory() . '/notarypro/' . $template_name;\n    return file_exists($child_path) ? $child_path : $default_path;\n}, 10, 2);`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A192F] p-5 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <i className="fa-solid fa-code text-lg"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-wide">NotaryPro Integration Catalog</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#0A192F]">
                  Theme & Page Builder Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Shortcodes, Gutenberg Blocks, and Developer Hooks Documentation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('SHORTCODES')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'SHORTCODES'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-square-brackets text-xs"></i>
            <span>12 Safe Shortcodes</span>
          </button>

          <button
            onClick={() => setActiveTab('GUTENBERG')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'GUTENBERG'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-cubes text-xs"></i>
            <span>Gutenberg Blocks & Builders</span>
          </button>

          <button
            onClick={() => setActiveTab('HOOKS')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'HOOKS'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-code-branch text-xs"></i>
            <span>Developer Actions & Filters</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'SHORTCODES' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <span className="font-bold block">Authorization Protected Shortcodes</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Semua shortcode dapat dipasang di Elementor, Gutenberg, Kadence, Divi, atau Classic Editor. Akses data
                  pribadi tetap memvalidasi sesi dan kapabilitas user.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {shortcodeList.map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <code className="px-2.5 py-1 rounded bg-[#0A192F] text-[#D4AF37] font-mono font-bold text-xs">
                        {sc.code}
                      </code>
                      <button
                        onClick={() => handleCopy(sc.code)}
                        className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center space-x-1"
                      >
                        <i className={`fa-solid ${copiedCode === sc.code ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                        <span>{copiedCode === sc.code ? 'Tersalin' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-600 text-xs">{sc.description}</p>
                    <div className="text-[10px] font-mono text-slate-400">
                      Parameter Opsi: <span className="text-slate-600">{sc.args}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'GUTENBERG' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                <span className="font-bold block">Gutenberg & Page Builder Independence</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Plugin menyediakan server-side render blocks yang kompatibel dengan Block Themes, Elementor, Bricks,
                  Kadence, GeneratePress, dan Astra tanpa dependensi wajib.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {gutenbergBlocks.map((blk, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{blk.name}</h4>
                      <code className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {blk.handle}
                      </code>
                    </div>
                    <p className="text-slate-600 text-[11px]">{blk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'HOOKS' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <span className="font-bold block">Extensibility via Child Theme</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Gunakan WordPress actions & filters untuk memodifikasi alur bisnis tanpa mengotori core plugin.
                </p>
              </div>

              <div className="space-y-3">
                {developerHooks.map((hk, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A192F] text-white">
                          {hk.type}
                        </span>
                        <code className="font-mono font-bold text-slate-900 text-xs">{hk.name}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(hk.example)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition"
                      >
                        Copy Snippet
                      </button>
                    </div>
                    <p className="text-slate-600 text-[11px]">{hk.description}</p>
                    <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] overflow-x-auto">
                      {hk.example}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">NotaryPro Developer Documentation &bull; REST API Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0A192F] text-white font-bold hover:bg-slate-800 transition"
          >
            Tutup Katalog
          </button>
        </div>
      </div>
    </div>
  );
};
