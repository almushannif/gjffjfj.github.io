import React from 'react';

export const NotaryWorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Konsultasi & Penelaahan Kebutuhan',
      desc: 'Klien berkonsultasi mengenai substansi perbuatan hukum atau transaksi tanah. Tim legal menelaah kehendak hukum para pihak dan memeriksa aspek legalitas awal.',
      icon: 'fa-solid fa-comments',
    },
    {
      step: '02',
      title: 'Verifikasi Dokumen & Uji Tuntas (Due Diligence)',
      desc: 'Pemeriksaan keaslian KTP/NPWP, keabsahan sertifikat di Kantor Pertanahan (BPN), validasi pembayaran pajak daerah (BPHTB) dan PPh Final.',
      icon: 'fa-solid fa-file-shield',
    },
    {
      step: '03',
      title: 'Penyusunan Minuta & Penandatanganan Akta',
      desc: 'Penyusunan draf akta otentik, pembacaan akta secara jelas di hadapan para penghadap/saksi, dan penandatanganan resmi di hadapan Notaris/PPAT.',
      icon: 'fa-solid fa-signature',
    },
    {
      step: '04',
      title: 'Pendaftaran ke Instansi & Penyerahan Salinan',
      desc: 'Pengesahan SK Kemenkumham RI atau pendaftaran balik nama ke BPN. Klien dapat memantau progres hingga menerima salinan akta otentik dan sertifikat.',
      icon: 'fa-solid fa-award',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#0F172A] text-white" id="cara-kerja">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Alur Pelayanan Standar Operasional
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury">
            4 Langkah Mudah & Transparan Pembuatan Akta
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Menjamin keamanan hukum, kepatuhan undang-undang, serta kemudahan komunikasi bagi setiap klien.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#C9A227]/60 transition-all duration-200 shadow-lg relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-serif-luxury text-[#C9A227] tracking-wider">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-[#C9A227] flex items-center justify-center text-base">
                    <i className={item.icon}></i>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white font-serif-luxury leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-emerald-400">
                <i className="fa-solid fa-circle-check text-xs"></i>
                <span>Tercatat di Client Portal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
