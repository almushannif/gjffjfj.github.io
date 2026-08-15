import {
  NotaryCustomizerSettings,
  LegalService,
  ClientCase,
  ClientNotification,
  ActivityLog,
  LegalArticle,
  LegalFaq,
  DesignPreset,
  StarterSiteDemo,
  SystemDiagnosticItem,
} from '../types';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'navy-gold',
    name: 'Navy Gold (Executive Legal)',
    description: 'Kombinasi klasik biru laut dalam (#0A192F) dan emas satin (#D4AF37) yang memancarkan wibawa dan integritas kenotariatan formal.',
    primaryColor: '#0A192F',
    secondaryColor: '#1E293B',
    accentColor: '#D4AF37',
    backgroundColor: '#F8FAFC',
    textColor: '#0F172A',
    headingColor: '#0A192F',
    borderColor: '#E2E8F0',
    buttonColor: '#D4AF37',
    headingFont: 'Cinzel',
    bodyFont: 'Plus Jakarta Sans',
    borderRadius: '8px',
    headerStyle: 'classic',
    footerStyle: 'classic',
  },
  {
    id: 'elegant-black',
    name: 'Elegant Black (Luxury Firm)',
    description: 'Nuansa hitam obsidian premium (#121212) dengan aksen emas champagne (#C5A059) untuk kantor hukum dan notaris papan atas.',
    primaryColor: '#121212',
    secondaryColor: '#1E1E1E',
    accentColor: '#C5A059',
    backgroundColor: '#FAFAFA',
    textColor: '#171717',
    headingColor: '#121212',
    borderColor: '#E5E5E5',
    buttonColor: '#C5A059',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    borderRadius: '4px',
    headerStyle: 'legal',
    footerStyle: 'corporate',
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue (Enterprise PPAT)',
    description: 'Biru korporat terpercaya (#1E3A8A) berpadu kuning amber (#F59E0B) untuk kantor dengan fokus klien korporasi, perbankan, dan developer.',
    primaryColor: '#1E3A8A',
    secondaryColor: '#2563EB',
    accentColor: '#F59E0B',
    backgroundColor: '#F0F9FF',
    textColor: '#0F172A',
    headingColor: '#1E3A8A',
    borderColor: '#BAE6FD',
    buttonColor: '#2563EB',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    borderRadius: '12px',
    headerStyle: 'corporate',
    footerStyle: 'four-column',
  },
  {
    id: 'green-legal',
    name: 'Green Legal (Pertanahan & Agraria)',
    description: 'Hijau emerald zamrud (#064E3B) dengan aksen emas kuningan (#EAB308) melambangkan kepastian tanah dan sertifikasi agraria.',
    primaryColor: '#064E3B',
    secondaryColor: '#047857',
    accentColor: '#EAB308',
    backgroundColor: '#F0FDF4',
    textColor: '#022C22',
    headingColor: '#064E3B',
    borderColor: '#BBF7D0',
    buttonColor: '#047857',
    headingFont: 'Merriweather',
    bodyFont: 'Inter',
    borderRadius: '8px',
    headerStyle: 'modern',
    footerStyle: 'three-column',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White (Modern Boutique)',
    description: 'Desain bersih berkonsep modern monokrom (#18181B) dengan aksen safir (#2563EB) untuk kantor notaris generasi baru.',
    primaryColor: '#18181B',
    secondaryColor: '#3F3F46',
    accentColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    textColor: '#09090B',
    headingColor: '#18181B',
    borderColor: '#E4E4E7',
    buttonColor: '#18181B',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    borderRadius: '0px',
    headerStyle: 'minimal',
    footerStyle: 'minimal',
  },
  {
    id: 'luxury-brown',
    name: 'Luxury Brown (Heritage Classic)',
    description: 'Nuansa coklat kulit antik (#451A03) dan tembaga hangat (#D97706) yang mengedepankan tradisi kenotariatan terpercaya.',
    primaryColor: '#451A03',
    secondaryColor: '#78350F',
    accentColor: '#D97706',
    backgroundColor: '#FFFBEB',
    textColor: '#451A03',
    headingColor: '#451A03',
    borderColor: '#FED7AA',
    buttonColor: '#78350F',
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    borderRadius: '6px',
    headerStyle: 'classic',
    footerStyle: 'corporate',
  },
  {
    id: 'modern-teal',
    name: 'Modern Teal (Digital Law Office)',
    description: 'Nuansa teal futuristik (#134E4A) dengan aksen oranye koral (#F97316) untuk kantor notaris ramah teknologi dan digitalisasi warkah.',
    primaryColor: '#134E4A',
    secondaryColor: '#0F766E',
    accentColor: '#F97316',
    backgroundColor: '#F0FDFA',
    textColor: '#134E4A',
    headingColor: '#134E4A',
    borderColor: '#99F6E4',
    buttonColor: '#0F766E',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    borderRadius: '12px',
    headerStyle: 'modern',
    footerStyle: 'four-column',
  }
];

export const STARTER_SITE_DEMOS: StarterSiteDemo[] = [
  {
    id: 'demo-01-corporate',
    name: 'Demo 01 — Notaris Corporate & M&A',
    badge: 'Enterprise',
    description: 'Dioptimalkan untuk kantor notaris yang melayani holding perusahaan, akuisisi, merger, obligasi, dan perbankan syariah.',
    presetKey: 'corporate-blue',
    sampleOffice: {
      brandName: 'Wijaya Legal & Partners',
      officeName: 'Kantor Notaris & PPAT Ahmad Wijaya, S.H., M.Kn.',
      notaryName: 'Ahmad Wijaya, S.H., M.Kn.',
      notaryTitle: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT) Pasar Modal',
      city: 'Jakarta Selatan',
      tagline: 'Mitra Hukum Korporasi & Transaksi Strategis',
    }
  },
  {
    id: 'demo-02-modern',
    name: 'Demo 02 — Notaris Modern Digital',
    badge: 'Tech-Forward',
    description: 'Tampilan interaktif ramah klien dengan kalkulator instan dan tracking berkas real-time untuk generasi muda & startup.',
    presetKey: 'modern-teal',
    sampleOffice: {
      brandName: 'NotaryPro Digital Hub',
      officeName: 'Kantor Notaris & PPAT Siti Rahma, S.H., M.Kn.',
      notaryName: 'Siti Rahma, S.H., M.Kn.',
      notaryTitle: 'Notaris & PPAT Ramah Digital & UMKM',
      city: 'Kota Bandung',
      tagline: 'Legalitas Cepat, Transparan, dan Tanpa Ribet',
    }
  },
  {
    id: 'demo-03-elegant',
    name: 'Demo 03 — Notaris Elegant & Heritage',
    badge: 'Executive',
    description: 'Gaya visual megah dan eksklusif untuk notaris senior dengan portofolio keluarga, waris, dan yayasan besar.',
    presetKey: 'navy-gold',
    sampleOffice: {
      brandName: 'Lalu Daud Notary & PPAT',
      officeName: 'Kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn.',
      notaryName: 'Lalu Daud Nurjadi, M.Kn.',
      notaryTitle: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT)',
      city: 'Kota Mataram',
      tagline: 'Profesional, Terpercaya, dan Berintegritas',
    }
  },
  {
    id: 'demo-04-minimal',
    name: 'Demo 04 — Notaris Minimal Boutique',
    badge: 'Minimalist',
    description: 'Desain monokrom minimalis tanpa distraksi, mengutamakan kecepatan akses dokumen dan kejelasan informasi.',
    presetKey: 'minimal-white',
    sampleOffice: {
      brandName: 'Boutique Notary Office',
      officeName: 'Kantor Notaris & PPAT Hendra Kusuma, S.H., M.Kn.',
      notaryName: 'Hendra Kusuma, S.H., M.Kn.',
      notaryTitle: 'Notaris & PPAT Kota Surabaya',
      city: 'Kota Surabaya',
      tagline: 'Kejelasan Hukum dalam Kesederhanaan',
    }
  },
  {
    id: 'demo-05-ppat-pro',
    name: 'Demo 05 — PPAT Professional Agraria',
    badge: 'Agraria Focus',
    description: 'Didesain khusus untuk spesialis transaksi properti, jual beli tanah kavling, perumahan developer, dan roya sertifikat.',
    presetKey: 'green-legal',
    sampleOffice: {
      brandName: 'Agraria Legal Center',
      officeName: 'Kantor Notaris & PPAT Ratna Juwita, S.H., M.Kn.',
      notaryName: 'Ratna Juwita, S.H., M.Kn.',
      notaryTitle: 'Pejabat Pembuat Akta Tanah (PPAT) Wilayah Kerja BPN',
      city: 'Kabupaten Tangerang',
      tagline: 'Solusi Lengkap Kepastian Hak Atas Tanah & Properti',
    }
  }
];

