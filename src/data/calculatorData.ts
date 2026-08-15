import {
  CalculatorServiceItem,
  FeeComponentItem,
  FeeTierItem,
  CalculatorSettingsState,
  CalculationInputData,
  EstimateRecord,
  TariffAuditLogItem,
  CalculatedComponentBreakdown
} from '../types';

// =========================================================================
// 1. CALCULATOR SETTINGS (Google Sheets: CalculatorSettings)
// =========================================================================
export const INITIAL_CALCULATOR_SETTINGS: CalculatorSettingsState = {
  currency: 'IDR',
  rounding_unit: 1000,
  estimate_expiration_days: 7,
  show_tax: true,
  pnbp_checking_base: 50000, // Rp 50.000 / sertifikat (standar PNBP BPN)
  meterai_per_sheet: 10000,   // Rp 10.000 (Meterai Elektronik/Fisik)
  tariff_version: 'v2.4.0-2026',
  effective_from: '2026-01-01',
  effective_until: '2026-12-31'
};

// =========================================================================
// 2. SERVICES CATALOG (Google Sheets: Services)
// =========================================================================
export const INITIAL_CALCULATOR_SERVICES: CalculatorServiceItem[] = [
  // --- KATEGORI PPAT ---
  {
    service_id: 'PPAT_AJB',
    service_name: 'Akta Jual Beli (AJB) Tanah & Bangunan',
    category: 'PPAT',
    description: 'Pembuatan akta otentik peralihan hak atas tanah dan bangunan karena proses jual beli resmi.',
    calculator_enabled: true,
    calculation_type: 'PROPERTY_TRANSACTION',
    active: true,
    display_order: 1,
    fields_required: ['transaction_value', 'object_value', 'land_area', 'certificate_count', 'certificate_status', 'location'],
    available_addons: ['ADDON_BPN_CHECK', 'ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY', 'ADDON_TAX_VALIDATION'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'PPAT_HIBAH',
    service_name: 'Akta Hibah Tanah / Properti',
    category: 'PPAT',
    description: 'Pemberian hak atas tanah/bangunan secara sukarela tanpa imbalan kepada keluarga atau pihak lain.',
    calculator_enabled: true,
    calculation_type: 'PROPERTY_TRANSACTION',
    active: true,
    display_order: 2,
    fields_required: ['object_value', 'land_area', 'certificate_count', 'certificate_status', 'location'],
    available_addons: ['ADDON_BPN_CHECK', 'ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'PPAT_APHT',
    service_name: 'Akta Pemberian Hak Tanggungan (APHT)',
    category: 'PPAT',
    description: 'Pembebanan hak tanggungan atas tanah sebagai jaminan pelunasan utang/kredit perbankan.',
    calculator_enabled: true,
    calculation_type: 'PROPERTY_TRANSACTION',
    active: true,
    display_order: 3,
    fields_required: ['transaction_value', 'certificate_count', 'certificate_status', 'location'],
    available_addons: ['ADDON_BPN_CHECK', 'ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'PPAT_APHB',
    service_name: 'Akta Pembagian Hak Bersama (APHB)',
    category: 'PPAT',
    description: 'Pembagian kepemilikan tanah bersama/waris menjadi hak perorangan masing-masing ahli waris.',
    calculator_enabled: true,
    calculation_type: 'PROPERTY_TRANSACTION',
    active: true,
    display_order: 4,
    fields_required: ['object_value', 'land_area', 'certificate_count', 'certificate_status'],
    available_addons: ['ADDON_BPN_CHECK', 'ADDON_EXTRA_COPY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'PPAT_ROYA',
    service_name: 'Pencoretan Hak Tanggungan (Roya)',
    category: 'PPAT',
    description: 'Penghapusan catatan beban jaminan hak tanggungan di buku tanah BPN setelah kredit lunas.',
    calculator_enabled: true,
    calculation_type: 'PER_CERTIFICATE',
    active: true,
    display_order: 5,
    fields_required: ['certificate_count', 'location'],
    available_addons: ['ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'PPAT_PENGECEKAN',
    service_name: 'Pengecekan Sertifikat Resmi BPN',
    category: 'PPAT',
    description: 'Pengecekan keabsahan, status blokir, sengketa, dan riwayat sertifikat tanah di Kantor Pertanahan.',
    calculator_enabled: true,
    calculation_type: 'PER_CERTIFICATE',
    active: true,
    display_order: 6,
    fields_required: ['certificate_count', 'location'],
    available_addons: ['ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },

  // --- KATEGORI NOTARIS ---
  {
    service_id: 'NOTARIS_PT',
    service_name: 'Pendirian PT (Perseroan Terbatas)',
    category: 'NOTARIS',
    description: 'Pembuatan Akta Pendirian PT, SK Kemenkumham, NIB OSS RBA, dan NPWP Perusahaan.',
    calculator_enabled: true,
    calculation_type: 'CORPORATE_ENTITY',
    active: true,
    display_order: 7,
    fields_required: ['authorized_capital', 'paid_up_capital', 'founders_count', 'directors_count', 'commissioners_count'],
    available_addons: ['ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY', 'ADDON_LEGAL_CONSULT_EXTENDED'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'NOTARIS_PERUBAHAN_PT',
    service_name: 'Perubahan Anggaran Dasar / Direksi PT',
    category: 'NOTARIS',
    description: 'Akta RUPS Perubahan Direksi, Komisaris, Pemegang Saham, Maksud Tujuan, atau Modal PT.',
    calculator_enabled: true,
    calculation_type: 'FIXED_PLUS_PERCENTAGE',
    active: true,
    display_order: 8,
    fields_required: ['authorized_capital'],
    available_addons: ['ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'NOTARIS_CV',
    service_name: 'Pendirian CV / Firma / Persekutuan Perdata',
    category: 'NOTARIS',
    description: 'Pembuatan Akta Pendirian CV, Pendaftaran AHU Kemenkumham, NIB OSS, dan NPWP Badan Usaha.',
    calculator_enabled: true,
    calculation_type: 'FIXED',
    active: true,
    display_order: 9,
    fields_required: ['founders_count'],
    available_addons: ['ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'NOTARIS_PPJB',
    service_name: 'Perjanjian Pengikatan Jual Beli (PPJB)',
    category: 'NOTARIS',
    description: 'Akta otentik kesepakatan pengikatan jual beli sebelum pelunasan atau persyaratan AJB terpenuhi.',
    calculator_enabled: true,
    calculation_type: 'TIERED',
    active: true,
    display_order: 10,
    fields_required: ['transaction_value'],
    available_addons: ['ADDON_EXTRA_COPY', 'ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'NOTARIS_PKS',
    service_name: 'Perjanjian Kerja Sama / Kontrak Bisnis',
    category: 'NOTARIS',
    description: 'Penyusunan akta perjanjian komersial, kemitraan strategis, sewa menyewa, atau pengakuan utang.',
    calculator_enabled: true,
    calculation_type: 'TIERED',
    active: true,
    display_order: 11,
    fields_required: ['transaction_value', 'page_count'],
    available_addons: ['ADDON_EXTRA_COPY', 'ADDON_LEGAL_CONSULT_EXTENDED'],
    updated_at: '2026-01-15'
  },
  {
    service_id: 'NOTARIS_LEGALISASI',
    service_name: 'Legalisasi / Waarmerking Dokumen',
    category: 'NOTARIS',
    description: 'Pengesahan tanda tangan di hadapan Notaris (Legalisasi) atau pembukuan surat di bawah tangan (Waarmerking).',
    calculator_enabled: true,
    calculation_type: 'PER_DOCUMENT',
    active: true,
    display_order: 12,
    fields_required: ['document_count', 'page_count', 'signatures_count', 'urgency'],
    available_addons: ['ADDON_SEALED_DELIVERY'],
    updated_at: '2026-01-15'
  }
];

// =========================================================================
// 3. FEE COMPONENTS CATALOG (Google Sheets: FeeComponents)
// =========================================================================
export const INITIAL_FEE_COMPONENTS: FeeComponentItem[] = [
  // --- JASA UTAMA & OPERASIONAL PPAT_AJB ---
  {
    component_id: 'AJB_PROF_FEE',
    service_id: 'PPAT_AJB',
    component_name: 'Honorarium Jasa PPAT (Permen ATR/BPN No. 33/2021)',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'TIERED',
    fixed_value: 0,
    percentage: 1.0,
    minimum_fee: 1500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Maksimal 1% dari nilai transaksi sesuai regulasi PPAT dengan batas tiering resmi.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'AJB_ADMIN_OPERASIONAL',
    service_id: 'PPAT_AJB',
    component_name: 'Biaya Administrasi & Warkah Akta',
    component_type: 'ADMINISTRATION',
    calculation_method: 'FIXED',
    fixed_value: 750000,
    percentage: 0,
    minimum_fee: 750000,
    maximum_fee: 750000,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Penyusunan berkas warkah, blanko akta resmi, dan pengarsipan protokol.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'AJB_PNBP_CHECKING',
    service_id: 'PPAT_AJB',
    component_name: 'PNBP Pengecekan Sertifikat Elektronik BPN',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'PER_CERTIFICATE',
    fixed_value: 50000,
    percentage: 0,
    minimum_fee: 50000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Tarif resmi PNBP Kantor Pertanahan ATR/BPN per buku sertifikat.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'AJB_PNBP_REGISTRATION',
    service_id: 'PPAT_AJB',
    component_name: 'Estimasi PNBP Pendaftaran Balik Nama BPN',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'PERCENTAGE',
    fixed_value: 25000,
    percentage: 0.1, // 1 per mil (T / 1000) + 25rb
    minimum_fee: 50000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Formula PNBP BPN: (Nilai Tanah per m² x Luas / 1000) + Rp 25.000.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'AJB_EST_PPH',
    service_id: 'PPAT_AJB',
    component_name: 'Estimasi PPh Final Penjual (2.5%)',
    component_type: 'TAX_PPH',
    calculation_method: 'PERCENTAGE',
    fixed_value: 0,
    percentage: 2.5,
    minimum_fee: null,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Pajak Penghasilan Final atas Pengalihan Hak atas Tanah dan Bangunan (dibayar Penjual).',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'AJB_EST_BPHTB',
    service_id: 'PPAT_AJB',
    component_name: 'Estimasi BPHTB Pembeli (5% x [Nilai - NPOPTKP])',
    component_type: 'TAX_BPHTB',
    calculation_method: 'FORMULA_PROPERTY',
    fixed_value: 0,
    percentage: 5.0,
    minimum_fee: null,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    description: 'Bea Perolehan Hak atas Tanah dan Bangunan (dibayar Pembeli, asumsi NPOPTKP Rp 80jt Mataram/NTB).',
    updated_at: '2026-01-15'
  },

  // --- PPAT HIBAH ---
  {
    component_id: 'HIBAH_PROF_FEE',
    service_id: 'PPAT_HIBAH',
    component_name: 'Honorarium Akta Hibah PPAT',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'TIERED',
    fixed_value: 0,
    percentage: 0.75,
    minimum_fee: 1500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'HIBAH_ADMIN',
    service_id: 'PPAT_HIBAH',
    component_name: 'Biaya Administrasi & Warkah Hibah',
    component_type: 'ADMINISTRATION',
    calculation_method: 'FIXED',
    fixed_value: 750000,
    percentage: 0,
    minimum_fee: 750000,
    maximum_fee: 750000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- PPAT APHT ---
  {
    component_id: 'APHT_PROF_FEE',
    service_id: 'PPAT_APHT',
    component_name: 'Jasa Pembuatan Akta APHT & SKMHT',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'TIERED',
    fixed_value: 0,
    percentage: 0.5,
    minimum_fee: 1500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'APHT_ADMIN',
    service_id: 'PPAT_APHT',
    component_name: 'Administrasi & Pendaftaran HT Elektronik',
    component_type: 'ADMINISTRATION',
    calculation_method: 'FIXED',
    fixed_value: 600000,
    percentage: 0,
    minimum_fee: 600000,
    maximum_fee: 600000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- PPAT ROYA ---
  {
    component_id: 'ROYA_JASA',
    service_id: 'PPAT_ROYA',
    component_name: 'Jasa Pengurusan Surat Pengantar & Validasi Roya',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'FIXED',
    fixed_value: 350000,
    percentage: 0,
    minimum_fee: 350000,
    maximum_fee: 350000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'ROYA_PNBP',
    service_id: 'PPAT_ROYA',
    component_name: 'PNBP Pencoretan Hak Tanggungan BPN',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'PER_CERTIFICATE',
    fixed_value: 50000,
    percentage: 0,
    minimum_fee: 50000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- PPAT PENGECEKAN ---
  {
    component_id: 'CEK_JASA',
    service_id: 'PPAT_PENGECEKAN',
    component_name: 'Jasa Validasi & Telaah Legalitas Sertifikat',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'PER_CERTIFICATE',
    fixed_value: 150000,
    percentage: 0,
    minimum_fee: 150000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'CEK_PNBP',
    service_id: 'PPAT_PENGECEKAN',
    component_name: 'PNBP Pengecekan Sertifikat Resmi BPN',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'PER_CERTIFICATE',
    fixed_value: 50000,
    percentage: 0,
    minimum_fee: 50000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- NOTARIS PENDIRIAN PT ---
  {
    component_id: 'PT_JASA_NOTARIS',
    service_id: 'NOTARIS_PT',
    component_name: 'Jasa Pembuatan Akta Pendirian PT Otentik',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'FORMULA_CORPORATE',
    fixed_value: 3500000,
    percentage: 0,
    minimum_fee: 3500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'PT_PNBP_KEMENKUMHAM',
    service_id: 'NOTARIS_PT',
    component_name: 'PNBP Pesan Nama & Pengesahan SK Menkumham',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'FIXED',
    fixed_value: 1200000, // Rp 200rb nama + Rp 1jt SK AHU
    percentage: 0,
    minimum_fee: 1200000,
    maximum_fee: 1200000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'PT_ADMIN_PERIZINAN',
    service_id: 'NOTARIS_PT',
    component_name: 'Administrasi NIB OSS RBA & NPWP Perusahaan',
    component_type: 'ADMINISTRATION',
    calculation_method: 'FIXED',
    fixed_value: 800000,
    percentage: 0,
    minimum_fee: 800000,
    maximum_fee: 800000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- NOTARIS PERUBAHAN PT ---
  {
    component_id: 'PT_PERUBAHAN_JASA',
    service_id: 'NOTARIS_PERUBAHAN_PT',
    component_name: 'Jasa Akta RUPS Perubahan PT',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'FIXED',
    fixed_value: 3000000,
    percentage: 0,
    minimum_fee: 3000000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'PT_PERUBAHAN_PNBP',
    service_id: 'NOTARIS_PERUBAHAN_PT',
    component_name: 'PNBP Persetujuan / Pemberitahuan AHU Menkumham',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'FIXED',
    fixed_value: 700000,
    percentage: 0,
    minimum_fee: 700000,
    maximum_fee: 700000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- NOTARIS PENDIRIAN CV ---
  {
    component_id: 'CV_JASA_NOTARIS',
    service_id: 'NOTARIS_CV',
    component_name: 'Jasa Pembuatan Akta Pendirian CV',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'FIXED',
    fixed_value: 2000000,
    percentage: 0,
    minimum_fee: 2000000,
    maximum_fee: 2000000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'CV_PNBP_SABU',
    service_id: 'NOTARIS_CV',
    component_name: 'PNBP Pendaftaran SABU Kemenkumham & NIB OSS',
    component_type: 'PNBP_OFFICIAL',
    calculation_method: 'FIXED',
    fixed_value: 500000,
    percentage: 0,
    minimum_fee: 500000,
    maximum_fee: 500000,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- NOTARIS PPJB & PKS ---
  {
    component_id: 'PPJB_JASA',
    service_id: 'NOTARIS_PPJB',
    component_name: 'Jasa Pembuatan Akta Otentik PPJB',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'TIERED',
    fixed_value: 0,
    percentage: 0.5,
    minimum_fee: 1500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'PKS_JASA',
    service_id: 'NOTARIS_PKS',
    component_name: 'Honorarium Akta Perjanjian Kerja Sama Komersial',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'TIERED',
    fixed_value: 0,
    percentage: 0.5,
    minimum_fee: 1500000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- NOTARIS LEGALISASI / WAARMERKING ---
  {
    component_id: 'LEG_JASA_DOKUMEN',
    service_id: 'NOTARIS_LEGALISASI',
    component_name: 'Jasa Legalisasi / Waarmerking Dokumen',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'PER_DOCUMENT',
    fixed_value: 100000,
    percentage: 0,
    minimum_fee: 100000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },
  {
    component_id: 'LEG_METERAI',
    service_id: 'NOTARIS_LEGALISASI',
    component_name: 'Biaya Bea Meterai Dokumen Resmi',
    component_type: 'METERAI',
    calculation_method: 'PER_DOCUMENT',
    fixed_value: 10000,
    percentage: 0,
    minimum_fee: 10000,
    maximum_fee: null,
    taxable: false,
    display_to_client: true,
    active: true,
    updated_at: '2026-01-15'
  },

  // --- ADD-ONS (LAYANAN TAMBAHAN YANG DAPAT DIPILIH KLIEN) ---
  {
    component_id: 'ADDON_BPN_CHECK',
    service_id: 'GLOBAL_ADDON',
    component_name: 'Pengecekan Keabsahan BPN Tambahan',
    component_type: 'CHECKING',
    calculation_method: 'FIXED',
    fixed_value: 200000,
    percentage: 0,
    minimum_fee: 200000,
    maximum_fee: 200000,
    taxable: false,
    display_to_client: true,
    active: true,
    is_optional_addon: true,
    description: 'Pengecekan sertifikat tambahan di luar kuota awal.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'ADDON_EXTRA_COPY',
    service_id: 'GLOBAL_ADDON',
    component_name: 'Salinan Akta Tambahan (Grosse / Turunan Akta)',
    component_type: 'DUPLICATION',
    calculation_method: 'FIXED',
    fixed_value: 150000,
    percentage: 0,
    minimum_fee: 150000,
    maximum_fee: 150000,
    taxable: false,
    display_to_client: true,
    active: true,
    is_optional_addon: true,
    description: 'Salinan resmi bermeterai tambahan untuk bank atau arsip pribadi.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'ADDON_SEALED_DELIVERY',
    service_id: 'GLOBAL_ADDON',
    component_name: 'Pengiriman Berkas Kurir Khusus Tersegel Aman',
    component_type: 'DELIVERY',
    calculation_method: 'FIXED',
    fixed_value: 75000,
    percentage: 0,
    minimum_fee: 75000,
    maximum_fee: 75000,
    taxable: false,
    display_to_client: true,
    active: true,
    is_optional_addon: true,
    description: 'Pengiriman dokumen final ke alamat klien dengan amplop bersegel resmi.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'ADDON_TAX_VALIDATION',
    service_id: 'GLOBAL_ADDON',
    component_name: 'Pendampingan Validasi Pajak (KPP & Bappenda)',
    component_type: 'EXAMINATION',
    calculation_method: 'FIXED',
    fixed_value: 500000,
    percentage: 0,
    minimum_fee: 500000,
    maximum_fee: 500000,
    taxable: false,
    display_to_client: true,
    active: true,
    is_optional_addon: true,
    description: 'Pengurusan verifikasi SSP PPh di KPP Pratama dan validasi SSB BPHTB di Bappenda.',
    updated_at: '2026-01-15'
  },
  {
    component_id: 'ADDON_LEGAL_CONSULT_EXTENDED',
    service_id: 'GLOBAL_ADDON',
    component_name: 'Konsultasi Legalitas & Due Diligence Tambahan',
    component_type: 'PROFESSIONAL_FEE',
    calculation_method: 'FIXED',
    fixed_value: 500000,
    percentage: 0,
    minimum_fee: 500000,
    maximum_fee: 500000,
    taxable: false,
    display_to_client: true,
    active: true,
    is_optional_addon: true,
    description: 'Sesi konsultasi hukum mendalam dengan Notaris/PPAT.',
    updated_at: '2026-01-15'
  }
];

// =========================================================================
// 4. FEE TIERS (Google Sheets: FeeTiers)
// Mengikuti aturan bertingkat (Tiering) resmi
// =========================================================================
export const INITIAL_FEE_TIERS: FeeTierItem[] = [
  // Tier PPAT AJB (Berdasarkan Nilai Transaksi / Objek)
  // Sesuai batasan Permen ATR/BPN No. 33/2021
  {
    tier_id: 'TIER_AJB_1',
    service_id: 'PPAT_AJB',
    component_id: 'AJB_PROF_FEE',
    min_value: 0,
    max_value: 500000000, // s/d 500 Juta
    calculation_method: 'PERCENTAGE',
    percentage: 1.0, // Maks 1%
    fixed_fee: 0,
    minimum_fee: 1500000,
    maximum_fee: 5000000,
    active: true
  },
  {
    tier_id: 'TIER_AJB_2',
    service_id: 'PPAT_AJB',
    component_id: 'AJB_PROF_FEE',
    min_value: 500000001,
    max_value: 1000000000, // 500 Juta - 1 Miliar
    calculation_method: 'PERCENTAGE',
    percentage: 0.75, // 0.75%
    fixed_fee: 0,
    minimum_fee: 5000000,
    maximum_fee: 7500000,
    active: true
  },
  {
    tier_id: 'TIER_AJB_3',
    service_id: 'PPAT_AJB',
    component_id: 'AJB_PROF_FEE',
    min_value: 1000000001,
    max_value: 2500000000, // 1 Miliar - 2.5 Miliar
    calculation_method: 'PERCENTAGE',
    percentage: 0.5, // 0.5%
    fixed_fee: 0,
    minimum_fee: 7500000,
    maximum_fee: 12500000,
    active: true
  },
  {
    tier_id: 'TIER_AJB_4',
    service_id: 'PPAT_AJB',
    component_id: 'AJB_PROF_FEE',
    min_value: 2500000001,
    max_value: 999999999999, // > 2.5 Miliar
    calculation_method: 'PERCENTAGE',
    percentage: 0.25, // 0.25%
    fixed_fee: 0,
    minimum_fee: 12500000,
    maximum_fee: 25000000,
    active: true
  },

  // Tier PPAT HIBAH
  {
    tier_id: 'TIER_HIBAH_1',
    service_id: 'PPAT_HIBAH',
    component_id: 'HIBAH_PROF_FEE',
    min_value: 0,
    max_value: 500000000,
    calculation_method: 'PERCENTAGE',
    percentage: 0.75,
    fixed_fee: 0,
    minimum_fee: 1500000,
    maximum_fee: 3750000,
    active: true
  },
  {
    tier_id: 'TIER_HIBAH_2',
    service_id: 'PPAT_HIBAH',
    component_id: 'HIBAH_PROF_FEE',
    min_value: 500000001,
    max_value: 999999999999,
    calculation_method: 'PERCENTAGE',
    percentage: 0.5,
    fixed_fee: 0,
    minimum_fee: 3750000,
    maximum_fee: 15000000,
    active: true
  },

  // Tier PPAT APHT
  {
    tier_id: 'TIER_APHT_1',
    service_id: 'PPAT_APHT',
    component_id: 'APHT_PROF_FEE',
    min_value: 0,
    max_value: 1000000000, // s/d 1 Miliar
    calculation_method: 'PERCENTAGE',
    percentage: 0.5,
    fixed_fee: 0,
    minimum_fee: 1500000,
    maximum_fee: 5000000,
    active: true
  },
  {
    tier_id: 'TIER_APHT_2',
    service_id: 'PPAT_APHT',
    component_id: 'APHT_PROF_FEE',
    min_value: 1000000001,
    max_value: 999999999999, // > 1 Miliar
    calculation_method: 'PERCENTAGE',
    percentage: 0.25,
    fixed_fee: 0,
    minimum_fee: 5000000,
    maximum_fee: 15000000,
    active: true
  },

  // Tier NOTARIS PPJB & PKS
  {
    tier_id: 'TIER_PPJB_1',
    service_id: 'NOTARIS_PPJB',
    component_id: 'PPJB_JASA',
    min_value: 0,
    max_value: 500000000,
    calculation_method: 'PERCENTAGE',
    percentage: 0.5,
    fixed_fee: 0,
    minimum_fee: 1500000,
    maximum_fee: 2500000,
    active: true
  },
  {
    tier_id: 'TIER_PPJB_2',
    service_id: 'NOTARIS_PPJB',
    component_id: 'PPJB_JASA',
    min_value: 500000001,
    max_value: 999999999999,
    calculation_method: 'PERCENTAGE',
    percentage: 0.25,
    fixed_fee: 0,
    minimum_fee: 2500000,
    maximum_fee: 10000000,
    active: true
  },
  {
    tier_id: 'TIER_PKS_1',
    service_id: 'NOTARIS_PKS',
    component_id: 'PKS_JASA',
    min_value: 0,
    max_value: 500000000,
    calculation_method: 'PERCENTAGE',
    percentage: 0.5,
    fixed_fee: 0,
    minimum_fee: 1500000,
    maximum_fee: 2500000,
    active: true
  },
  {
    tier_id: 'TIER_PKS_2',
    service_id: 'NOTARIS_PKS',
    component_id: 'PKS_JASA',
    min_value: 500000001,
    max_value: 999999999999,
    calculation_method: 'PERCENTAGE',
    percentage: 0.25,
    fixed_fee: 0,
    minimum_fee: 2500000,
    maximum_fee: 10000000,
    active: true
  }
];

// =========================================================================
// 5. INITIAL SAVED ESTIMATES (Google Sheets: Estimates)
// =========================================================================
export const INITIAL_SAVED_ESTIMATES: EstimateRecord[] = [
  {
    estimate_id: 'EST-2026-00001',
    client_id: 'CL-2026-00001',
    service_id: 'PPAT_AJB',
    service_name: 'Akta Jual Beli (AJB) Tanah & Bangunan',
    category: 'PPAT',
    created_at: '2026-08-10 10:30',
    expires_at: '2026-08-17 23:59',
    status: 'ESTIMASI_AWAL',
    input_summary: {
      transaction_value: 500000000,
      object_value: 450000000,
      land_area: 250,
      certificate_count: 1,
      certificate_status: 'SHM',
      location: 'Kota Mataram'
    },
    components: [
      {
        component_id: 'AJB_PROF_FEE',
        component_name: 'Honorarium Jasa PPAT (Tier 1)',
        component_type: 'PROFESSIONAL_FEE',
        category_group: 'JASA',
        amount: 5000000,
        calculation_note: '1.0% dari nilai transaksi Rp 500.000.000',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'AJB_ADMIN_OPERASIONAL',
        component_name: 'Biaya Administrasi & Warkah Akta',
        component_type: 'ADMINISTRATION',
        category_group: 'ADMIN',
        amount: 750000,
        calculation_note: 'Biaya tetap administrasi',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'AJB_PNBP_CHECKING',
        component_name: 'PNBP Pengecekan Sertifikat BPN',
        component_type: 'PNBP_OFFICIAL',
        category_group: 'PNBP',
        amount: 50000,
        calculation_note: '1 Sertifikat x Rp 50.000',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'AJB_PNBP_REGISTRATION',
        component_name: 'Estimasi PNBP Balik Nama BPN',
        component_type: 'PNBP_OFFICIAL',
        category_group: 'PNBP',
        amount: 525000,
        calculation_note: '(1‰ x Rp 500jt) + Rp 25.000',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'AJB_EST_PPH',
        component_name: 'Estimasi PPh Final Penjual (2.5%)',
        component_type: 'TAX_PPH',
        category_group: 'PAJAK',
        amount: 12500000,
        calculation_note: '2.5% x Rp 500.000.000',
        is_tax: true,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'AJB_EST_BPHTB',
        component_name: 'Estimasi BPHTB Pembeli (5%)',
        component_type: 'TAX_BPHTB',
        category_group: 'PAJAK',
        amount: 21000000,
        calculation_note: '5% x (Rp 500jt - Rp 80jt NPOPTKP Mataram)',
        is_tax: true,
        is_optional: false,
        display_to_client: true
      }
    ],
    summary: {
      professional_fee: 5000000,
      admin_fee: 750000,
      pnbp_fee: 575000,
      tax_fee: 33500000,
      addons_fee: 0
    },
    total_estimated: 39825000,
    estimated_min: 38500000,
    estimated_max: 41500000,
    rounding_unit: 1000,
    tariff_version: 'v2.4.0-2026',
    disclaimer: 'Estimasi biaya yang ditampilkan merupakan simulasi berdasarkan data dan parameter yang Anda masukkan. Biaya final dapat berbeda setelah dilakukan pemeriksaan dokumen, objek, nilai transaksi, kebutuhan layanan, pajak, biaya administrasi, serta ketentuan yang berlaku. Untuk mendapatkan perhitungan final, silakan konsultasikan dengan kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn.'
  },
  {
    estimate_id: 'EST-2026-00002',
    client_id: 'CL-2026-00002',
    service_id: 'NOTARIS_PT',
    service_name: 'Pendirian PT (Perseroan Terbatas)',
    category: 'NOTARIS',
    created_at: '2026-08-12 14:15',
    expires_at: '2026-08-19 23:59',
    status: 'ESTIMASI_AWAL',
    input_summary: {
      authorized_capital: 1000000000,
      paid_up_capital: 250000000,
      founders_count: 2,
      directors_count: 1,
      commissioners_count: 1
    },
    components: [
      {
        component_id: 'PT_JASA_NOTARIS',
        component_name: 'Jasa Pembuatan Akta Pendirian PT',
        component_type: 'PROFESSIONAL_FEE',
        category_group: 'JASA',
        amount: 3500000,
        calculation_note: 'Paket standar pendirian PT',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'PT_PNBP_KEMENKUMHAM',
        component_name: 'PNBP Pesan Nama & SK Menkumham',
        component_type: 'PNBP_OFFICIAL',
        category_group: 'PNBP',
        amount: 1200000,
        calculation_note: 'Voucher AHU Kemenkumham resmi',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      },
      {
        component_id: 'PT_ADMIN_PERIZINAN',
        component_name: 'Administrasi NIB OSS & NPWP',
        component_type: 'ADMINISTRATION',
        category_group: 'ADMIN',
        amount: 800000,
        calculation_note: 'Penerbitan NIB Berbasis Risiko',
        is_tax: false,
        is_optional: false,
        display_to_client: true
      }
    ],
    summary: {
      professional_fee: 3500000,
      admin_fee: 800000,
      pnbp_fee: 1200000,
      tax_fee: 0,
      addons_fee: 0
    },
    total_estimated: 5500000,
    estimated_min: 5000000,
    estimated_max: 6000000,
    rounding_unit: 1000,
    tariff_version: 'v2.4.0-2026',
    disclaimer: 'Estimasi biaya yang ditampilkan merupakan simulasi berdasarkan data dan parameter yang Anda masukkan. Biaya final dapat berbeda setelah dilakukan pemeriksaan dokumen, objek, nilai transaksi, kebutuhan layanan, pajak, biaya administrasi, serta ketentuan yang berlaku. Untuk mendapatkan perhitungan final, silakan konsultasikan dengan kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn.'
  }
];

// =========================================================================
// 6. TARIFF AUDIT LOG (Google Sheets: AuditLog / TariffAuditLog)
// =========================================================================
export const INITIAL_TARIFF_AUDIT_LOGS: TariffAuditLogItem[] = [
  {
    audit_id: 'AUD-TAR-001',
    admin_user: 'Lalu Daud Nurjadi, M.Kn. (Notaris/PPAT)',
    service_id: 'PPAT_AJB',
    component_id: 'AJB_PROF_FEE',
    old_value: 'Tarif Flat 1%',
    new_value: 'Tiering Permen ATR/BPN No. 33/2021 (1.0% -> 0.25%)',
    changed_at: '2026-01-01 08:00',
    version: 'v2.4.0-2026',
    action_type: 'UPDATE_RATE'
  },
  {
    audit_id: 'AUD-TAR-002',
    admin_user: 'Administrator Kantor',
    service_id: 'GLOBAL_SETTINGS',
    component_id: 'rounding_unit',
    old_value: '500',
    new_value: '1000',
    changed_at: '2026-01-05 09:30',
    version: 'v2.4.0-2026',
    action_type: 'UPDATE_SETTING'
  },
  {
    audit_id: 'AUD-TAR-003',
    admin_user: 'Administrator Kantor',
    service_id: 'NOTARIS_PT',
    component_id: 'PT_PNBP_KEMENKUMHAM',
    old_value: 'Rp 1.000.000',
    new_value: 'Rp 1.200.000 (Penyesuaian PNBP Nama + SK AHU)',
    changed_at: '2026-01-10 11:20',
    version: 'v2.4.0-2026',
    action_type: 'UPDATE_RATE'
  }
];

// =========================================================================
// 7. SAFE BACKEND FORMULA CALCULATION ENGINE
// Dijalankan di server (Apps Script / PHP Service Layer).
// Anti-eval(), anti-manipulation, strictly validated.
// =========================================================================

export function formatRupiah(value: number | string | null | undefined): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'Rp 0';
  }
  const numeric = Math.round(Number(value));
  return 'Rp ' + numeric.toLocaleString('id-ID');
}

export function validateCalculationInput(
  input: CalculationInputData,
  service: CalculatorServiceItem
): { isValid: boolean; errorMessage?: string } {
  if (!service.active || !service.calculator_enabled) {
    return {
      isValid: false,
      errorMessage: 'Kalkulator untuk layanan ini sedang diperbarui atau dinonaktifkan. Silakan hubungi kantor untuk informasi lebih lanjut.'
    };
  }

  // Validasi nilai angka tidak boleh negatif
  const numericFields: (keyof CalculationInputData)[] = [
    'transaction_value',
    'object_value',
    'land_area',
    'building_area',
    'certificate_count',
    'authorized_capital',
    'paid_up_capital',
    'founders_count',
    'directors_count',
    'commissioners_count',
    'document_count',
    'page_count',
    'signatures_count'
  ];

  for (const field of numericFields) {
    const val = input[field];
    if (val !== undefined && val !== null) {
      if (typeof val !== 'number' || isNaN(val)) {
        return { isValid: false, errorMessage: `Input field ${field} harus berupa angka valid.` };
      }
      if (val < 0) {
        return { isValid: false, errorMessage: 'Nilai masukan tidak boleh bernilai negatif.' };
      }
    }
  }

  // Validasi input khusus per layanan
  if (service.category === 'PPAT' && service.calculation_type === 'PROPERTY_TRANSACTION') {
    const txVal = input.transaction_value || 0;
    const objVal = input.object_value || 0;
    if (txVal <= 0 && objVal <= 0) {
      return { isValid: false, errorMessage: 'Nilai Transaksi atau Nilai Objek harus lebih besar dari 0.' };
    }
  }

  return { isValid: true };
}

/**
 * Backend Safe Calculation Engine (Simulasi otentik Apps Script CalculationEngine.gs)
 */
export function executeBackendCalculation(
  input: CalculationInputData,
  customServices = INITIAL_CALCULATOR_SERVICES,
  customComponents = INITIAL_FEE_COMPONENTS,
  customTiers = INITIAL_FEE_TIERS,
  customSettings = INITIAL_CALCULATOR_SETTINGS
): CalculationResultPayload {
  const service = customServices.find((s) => s.service_id === input.service_id);
  if (!service) {
    throw new Error('Layanan tidak ditemukan.');
  }

  const validation = validateCalculationInput(input, service);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage);
  }

  const baseValue = Math.max(input.transaction_value || 0, input.object_value || 0);
  const landArea = input.land_area || 0;
  const certCount = Math.max(1, input.certificate_count || 1);
  const docCount = Math.max(1, input.document_count || 1);
  const pageCount = Math.max(1, input.page_count || 1);

  // Ambil semua komponen aktif untuk service ini
  const serviceComponents = customComponents.filter(
    (c) => c.service_id === service.service_id && c.active
  );

  const calculatedComponents: CalculatedComponentBreakdown[] = [];

  let professionalFee = 0;
  let adminFee = 0;
  let pnbpFee = 0;
  let taxFee = 0;
  let addonsFee = 0;

  // 1. Hitung Komponen Utama Layanan
  for (const comp of serviceComponents) {
    let rawAmount = 0;
    let note = '';

    if (comp.calculation_method === 'FIXED') {
      rawAmount = comp.fixed_value;
      note = 'Biaya standar tetap';
    } else if (comp.calculation_method === 'TIERED') {
      // Cari tier yang cocok
      const tiers = customTiers.filter(
        (t) => t.service_id === service.service_id && t.component_id === comp.component_id && t.active
      );
      
      const matchedTier = tiers.find(
        (t) => baseValue >= t.min_value && baseValue <= t.max_value
      ) || tiers[0];

      if (matchedTier) {
        if (matchedTier.calculation_method === 'PERCENTAGE') {
          rawAmount = (baseValue * matchedTier.percentage) / 100;
          note = `${matchedTier.percentage}% dari nilai dasar ${formatRupiah(baseValue)}`;
        } else {
          rawAmount = matchedTier.fixed_fee;
          note = `Tarif tier tetap`;
        }

        // Apply tier min / max
        if (matchedTier.minimum_fee !== null && rawAmount < matchedTier.minimum_fee) {
          rawAmount = matchedTier.minimum_fee;
          note += ` (Minimum: ${formatRupiah(matchedTier.minimum_fee)})`;
        }
        if (matchedTier.maximum_fee !== null && rawAmount > matchedTier.maximum_fee) {
          rawAmount = matchedTier.maximum_fee;
          note += ` (Maksimum: ${formatRupiah(matchedTier.maximum_fee)})`;
        }
      } else {
        rawAmount = (baseValue * comp.percentage) / 100;
        note = `${comp.percentage}% dari ${formatRupiah(baseValue)}`;
      }
    } else if (comp.calculation_method === 'PERCENTAGE') {
      rawAmount = (baseValue * comp.percentage) / 100;
      note = `${comp.percentage}% dari ${formatRupiah(baseValue)}`;
      if (comp.component_id === 'AJB_PNBP_REGISTRATION') {
        rawAmount = (baseValue / 1000) + 25000;
        note = `(1‰ x ${formatRupiah(baseValue)}) + Rp 25.000 (PNBP Balik Nama)`;
      }
    } else if (comp.calculation_method === 'PER_CERTIFICATE') {
      rawAmount = comp.fixed_value * certCount;
      note = `${certCount} Sertifikat x ${formatRupiah(comp.fixed_value)}`;
    } else if (comp.calculation_method === 'PER_DOCUMENT') {
      rawAmount = comp.fixed_value * docCount;
      note = `${docCount} Dokumen x ${formatRupiah(comp.fixed_value)}`;
    } else if (comp.calculation_method === 'PER_PAGE') {
      rawAmount = comp.fixed_value * pageCount;
      note = `${pageCount} Halaman x ${formatRupiah(comp.fixed_value)}`;
    } else if (comp.calculation_method === 'FORMULA_PROPERTY') {
      // BPHTB Formula: 5% x (Nilai - NPOPTKP 80jt)
      const npoptkp = 80000000; // Asumsi Standar Kota Mataram / NTB
      const taxableValue = Math.max(0, baseValue - npoptkp);
      rawAmount = (taxableValue * 5) / 100;
      note = `5% x (${formatRupiah(baseValue)} - ${formatRupiah(npoptkp)} NPOPTKP)`;
    } else if (comp.calculation_method === 'FORMULA_CORPORATE') {
      rawAmount = comp.fixed_value;
      note = 'Paket Akta Otentik Notaris PT';
    }

    // Apply Component Minimum & Maximum capping
    if (comp.minimum_fee !== null && rawAmount < comp.minimum_fee) {
      rawAmount = comp.minimum_fee;
    }
    if (comp.maximum_fee !== null && rawAmount > comp.maximum_fee) {
      rawAmount = comp.maximum_fee;
    }

    // Tentukan kategori grup
    let group: 'JASA' | 'ADMIN' | 'PNBP' | 'PAJAK' | 'ADDON' | 'LAINNYA' = 'LAINNYA';
    if (comp.component_type === 'PROFESSIONAL_FEE') {
      group = 'JASA';
      professionalFee += rawAmount;
    } else if (comp.component_type === 'ADMINISTRATION') {
      group = 'ADMIN';
      adminFee += rawAmount;
    } else if (comp.component_type === 'PNBP_OFFICIAL' || comp.component_type === 'CHECKING') {
      group = 'PNBP';
      pnbpFee += rawAmount;
    } else if (comp.component_type === 'TAX_PPH' || comp.component_type === 'TAX_BPHTB' || comp.component_type === 'TAX_PPN') {
      group = 'PAJAK';
      if (customSettings.show_tax) {
        taxFee += rawAmount;
      }
    } else if (comp.component_type === 'METERAI') {
      group = 'ADMIN';
      adminFee += rawAmount;
    }

    // Jika komponen pajak dan show_tax nonaktif, skip dari rincian atau beri tanda
    if (group === 'PAJAK' && !customSettings.show_tax) {
      continue;
    }

    calculatedComponents.push({
      component_id: comp.component_id,
      component_name: comp.component_name,
      component_type: comp.component_type,
      category_group: group,
      amount: rawAmount,
      calculation_note: note,
      is_tax: group === 'PAJAK',
      is_optional: false,
      display_to_client: comp.display_to_client
    });
  }

  // 2. Hitung Add-ons yang Dipilih Klien
  if (input.selected_addons && input.selected_addons.length > 0) {
    for (const addonId of input.selected_addons) {
      const addon = customComponents.find(
        (c) => c.component_id === addonId && c.active && c.is_optional_addon
      );
      if (addon) {
        const addonAmount = addon.fixed_value;
        addonsFee += addonAmount;
        calculatedComponents.push({
          component_id: addon.component_id,
          component_name: addon.component_name,
          component_type: addon.component_type,
          category_group: 'ADDON',
          amount: addonAmount,
          calculation_note: 'Layanan tambahan opsional',
          is_tax: false,
          is_optional: true,
          display_to_client: true
        });
      }
    }
  }

  // 3. Hitung Total & Pembulatan (Rounding Unit)
  const rawTotal = professionalFee + adminFee + pnbpFee + taxFee + addonsFee;
  const roundingUnit = customSettings.rounding_unit || 1000;
  const totalEstimated = Math.round(rawTotal / roundingUnit) * roundingUnit;

  // Rentang estimasi min dan max (misal +- 5% untuk ketidakpastian objek/lapangan)
  const rangeMargin = Math.max(250000, Math.round(totalEstimated * 0.05 / roundingUnit) * roundingUnit);
  const estimatedMin = Math.max(0, totalEstimated - rangeMargin);
  const estimatedMax = totalEstimated + rangeMargin;

  // Tanggal kedaluwarsa estimasi
  const now = new Date();
  const expDays = customSettings.estimate_expiration_days || 7;
  const expDate = new Date(now.getTime() + expDays * 24 * 60 * 60 * 1000);

  const estimateId = `EST-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`;

  const result: EstimateRecord = {
    estimate_id: estimateId,
    client_id: input.client_name ? `GUEST-${Date.now()}` : undefined,
    service_id: service.service_id,
    service_name: service.service_name,
    category: service.category,
    created_at: now.toISOString().replace('T', ' ').substring(0, 16),
    expires_at: expDate.toISOString().replace('T', ' ').substring(0, 16),
    status: 'ESTIMASI_AWAL',
    input_summary: { ...input },
    components: calculatedComponents,
    summary: {
      professional_fee: professionalFee,
      admin_fee: adminFee,
      pnbp_fee: pnbpFee,
      tax_fee: taxFee,
      addons_fee: addonsFee
    },
    total_estimated: totalEstimated,
    estimated_min: estimatedMin,
    estimated_max: estimatedMax,
    rounding_unit: roundingUnit,
    tariff_version: customSettings.tariff_version,
    disclaimer:
      'Estimasi biaya yang ditampilkan merupakan simulasi berdasarkan data dan parameter yang Anda masukkan. Biaya final dapat berbeda setelah dilakukan pemeriksaan dokumen, objek, nilai transaksi, kebutuhan layanan, pajak, biaya administrasi, serta ketentuan yang berlaku. Untuk mendapatkan perhitungan final, silakan konsultasikan dengan kantor Notaris & PPAT Lalu Daud Nurjadi, M.Kn.'
  };

  return {
    success: true,
    data: result
  };
}

export interface CalculationResultPayload {
  success: boolean;
  data: EstimateRecord;
  message?: string;
}

/**
 * Format pesan WhatsApp resmi
 */
export function generateWhatsAppMessage(estimate: EstimateRecord, officePhone = '6281139000888'): string {
  const text = `Halo Notaris & PPAT Lalu Daud Nurjadi, M.Kn.

Saya telah melakukan simulasi biaya layanan di website resmi.

ID Estimasi: ${estimate.estimate_id}
Layanan: ${estimate.service_name} (${estimate.category})
Total Estimasi: ${formatRupiah(estimate.total_estimated)} (${formatRupiah(estimate.estimated_min)} - ${formatRupiah(estimate.estimated_max)})

Saya ingin berkonsultasi lebih lanjut mengenai persyaratan berkas dan konfirmasi biaya final. Terima kasih.`;

  return `https://wa.me/${officePhone}?text=${encodeURIComponent(text)}`;
}
