export type ServiceCategory = 'NOTARIS' | 'PPAT';

export interface LegalService {
  id: string;
  slug: string;
  category: ServiceCategory;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconClass: string;
  targetAudience: string;
  requirements: string[];
  procedures: string[];
  estimatedTime: string;
  importantNotes: string;
  faq: {
    question: string;
    answer: string;
  }[];
}

export type CaseStatus =
  | 'Permohonan Diterima'
  | 'Verifikasi Dokumen'
  | 'Dokumen Belum Lengkap'
  | 'Pemeriksaan Dokumen'
  | 'Proses Penyusunan Akta'
  | 'Menunggu Penandatanganan'
  | 'Proses Pendaftaran'
  | 'Proses Penyelesaian'
  | 'Selesai'
  | 'Ditutup';

export type DocumentCategory =
  | 'Dokumen Permohonan'
  | 'Dokumen Identitas'
  | 'Draft Akta'
  | 'Dokumen Pendukung'
  | 'Dokumen Final';

export interface CaseDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  uploadDate: string;
  fileSize: string;
  uploader: string;
  status: 'Terverifikasi' | 'Menunggu Review' | 'Draft' | 'Final Siap Ambil';
  fileType: 'pdf' | 'doc' | 'scan';
}

export interface CaseTimeline {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
}

export interface ClientCase {
  id: string; // e.g. LDN-2026-0001
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  category: ServiceCategory;
  status: CaseStatus;
  progress: number; // 0 - 100
  picName: string;
  dateSubmitted: string;
  lastUpdated: string;
  targetDate: string;
  clientNotes: string;
  internalNotes: string;
  documents: CaseDocument[];
  timeline: CaseTimeline[];
}

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'status' | 'document' | 'schedule' | 'payment' | 'general';
}

export interface ActivityLog {
  id: string;
  date: string;
  user: string;
  userRole: 'Client' | 'Staff' | 'Admin Kantor' | 'Super Admin';
  activity: string;
  ip: string;
  object: string;
  status: 'Success' | 'Warning' | 'Notice';
}

export interface LegalArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Notaris' | 'PPAT' | 'Pertanahan' | 'Properti' | 'Badan Usaha' | 'Tips Dokumen';
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
}

export interface LegalFaq {
  id: string;
  category: 'Notaris' | 'PPAT' | 'Pertanahan' | 'Dokumen' | 'Client Portal' | 'Konsultasi';
  question: string;
  answer: string;
}

export type DesignPresetKey =
  | 'navy-gold'
  | 'elegant-black'
  | 'corporate-blue'
  | 'green-legal'
  | 'minimal-white'
  | 'luxury-brown'
  | 'modern-teal';

export type HeaderStyleOption = 'classic' | 'modern' | 'minimal' | 'corporate' | 'legal';
export type FooterStyleOption = 'classic' | 'corporate' | 'three-column' | 'four-column' | 'minimal';
export type HeadingFontOption = 'Cinzel' | 'Playfair Display' | 'Merriweather' | 'Plus Jakarta Sans' | 'Inter';
export type BodyFontOption = 'Inter' | 'Plus Jakarta Sans' | 'Open Sans' | 'Lora';
export type ButtonStyleOption = 'solid' | 'outline' | 'pill' | 'luxury-border';
export type CardStyleOption = 'bordered' | 'shadowed' | 'flat' | 'elevated';
export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'INVALID';
export type LicenseTier = 'BASIC' | 'PROFESSIONAL' | 'BUSINESS' | 'AGENCY';

export interface DesignPreset {
  id: DesignPresetKey;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
  buttonColor: string;
  headingFont: HeadingFontOption;
  bodyFont: BodyFontOption;
  borderRadius: string;
  headerStyle: HeaderStyleOption;
  footerStyle: FooterStyleOption;
}

export interface StarterSiteDemo {
  id: string;
  name: string;
  badge: string;
  description: string;
  presetKey: DesignPresetKey;
  sampleOffice: {
    brandName: string;
    officeName: string;
    notaryName: string;
    notaryTitle: string;
    city: string;
    tagline: string;
  };
}

