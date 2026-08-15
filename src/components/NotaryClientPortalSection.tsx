import React, { useState } from 'react';
import { ClientCase, ClientNotification, ActivityLog, CaseStatus } from '../types';
import {
  INITIAL_CLIENT_CASES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/notaryData';

interface NotaryClientPortalSectionProps {
  onOpenGoogleIntegration?: () => void;
}

export const NotaryClientPortalSection: React.FC<NotaryClientPortalSectionProps> = ({
  onOpenGoogleIntegration,
}) => {
  const [cases, setCases] = useState<ClientCase[]>(INITIAL_CLIENT_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>('LDN-2026-0001');
  const [portalRole, setPortalRole] = useState<'CLIENT' | 'STAFF'>('CLIENT');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'TIMELINE' | 'NOTIFICATIONS' | 'LOGS'>('OVERVIEW');
  const [searchCaseQuery, setSearchCaseQuery] = useState('');
  const [notifications, setNotifications] = useState<ClientNotification[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Form states for Staff mode
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const handleSearchLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = cases.find((c) => c.id.toLowerCase() === searchCaseQuery.trim().toLowerCase());
    if (found) {
      setActiveCaseId(found.id);
      showToast(`Nomor perkara ${found.id} berhasil dimuat.`);
    } else {
      showToast(`Nomor perkara "${searchCaseQuery}" tidak ditemukan.`);
    }
  };

  const handleUpdateStatus = (newStatus: CaseStatus) => {
    const updated = cases.map((c) => {
      if (c.id === activeCaseId) {
        return { ...c, status: newStatus, lastUpdated: 'Baru saja' };
      }
      return c;
    });
    setCases(updated);

    // Add activity log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      date: 'Hari ini, Baru saja',
      user: 'Ahmad Fauzi, S.H. (Staff)',
      userRole: 'Staff',
      activity: `Mengubah status perkara ${activeCaseId} menjadi: ${newStatus}`,
      ip: '180.252.110.8',
      object: `Case ${activeCaseId}`,
      status: 'Success',
    };
    setActivityLogs([newLog, ...activityLogs]);
    showToast(`Status perkara berhasil diubah ke: ${newStatus}`);
  };

  const handleUpdateProgress = (newVal: number) => {
    const updated = cases.map((c) => {
      if (c.id === activeCaseId) {
        return { ...c, progress: newVal, lastUpdated: 'Baru saja' };
      }
      return c;
    });
    setCases(updated);
  };

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineTitle.trim()) return;

    const newEntry = {
      id: `tl-${Date.now()}`,
      date: 'Hari ini, Baru saja',
      title: newTimelineTitle,
      description: newTimelineDesc || 'Proses tercatat oleh staf kantor.',
      actor: 'Ahmad Fauzi, S.H. (Staff Legal)',
    };

    const updated = cases.map((c) => {
      if (c.id === activeCaseId) {
        return {
          ...c,
          timeline: [newEntry, ...c.timeline],
          lastUpdated: 'Baru saja',
        };
      }
      return c;
    });

    setCases(updated);
    setNewTimelineTitle('');
    setNewTimelineDesc('');
    showToast('Tahapan timeline baru berhasil ditambahkan.');
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      category: 'Dokumen Pendukung' as const,
      uploadDate: 'Hari ini',
      fileSize: '1.5 MB',
      uploader: portalRole === 'STAFF' ? 'Staff Kantor' : 'Client',
      status: 'Terverifikasi' as const,
      fileType: 'pdf' as const,
    };

    const updated = cases.map((c) => {
      if (c.id === activeCaseId) {
        return {
          ...c,
          documents: [newDoc, ...c.documents],
        };
      }
      return c;
    });

    setCases(updated);
    setNewDocName('');
    showToast('Dokumen baru berhasil diunggah ke berkas perkara.');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative" id="client-portal">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C9A227] text-[#0F172A] px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-bounce">
          <i className="fa-solid fa-circle-check text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Client Portal Terintegrasi (Live Demo)</span>
              </div>
              {onOpenGoogleIntegration && (
                <button
                  onClick={onOpenGoogleIntegration}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow-sm"
                >
                  <i className="fa-solid fa-cloud-bolt text-emerald-400"></i>
                  <span>Google Apps Script & Sheets Hub</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] ml-0.5"></i>
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury text-white">
              Pelacakan Berkas Perkara & Manajemen Dokumen Digital
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Memungkinkan klien memantau tahapan verifikasi berkas, validasi pajak, tahapan BPN, serta mengunduh salinan akta otentik secara transparan 24/7.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center space-x-2 p-1 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 px-2">Mode Tampilan:</span>
            <button
              onClick={() => setPortalRole('CLIENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                portalRole === 'CLIENT'
                  ? 'bg-[#C9A227] text-[#0F172A] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-user"></i>
              <span>Client View</span>
            </button>
            <button
              onClick={() => setPortalRole('STAFF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                portalRole === 'STAFF'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-user-gear"></i>
              <span>Staff / Admin View</span>
            </button>
          </div>
        </div>

        {/* Search & Case Selector Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <form onSubmit={handleSearchLookup} className="lg:col-span-6 flex gap-2">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchCaseQuery}
                onChange={(e) => setSearchCaseQuery(e.target.value)}
                placeholder="Lacak nomor perkara (contoh: LDN-2026-0001)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Cari</span>
            </button>
          </form>

          {/* Quick Case Switcher */}
          <div className="lg:col-span-6 flex items-center justify-end space-x-2 overflow-x-auto">
            <span className="text-xs text-slate-400 shrink-0">Demo Perkara:</span>
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition shrink-0 border ${
                  activeCaseId === c.id
                    ? 'bg-slate-800 text-[#C9A227] border-[#C9A227]'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Portal Dashboard Card */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Top Bar inside Card */}
          <div className="p-6 bg-slate-900/90 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#C9A227] flex items-center justify-center text-[#C9A227] text-xl shrink-0">
                <i className="fa-solid fa-folder-closed"></i>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#C9A227]">{currentCase.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                    {currentCase.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif-luxury">{currentCase.serviceType}</h3>
                <div className="text-xs text-slate-400">
                  Pemohon: <strong className="text-slate-200">{currentCase.clientName}</strong> • PIC:{' '}
                  <span className="text-slate-300">{currentCase.picName}</span>
                </div>
              </div>
            </div>

            {/* Status & Progress Summary */}
            <div className="flex items-center space-x-4 text-right">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Status Saat Ini</div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-0.5 border ${
                    currentCase.status === 'Selesai'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : currentCase.status === 'Menunggu Penandatanganan'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {currentCase.status}
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Progres</div>
                <span className="text-xl font-bold font-mono text-[#C9A227]">{currentCase.progress}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar Visualizer */}
          <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Progres Penyelesaian Berkas</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Estimasi Target: {currentCase.targetDate}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-[#C9A227] to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${currentCase.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center px-6 border-b border-slate-700 bg-slate-900/30 overflow-x-auto">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`py-3.5 px-4 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-2 ${
                activeTab === 'OVERVIEW'
                  ? 'border-[#C9A227] text-[#C9A227]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-circle-info"></i>
              <span>Ringkasan Perkara</span>
            </button>

            <button
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`py-3.5 px-4 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-2 ${
                activeTab === 'DOCUMENTS'
                  ? 'border-[#C9A227] text-[#C9A227]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-file-lines"></i>
              <span>Pusat Dokumen ({currentCase.documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('TIMELINE')}
              className={`py-3.5 px-4 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-2 ${
                activeTab === 'TIMELINE'
                  ? 'border-[#C9A227] text-[#C9A227]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-timeline"></i>
              <span>Timeline Pelayanan ({currentCase.timeline.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`py-3.5 px-4 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-2 ${
                activeTab === 'NOTIFICATIONS'
                  ? 'border-[#C9A227] text-[#C9A227]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-bell"></i>
              <span>Notifikasi {unreadCount > 0 && <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-[10px] text-white font-bold">{unreadCount}</span>}</span>
            </button>

            {portalRole === 'STAFF' && (
              <button
                onClick={() => setActiveTab('LOGS')}
                className={`py-3.5 px-4 text-xs font-bold transition border-b-2 shrink-0 flex items-center space-x-2 ${
                  activeTab === 'LOGS'
                    ? 'border-[#C9A227] text-[#C9A227]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>Audit & Log Sistem</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Note Card */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] flex items-center space-x-2">
                      <i className="fa-solid fa-message"></i>
                      <span>Pemberitahuan Terkini untuk Klien:</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentCase.clientNotes}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-500">
                      Terakhir diperbarui: {currentCase.lastUpdated}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-2.5 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Tanggal Masuk:</span>
                      <span className="font-semibold text-slate-200">{currentCase.dateSubmitted}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Target Selesai:</span>
                      <span className="font-semibold text-emerald-400">{currentCase.targetDate}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Email Pemohon:</span>
                      <span className="font-semibold text-slate-200">{currentCase.clientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kontak WhatsApp:</span>
                      <span className="font-semibold text-[#C9A227]">{currentCase.clientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Staff Actions Panel (Only in STAFF mode) */}
                {portalRole === 'STAFF' && (
                  <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <i className="fa-solid fa-user-gear"></i>
                      <span>Panel Pengendali Staff (Ubah Status & Progres)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Status Selector */}
                      <div>
                        <label className="block text-xs text-slate-300 font-semibold mb-1">
                          Ubah Status Perkara:
                        </label>
                        <select
                          value={currentCase.status}
                          onChange={(e) => handleUpdateStatus(e.target.value as CaseStatus)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                        >
                          <option value="Permohonan Diterima">Permohonan Diterima</option>
                          <option value="Verifikasi Dokumen">Verifikasi Dokumen</option>
                          <option value="Pemeriksaan Dokumen">Pemeriksaan Dokumen</option>
                          <option value="Proses Penyusunan Akta">Proses Penyusunan Akta</option>
                          <option value="Menunggu Penandatanganan">Menunggu Penandatanganan</option>
                          <option value="Proses Pendaftaran">Proses Pendaftaran (BPN/AHU)</option>
                          <option value="Proses Penyelesaian">Proses Penyelesaian</option>
                          <option value="Selesai">Selesai (Siap Ambil)</option>
                        </select>
                      </div>

                      {/* Progress Slider */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                          <span>Persentase Progres:</span>
                          <span className="font-mono text-[#C9A227]">{currentCase.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={currentCase.progress}
                          onChange={(e) => handleUpdateProgress(Number(e.target.value))}
                          className="w-full accent-[#C9A227]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'DOCUMENTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Daftar Dokumen Terdaftar ({currentCase.documents.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Semua dokumen dienkripsi dan terlindungi kerahasiaan jabatan
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentCase.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-[#C9A227] flex items-center justify-center text-lg shrink-0">
                          <i
                            className={
                              doc.fileType === 'pdf'
                                ? 'fa-solid fa-file-pdf text-red-400'
                                : doc.fileType === 'doc'
                                ? 'fa-solid fa-file-word text-blue-400'
                                : 'fa-solid fa-file-image text-amber-400'
                            }
                          ></i>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-200">{doc.name}</h5>
                          <div className="text-[11px] text-slate-400 space-x-2">
                            <span>{doc.category}</span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>Diunggah oleh: {doc.uploader} ({doc.uploadDate})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            doc.status === 'Terverifikasi'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : doc.status === 'Final Siap Ambil'
                              ? 'bg-[#C9A227]/20 text-[#C9A227]'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <button
                          onClick={() => showToast(`Mengunduh berkas: ${doc.name}`)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <i className="fa-solid fa-download text-[10px]"></i>
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload New Document Form */}
                <form onSubmit={handleAddDocument} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/80 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Nama file / dokumen yang ingin diunggah..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0F172A] text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Unggah Dokumen</span>
                  </button>
                </form>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'TIMELINE' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Histori & Alur Timeline Berkas
                  </h4>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                  {currentCase.timeline.map((item, idx) => (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                          idx === 0
                            ? 'bg-[#C9A227] border-white ring-4 ring-[#C9A227]/30'
                            : 'bg-slate-800 border-slate-500'
                        }`}
                      ></span>

                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <h5 className="font-bold text-white text-sm font-serif-luxury">{item.title}</h5>
                          <span className="text-[11px] text-[#C9A227] font-mono">{item.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                        <div className="text-[10px] text-slate-400 pt-1">Oleh: {item.actor}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Timeline Entry (Staff only) */}
                {portalRole === 'STAFF' && (
                  <form
                    onSubmit={handleAddTimeline}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3"
                  >
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Tambah Tahapan Timeline Baru:
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        required
                        value={newTimelineTitle}
                        onChange={(e) => setNewTimelineTitle(e.target.value)}
                        placeholder="Judul tahapan (contoh: Validasi PPh KPP Selesai)..."
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                      />
                      <textarea
                        rows={2}
                        value={newTimelineDesc}
                        onChange={(e) => setNewTimelineDesc(e.target.value)}
                        placeholder="Deskripsi rincian proses tahapan..."
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Simpan Tahapan Timeline</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Notifikasi & Pesan Kantor ({notifications.length})
                  </h4>
                  <button
                    onClick={() => {
                      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
                      showToast('Semua notifikasi ditandai telah dibaca.');
                    }}
                    className="text-xs text-[#C9A227] hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border transition ${
                        notif.isRead
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-slate-900/90 border-[#C9A227]/40 text-slate-200 shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#C9A227] shrink-0"></span>
                            )}
                            <h5 className="font-bold text-xs sm:text-sm text-white">{notif.title}</h5>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                          <div className="text-[10px] text-slate-500 pt-1">{notif.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOGS TAB (Staff only) */}
            {activeTab === 'LOGS' && portalRole === 'STAFF' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Log Audit & Keamanan Sistem
                  </h4>
                  <span className="text-[10px] text-slate-500">Standar ISO 27001 & UUJN</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Waktu</th>
                        <th className="py-2.5 px-3">Pengguna</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Aktivitas</th>
                        <th className="py-2.5 px-3">Objek</th>
                        <th className="py-2.5 px-3">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 text-slate-400">{log.date}</td>
                          <td className="py-2.5 px-3 text-white font-semibold">{log.user}</td>
                          <td className="py-2.5 px-3 text-[#C9A227]">{log.userRole}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-200">{log.activity}</td>
                          <td className="py-2.5 px-3 text-slate-400">{log.object}</td>
                          <td className="py-2.5 px-3 text-slate-500">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
