import React from 'react';
import { NotaryCustomizerSettings } from '../types';

interface NotaryContactSectionProps {
  settings: NotaryCustomizerSettings;
}

export const NotaryContactSection: React.FC<NotaryContactSectionProps> = ({ settings }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]" id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            Lokasi & Kontak Kantor
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
            Hubungi atau Kunjungi Kantor Kami
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Lokasi strategis mudah dijangkau, dengan area parkir yang nyaman dan ruang konsultasi privat.
          </p>
        </div>

        {/* Contact Cards & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Alamat Lengkap Kantor
                  </h4>
                  <p className="text-sm font-semibold text-[#0F172A] mt-1 leading-snug">
                    {settings.officeAddress}
                  </p>
                  <p className="text-xs text-[#C9A227] font-medium mt-1">
                    Wilayah Kerja: {settings.jurisdiction}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Telepon & WhatsApp
                  </h4>
                  <p className="text-sm font-semibold text-[#0F172A] mt-1">{settings.phoneNumber}</p>
                  <p className="text-xs text-slate-500">Senin - Jumat (08.00 - 16.00 WITA)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#C9A227] flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Surat Elektronik (Email)
                  </h4>
                  <p className="text-sm font-semibold text-[#0F172A] mt-1">{settings.officeEmail}</p>
                  <p className="text-xs text-slate-500">Pelayanan resmi berkas & korespondensi</p>
                </div>
              </div>
            </div>

            {/* Direct Quick WhatsApp Button */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Hubungi via WhatsApp Langsung</span>
            </a>
          </div>

          {/* Right Map */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-sm border border-slate-200 min-h-[380px] bg-slate-100 relative">
            <iframe
              title="Peta Kantor Notaris Lalu Daud Nurjadi"
              src={settings.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