export interface LicenseConfig {
  licenseKey: string;
  status: LicenseStatus;
  tier: LicenseTier;
  licensedDomain: string;
  productVersion: string;
  licenseExpiry: string;
  updateChannel: 'stable' | 'beta' | 'lts';
  maxDomains: number;
  activatedDomains: string[];
}

export interface AgencyWhiteLabelSettings {
  enabled: boolean;
  pluginName: string;
  pluginAuthor: string;
  themeName: string;
  adminLogoUrl: string;
  supportUrl: string;
  documentationUrl: string;
  hideNotaryProAttribution: boolean;
}

export interface SystemDiagnosticItem {
  id: string;
  name: string;
  category: 'CORE' | 'SECURITY' | 'GOOGLE' | 'STORAGE' | 'SERVER';
  status: 'PASS' | 'WARNING' | 'ERROR';
  value: string;
  recommendation?: string;
}

export interface NotaryCustomizerSettings {
  // Brand & Identitas Utama (White-Label)
  brandName: string; // e.g. "NotaryPro" or Custom Office Brand
  officeName: string;
  notaryName: string;
  notaryTitle: string;
  notaryDegrees: string;
  skNotaryNo: string;
  skPpatNo: string;
  jurisdiction: string;
  tagline: string;
  motto: string;
  
  // Brand Assets
  logoUrl: string;
  logoMobileUrl: string;
  faviconUrl: string;

  // Global Design System & CSS Variables
  presetKey: DesignPresetKey;
  primaryColor: string;    // --notary-primary
  secondaryColor: string;  // --notary-secondary
  accentColor: string;     // --notary-accent
  backgroundColor: string; // --notary-background
  textColor: string;       // --notary-text
  headingColor: string;    // --notary-heading
  borderColor: string;     // --notary-border
  buttonColor: string;     // --notary-button

  // Typography
  headingFont: HeadingFontOption;
  bodyFont: BodyFontOption;
  buttonFont: string;
  menuFont: string;

  // Layout & Container
  containerWidth: '1200px' | '1280px' | '1440px' | 'full';
  headerStyle: HeaderStyleOption;
  footerStyle: FooterStyleOption;
  borderRadius: '0px' | '4px' | '8px' | '12px' | '16px';
  buttonStyle: ButtonStyleOption;
  cardStyle: CardStyleOption;
  customCss: string;

  // Kontak & Operasional
  officeAddress: string;
  subdistrict: string;
  city: string;
  province: string;
  whatsappNumber: string;
  phoneNumber: string;
  officeEmail: string;
  workingHours: string;
  googleMapsEmbedUrl: string;
  googleMapsEmbed: string;

  // Profil
  notaryPhotoUrl: string;
  officePhotoUrl: string;
  biography: string;
  vision: string;
  mission: string[];

  // Client Portal Settings
  clientPortalActive: boolean;
  supportEmail: string;
  supportPhone: string;

  // Socials
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;

  // White-Label & Licensing Settings
  licensing: LicenseConfig;
  agencyWhiteLabel: AgencyWhiteLabelSettings;
}

export interface ThemeFile {
  path: string;
  name: string;
  description: string;
  content: string;
  language?: string;
}

// ==========================================
// CALCULATOR & TARIFF MANAGEMENT TYPES
// ==========================================
export type CalculationType =
  | 'FIXED'
  | 'PERCENTAGE'
  | 'TIERED'
  | 'FIXED_PLUS_PERCENTAGE'
  | 'MULTI_COMPONENT'
  | 'PROPERTY_TRANSACTION'
  | 'CORPORATE_ENTITY'
  | 'PER_UNIT'
  | 'PER_DOCUMENT'
  | 'PER_PAGE'
  | 'PER_CERTIFICATE'
  | 'CUSTOM_FORMULA';