export const SYSTEM_DIAGNOSTICS_DATA: SystemDiagnosticItem[] = [
  {
    id: 'sys-wp',
    name: 'WordPress Core Compatibility',
    category: 'CORE',
    status: 'PASS',
    value: 'WordPress 6.7.2 (Gutenberg & Classic Editor Ready)',
    recommendation: 'Sistem kompatibel penuh dengan standar arsitektur WordPress terbaru.'
  },
  {
    id: 'sys-php',
    name: 'PHP Engine & Extensions',
    category: 'SERVER',
    status: 'PASS',
    value: 'PHP 8.2.18 (cURL, OpenSSL, JSON, MBString, PDO Active)',
    recommendation: 'Semua ekstensi kriptografi dan koneksi jaringan tersedia.'
  },
  {
    id: 'sys-plugin',
    name: 'NotaryPro Plugin Version',
    category: 'CORE',
    status: 'PASS',
    value: 'v3.0.0 Enterprise Multi-Tenant Edition',
    recommendation: 'Database schema version 3.0.0 tersinkronisasi.'
  },
  {
    id: 'sys-theme',
    name: 'NotaryPro Theme Version',
    category: 'CORE',
    status: 'PASS',
    value: 'v3.0.0 White-Label Theme (Child Theme Supported)',
    recommendation: 'Template override filters aktif via notarypro_template_path.'
  },
  {
    id: 'sys-hmac',
    name: 'HMAC-SHA256 Security Token Verification',
    category: 'SECURITY',
    status: 'PASS',
    value: 'Signature Valid (5-minute timestamp tolerance, Replay guarded)',
    recommendation: 'Komunikasi WordPress <-> GAS terenkripsi penuh tanpa bocor ke browser.'
  },
  {
    id: 'sys-gas',
    name: 'Google Apps Script Web App Bridge',
    category: 'GOOGLE',
    status: 'PASS',
    value: 'Connected (PropertiesService & LockService Active)',
    recommendation: 'Endpoint doPost routing berfungsi normal untuk pembuatan folder & row data.'
  },
  {
    id: 'sys-sheets',
    name: 'Google Sheets Database Sync',
    category: 'GOOGLE',
    status: 'PASS',
    value: 'Connected (9 Worksheets: Cases, Clients, Documents, Payments, etc.)',
    recommendation: 'Struktur spreadsheet cocok dengan skema lokal ldn_cases.'
  },
  {
    id: 'sys-drive',
    name: 'Google Drive Private Storage Vault',
    category: 'STORAGE',
    status: 'PASS',
    value: 'DriveApp Root Connected (Hierarki Klien & Perkara Terisolasi)',
    recommendation: 'Izin akses diset private; dokumen hanya dapat diunduh via stream terotorisasi.'
  },
  {
    id: 'sys-upload',
    name: 'Upload Buffer & MIME Validation',
    category: 'SERVER',
    status: 'PASS',
    value: '10 MB per file limit (Magic byte verification active)',
    recommendation: 'File non-PDF/DOC/JPG/PNG otomatis ditolak di layer sanitasi.'
  },
  {
    id: 'sys-license',
    name: 'License Key & Agency Activation',
    category: 'SECURITY',
    status: 'PASS',
    value: 'AGENCY_LICENSE (Multi-Domain Active / Safe Offline Fallback)',
    recommendation: 'Fitur white-label kustom aktif tanpa batasan module flags.'
  }
];

export const DEFAULT_NOTARY_SETTINGS: NotaryCustomizerSettings = {
  // Brand & Identitas
  brandName: 'NotaryPro WP',
  officeName: 'Kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn.',
  notaryName: 'Lalu Daud Nurjadi, M.Kn.',
  notaryTitle: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT)',
  notaryDegrees: 'S.H., M.Kn.',
  skNotaryNo: 'SK Kemenkumham RI No. AHU-00342.AH.02.01.Tahun 2018',
  skPpatNo: 'SK Menteri ATR/BPN No. 248/KEP-400.17.3/IX/2019',
  jurisdiction: 'Kota Mataram & Wilayah Kerja Terkait se-Provinsi Nusa Tenggara Barat',
  tagline: 'Profesional, Terpercaya, dan Berintegritas',
  motto: 'Menghadirkan kepastian hukum, transparansi administrasi, dan kenyamanan pelayanan bagi seluruh klien perorangan maupun korporasi.',
  
  // Brand Assets
  logoUrl: '',
  logoMobileUrl: '',
  faviconUrl: '',

  // Design System & CSS Variables
  presetKey: 'navy-gold',
  primaryColor: '#0A192F',
  secondaryColor: '#1E293B',
  accentColor: '#D4AF37',
  backgroundColor: '#F8FAFC',
  textColor: '#0F172A',
  headingColor: '#0A192F',
  borderColor: '#E2E8F0',
  buttonColor: '#D4AF37',

  // Typography
  headingFont: 'Cinzel',
  bodyFont: 'Plus Jakarta Sans',
  buttonFont: 'Plus Jakarta Sans',
  menuFont: 'Plus Jakarta Sans',

  // Layout
  containerWidth: '1280px',
  headerStyle: 'classic',
  footerStyle: 'classic',
  borderRadius: '8px',
  buttonStyle: 'luxury-border',
  cardStyle: 'bordered',
  customCss: '/* Custom CSS NotaryPro WP */\n.notary-highlight {\n  border-color: var(--notary-accent);\n}',

  // Kontak & Operasional
  officeAddress: 'Jl. Majapahit No. 88A, Kekalik Jaya, Kec. Sekarbela, Kota Mataram, Nusa Tenggara Barat 83115',
  subdistrict: 'Sekarbela',
  city: 'Kota Mataram',
  province: 'Nusa Tenggara Barat',
  whatsappNumber: '6281234567890',
  phoneNumber: '(0370) 645-890',
  officeEmail: 'kontak@notarisdaudnurjadi.co.id',
  workingHours: 'Senin – Jumat | 08.00 – 16.00 WITA',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.023249089531!2d116.09630737497184!3d-8.59379899145107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdbf5c5bf5287f%3A0x6a0c0ad75b4dc175!2sSekarbela%2C%20Mataram%20City%2C%20West%20Nusa%20Tenggara!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid',
  googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.023249089531!2d116.09630737497184!3d-8.59379899145107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdbf5c5bf5287f%3A0x6a0c0ad75b4dc175!2sSekarbela%2C%20Mataram%20City%2C%20West%20Nusa%20Tenggara!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',

  notaryPhotoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80',
  officePhotoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  biography: 'Notaris dan Pejabat Pembuat Akta Tanah (PPAT) yang berpengalaman dalam menangani transaksi perdata, hukum korporasi, pendirian badan hukum/usaha, serta berbagai peralihan hak atas tanah dan pembebanan hak tanggungan. Berpegang teguh pada kode etik kenotariatan, prinsip kehati-hatian (due diligence), dan kepatuhan terhadap peraturan perundang-undangan Republik Indonesia.',
  vision: 'Menjadi kantor Notaris & PPAT terdepan yang modern, transparan, terpercaya, serta mengedepankan kepatuhan hukum dan kemudahan akses informasi bagi para pihak.',
  mission: [
    'Memberikan pelayanan hukum kenotariatan dan pertanahan yang cepat, akurat, dan sesuai asas hukum yang berlaku.',
    'Menerapkan tata kelola berkas digital dan transparansi proses melalui Client Portal terintegrasi.',
    'Menjaga kerahasiaan jabatan, integritas moral, dan objektivitas dalam setiap pembuatan akta otentik.',
    'Memberikan konsultasi hukum yang solutif, edukatif, dan bebas dari konflik kepentingan.'
  ],

  clientPortalActive: true,
  supportEmail: 'support@notarypro.id',
  supportPhone: '(0370) 645-891',

  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',

  licensing: {
    licenseKey: 'NPRO-AGENCY-2026-8899-7711-VALID',
    status: 'ACTIVE',
    tier: 'AGENCY',
    licensedDomain: 'notarisdaudnurjadi.co.id',
    productVersion: '3.0.0',
    licenseExpiry: 'Lifetime Enterprise',
    updateChannel: 'stable',
    maxDomains: 999,
    activatedDomains: ['notarisdaudnurjadi.co.id', 'demo.notarypro.id', 'localhost'],
  },

  agencyWhiteLabel: {
    enabled: true,
    pluginName: 'NotaryPro Core Plugin',
    pluginAuthor: 'NotaryPro Digital Systems',
    themeName: 'NotaryPro Theme',
    adminLogoUrl: '',
    supportUrl: 'https://notarypro.id/support',
    documentationUrl: 'https://notarypro.id/docs',
    hideNotaryProAttribution: false,
  }
};

