import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldAlert,
  Building2,
  FileText,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Download,
  Share2,
  MessageCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  Settings,
  RefreshCw,
  FileCheck,
  Percent,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Landmark,
  FileCode2,
  Scale
} from 'lucide-react';
import {
  INITIAL_CALCULATOR_SERVICES,
  INITIAL_FEE_COMPONENTS,
  INITIAL_FEE_TIERS,
  INITIAL_CALCULATOR_SETTINGS,
  INITIAL_SAVED_ESTIMATES,
  INITIAL_TARIFF_AUDIT_LOGS,
  formatRupiah,
  executeBackendCalculation,
  generateWhatsAppMessage
} from '../data/calculatorData';
import {
  CalculatorServiceItem,
  CalculationInputData,
  EstimateRecord,
  ServiceCategory
} from '../types';

interface NotaryCostCalculatorSectionProps {
  onNavigateToConsultation?: (serviceName: string, notes?: string) => void;
  onOpenGoogleHub?: () => void;
}

export const NotaryCostCalculatorSection: React.FC<NotaryCostCalculatorSectionProps> = ({
  onNavigateToConsultation,
  onOpenGoogleHub
}) => {
  // State Layanan & Kategori
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ServiceCategory>('ALL');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('PPAT_AJB');

  // State Input Form Dinamis
  const [transactionValue, setTransactionValue] = useState<number>(500000000);
  const [objectValue, setObjectValue] = useState<number>(450000000);
  const [landArea, setLandArea] = useState<number>(200);
  const [buildingArea, setBuildingArea] = useState<number>(120);
  const [certificateCount, setCertificateCount] = useState<number>(1);
  const [certificateStatus, setCertificateStatus] = useState<string>('SHM');
  const [location, setLocation] = useState<string>('Kota Mataram');
  
  // Input Badan Usaha
  const [authorizedCapital, setAuthorizedCapital] = useState<number>(1000000000);
  const [paidUpCapital, setPaidUpCapital] = useState<number>(250000000);
  const [foundersCount, setFoundersCount] = useState<number>(2);
  const [directorsCount, setDirectorsCount] = useState<number>(1);
  const [commissionersCount, setCommissionersCount] = useState<number>(1);

  // Input Legalisasi / Dokumen
  const [documentCount, setDocumentCount] = useState<number>(2);
  const [pageCount, setPageCount] = useState<number>(5);
  const [signaturesCount, setSignaturesCount] = useState<number>(2);
  const [urgency, setUrgency] = useState<'NORMAL' | 'EXPRESS'>('NORMAL');

  // Addons terpilih
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // State Hasil Perhitungan & Status
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentEstimate, setCurrentEstimate] = useState<EstimateRecord | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Modal State
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showAdminTariffModal, setShowAdminTariffModal] = useState<boolean>(false);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<boolean>(false);

  // Layanan Terpilih
  const selectedService = useMemo(() => {
    return INITIAL_CALCULATOR_SERVICES.find((s) => s.service_id === selectedServiceId) || INITIAL_CALCULATOR_SERVICES[0];
  }, [selectedServiceId]);

  // Filter Layanan berdasarkan Tab
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'ALL') return INITIAL_CALCULATOR_SERVICES;
    return INITIAL_CALCULATOR_SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Daftar Add-on yang relevan
  const availableAddonsList = useMemo(() => {
    return INITIAL_FEE_COMPONENTS.filter(
      (c) => (c.service_id === 'GLOBAL_ADDON' || c.is_optional_addon) && c.active
    );
  }, []);

  // Toggle Addon
  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Handler Hitung Estimasi (Server Authoritative Simulator)
  const handleCalculate = () => {
    setIsCalculating(true);
    setCalculationError(null);
    setSavedSuccessNotice(false);

    setTimeout(() => {
      try {
        const inputData: CalculationInputData = {
          service_id: selectedService.service_id,
          transaction_value: transactionValue,
          object_value: objectValue,
          land_area: landArea,
          building_area: buildingArea,
          certificate_count: certificateCount,
          certificate_status: certificateStatus,
          location: location,
          authorized_capital: authorizedCapital,
          paid_up_capital: paidUpCapital,
          founders_count: foundersCount,
          directors_count: directorsCount,
          commissioners_count: commissionersCount,
          document_count: documentCount,
          page_count: pageCount,
          signatures_count: signaturesCount,
          urgency: urgency,
          selected_addons: selectedAddons
        };

        const result = executeBackendCalculation(inputData);
        if (result.success && result.data) {
          setCurrentEstimate(result.data);
          // Scroll halus ke hasil pada mobile/desktop
          const resultElement = document.getElementById('calculator-result-card');
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          setCalculationError(result.message || 'Gagal menghitung estimasi biaya.');
        }
      } catch (err: any) {
        setCalculationError(err.message || 'Terjadi kendala saat memproses estimasi.');
      } finally {
        setIsCalculating(false);
      }
    }, 450); // Simulasi latensi jaringan backend aman
  };

  // Kalkulasi awal otomatis saat komponen pertama kali dimuat
  React.useEffect(() => {
    handleCalculate();
  }, [selectedServiceId]);

  return (
    <section id="kalkulator-biaya" className="py-20 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4 text-amber-400" />
            Kalkulator Estimasi Biaya Layanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Simulasi Biaya Notaris & PPAT
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            Perhitungan estimasi transparan, berbasis regulasi resmi tarif hukum dan formula dinamis terintegrasi Google Sheets.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs text-amber-200/90 bg-amber-950/40 border border-amber-800/50 px-4 py-2 rounded-lg">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Kalkulator memberikan <strong>ESTIMASI AWAL</strong>, bukan penetapan biaya final kantor.</span>
          </div>
        </div>

        {/* Top Controls: Kategori Layanan */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            Semua Layanan
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('PPAT')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'PPAT'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Layanan PPAT (Tanah & Properti)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('NOTARIS')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'NOTARIS'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Layanan Notaris (Badan Usaha & Akta)
          </button>
          
          {/* Tombol Manajemen Admin Tarif */}
          <button
            type="button"
            onClick={() => setShowAdminTariffModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700 border border-slate-700 transition-colors ml-auto"
            title="Kelola & Lihat Sumber Tarif Google Sheets"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manajemen Tarif Admin</span>
          </button>
        </div>

        {/* Main Grid: Form Inputs (Left) & Result Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: DYNAMIC FORM INPUTS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl backdrop-blur-sm">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-700 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Parameter Layanan</h3>
                  <p className="text-xs text-slate-400">Isi data objek/transaksi untuk menghitung estimasi</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-amber-300 border border-slate-700">
                {selectedService.category}
              </span>
            </div>

            <div className="space-y-5">
              
              {/* Dropdown Pemilihan Layanan */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Jenis Layanan Notaris / PPAT
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  {filteredServices.map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      [{service.category}] {service.service_name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-400 italic">
                  {selectedService.description}
                </p>
              </div>

              {/* DYNAMIC FIELDS: Transaksi Properti (AJB, Hibah, APHT, APHB) */}
              {selectedService.calculation_type === 'PROPERTY_TRANSACTION' && (
                <div className="space-y-4 pt-3 border-t border-slate-700/60">
                  
                  {/* Nilai Transaksi & Nilai Objek */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Nilai Transaksi (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="10000000"
                          value={transactionValue}
                          onChange={(e) => setTransactionValue(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          placeholder="500.000.000"
                        />
                      </div>
                      <span className="text-[11px] text-amber-400/80 mt-1 block">
                        {formatRupiah(transactionValue)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Nilai Objek / NJOP (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="10000000"
                          value={objectValue}
                          onChange={(e) => setObjectValue(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          placeholder="450.000.000"
                        />
                      </div>
                      <span className="text-[11px] text-amber-400/80 mt-1 block">
                        {formatRupiah(objectValue)}
                      </span>
                    </div>
                  </div>

                  {/* Luas Tanah & Luas Bangunan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Luas Tanah (m²)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={landArea}
                        onChange={(e) => setLandArea(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="Contoh: 200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Luas Bangunan (m²) <span className="text-slate-500">(Opsional)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={buildingArea}
                        onChange={(e) => setBuildingArea(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="Contoh: 120"
                      />
                    </div>
                  </div>

                  {/* Status Sertifikat & Jumlah */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Status / Jenis Hak Atas Tanah
                      </label>
                      <select
                        value={certificateStatus}
                        onChange={(e) => setCertificateStatus(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="SHM">Sertipikat Hak Milik (SHM)</option>
                        <option value="HGB">Hak Guna Bangunan (HGB)</option>
                        <option value="HAK_PAKAI">Hak Pakai</option>
                        <option value="STRATA_TITLE">HMSRS / Strata Title</option>
                        <option value="GIRIK_LETTER_C">Girik / Letter C / Tanah Adat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Jumlah Sertipikat (Buku)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={certificateCount}
                        onChange={(e) => setCertificateCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Lokasi Objek Wilayah Kerja PPAT */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Lokasi Objek Pertanahan
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Kota Mataram">Kota Mataram (Wilayah Kerja Utama)</option>
                      <option value="Kabupaten Lombok Barat">Kabupaten Lombok Barat</option>
                      <option value="Kabupaten Lombok Tengah">Kabupaten Lombok Tengah (Mandalika/Praya)</option>
                      <option value="Kabupaten Lombok Timur">Kabupaten Lombok Timur (Selong)</option>
                      <option value="Kabupaten Lombok Utara">Kabupaten Lombok Utara (KLU)</option>
                    </select>
                  </div>

                </div>
              )}

              {/* DYNAMIC FIELDS: Pendirian PT / Badan Usaha */}
              {selectedService.calculation_type === 'CORPORATE_ENTITY' && (
                <div className="space-y-4 pt-3 border-t border-slate-700/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Modal Dasar Perseroan (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="50000000"
                          value={authorizedCapital}
                          onChange={(e) => setAuthorizedCapital(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <span className="text-[11px] text-amber-400/80 mt-1 block">
                        {formatRupiah(authorizedCapital)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Modal Disetor (Min. 25%) (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="10000000"
                          value={paidUpCapital}
                          onChange={(e) => setPaidUpCapital(Math.max(0, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <span className="text-[11px] text-amber-400/80 mt-1 block">
                        {formatRupiah(paidUpCapital)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Jumlah Pendiri
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={foundersCount}
                        onChange={(e) => setFoundersCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Jumlah Direksi
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={directorsCount}
                        onChange={(e) => setDirectorsCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Komisaris
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={commissionersCount}
                        onChange={(e) => setCommissionersCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELDS: Legalisasi / Waarmerking */}
              {selectedService.calculation_type === 'PER_DOCUMENT' && (
                <div className="space-y-4 pt-3 border-t border-slate-700/60">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Jumlah Dokumen
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={documentCount}
                        onChange={(e) => setDocumentCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Jumlah Halaman
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={pageCount}
                        onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Jumlah Tanda Tangan
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={signaturesCount}
                        onChange={(e) => setSignaturesCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tingkat Urgensi Layanan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUrgency('NORMAL')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                          urgency === 'NORMAL'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Standar (1-2 Hari Kerja)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency('EXPRESS')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                          urgency === 'EXPRESS'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        Prioritas / Express Sameday
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELDS: Roya / Pengecekan Sertifikat */}
              {selectedService.calculation_type === 'PER_CERTIFICATE' && (
                <div className="space-y-4 pt-3 border-t border-slate-700/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Jumlah Sertipikat Objek (Buku)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={certificateCount}
                        onChange={(e) => setCertificateCount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Kantor Pertanahan (Kantah BPN)
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="Kota Mataram">Kantah BPN Kota Mataram</option>
                        <option value="Kabupaten Lombok Barat">Kantah BPN Kab. Lombok Barat (Gerung)</option>
                        <option value="Kabupaten Lombok Tengah">Kantah BPN Kab. Lombok Tengah (Praya)</option>
                        <option value="Kabupaten Lombok Timur">Kantah BPN Kab. Lombok Timur (Selong)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELDS: Tiered Perjanjian PPJB / PKS */}
              {selectedService.calculation_type === 'TIERED' && (
                <div className="space-y-4 pt-3 border-t border-slate-700/60">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nilai Transaksi / Objek Perjanjian (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10000000"
                        value={transactionValue}
                        onChange={(e) => setTransactionValue(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-amber-400/80 mt-1 block">
                      {formatRupiah(transactionValue)}
                    </span>
                  </div>
                </div>
              )}

              {/* ADD-ONS OPSIONAL (Layanan Tambahan) */}
              <div className="pt-4 border-t border-slate-700/60">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
                  Layanan Tambahan / Add-ons (Opsional)
                </label>
                <div className="space-y-2">
                  {availableAddonsList.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.component_id);
                    return (
                      <label
                        key={addon.component_id}
                        onClick={() => toggleAddon(addon.component_id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-white'
                            : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by container
                          className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-xs font-medium text-white">{addon.component_name}</span>
                            <span className="text-xs font-semibold text-amber-400">
                              +{formatRupiah(addon.fixed_value)}
                            </span>
                          </div>
                          {addon.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{addon.description}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Hitung Estimasi */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] disabled:opacity-50"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Menghitung Estimasi di Server...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 text-slate-950" />
                      <span>Hitung Estimasi Biaya</span>
                    </>
                  )}
                </button>
              </div>

              {calculationError && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{calculationError}</span>
                </div>
              )}

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: ESTIMATE RESULT CARD BREAKDOWN */}
          {/* ========================================================================= */}
          <div
            id="calculator-result-card"
            className="lg:col-span-6 bg-slate-800/95 rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative"
          >
            {/* Badge Estimasi Awal */}
            <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  Estimasi Awal
                </span>
                {currentEstimate && (
                  <span className="text-xs text-slate-400 font-mono">
                    {currentEstimate.estimate_id}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Versi Tarif: <strong className="text-slate-300">v2.4.0-2026</strong>
              </span>
            </div>

            {currentEstimate ? (
              <div className="space-y-6">
                
                {/* Header Hasil */}
                <div>
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {currentEstimate.service_name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Simulasi transaksi wilayah {location || 'Kota Mataram'}.
                  </p>
                </div>

                {/* Total Estimasi Highlight Box */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 rounded-2xl border border-amber-500/40 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Estimasi Biaya
                    </span>
                    <span className="text-xs text-amber-300/80">
                      Rentang: {formatRupiah(currentEstimate.estimated_min)} – {formatRupiah(currentEstimate.estimated_max)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">
                      {formatRupiah(currentEstimate.total_estimated)}
                    </span>
                    <span className="text-xs text-slate-400">*</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Pembulatan: Ke kelipatan Rp {currentEstimate.rounding_unit.toLocaleString('id-ID')}</span>
                    <span className="text-amber-400/90 font-medium">Berlaku s/d: {currentEstimate.expires_at}</span>
                  </div>
                </div>

                {/* Breakdown Komponen Biaya Rinci */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Rincian Komponen Biaya</span>
                    <span className="text-[11px] text-slate-400 font-normal">Transparansi Regulasi</span>
                  </h5>

                  <div className="bg-slate-900/80 rounded-xl divide-y divide-slate-800/80 border border-slate-700/60 overflow-hidden">
                    
                    {/* 1. Jasa Profesional */}
                    <div className="p-3.5 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white">Jasa Profesional Notaris/PPAT</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">Jasa</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Honorarium pembuatan minuta & akta otentik resmi
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-white font-mono shrink-0">
                        {formatRupiah(currentEstimate.summary.professional_fee)}
                      </span>
                    </div>

                    {/* 2. Biaya Administrasi */}
                    {currentEstimate.summary.admin_fee > 0 && (
                      <div className="p-3.5 flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Biaya Administrasi & Warkah</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Operasional</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Blanko akta, materai, dan pengarsipan protokol
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-white font-mono shrink-0">
                          {formatRupiah(currentEstimate.summary.admin_fee)}
                        </span>
                      </div>
                    )}

                    {/* 3. PNBP & Biaya Resmi BPN/AHU */}
                    {currentEstimate.summary.pnbp_fee > 0 && (
                      <div className="p-3.5 flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Biaya Resmi Negara (PNBP)</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">Resmi BPN/AHU</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Pengecekan sertifikat, pendaftaran balik nama, voucher SK Kemenkumham
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-white font-mono shrink-0">
                          {formatRupiah(currentEstimate.summary.pnbp_fee)}
                        </span>
                      </div>
                    )}

                    {/* 4. Estimasi Pajak (PPh & BPHTB) */}
                    {currentEstimate.summary.tax_fee > 0 && (
                      <div className="p-3.5 flex justify-between items-start gap-4 bg-amber-950/20">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-amber-200">Estimasi Pajak Transaksi</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono">PPh / BPHTB</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            PPh Final Penjual (2.5%) & Estimasi BPHTB Pembeli (5% - NPOPTKP)
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-amber-300 font-mono shrink-0">
                          {formatRupiah(currentEstimate.summary.tax_fee)}
                        </span>
                      </div>
                    )}

                    {/* 5. Layanan Tambahan Addons */}
                    {currentEstimate.summary.addons_fee > 0 && (
                      <div className="p-3.5 flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Layanan Tambahan (Add-ons)</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">Opsional</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {selectedAddons.length} opsi layanan tambahan dipilih
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-purple-300 font-mono shrink-0">
                          {formatRupiah(currentEstimate.summary.addons_fee)}
                        </span>
                      </div>
                    )}

                  </div>
                </div>

                {/* MANDATORY LEGAL DISCLAIMER */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-400 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Disclaimer Hukum Perhitungan Biaya:</span>
                  </div>
                  <p>
                    {currentEstimate.disclaimer}
                  </p>
                </div>

                {/* CTAs Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  
                  {/* Button 1: WhatsApp CTA */}
                  <a
                    href={generateWhatsAppMessage(currentEstimate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Konsultasikan Estimasi Ini via WhatsApp</span>
                  </a>

                  {/* Button 2: Ajukan Permohonan / Konsultasi */}
                  {onNavigateToConsultation && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigateToConsultation(
                          currentEstimate.service_name,
                          `Simulasi Estimasi Biaya (${currentEstimate.estimate_id}): Total ${formatRupiah(
                            currentEstimate.total_estimated
                          )}`
                        )
                      }
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      <span>Ajukan Permohonan Konsultasi Berkas Resmi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Button 3 & 4: Simpan ke Portal & Cetak PDF */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSavedSuccessNotice(true);
                        setTimeout(() => setSavedSuccessNotice(false), 4000);
                      }}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simpan ke Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPdfModal(true)}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unduh Ringkasan PDF</span>
                    </button>
                  </div>

                  {savedSuccessNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Estimasi <strong>{currentEstimate.estimate_id}</strong> berhasil disimpan ke riwayat akun Client Portal Anda!</span>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Calculator className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p>Klik tombol <strong>Hitung Estimasi Biaya</strong> untuk melihat kalkulasi.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: OFFICIAL PDF ESTIMATE PREVIEW / PRINT */}
      {/* ========================================================================= */}
      {showPdfModal && currentEstimate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden relative my-8">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-35deg]">
              <span className="text-5xl sm:text-6xl font-black font-sans uppercase tracking-widest text-slate-900 border-4 border-slate-900 p-6">
                ESTIMASI — BUKAN TAGIHAN
              </span>
            </div>

            {/* Modal Actions Bar (No Print) */}
            <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">Preview Lembar Estimasi Biaya</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 sm:p-10 space-y-6 text-slate-800">
              
              {/* Kop Kantor Resmi */}
              <div className="text-center pb-6 border-b-2 border-slate-900">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-950 tracking-tight">
                  KANTOR NOTARIS & PEJABAT PEMBUAT AKTA TANAH (PPAT)
                </h3>
                <h4 className="text-base sm:text-lg font-serif font-semibold text-amber-800">
                  LALU DAUD NURJADI, S.H., M.Kn.
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  SK Kemenkumham RI No. AHU-00123.AH.02.01.Tahun 2018 | SK Kepala BPN RI No. 456/KEP-PPAT/2019
                </p>
                <p className="text-[11px] text-slate-500">
                  Jl. Pejanggik No. 88, Mataram, Nusa Tenggara Barat | Telp: (0370) 621888 | WhatsApp: 0811-3900-0888
                </p>
              </div>

              {/* Judul Lembar Estimasi */}
              <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-4">
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
                    Lembar Simulasi
                  </span>
                  <strong className="text-sm font-bold text-slate-900">ESTIMASI BIAYA LAYANAN HUKUM</strong>
                  <p className="text-slate-600 mt-0.5">Layanan: <strong>{currentEstimate.service_name}</strong></p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 rounded border border-slate-300">
                    {currentEstimate.estimate_id}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Tanggal: {currentEstimate.created_at}</p>
                </div>
              </div>

              {/* Rincian Komponen */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold text-slate-700">Komponen Biaya</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-700">Keterangan / Dasar Hitung</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-700 text-right">Jumlah Estimasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentEstimate.components.map((comp) => (
                    <tr key={comp.component_id}>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {comp.component_name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {comp.calculation_note}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                        {formatRupiah(comp.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-900 font-bold bg-amber-50/60">
                    <td colSpan={2} className="py-3 px-3 text-slate-950 uppercase">
                      TOTAL ESTIMASI BIAYA
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-slate-950">
                      {formatRupiah(currentEstimate.total_estimated)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Legal Disclaimer Box */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-[10px] text-slate-600 leading-relaxed">
                <strong>Catatan Resmi Penting:</strong> Lembar ini merupakan simulasi estimasi awal berdasarkan data input awal pemohon. Nilai ini bukan tagihan mengikat atau penetapan biaya final kantor. Biaya final akan ditetapkan setelah telaah fisik dokumen, objek transaksi, status perpajakan, dan verifikasi Kantor Pertanahan/Kemenkumham.
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADMIN TARIFF CONFIG & AUDIT LOG (Google Sheets Source of Truth) */}
      {/* ========================================================================= */}
      {showAdminTariffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-8">
            
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-white">Manajemen Tarif & Formula Kalkulator</h3>
                  <p className="text-xs text-slate-400">Google Sheets Database: Services, FeeComponents, FeeTiers, & AuditLog</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminTariffModal(false)}
                className="text-slate-400 hover:text-white text-xs px-3 py-1.5 bg-slate-800 rounded-lg"
              >
                Tutup
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Info Sinkronisasi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block">Sumber Kebenaran (Source of Truth)</span>
                  <strong className="text-sm text-amber-300">Google Sheets DB</strong>
                  <p className="text-[11px] text-slate-400 mt-1">Sheets: Services, FeeComponents, FeeTiers</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block">Versi Tarif Aktif</span>
                  <strong className="text-sm text-white">v2.4.0-2026</strong>
                  <p className="text-[11px] text-slate-400 mt-1">Berlaku: 01 Jan 2026 s/d 31 Des 2026</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block">Status Perhitungan</span>
                  <strong className="text-sm text-emerald-400">Server Authoritative</strong>
                  <p className="text-[11px] text-slate-400 mt-1">Formula engine aman anti-eval()</p>
                </div>
              </div>

              {/* Audit Log Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>Jejak Audit & Histori Perubahan Tarif (AuditLog)</span>
                  <span className="text-[11px] text-amber-400 font-normal">Terekam di Google Sheets</span>
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Waktu</th>
                        <th className="py-2.5 px-3">Admin</th>
                        <th className="py-2.5 px-3">Layanan / Komponen</th>
                        <th className="py-2.5 px-3">Perubahan Tarif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                      {INITIAL_TARIFF_AUDIT_LOGS.map((log) => (
                        <tr key={log.audit_id}>
                          <td className="py-2.5 px-3 font-mono text-slate-400">{log.changed_at}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-200">{log.admin_user}</td>
                          <td className="py-2.5 px-3 text-amber-300">{log.service_id} ({log.component_id})</td>
                          <td className="py-2.5 px-3 text-slate-300">
                            <span className="line-through text-red-400 mr-2">{log.old_value}</span>
                            <span className="text-emerald-400 font-semibold">{log.new_value}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aksi Integrasi Google Hub */}
              {onOpenGoogleHub && (
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminTariffModal(false);
                      onOpenGoogleHub();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <FileCode2 className="w-4 h-4" />
                    <span>Buka Google Integration Hub & Database 14 Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