export type FeeComponentType =
  | 'PROFESSIONAL_FEE'
  | 'ADMINISTRATION'
  | 'EXAMINATION'
  | 'REGISTRATION'
  | 'CHECKING'
  | 'PNBP_OFFICIAL'
  | 'TAX_PPH'
  | 'TAX_BPHTB'
  | 'TAX_PPN'
  | 'METERAI'
  | 'DUPLICATION'
  | 'DELIVERY'
  | 'OTHER';

export type CalculationMethod =
  | 'FIXED'
  | 'PERCENTAGE'
  | 'TIERED'
  | 'PER_UNIT'
  | 'PER_DOCUMENT'
  | 'PER_PAGE'
  | 'PER_CERTIFICATE'
  | 'FORMULA_PROPERTY'
  | 'FORMULA_CORPORATE'
  | 'FORMULA_CUSTOM';

export interface CalculatorServiceItem {
  service_id: string;
  service_name: string;
  category: ServiceCategory;
  description: string;
  calculator_enabled: boolean;
  calculation_type: CalculationType;
  active: boolean;
  display_order: number;
  fields_required: string[];
  available_addons: string[];
  updated_at: string;
}

export interface FeeComponentItem {
  component_id: string;
  service_id: string;
  component_name: string;
  component_type: FeeComponentType;
  calculation_method: CalculationMethod;
  fixed_value: number;
  percentage: number;
  minimum_fee: number | null;
  maximum_fee: number | null;
  taxable: boolean;
  display_to_client: boolean;
  active: boolean;
  is_optional_addon?: boolean;
  description?: string;
  updated_at: string;
}

export interface FeeTierItem {
  tier_id: string;
  service_id: string;
  component_id: string;
  min_value: number;
  max_value: number;
  calculation_method: 'PERCENTAGE' | 'FIXED';
  percentage: number;
  fixed_fee: number;
  minimum_fee: number | null;
  maximum_fee: number | null;
  active: boolean;
}

export interface CalculatorSettingsState {
  currency: string;
  rounding_unit: number;
  estimate_expiration_days: number;
  show_tax: boolean;
  pnbp_checking_base: number;
  meterai_per_sheet: number;
  tariff_version: string;
  effective_from: string;
  effective_until: string;
}

export interface CalculationInputData {
  service_id: string;
  transaction_value?: number;
  object_value?: number;
  land_area?: number;
  building_area?: number;
  certificate_count?: number;
  certificate_status?: string;
  location?: string;
  authorized_capital?: number;
  paid_up_capital?: number;
  founders_count?: number;
  directors_count?: number;
  commissioners_count?: number;
  document_count?: number;
  page_count?: number;
  signatures_count?: number;
  urgency?: 'NORMAL' | 'EXPRESS';
  selected_addons?: string[];
  client_name?: string;
  client_whatsapp?: string;
  client_email?: string;
}

export interface CalculatedComponentBreakdown {
  component_id: string;
  component_name: string;
  component_type: FeeComponentType;
  category_group: 'JASA' | 'ADMIN' | 'PNBP' | 'PAJAK' | 'ADDON' | 'LAINNYA';
  amount: number;
  calculation_note: string;
  is_tax: boolean;
  is_optional: boolean;
  display_to_client: boolean;
}

export interface EstimateRecord {
  estimate_id: string;
  client_id?: string;
  service_id: string;
  service_name: string;
  category: ServiceCategory;
  created_at: string;
  expires_at: string;
  status: 'ESTIMASI_AWAL' | 'DIKONFIRMASI' | 'KEDALUWARSA';
  input_summary: Record<string, any>;
  components: CalculatedComponentBreakdown[];
  summary: {
    professional_fee: number;
    admin_fee: number;
    pnbp_fee: number;
    tax_fee: number;
    addons_fee: number;
  };
  total_estimated: number;
  estimated_min: number;
  estimated_max: number;
  rounding_unit: number;
  tariff_version: string;
  disclaimer: string;
}

export interface TariffAuditLogItem {
  audit_id: string;
  admin_user: string;
  service_id: string;
  component_id: string;
  old_value: string;
  new_value: string;
  changed_at: string;
  version: string;
  action_type: string;
}