export const LEGAL_SERVICES: LegalService[] = [
  // NOTARIS CATEGORY
  {
    id: 'akta-pendirian-badan-usaha',
    slug: 'akta-pendirian-badan-usaha',
    category: 'NOTARIS',
    title: 'Akta Pendirian Badan Usaha & Badan Hukum',
    shortDesc: 'Pembuatan akta otentik pendirian PT (Perseroan Terbatas), CV, Yayasan, Koperasi, dan Firma lengkap pengesahan Kemenkumham RI.',
    fullDesc: 'Layanan legalitas komprehensif untuk pendirian berbagai bentuk badan hukum dan badan usaha di Indonesia. Kami memfasilitasi pengecekan nama, penyusunan anggaran dasar (AD/ART), penandatanganan akta otentik, hingga pengurusan SK Pengesahan dari Kementerian Hukum dan HAM RI melalui sistem AHU Online.',
    iconClass: 'fa-solid fa-building-columns',
    targetAudience: 'Para pelaku usaha, pendiri startup, yayasan sosial, kelompok tani/koperasi, dan investor.',
    requirements: [
      'Foto/Scan KTP dan NPWP seluruh pendiri, direksi, dan komisaris.',
      'Opsi minimal 3 nama badan usaha yang akan didaftarkan.',
      'Rincian modal dasar, modal ditempatkan, dan persentase kepemilikan saham.',
      'Bidang kegiatan usaha sesuai Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) terbaru.',
      'Alamat domisili lengkap kantor tempat kedudukan usaha.'
    ],
    procedures: [
      'Konsultasi awal dan pengecekan ketersediaan nama badan usaha di SABH Kemenkumham.',
      'Penyusunan draf Anggaran Dasar oleh staf legal notaris.',
      'Pembacaan dan penandatanganan akta notaris oleh para penghadap / pendiri.',
      'Pengesahan SK Badan Hukum ke Ditjen AHU Kemenkumham.',
      'Penyerahan salinan akta otentik dan SK Pengesahan kepada klien.'
    ],
    estimatedTime: '2 – 5 Hari Kerja (setelah dokumen lengkap)',
    importantNotes: 'Semua pihak penghadap wajib menunjukkan dokumen asli identitas diri saat penandatanganan akta otentik di hadapan Notaris.',
    faq: [
      {
        question: 'Apakah pendiri harus hadir langsung saat penandatanganan?',
        answer: 'Para pendiri wajib hadir secara fisik di hadapan Notaris, atau dapat menunjuk kuasa yang sah melalui Surat Kuasa Otentik/Khusus bermaterai.'
      },
      {
        question: 'Apakah sudah termasuk pengurusan NIB OSS?',
        answer: 'Layanan notaris memfokuskan pada Akta Otentik dan SK Kemenkumham. Namun tim kami dapat membantu proses integrasi perizinan berusaha pada portal OSS RBA.'
      }
    ]
  },
  {
    id: 'perubahan-anggaran-dasar',
    slug: 'perubahan-anggaran-dasar',
    category: 'NOTARIS',
    title: 'Perubahan Anggaran Dasar & Kepengurusan Perusahaan',
    shortDesc: 'Pencatatan Berita Acara RUPS, perubahan direksi/komisaris, penambahan modal, dan pengalihan kepemilikan saham.',
    fullDesc: 'Pembuatan Akta Berita Acara Rapat Umum Pemegang Saham (RUPS) atau Pernyataan Keputusan Rapat (PKR) untuk perubahan struktur permodalan, pemegang saham, susunan pengurus, atau perubahan maksud dan tujuan perseroan.',
    iconClass: 'fa-solid fa-file-pen',
    targetAudience: 'Perseroan Terbatas (PT), CV, dan Badan Hukum yang melakukan restrukturisasi korporasi.',
    requirements: [
      'Akta Pendirian dan seluruh Akta Perubahan terakhir beserta SK Kemenkumham.',
      'KTP & NPWP pengurus lama dan pengurus baru.',
      'Risalah RUPS asli / Keputusan Sirkuler Para Pemegang Saham.',
      'Laporan daftar pemegang saham terbaru.'
    ],
    procedures: [
      'Penelaahan akta-akta terdahulu (due diligence akta perusahaan).',
      'Penyusunan minuta akta perubahan anggaran dasar.',
      'Penandatanganan akta PKR / Berita Acara RUPS.',
      'Pemberitahuan atau permohonan persetujuan perubahan ke Kemenkumham.',
      'Penerbitan surat penerimaan pemberitahuan perubahan dari Ditjen AHU.'
    ],
    estimatedTime: '3 – 6 Hari Kerja',
    importantNotes: 'Pastikan kuorum rapat pemegang saham memenuhi ketentuan pasal dalam anggaran dasar perusahaan Anda.',
    faq: [
      {
        question: 'Apakah setiap perubahan direksi wajib dilaporkan ke Kemenkumham?',
        answer: 'Ya, perubahan susunan pengurus wajib diberitahukan ke Kemenkumham dalam jangka waktu 30 hari sejak tanggal keputusan rapat.'
      }
    ]
  },
  {
    id: 'akta-perjanjian-kerjasama-pks',
    slug: 'akta-perjanjian-kerjasama-pks',
    category: 'NOTARIS',
    title: 'Perjanjian Kerja Sama (PKS) & Kontrak Bisnis',
    shortDesc: 'Penyusunan akta otentik kontrak bisnis, kemitraan strategis, joint venture, dan perjanjian fidusia.',
    fullDesc: 'Memberikan kekuatan pembuktian sempurna (volledig bewijs) atas kesepakatan bisnis para pihak melalui pembuatan akta otentik yang mengikat secara hukum serta memitigasi risiko wanprestasi.',
    iconClass: 'fa-solid fa-handshake',
    targetAudience: 'Pelaku usaha, vendor, institusi swasta, kontraktor, dan perorangan.',
    requirements: [
      'Identitas para pihak yang bersepakat (KTP/NPWP dan Legalitas Perusahaan).',
      'Poin-poin kesepakatan komersial dan ruang lingkup kerja sama.',
      'Hak dan kewajiban masing-masing pihak.',
      'Ketentuan jangka waktu, nilai transaksi, dan penyelesaian sengketa.'
    ],
    procedures: [
      'Legal drafting draf kontrak oleh tim notaris.',
      'Review dan harmonisasi pasal oleh para pihak.',
      'Penjadwalan pembacaan akta otentik.',
      'Penandatanganan di hadapan Notaris dan para saksi.',
      'Penyerahan salinan (grosse/turunan) akta.'
    ],
    estimatedTime: '2 – 4 Hari Kerja',
    importantNotes: 'Akta otentik notaris memiliki kekuatan pembuktian tertinggi di pengadilan perdata jika terjadi perselisihan.',
    faq: [
      {
        question: 'Apa perbedaan akta notaris dengan perjanjian di bawah tangan?',
        answer: 'Akta notaris dibuat di hadapan pejabat umum, memiliki tanggal pasti, menjamin keabsahan para penandatangan, dan memiliki kekuatan pembuktian mutlak.'
      }
    ]
  },
  {
    id: 'perjanjian-pengikatan-jual-beli-ppjb',
    slug: 'perjanjian-pengikatan-jual-beli-ppjb',
    category: 'NOTARIS',
    title: 'Perjanjian Pengikatan Jual Beli (PPJB)',
    shortDesc: 'Akta pendahuluan jual beli properti/tanah sebelum pembuatan AJB resmi dan pelunasan pembayaran.',
    fullDesc: 'PPJB notariil merupakan akta perjanjian pendahuluan yang melindungi hak dan kewajiban penjual dan pembeli saat syarat formal pembuatan Akta Jual Beli (AJB) PPAT belum sepenuhnya terpenuhi, seperti pembayaran bertahap atau sertifikat masih dalam proses pemecahan.',
    iconClass: 'fa-solid fa-file-contract',
    targetAudience: 'Pembeli dan penjual properti, pengembang perumahan, serta investor real estate.',
    requirements: [
      'KTP & KK Penjual (beserta persetujuan suami/istri jika harta bersama).',
      'KTP & KK Pembeli.',
      'Fotokopi Sertifikat Hak Atas Tanah (SHM/SHGB).',
      'Bukti pembayaran PBB dan kesepakatan skema termin pembayaran.'
    ],
    procedures: [
      'Pengecekan awal keaslian dokumen kepemilikan tanah.',
      'Penyusunan klausul PPJB termasuk batas waktu pelunasan dan penalti.',
      'Penandatanganan akta PPJB di hadapan Notaris.',
      'Pemberian salinan akta kepada penjual dan pembeli.'
    ],
    estimatedTime: '1 – 3 Hari Kerja',
    importantNotes: 'PPJB Notariil memberikan kepastian hukum yang jauh lebih kuat dibanding surat pernyataan di bawah tangan.',
    faq: [
      {
        question: 'Apakah PPJB otomatis mengalihkan kepemilikan tanah di BPN?',
        answer: 'Tidak. PPJB adalah ikatan perjanjian. Peralihan hak resmi di BPN baru terjadi setelah ditandatanganinya AJB di hadapan PPAT dan dibalik nama.'
      }
    ]
  },
  {
    id: 'legalisasi-dan-waarmerking',
    slug: 'legalisasi-dan-waarmerking',
    category: 'NOTARIS',
    title: 'Legalisasi, Waarmerking & Pencocokan Surat',
    shortDesc: 'Pengesahan tanda tangan dokumen di hadapan Notaris (Legalisasi) dan pendaftaran surat di bawah tangan (Waarmerking).',
    fullDesc: 'Layanan pembuktian formal atas keabsahan penandatanganan dokumen di hadapan Notaris pada tanggal tertentu (Legalisasi) atau pembukuan surat di bawah tangan ke dalam buku register khusus Notaris (Waarmerking).',
    iconClass: 'fa-solid fa-stamp',
    targetAudience: 'Masyarakat umum, instansi perbankan, ekspatriat, dan korporasi.',
    requirements: [
      'Dokumen asli yang akan dilegalisasi/didaftarkan.',
      'KTP asli pihak yang menandatangani (untuk legalisasi, penandatangan wajib hadir).',
      'Kelengkapan dokumen pendukung jika menyangkut persetujuan keluarga/perusahaan.'
    ],
    procedures: [
      'Verifikasi identitas penghadap dan substansi surat.',
      'Penandatanganan langsung di hadapan Notaris (untuk legalisasi).',
      'Pencatatan dalam buku repertorium / buku daftar surat notaris.',
      'Pemberian stempel legalisasi resmi beserta tanda tangan Notaris.'
    ],
    estimatedTime: 'Langsung selesai (30 – 60 Menit)',
    importantNotes: 'Untuk Legalisasi, para penandatangan mutlak harus hadir sendiri secara fisik membawa KTP asli.',
    faq: [
      {
        question: 'Apa beda Legalisasi dengan Waarmerking?',
        answer: 'Legalisasi memastikan tanggal dan penandatanganan dilakukan di hadapan notaris. Waarmerking hanya membukukan surat yang sudah ditandatangani sebelumnya untuk kepastian tanggal terdaftar.'
      }
    ]
  },
  {
    id: 'akta-hibah-wasiat-kuasa',
    slug: 'akta-hibah-wasiat-kuasa',
    category: 'NOTARIS',
    title: 'Akta Wasiat, Hibah & Surat Kuasa Otentik',
    shortDesc: 'Penyusunan akta wasiat otentik, hibah harta non-tanah, serta surat kuasa menjual atau kuasa perdata otentik.',
    fullDesc: 'Penyusunan dokumen otentik mengenai pembagian warisan, pembuatan wasiat tertutup maupun terbuka yang didaftarkan ke Pusat Daftar Wasiat Kemenkumham, serta kuasa otentik yang tidak dapat ditarik kembali.',
    iconClass: 'fa-solid fa-scroll',
    targetAudience: 'Keluarga, perorangan yang ingin merencanakan waris, dan pemegang hak.',
    requirements: [
      'KTP, KK, dan Akta Kelahiran pemberi wasiat/kuasa.',
      'Daftar harta peninggalan/objek yang akan diwasiatkan.',
      'Identitas para penerima wasiat/kuasa.',
      'Dua orang saksi yang memenuhi syarat hukum.'
    ],
    procedures: [
      'Konsultasi privat dan pemeriksaan kehendak bebas pembuat wasiat.',
      'Penyusunan minuta wasiat/kuasa secara rahasia.',
      'Pembacaan dan penandatanganan di hadapan Notaris dan 2 orang saksi.',
      'Pelaporan akta wasiat ke Pusat Daftar Wasiat Kemenkumham RI.'
    ],
    estimatedTime: '2 – 3 Hari Kerja',
    importantNotes: 'Wasiat dibuat dalam keadaan sadar penuh tanpa ada paksaan dan tetap menghormati bagian mutlak (legitieme portie) ahli waris.',
    faq: [
      {
        question: 'Apakah akta wasiat dapat diubah di kemudian hari?',
        answer: 'Ya, pemberi wasiat berhak mencabut atau mengubah isi wasiat sewaktu-waktu dengan membuat akta wasiat baru di hadapan Notaris.'
      }
    ]
  },

  // PPAT CATEGORY
  {
    id: 'akta-jual-beli-ajb-tanah',
    slug: 'akta-jual-beli-ajb-tanah',
    category: 'PPAT',
    title: 'Akta Jual Beli (AJB) Tanah & Bangunan',
    shortDesc: 'Pembuatan akta resmi peralihan hak atas tanah dan bangunan oleh PPAT untuk proses balik nama di Kantor Pertanahan (BPN).',
    fullDesc: 'AJB merupakan akta otentik yang dibuat oleh Pejabat Pembuat Akta Tanah (PPAT) sebagai bukti sah pemindahan hak atas tanah dan bangunan karena jual beli. AJB adalah syarat mutlak pendaftaran balik nama sertifikat ke Kantor Pertanahan (BPN).',
    iconClass: 'fa-solid fa-house-chimney-user',
    targetAudience: 'Penjual dan Pembeli tanah/rumah, perorangan maupun badan hukum.',
    requirements: [
      'Sertifikat Asli Hak Atas Tanah (SHM/SHGB) yang telah dicek bersih di BPN.',
      'KTP & KK Penjual (beserta KTP suami/istri jika telah menikah).',
      'KTP & KK Pembeli.',
      'Surat Nikah Penjual (atau Surat Kematian/Keterangan Waris jika pemilik wafat).',
      'Bukti Lunas PBB 5 tahun terakhir.',
      'Bukti Pembayaran PPh Final (Penjual) dan BPHTB (Pembeli) yang telah divalidasi Bapenda/KPP.'
    ],
    procedures: [
      'Pengecekan sertifikat di Kantor Pertanahan (BPN) setempat.',
      'Validasi pembayaran pajak PPh Penjual dan validasi BPHTB Pembeli.',
      'Pembacaan akta dan penandatanganan AJB oleh Penjual, Pembeli, dan Saksi di hadapan PPAT.',
      'Pendaftaran berkas balik nama ke Kantor Pertanahan (BPN).',
      'Penyerahan sertifikat yang telah selesai dibalik nama ke nama Pembeli.'
    ],
    estimatedTime: '14 – 30 Hari Kerja (termasuk proses balik nama di BPN)',
    importantNotes: 'Penjual dan Pembeli wajib melunasi kewajiban pajak (PPh dan BPHTB) sebelum penandatanganan AJB dilakukan.',
    faq: [
      {
        question: 'Apakah pengecekan sertifikat di BPN wajib dilakukan?',
        answer: 'Wajib. PPAT dilarang membuat AJB sebelum sertifikat dinyatakan bersih dari sengketa, blokir, sita, atau hak tanggungan oleh BPN.'
      },
      {
        question: 'Bagaimana jika salah satu pihak berhalangan hadir?',
        answer: 'Pihak yang berhalangan dapat memberikan Surat Kuasa Membeli / Menjual Otentik yang dibuat di hadapan Notaris.'
      }
    ]
  },
  {
    id: 'akta-hibah-tanah',
    slug: 'akta-hibah-tanah',
    category: 'PPAT',
    title: 'Akta Hibah Tanah & Bangunan',
    shortDesc: 'Peralihan hak atas tanah secara cuma-cuma kepada keluarga sedarah atau pihak lain melalui akta otentik PPAT.',
    fullDesc: 'Pembuatan akta otentik peralihan hak milik tanah secara cuma-cuma tanpa kompensasi finansial, umumnya dari orang tua kepada anak kandung atau antar keluarga, dilengkapi dengan perhitungan BPHTB hibah dan pendaftaran balik nama ke BPN.',
    iconClass: 'fa-solid fa-gift',
    targetAudience: 'Orang tua kepada anak, antar kerabat keluarga, atau donatur tanah wakaf/sosial.',
    requirements: [
      'Sertifikat Asli Tanah (SHM/SHGB).',
      'KTP & KK Pemberi Hibah dan Penerima Hibah.',
      'Persetujuan seluruh calon ahli waris lain (untuk mencegah sengketa legitieme portie).',
      'SPPT dan bukti lunas PBB tahun berjalan.',
      'Bukti validasi BPHTB Hibah dari Bapenda.'
    ],
    procedures: [
      'Pengecekan sertifikat di BPN setempat.',
      'Pemeriksaan persetujuan keluarga/ahli waris.',
      'Penandatanganan Akta Hibah di hadapan PPAT.',
      'Pendaftaran peralihan hak hibah ke BPN.',
      'Pengambilan sertifikat atas nama penerima hibah.'
    ],
    estimatedTime: '14 – 25 Hari Kerja',
    importantNotes: 'Pemberian hibah tanah tetap dikenakan pajak BPHTB sesuai ketentuan Perda setempat (umumnya ada pengurangan tarif untuk hibah wasiat/anak kandung).',
    faq: [
      {
        question: 'Apakah hibah tanah dapat dibatalkan di kemudian hari?',
        answer: 'Menurut KUHPerdata, hibah pada dasarnya tidak dapat ditarik kembali kecuali memenuhi syarat-syarat khusus yang diatur undang-undang.'
      }
    ]
  },
  {
    id: 'pembagian-hak-bersama-aphb',
    slug: 'pembagian-hak-bersama-aphb',
    category: 'PPAT',
    title: 'Akta Pembagian Hak Bersama (APHB)',
    shortDesc: 'Pemisahan dan pembagian kepemilikan tanah warisan atau harta bersama menjadi sertifikat perorangan masing-masing ahli waris.',
    fullDesc: 'APHB digunakan ketika sebidang tanah dimiliki secara bersama-sama (misalnya oleh para ahli waris) dan disepakati untuk dibagi kepada salah satu atau beberapa orang pemegang hak bersama secara definitif.',
    iconClass: 'fa-solid fa-diagram-project',
    targetAudience: 'Para ahli waris pemegang sertifikat warisan, mantan suami-istri (harta gono-gini).',
    requirements: [
      'Sertifikat Asli yang masih tercatat atas nama pewaris atau nama bersama para ahli waris.',
      'Surat Keterangan Hak Mewaris / Fatwa Waris yang sah.',
      'KTP & KK seluruh ahli waris yang berhak.',
      'Surat Pernyataan Kesepakatan Pembagian Hak Bersama.',
      'Bukti lunas PBB dan validasi pajak terkait.'
    ],
    procedures: [
      'Verifikasi keabsahan silsilah dan surat keterangan waris.',
      'Pengecekan sertifikat di Kantor Pertanahan.',
      'Penandatanganan APHB oleh seluruh ahli waris di hadapan PPAT.',
      'Pendaftaran APHB ke Kantor Pertanahan untuk penerbitan sertifikat pemecahan/perseorangan.'
    ],
    estimatedTime: '20 – 40 Hari Kerja (bergantung pada proses pemecahan di BPN)',
    importantNotes: 'Seluruh ahli waris wajib hadir dan menandatangani APHB atau memberikan kuasa otentik yang sah.',
    faq: [
      {
        question: 'Apakah ada ahli waris yang boleh dilewati?',
        answer: 'Tidak boleh. Seluruh ahli waris yang sah menurut hukum wajib menyetujui dan menandatangani akta APHB.'
      }
    ]
  },
  {
    id: 'akta-pemberian-hak-tanggungan-apht',
    slug: 'akta-pemberian-hak-tanggungan-apht',
    category: 'PPAT',
    title: 'Akta Pemberian Hak Tanggungan (APHT) & SKMHT',
    shortDesc: 'Pembebanan jaminan hak atas tanah untuk fasilitas kredit perbankan/lembaga keuangan sesuai UU Hak Tanggungan.',
    fullDesc: 'Pembuatan Akta Pemberian Hak Tanggungan (APHT) dan Surat Kuasa Membebankan Hak Tanggungan (SKMHT) untuk mengikat jaminan kredit perbankan atau fasilitas pembiayaan institusi keuangan melalui sistem HT Elektronik (HT-el) BPN.',
    iconClass: 'fa-solid fa-vault',
    targetAudience: 'Bank Pemerintah, Bank Swasta, BPR, Lembaga Pembiayaan, Debitur perorangan dan korporasi.',
    requirements: [
      'Sertifikat Asli Tanah yang akan dibebani Hak Tanggungan.',
      'Surat Penegasan Persetujuan Penyediaan Kredit (SP3K) / Perjanjian Kredit dari Bank.',
      'KTP, KK, dan Surat Nikah Pemberi Hak Tanggungan.',
      'Pengecekan sertifikat elektronik BPN terkini.'
    ],
    procedures: [
      'Pemeriksaan keabsahan sertifikat dan perjanjian kredit.',
      'Penandatanganan APHT / SKMHT di hadapan PPAT.',
      'Pendaftaran Hak Tanggungan Elektronik ke server BPN.',
      'Penerbitan Sertifikat Hak Tanggungan Elektronik (SHT-el).'
    ],
    estimatedTime: '3 – 7 Hari Kerja',
    importantNotes: 'Pendaftaran APHT saat ini terhubung langsung secara online dengan sistem Hak Tanggungan Elektronik (HT-el) Kementerian ATR/BPN.',
    faq: [
      {
        question: 'Berapa lama masa berlaku SKMHT?',
        answer: 'SKMHT untuk tanah bersertifikat berlaku 1 bulan, sedangkan untuk tanah belum bersertifikat berlaku 3 bulan sejak tanggal pembuatan.'
      }
    ]
  },
  {
    id: 'roya-penghapusan-hak-tanggungan',
    slug: 'roya-penghapusan-hak-tanggungan',
    category: 'PPAT',
    title: 'Roya Sertifikat (Penghapusan Hak Tanggungan)',
    shortDesc: 'Pencoretan catatan beban Hak Tanggungan pada sertifikat setelah fasilitas kredit pinjaman di bank lunas.',
    fullDesc: 'Layanan pengurusan pencoretan (roya) catatan hutang/hak tanggungan pada buku tanah dan sertifikat di BPN setelah kredit bank lunas, sehingga sertifikat kembali bersih dari segala ikatan jaminan.',
    iconClass: 'fa-solid fa-shield-halved',
    targetAudience: 'Nasabah bank/pemilik tanah yang telah melunasi fasilitas pinjaman perbankan.',
    requirements: [
      'Sertifikat Asli Hak Atas Tanah.',
      'Sertifikat Hak Tanggungan Asli (atau surat keterangan lunas jika HT-el).',
      'Surat Keterangan Lunas dan Surat Pengantar Roya dari Bank.',
      'KTP & KK Pemohon/Pemilik Sertifikat.',
      'Surat Kuasa (bila dikuasakan pengurusannya).'
    ],
    procedures: [
      'Verifikasi surat pengantar lunas dari pihak perbankan.',
      'Pendaftaran permohonan roya ke Kantor Pertanahan setempat.',
      'Proses pencoretan catatan Hak Tanggungan pada buku tanah BPN.',
      'Pengembalian sertifikat yang telah bebas beban hak tanggungan.'
    ],
    estimatedTime: '3 – 7 Hari Kerja',
    importantNotes: 'Pastikan surat keterangan lunas dan dokumen jaminan asli dari bank telah lengkap sebelum mengajukan permohonan roya.',
    faq: [
      {
        question: 'Apakah sertifikat yang belum di-roya bisa langsung dijual?',
        answer: 'Tidak bisa dibuatkan AJB. Sertifikat harus di-roya terlebih dahulu agar status jaminannya terhapus di buku tanah BPN.'
      }
    ]
  },
  {
    id: 'balik-nama-dan-pengecekan-bpn',
    slug: 'balik-nama-dan-pengecekan-bpn',
    category: 'PPAT',
    title: 'Balik Nama Sertifikat & Pengecekan BPN',
    shortDesc: 'Pengurusan balik nama sertifikat tanah karena pewarisan/jual beli serta layanan pengecekan resmi keaslian sertifikat di BPN.',
    fullDesc: 'Layanan komprehensif pendaftaran peralihan nama pemegang hak pada sertifikat ke Kantor Pertanahan (BPN) serta layanan pengecekan legalitas sertifikat tanah untuk memastikan tidak ada sengketa, tumpang tindih, atau pemblokiran peradilan.',
    iconClass: 'fa-solid fa-magnifying-glass-location',
    targetAudience: 'Calon pembeli tanah, ahli waris keluarga, pengembang, perbankan.',
    requirements: [
      'Sertifikat Asli Tanah (SHM/SHGB).',
      'Alas hak peralihan (AJB, Akta Hibah, APHB, atau Surat Keterangan Waris).',
      'KTP & KK pemegang hak baru.',
      'Bukti pelunasan PPh dan BPHTB yang tervalidasi.',
      'Surat permohonan resmi.'
    ],
    procedures: [
      'Pengecekan sertifikat melalui aplikasi mitra BPN.',
      'Pemasukan berkas pendaftaran peralihan hak di loket BPN.',
      'Pencatatan perubahan nama pemegang hak pada buku tanah dan lembar sertifikat.',
      'Penyerahan sertifikat yang telah tercatat atas nama baru kepada pemilik.'
    ],
    estimatedTime: '7 – 20 Hari Kerja',
    importantNotes: 'Pengecekan sertifikat di BPN merupakan langkah pencegahan paling krusial sebelum melakukan transaksi jual beli tanah.',
    faq: [
      {
        question: 'Berapa lama masa berlaku hasil pengecekan sertifikat?',
        answer: 'Hasil pengecekan sertifikat di BPN umumnya berlaku untuk jangka waktu pembuatan akta pada bulan berjalan.'
      }
    ]
  }
];

