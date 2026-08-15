import React from 'react';
import { LegalService, NotaryCustomizerSettings } from '../types';

interface ServiceDetailModalProps {
  service: LegalService | null;
  settings: NotaryCustomizerSettings;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  settings,
  onClose,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center text-[#C9A227] text-lg shrink-0">
              <i className={service.iconClass}></i>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                Layanan {service.category}
              </span>
              <h3 className="text-lg font-bold font-serif-luxury leading-tight">{service.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            aria-label="Tutup Modal"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Deskripsi Layanan
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">{service.fullDesc}</p>
          </div>

          {/* Target Audience & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1.5">
                <i className="fa-solid fa-users text-[#C9A227]"></i>
                <span>Subjek / Sasaran:</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">{service.targetAudience}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1.5">
                <i className="fa-solid fa-clock text-[#C9A227]"></i>
                <span>Estimasi Waktu Proses:</span>
              </div>
              <p className="text-xs text-emerald-700 font-bold">{service.estimatedTime}</p>
            </div>
          </div>

          {/* Requirements (Persyaratan Dokumen) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center space-x-2">
              <i className="fa-solid fa-list-check text-[#C9A227]"></i>
              <span>Persyaratan Dokumen yang Wajib Disiapkan:</span>
            </h4>
            <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              {service.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                  <span className="text-slate-700 leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Procedures (Alur Prosedur) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center space-x-2">
              <i className="fa-solid fa-route text-[#C9A227]"></i>
              <span>Tahapan & Alur Pelayanan:</span>
            </h4>
            <div className="space-y-2">
              {service.procedures.map((proc, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0F172A] text-[#C9A227] font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 leading-relaxed">{proc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          {service.importantNotes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
              <i className="fa-solid fa-triangle-exclamation text-amber-600 text-base mt-0.5 shrink-0"></i>
              <div>
                <strong className="block font-bold">Catatan Penting:</strong>
                <span>{service.importantNotes}</span>
              </div>
            </div>
          )}

          {/* FAQ */}
          {service.faq && service.faq.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                FAQ Terkait Layanan Ini:
              </h4>
              <div className="space-y-2 text-xs">
                {service.faq.map((f, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-[#0F172A] flex items-center space-x-1.5">
                      <i className="fa-solid fa-circle-question text-[#C9A227]"></i>
                      <span>{f.question}</span>
                    </div>
                    <p className="text-slate-600 pl-4 leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Tutup
          </button>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Notaris%20Lalu%20Daud%20Nurjadi,%20saya%20ingin%20konsultasi%20layanan:%20${encodeURIComponent(
              service.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#C9A227] text-xs font-bold shadow transition flex items-center justify-center space-x-2"
          >
            <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
            <span>Konsultasikan Layanan Ini</span>
          </a>
        </div>
      </div>
    </div>
  );
};
