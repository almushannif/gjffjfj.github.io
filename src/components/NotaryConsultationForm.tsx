import React, { useState } from 'react';
import { NotaryCustomizerSettings } from '../types';
import { LEGAL_SERVICES } from '../data/notaryData';

interface NotaryConsultationFormProps {
  settings: NotaryCustomizerSettings;
  initialService?: string;
  initialNotes?: string;
}

export const NotaryConsultationForm: React.FC<NotaryConsultationFormProps> = ({
  settings,
  initialService,
  initialNotes
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(initialService || 'Pendirian PT & Badan Usaha');
  const [urgency, setUrgency] = useState<'Biasa' | 'Penting' | 'Mendesak (1-2 Hari)'>('Biasa');
  const [notes, setNotes] = useState(initialNotes || '');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialService) setSelectedService(initialService);
    if (initialNotes) setNotes(initialNotes);
  }, [initialService, initialNotes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Build WhatsApp message
    const msg = `*KONSULTASI HUKUM ONLINE - NOTARIS LALU DAUD LEGAL*
----------------------------------------
*Nama Klien:* ${name}
*No. WhatsApp:* ${phone}
*Email:* ${email || '-'}
*Layanan yang Diminta:* ${selectedService}
*Tingkat Urgensi:* ${urgency}
*Uraian Kebutuhan:*
${notes}
----------------------------------------
_Mohon konfirmasi ketersediaan jadwal konsultasi tatap muka / online._`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
    
    // Automatically trigger WhatsApp in new tab
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#0F172A] text-white" id="konsultasi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
              Layanan Konsultasi Terjadwal
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury leading-tight">
              Konsultasikan Transaksi & Kebutuhan Akta Hukum Anda
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Dapatkan telaah hukum pendahuluan langsung dari Notaris & PPAT berwenang. Kami melayani konsultasi langsung di kantor maupun telekonsultasi digital.
            </p>

            <div className="space-y-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <i className="fa-solid fa-clock text-[#C9A227] text-base"></i>
                <div>
                  <strong className="block text-white">Jam Operasional:</strong>
                  <span>{settings.workingHours}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <i className="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
                <div>
                  <strong className="block text-white">WhatsApp Fast Response:</strong>
                  <span>{settings.phoneNumber}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <i className="fa-solid fa-shield-halved text-[#C9A227] text-base"></i>
                <div>
                  <strong className="block text-white">Kerahasiaan Terjamin:</strong>
                  <span>Dilindungi oleh Sumpah Jabatan Notaris (UU No. 2/2014)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] font-serif-luxury">
                    Permintaan Konsultasi Diteruskan!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Formulir Anda telah diteruskan ke nomor WhatsApp resmi Kantor Notaris{' '}
                    <strong>{settings.notaryName}</strong>. Staf kami akan segera menanggapi dalam waktu 15–30 menit.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-[#0F172A] text-[#C9A227] text-xs font-bold transition hover:bg-[#1E293B]"
                  >
                    Kirim Pesan Konsultasi Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap / Perusahaan *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Santoso / PT Maju Jaya"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jenis Layanan Hukum *
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
                      >
                        {LEGAL_SERVICES.map((s) => (
                          <option key={s.id} value={s.title}>
                            [{s.category}] {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tingkat Urgensi
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['Biasa', 'Penting', 'Mendesak (1-2 Hari)'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setUrgency(lvl)}
                          className={`py-2 rounded-lg border text-center font-semibold transition ${
                            urgency === lvl
                              ? 'bg-[#0F172A] text-[#C9A227] border-[#0F172A]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Uraian Singkat Masalah / Kehendak Hukum *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Jelaskan secara ringkas maksud perbuatan hukum (misal: rencana jual beli tanah di Gerung, pendirian PT dengan 2 pemegang saham, dsb)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C9A227] focus:bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#C9A227] border border-[#C9A227]/40 text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <i className="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
                    <span>Kirim Formulir & Buka Chat WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