export const INITIAL_CLIENT_CASES: ClientCase[] = [
  {
    id: 'LDN-2026-0001',
    clientName: 'Ir. H. Bambang Sudrajat',
    clientEmail: 'bambang.sudrajat@gmail.com',
    clientPhone: '0812-8899-7711',
    serviceType: 'Akta Jual Beli (AJB) Tanah & Bangunan',
    category: 'PPAT',
    status: 'Menunggu Penandatanganan',
    progress: 65,
    picName: 'Ahmad Fauzi, S.H. (Senior Legal Staff)',
    dateSubmitted: '10 Agustus 2026',
    lastUpdated: '14 Agustus 2026',
    targetDate: '24 Agustus 2026',
    clientNotes: 'Pengecekan BPN telah bersih dan validasi pajak PPh & BPHTB telah selesai. Jadwal penandatanganan AJB dijadwalkan pada hari Selasa pukul 10.00 WITA di Ruang Notaris.',
    internalNotes: 'PPh tervalidasi di KPP Pratama Mataram Barat No. 892/2026. BPHTB tervalidasi Bapenda Kota Mataram. Siapkan Minuta Akta AJB.',
    documents: [
      {
        id: 'doc-001',
        name: 'KTP & KK Penjual dan Pembeli (Lengkap)',
        category: 'Dokumen Identitas',
        uploadDate: '10 Agustus 2026',
        fileSize: '4.2 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-002',
        name: 'Sertifikat Asli SHM No. 04512/Kekalik Jaya',
        category: 'Dokumen Pendukung',
        uploadDate: '10 Agustus 2026',
        fileSize: '8.7 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'scan'
      },
      {
        id: 'doc-003',
        name: 'Hasil Pengecekan Sertifikat BPN (Clean & Clear)',
        category: 'Dokumen Pendukung',
        uploadDate: '12 Agustus 2026',
        fileSize: '1.8 MB',
        uploader: 'Staff Kantor',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-004',
        name: 'Bukti Validasi Pajak PPh & BPHTB',
        category: 'Dokumen Pendukung',
        uploadDate: '13 Agustus 2026',
        fileSize: '2.4 MB',
        uploader: 'Staff Kantor',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-005',
        name: 'Draf Minuta Akta Jual Beli (AJB) No. 42/2026',
        category: 'Draft Akta',
        uploadDate: '14 Agustus 2026',
        fileSize: '520 KB',
        uploader: 'Staff Kantor',
        status: 'Draft',
        fileType: 'doc'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        date: '10 Agustus 2026, 09:15 WITA',
        title: 'Permohonan Berkas Diterima',
        description: 'Klien menyerahkan berkas permohonan AJB tanah di Kantor Notaris & PPAT.',
        actor: 'Front Desk'
      },
      {
        id: 'tl-2',
        date: '11 Agustus 2026, 14:00 WITA',
        title: 'Verifikasi Dokumen & Identitas',
        description: 'Pemeriksaan kelengkapan berkas KTP, KK, Surat Nikah, dan PBB dinyatakan lengkap.',
        actor: 'Staff Legal'
      },
      {
        id: 'tl-3',
        date: '12 Agustus 2026, 11:30 WITA',
        title: 'Pengecekan Sertifikat di BPN Berhasil',
        description: 'Sertifikat SHM No. 04512 terkonfirmasi sah dan tidak dalam sengketa/sita peradilan.',
        actor: 'Petugas Lapangan PPAT'
      },
      {
        id: 'tl-4',
        date: '13 Agustus 2026, 16:00 WITA',
        title: 'Validasi Pajak PPh & BPHTB Selesai',
        description: 'Surat validasi Surat Setoran Pajak Daerah dan PPh final telah diterbitkan.',
        actor: 'Staff Administrasi'
      },
      {
        id: 'tl-5',
        date: '14 Agustus 2026, 10:00 WITA',
        title: 'Penyusunan Minuta Akta Jual Beli Selesai',
        description: 'Draf akta siap ditandatangani. Menunggu kehadiran para pihak.',
        actor: 'Lalu Daud Nurjadi, M.Kn.'
      }
    ]
  },
  {
    id: 'LDN-2026-0002',
    clientName: 'PT Berkah Nusantara Sejahtera',
    clientEmail: 'legal@berkahnusantara.co.id',
    clientPhone: '0819-7766-3322',
    serviceType: 'Akta Pendirian Badan Usaha & Badan Hukum PT',
    category: 'NOTARIS',
    status: 'Selesai',
    progress: 100,
    picName: 'Siti Rahmawati, S.H. (Notarial Officer)',
    dateSubmitted: '01 Agustus 2026',
    lastUpdated: '06 Agustus 2026',
    targetDate: '07 Agustus 2026',
    clientNotes: 'Seluruh proses telah selesai 100%. Salinan Akta Pendirian, SK Pengesahan Kemenkumham RI, dan dokumen legalitas fisik dapat diambil di kantor atau diunduh di tab Dokumen.',
    internalNotes: 'SK Kemenkumham No. AHU-0045231.AH.01.01.Tahun 2026 telah terbit. Dokumen asli telah diarsipkan di brankas warkah.',
    documents: [
      {
        id: 'doc-101',
        name: 'Formulir Permohonan & KTP Seluruh Direksi/Komisaris',
        category: 'Dokumen Identitas',
        uploadDate: '01 Agustus 2026',
        fileSize: '3.1 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-102',
        name: 'Bukti Pengecekan Nama PT Kemenkumham',
        category: 'Dokumen Pendukung',
        uploadDate: '02 Agustus 2026',
        fileSize: '780 KB',
        uploader: 'Staff Kantor',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-103',
        name: 'Salinan Akta Pendirian PT No. 12/2026',
        category: 'Dokumen Final',
        uploadDate: '05 Agustus 2026',
        fileSize: '2.9 MB',
        uploader: 'Staff Kantor',
        status: 'Final Siap Ambil',
        fileType: 'pdf'
      },
      {
        id: 'doc-104',
        name: 'SK Pengesahan Badan Hukum Kemenkumham RI',
        category: 'Dokumen Final',
        uploadDate: '06 Agustus 2026',
        fileSize: '1.4 MB',
        uploader: 'Staff Kantor',
        status: 'Final Siap Ambil',
        fileType: 'pdf'
      }
    ],
    timeline: [
      {
        id: 'tl-101',
        date: '01 Agustus 2026, 10:00 WITA',
        title: 'Pendaftaran Pendirian PT Diterima',
        description: 'Penyerahan data calon pendiri dan nama perseroan.',
        actor: 'Staff Legal'
      },
      {
        id: 'tl-102',
        date: '02 Agustus 2026, 11:15 WITA',
        title: 'Pemesanan Nama PT Disetujui Kemenkumham',
        description: 'Nama PT Berkah Nusantara Sejahtera berhasil dipesan.',
        actor: 'Staff Legal'
      },
      {
        id: 'tl-103',
        date: '04 Agustus 2026, 14:30 WITA',
        title: 'Penandatanganan Akta Notaris',
        description: 'Para pendiri menandatangani akta pendirian di hadapan Notaris.',
        actor: 'Lalu Daud Nurjadi, M.Kn.'
      },
      {
        id: 'tl-104',
        date: '06 Agustus 2026, 15:45 WITA',
        title: 'Penerbitan SK Kemenkumham RI',
        description: 'Badan hukum PT telah resmi berbadan hukum dan terbit SK Kemenkumham.',
        actor: 'Ditjen AHU'
      }
    ]
  },
  {
    id: 'LDN-2026-0003',
    clientName: 'Hj. Siti Mariam, S.Pd.',
    clientEmail: 'siti.mariam@yahoo.com',
    clientPhone: '0877-5544-2211',
    serviceType: 'Akta Pembagian Hak Bersama (APHB) & Balik Nama Waris',
    category: 'PPAT',
    status: 'Proses Pendaftaran',
    progress: 80,
    picName: 'Ahmad Fauzi, S.H. (Senior Legal Staff)',
    dateSubmitted: '15 Juli 2026',
    lastUpdated: '12 Agustus 2026',
    targetDate: '28 Agustus 2026',
    clientNotes: 'Akta APHB telah ditandatangani oleh seluruh ahli waris. Berkas saat ini sedang dalam proses pencatatan dan pemecahan buku tanah di Kantor BPN Kota Mataram.',
    internalNotes: 'No. Berkas BPN: 4412/2026. Estimasi selesai cetak sertifikat baru 2 minggu ke depan.',
    documents: [
      {
        id: 'doc-201',
        name: 'Surat Keterangan Hak Mewaris & Silsilah Waris',
        category: 'Dokumen Identitas',
        uploadDate: '15 Juli 2026',
        fileSize: '2.1 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-202',
        name: 'Salinan Akta APHB No. 18/2026',
        category: 'Draft Akta',
        uploadDate: '28 Juli 2026',
        fileSize: '3.4 MB',
        uploader: 'Staff Kantor',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-203',
        name: 'Tanda Terima Berkas Pendaftaran BPN',
        category: 'Dokumen Pendukung',
        uploadDate: '05 Agustus 2026',
        fileSize: '890 KB',
        uploader: 'Staff Kantor',
        status: 'Terverifikasi',
        fileType: 'pdf'
      }
    ],
    timeline: [
      {
        id: 'tl-201',
        date: '15 Juli 2026, 09:30 WITA',
        title: 'Konsultasi & Penyerahan Berkas Waris',
        description: 'Penelitian berkas silsilah dan surat keterangan waris.',
        actor: 'Front Desk'
      },
      {
        id: 'tl-202',
        date: '28 Juli 2026, 10:30 WITA',
        title: 'Penandatanganan Akta APHB',
        description: 'Seluruh 4 orang ahli waris hadir menandatangani akta di hadapan PPAT.',
        actor: 'Lalu Daud Nurjadi, M.Kn.'
      },
      {
        id: 'tl-203',
        date: '05 Agustus 2026, 11:00 WITA',
        title: 'Pendaftaran Berkas ke BPN',
        description: 'Berkas masuk loket peralihan hak waris Kantor Pertanahan.',
        actor: 'Petugas Lapangan'
      }
    ]
  },
  {
    id: 'LDN-2026-0004',
    clientName: 'Drs. Made Wiratama',
    clientEmail: 'made.wiratama@gmail.com',
    clientPhone: '0813-2211-9988',
    serviceType: 'Roya Sertifikat (Penghapusan Hak Tanggungan)',
    category: 'PPAT',
    status: 'Pemeriksaan Dokumen',
    progress: 35,
    picName: 'Siti Rahmawati, S.H. (Notarial Officer)',
    dateSubmitted: '12 Agustus 2026',
    lastUpdated: '14 Agustus 2026',
    targetDate: '20 Agustus 2026',
    clientNotes: 'Surat keterangan lunas dari Bank Mandiri telah diterima. Saat ini staf kami sedang menyiapkan permohonan pendaftaran roya ke Kantor Pertanahan.',
    internalNotes: 'Cek kesesuaian nomor APHT terdahulu dengan data buku tanah BPN.',
    documents: [
      {
        id: 'doc-301',
        name: 'Surat Keterangan Lunas & Pengantar Roya Bank',
        category: 'Dokumen Pendukung',
        uploadDate: '12 Agustus 2026',
        fileSize: '1.7 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'pdf'
      },
      {
        id: 'doc-302',
        name: 'Sertifikat Asli SHM No. 01289/Ampenan',
        category: 'Dokumen Pendukung',
        uploadDate: '12 Agustus 2026',
        fileSize: '5.2 MB',
        uploader: 'Client',
        status: 'Terverifikasi',
        fileType: 'scan'
      }
    ],
    timeline: [
      {
        id: 'tl-301',
        date: '12 Agustus 2026, 14:15 WITA',
        title: 'Permohonan Roya Diterima',
        description: 'Penyerahan sertifikat asli dan surat lunas bank.',
        actor: 'Front Desk'
      },
      {
        id: 'tl-302',
        date: '14 Agustus 2026, 09:00 WITA',
        title: 'Pemeriksaan Kelengkapan Dokumen Roya',
        description: 'Berkas dinyatakan lengkap dan siap diajukan ke BPN.',
        actor: 'Staff Legal'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: ClientNotification[] = [
  {
    id: 'notif-1',
    title: 'Jadwal Penandatanganan AJB (LDN-2026-0001)',
    message: 'Validasi pajak PPh & BPHTB telah selesai. Jadwal tanda tangan akta dijadwalkan pada Selasa, 18 Agustus 2026 pukul 10.00 WITA di Kantor Notaris.',
    date: '14 Agustus 2026, 10:30 WITA',
    isRead: false,
    type: 'schedule'
  },
  {
    id: 'notif-2',
    title: 'Draf Akta Minuta Telah Diunggah',
    message: 'Draf Minuta Akta Jual Beli No. 42/2026 telah tersedia untuk ditinjau oleh para pihak pada menu Dokumen.',
    date: '14 Agustus 2026, 10:05 WITA',
    isRead: false,
    type: 'document'
  },
  {
    id: 'notif-3',
    title: 'Validasi Berkas Pengecekan BPN Selesai',
    message: 'Sertifikat tanah dinyatakan Clean & Clear oleh Kantor Pertanahan setempat.',
    date: '12 Agustus 2026, 11:45 WITA',
    isRead: true,
    type: 'status'
  },
  {
    id: 'notif-4',
    title: 'Selamat Datang di Client Portal Notaris & PPAT',
    message: 'Akun Client Portal Anda telah aktif. Gunakan portal ini untuk memantau progres perkara secara transparan dan mengunduh dokumen resmi.',
    date: '10 Agustus 2026, 09:20 WITA',
    isRead: true,
    type: 'general'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    date: '14 Agustus 2026, 16:20 WITA',
    user: 'Lalu Daud Nurjadi, M.Kn.',
    userRole: 'Super Admin',
    activity: 'Menyetujui draf minuta akta perkara LDN-2026-0001',
    ip: '114.125.45.12',
    object: 'Case LDN-2026-0001',
    status: 'Success'
  },
  {
    id: 'log-2',
    date: '14 Agustus 2026, 10:05 WITA',
    user: 'Ahmad Fauzi, S.H.',
    userRole: 'Staff',
    activity: 'Mengunggah draf minuta akta: Draf Minuta Akta Jual Beli (AJB) No. 42/2026',
    ip: '180.252.110.8',
    object: 'Document Center',
    status: 'Success'
  },
  {
    id: 'log-3',
    date: '14 Agustus 2026, 09:12 WITA',
    user: 'Ir. H. Bambang Sudrajat',
    userRole: 'Client',
    activity: 'Login berhasil via Client Portal',
    ip: '36.85.12.90',
    object: 'Authentication',
    status: 'Success'
  },
  {
    id: 'log-4',
    date: '13 Agustus 2026, 16:05 WITA',
    user: 'Ahmad Fauzi, S.H.',
    userRole: 'Staff',
    activity: 'Memperbarui status perkara LDN-2026-0001 menjadi: Menunggu Penandatanganan (Progress: 65%)',
    ip: '180.252.110.8',
    object: 'Case LDN-2026-0001',
    status: 'Success'
  },
  {
    id: 'log-5',
    date: '12 Agustus 2026, 14:15 WITA',
    user: 'Siti Rahmawati, S.H.',
    userRole: 'Staff',
    activity: 'Membuat perkara baru: LDN-2026-0004 (Roya Sertifikat)',
    ip: '180.252.110.8',
    object: 'Case LDN-2026-0004',
    status: 'Success'
  },
  {
    id: 'log-6',
    date: '10 Agustus 2026, 09:15 WITA',
    user: 'Super Admin',
    userRole: 'Super Admin',
    activity: 'Registrasi akun klien baru: bambang.sudrajat@gmail.com',
    ip: '114.125.45.12',
    object: 'User Management',
    status: 'Success'
  }
];

export const LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: 'panduan-lengkap-jual-beli-tanah-aman',
    slug: 'panduan-lengkap-jual-beli-tanah-aman',
    title: 'Panduan Lengkap Prosedur Jual Beli Tanah yang Aman Menurut Hukum Indonesia',
    category: 'PPAT',
    author: 'Lalu Daud Nurjadi, M.Kn.',
    date: '12 Agustus 2026',
    readTime: '6 Menit Baca',
    excerpt: 'Langkah-langkah krusial menghindari sengketa tanah: pengecekan sertifikat di BPN, verifikasi batas tanah, perhitungan pajak PPh & BPHTB, hingga penandatanganan AJB.',
    content: `Transaksi jual beli tanah dan bangunan merupakan tindakan hukum bernilai ekonomis tinggi yang memerlukan ketelitian dan kepatuhan penuh terhadap peraturan pertanahan. Berdasarkan Undang-Undang Pokok Agraria (UUPA) No. 5 Tahun 1960 dan Peraturan Pemerintah No. 24 Tahun 1997 tentang Pendaftaran Tanah, jual beli tanah wajib dilakukan di hadapan Pejabat Pembuat Akta Tanah (PPAT) yang berwenang di wilayah letak tanah.

### 1. Pengecekan Keaslian Sertifikat di Kantor Pertanahan (BPN)
Sebelum transaksi dilakukan, PPAT akan melakukan pengecekan resmi ke Kantor Pertanahan untuk memastikan bahwa sertifikat tanah tersebut:
- Asli dan terdaftar secara sah dalam buku tanah BPN.
- Bebas dari catatan sita peradilan, sengketa, perkara perdata/pidana.
- Tidak sedang dibebani Hak Tanggungan atau jaminan utang yang belum lunas.
- Tidak ada blokir dari pihak ketiga yang berkepentingan.

### 2. Pemeriksaan Identitas & Persetujuan Pasangan
Apabila tanah yang dijual berstatus harta bersama dalam perkawinan, maka suami atau istri pemilik sertifikat WAJIB hadir dan memberikan persetujuan tertulis dalam akta, kecuali terdapat Perjanjian Kawin (pisah harta) yang disahkan sebelum atau saat perkawinan dilangsungkan.

### 3. Kewajiban Perpajakan (PPh & BPHTB)
Sebelum AJB ditandatangani:
- **Penjual** wajib melunasi Pajak Penghasilan (PPh) Final sebesar 2,5% dari nilai transaksi atau NJOP (mana yang lebih tinggi) dan divalidasi oleh Kantor Pelayanan Pajak (KPP).
- **Pembeli** wajib melunasi Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB) sebesar 5% setelah dikurangi Nilai Perolehan Objek Pajak Tidak Kena Pajak (NPOPTKP) daerah setempat dan divalidasi oleh Badan Pendapatan Daerah (Bapenda).

### 4. Penandatanganan AJB & Proses Balik Nama
Setelah seluruh syarat terpenuhi, akta AJB dibacakan dan ditandatangani oleh Penjual, Pembeli, 2 orang saksi, dan PPAT. Selanjutnya PPAT akan mendaftarkan berkas ke BPN dalam waktu paling lambat 7 hari kerja untuk proses balik nama sertifikat.`,
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    tags: ['PPAT', 'AJB', 'Pertanahan', 'Sertifikat', 'Hukum Properti']
  },
  {
    id: 'perbedaan-akta-otentik-vs-bawah-tangan',
    slug: 'perbedaan-akta-otentik-vs-bawah-tangan',
    title: 'Memahami Kekuatan Pembuktian: Akta Otentik Notaris vs Surat di Bawah Tangan',
    category: 'Notaris',
    author: 'Lalu Daud Nurjadi, M.Kn.',
    date: '08 Agustus 2026',
    readTime: '5 Menit Baca',
    excerpt: 'Mengapa kontrak bisnis dan perjanjian penting sebaiknya dibuat dalam bentuk Akta Notaris? Simak ulasan mengenai Pasal 1868 dan 1870 KUHPerdata.',
    content: `Dalam hukum perdata Indonesia, pembuktian merupakan fondasi utama dalam penegakan hak dan kewajiban. Pasal 1866 KUHPerdata menempatkan bukti tertulis (akta) sebagai alat bukti utama. Namun, tidak semua surat memiliki kekuatan pembuktian yang sama.

### Apa Itu Akta Otentik?
Berdasarkan Pasal 1868 KUHPerdata, Akta Otentik adalah suatu akta yang dibuat dalam bentuk yang ditentukan oleh undang-undang oleh atau di hadapan pejabat umum yang berwenang untuk itu (seperti Notaris atau PPAT) di tempat di mana akta itu dibuat.

### 3 Nilai Kekuatan Pembuktian Akta Otentik:
1. **Kekuatan Pembuktian Lahiriah (Uitwendige Bewijskracht):** Akta otentik dianggap sah sejak kelahirannya sampai ada pihak yang mampu membuktikan sebaliknya di pengadilan.
2. **Kekuatan Pembuktian Formal (Formele Bewijskracht):** Memberikan kepastian bahwa pejabat dan para pihak benar-benar telah menerangkan hal-hal yang tercantum dalam akta pada tanggal yang pasti.
3. **Kekuatan Pembuktian Materiil (Materiele Bewijskracht):** Kepastian bahwa apa yang tercantum dalam akta adalah benar dan mengikat para pihak secara sempurna (Volledig Bewijs).

### Risiko Surat di Bawah Tangan
Surat di bawah tangan dibuat tanpa perantara pejabat umum. Jika salah satu pihak menyangkal tanda tangannya di pengadilan, maka beban pembuktian keaslian tanda tangan tersebut jatuh kepada pihak yang mengajukan surat tersebut. Dengan membuat akta di hadapan Notaris, kepastian hukum para pihak terlindungi secara optimal.`,
    featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
    tags: ['Notaris', 'Akta Otentik', 'KUHPerdata', 'Hukum Perjanjian']
  },
  {
    id: 'syarat-pendirian-pt-uu-cipta-kerja',
    slug: 'syarat-pendirian-pt-uu-cipta-kerja',
    title: 'Syarat dan Tahapan Pendirian PT Pasca Berlakunya UU Cipta Kerja',
    category: 'Badan Usaha',
    author: 'Tim Legal Notaris',
    date: '02 Agustus 2026',
    readTime: '7 Menit Baca',
    excerpt: 'Regulasi terbaru pendirian PT Persekutuan Modal dan PT Perorangan: modal dasar, susunan pengurus, KBLI 2020, dan pengesahan Kemenkumham.',
    content: `Perkembangan regulasi hukum perseroan di Indonesia mengalami transformasi signifikan pasca diterbitkannya Undang-Undang Cipta Kerja dan peraturan turunannya (PP No. 8 Tahun 2021). Kini, pendirian badan usaha menjadi lebih fleksibel namun tetap membutuhkan ketelitian dalam penyusunan Anggaran Dasar.

### Kategori Perseroan Terbatas:
1. **PT Persekutuan Modal (PT Biasa):** Didirikan oleh 2 orang atau lebih dengan modal dasar yang ditentukan berdasarkan kesepakatan para pendiri.
2. **PT Perorangan:** Khusus untuk skala Usaha Mikro dan Kecil (UMK) yang dapat didirikan oleh 1 orang WNI berusia minimal 21 tahun.

### Tahapan Pendirian PT di Kantor Notaris:
- **Pengecekan dan Pemesanan Nama PT:** Nama minimal terdiri dari 3 suku kata berbahasa Indonesia untuk PT penanaman modal dalam negeri.
- **Penyusunan Anggaran Dasar (AD/ART):** Penentuan maksud dan tujuan kegiatan usaha mengacu pada kode KBLI 5 digit terbaru tahun 2020.
- **Penandatanganan Akta Pendirian:** Para pendiri menandatangani akta otentik di hadapan Notaris.
- **Pengesahan SK Kemenkumham:** Notaris mengajukan permohonan melalui SABH Online dan menerbitkan Surat Keputusan Menteri Hukum dan HAM RI.
- **Registrasi NIB pada Sistem OSS RBA:** Pendaftaran Nomor Induk Berusaha sebagai legalitas operasional dan izin komersial.`,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    tags: ['Badan Usaha', 'Pendirian PT', 'Kemenkumham', 'Legalitas Usaha']
  },
  {
    id: 'mengurus-akta-pembagian-hak-bersama-waris',
    slug: 'mengurus-akta-pembagian-hak-bersama-waris',
    title: 'Tata Cara Mengurus Akta Pembagian Hak Bersama (APHB) Tanah Warisan',
    category: 'Pertanahan',
    author: 'Lalu Daud Nurjadi, M.Kn.',
    date: '25 Juli 2026',
    readTime: '6 Menit Baca',
    excerpt: 'Solusi membagi tanah warisan keluarga secara adil dan sah: cara pembuatan Akta Pembagian Hak Bersama (APHB) di hadapan PPAT.',
    content: `Sengketa pertanahan yang melibatkan tanah warisan seringkali timbul akibat belum dilakukannya pembagian hak secara formal. Ketika pewaris meninggal dunia, tanah peninggalan menjadi milik bersama seluruh ahli waris secara tidak terbagi.

Untuk memisahkan hak tersebut menjadi sertifikat perorangan masing-masing ahli waris, instrumen hukum yang digunakan adalah **Akta Pembagian Hak Bersama (APHB)** yang dibuat oleh PPAT.

### Dokumen yang Wajib Disiapkan:
1. **Sertifikat Asli Tanah** yang masih atas nama pewaris.
2. **Surat Keterangan Hak Mewaris (SKW)** yang dibuat secara sah sesuai hukum kewarisan yang berlaku.
3. **KTP & Kartu Keluarga seluruh ahli waris**.
4. **Surat Kematian Pewaris**.
5. **Kesepakatan pembagian bagian masing-masing ahli waris**.

Seluruh ahli waris wajib hadir untuk menandatangani APHB di hadapan PPAT. Apabila salah satu ahli waris berhalangan hadir karena berada di luar kota/negeri, yang bersangkutan dapat membuat Surat Kuasa Otentik di hadapan Notaris atau KBRI setempat.`,
    featuredImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    tags: ['APHB', 'Waris', 'PPAT', 'Pertanahan', 'Sertifikat']
  },
  {
    id: 'pentingnya-perjanjian-kawin-prenuptial-postnuptial',
    slug: 'pentingnya-perjanjian-kawin-prenuptial-postnuptial',
    title: 'Pentingnya Perjanjian Kawin (Prenuptial & Postnuptial) Bagi Kepemilikan Properti',
    category: 'Notaris',
    author: 'Tim Legal Notaris',
    date: '18 Juli 2026',
    readTime: '5 Menit Baca',
    excerpt: 'Melindungi aset bisnis dan masa depan keluarga melalui Perjanjian Pranikah (Prenuptial) dan Perjanjian Perkawinan (Postnuptial) akta notaris.',
    content: `Berdasarkan Putusan Mahkamah Konstitusi No. 69/PUU-XIII/2015, perjanjian perkawinan tidak hanya dapat dibuat sebelum perkawinan dilangsungkan (Prenuptial Agreement), tetapi juga dapat dibuat selama perkawinan berlangsung (Postnuptial Agreement) sepanjang disepakati kedua belah pihak dan tidak merugikan pihak ketiga.

### Manfaat Pembuatan Perjanjian Perkawinan Notariil:
- **Pemisahan Harta dan Utang:** Melindungi salah satu pihak dari risiko kepailitan atau sita eksekusi utang bisnis pasangan.
- **Kepemilikan Properti bagi Pasangan WNI-WNA:** Memungkinkan pasangan WNI yang menikah dengan WNA untuk tetap memiliki Hak Milik atas tanah di Indonesia.
- **Transparansi Finansial:** Memberikan kejelasan pengelolaan aset dan hak anak di masa depan.

Perjanjian perkawinan wajib dibuat dalam bentuk Akta Notaris dan kemudian dicatatkan di Kantor Urusan Agama (KUA) atau Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) agar mengikat pihak ketiga.`,
    featuredImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
    tags: ['Perjanjian Kawin', 'Notaris', 'Hukum Keluarga', 'Pemisahan Harta']
  },
  {
    id: 'tips-aman-mengecek-legalitas-pengembang-properti',
    slug: 'tips-aman-mengecek-legalitas-pengembang-properti',
    title: 'Tips Aman Mengecek Legalitas Developer Properti Sebelum Membeli Rumah',
    category: 'Tips Dokumen',
    author: 'Lalu Daud Nurjadi, M.Kn.',
    date: '10 Juli 2026',
    readTime: '5 Menit Baca',
    excerpt: 'Daftar periksa (checklist) dokumen penting sebelum membayar DP rumah inden: izin lokasi, PBG, sertifikat induk, dan status rekening escrow.',
    content: `Membeli properti perumahan dari pengembang (developer) memerlukan kehati-hatian ekstra, terutama untuk rumah inden yang bangunannya belum selesai. Berikut adalah checklist penting yang wajib diperiksa konsumen:

1. **Status Sertifikat Tanah Induk:** Pastikan tanah perumahan bukan tanah sengketa dan telah bersertifikat atas nama PT Pengembang.
2. **Persetujuan Bangunan Gedung (PBG):** Pastikan pengembang telah mengantongi PBG (pengganti IMB) yang sah dari dinas perizinan setempat.
3. **Penyusunan PPJB Sesuai Permen PUPR:** PPJB harus dibuat secara notariil dengan mencantumkan jadwal serah terima yang tegas dan klausul sanksi wanprestasi yang seimbang.
4. **Hindari Pembayaran ke Rekening Pribadi:** Seluruh transaksi keuangan wajib ditransfer ke rekening resmi perseroan pengembang.`,
    featuredImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80',
    tags: ['Tips Dokumen', 'Properti', 'PPJB', 'Developer', 'Konsumen']
  }
];

export const LEGAL_FAQS: LegalFaq[] = [
  {
    id: 'faq-1',
    category: 'Notaris',
    question: 'Apa perbedaan mendasar antara wewenang Notaris dan PPAT?',
    answer: 'Notaris adalah pejabat umum yang berwenang membuat akta otentik mengenai semua perbuatan, perjanjian, dan ketetapan yang diharuskan oleh peraturan perundang-undangan (seperti pendirian PT/CV, perjanjian bisnis, wasiat, kuasa). Sedangkan PPAT (Pejabat Pembuat Akta Tanah) memiliki wewenang khusus dalam membuat akta-akta otentik mengenai perbuatan hukum tertentu atas tanah dan hak milik atas satuan rumah susun (seperti Akta Jual Beli/AJB, Hibah Tanah, APHB, dan APHT).'
  },
  {
    id: 'faq-2',
    category: 'PPAT',
    question: 'Berapa biaya pengurusan Akta Jual Beli (AJB) tanah di PPAT?',
    answer: 'Berdasarkan Peraturan Menteri ATR/BPN, honorarium PPAT ditetapkan proporsional berdasarkan nilai transaksi/NJOP (maksimal 1% dari nilai transaksi). Biaya tersebut di luar kewajiban pajak resmi negara (PPh Final Penjual 2,5% dan BPHTB Pembeli 5%) serta biaya PNBP pendaftaran balik nama di BPN.'
  },
  {
    id: 'faq-3',
    category: 'Pertanahan',
    question: 'Apakah bisa melakukan jual beli jika sertifikat tanah masih berstatus jaminan di Bank?',
    answer: 'Tidak dapat dibuatkan AJB sebelum hutang dilunasi dan sertifikat di-roya. Namun para pihak dapat membuat Akta Perjanjian Pengikatan Jual Beli (PPJB) Notariil yang mengatur kesepakatan pelunasan hutang bank (take over) terlebih dahulu.'
  },
  {
    id: 'faq-4',
    category: 'Client Portal',
    question: 'Bagaimana cara mengakses dan memantau berkas saya di Client Portal?',
    answer: 'Klien yang telah mendaftarkan permohonan layanan di kantor kami akan diberikan akses akun berupa Nomor Perkara (contoh: LDN-2026-0001) dan kredensial login. Melalui portal ini, Anda dapat memantau persentase progres, timeline verifikasi, jadwal tanda tangan, dan mengunduh draf akta secara aman.'
  },
  {
    id: 'faq-5',
    category: 'Dokumen',
    question: 'Apakah dokumen yang saya unggah ke Client Portal terjamin kerahasiaannya?',
    answer: 'Sangat terjamin. Seluruh berkas digital dilindungi dengan protokol keamanan berbasis token otorisasi, enkripsi berkas, dan pembatasan hak akses strictly per-klien. Sistem kami memenuhi standar kerahasiaan jabatan Notaris sesuai UU Jabatan Notaris (UUJN).'
  },
  {
    id: 'faq-6',
    category: 'Konsultasi',
    question: 'Bagaimana prosedur untuk melakukan konsultasi hukum tatap muka?',
    answer: 'Anda dapat menghubungi kantor kami melalui WhatsApp di (0812-3456-7890) atau mengisi formulir konsultasi online di website ini untuk membuat janji temu pada jam kerja (Senin–Jumat, 08.00–16.00 WITA).'
  }
];

export const TRUST_INDICATORS = [
  {
    iconClass: 'fa-solid fa-scale-balanced',
    title: 'Notaris & PPAT Resmi',
    desc: 'SK Kemenkumham & SK BPN resmi dengan legalitas penuh'
  },
  {
    iconClass: 'fa-solid fa-user-shield',
    title: 'Kerahasiaan & Integritas',
    desc: 'Menjaga sumpah jabatan dan kerahasiaan dokumen klien'
  },
  {
    iconClass: 'fa-solid fa-desktop',
    title: 'Client Portal Modern',
    desc: 'Pantau timeline dan proses berkas secara transparan 24/7'
  },
  {
    iconClass: 'fa-solid fa-handshake-angle',
    title: 'Pelayanan Profesional',
    desc: 'Penyusunan akta cermat, tepat waktu, dan berkepastian hukum'
  }
];

export const FAQ_ITEMS = LEGAL_FAQS;
