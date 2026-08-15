import React from 'react';
import { NotaryCustomizerSettings } from '../types';

interface NotaryProfileSectionProps {
  settings: NotaryCustomizerSettings;
}

export const NotaryProfileSection: React.FC<NotaryProfileSectionProps> = ({ settings }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]" id="profil">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Photo with Luxury Double Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl border-2 border-[#C9A227] pointer-events-none"></div>
              <div className="relative bg-white rounded-2xl p-3.5 shadow-xl border border-slate-200">
                <img
                  src={settings.notaryPhotoUrl}
                  alt={settings.notaryName}
                  className="w-full h-96 object-cover rounded-xl shadow-inner"
                />
                <div className="pt-4 text-center">
                  <h3 className="text-xl font-bold text-[#0F172A] font-serif-luxury">
                    {settings.notaryName}
                  </h3>
                  <p className="text-xs text-[#C9A227] font-bold uppercase tracking-wider mt-0.5">
                    {settings.notaryTitle}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{settings.jurisdiction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Official Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C9A227]">
                Profil Notaris & PPAT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] font-serif-luxury">
                Integritas, Akurasi, dan Kepastian Hukum Dalam Setiap Akta Otentik
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {settings.biography}
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#C9A227] font-bold text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-eye"></i>
                  <span>Visi Kantor</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{settings.vision}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#C9A227] font-bold text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-bullseye"></i>
                  <span>Misi & Komitmen</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  {settings.mission.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Legal Credentials Badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-100/80 border border-slate-200/80 flex items-center space-x-3">
                <i className="fa-solid fa-certificate text-[#C9A227] text-lg"></i>
                <div>
                  <div className="font-bold text-slate-700">SK Notaris RI:</div>
                  <div className="text-slate-500 font-mono text-[11px]">{settings.skNotaryNo}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-100/80 border border-slate-200/80 flex items-center space-x-3">
                <i className="fa-solid fa-landmark-flag text-[#C9A227] text-lg"></i>
                <div>
                  <div className="font-bold text-slate-700">SK Menteri ATR/BPN:</div>
                  <div className="text-slate-500 font-mono text-[11px]">{settings.skPpatNo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
