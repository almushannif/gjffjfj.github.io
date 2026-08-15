import React, { useState, useEffect } from 'react';
import { NotaryTopBar } from './components/NotaryTopBar';
import { NotaryHeader } from './components/NotaryHeader';
import { NotaryHero } from './components/NotaryHero';
import { NotaryTrustIndicators } from './components/NotaryTrustIndicators';
import { NotaryProfileSection } from './components/NotaryProfileSection';
import { NotaryServicesSection } from './components/NotaryServicesSection';
import { NotaryWorkflowSection } from './components/NotaryWorkflowSection';
import { NotaryCostCalculatorSection } from './components/NotaryCostCalculatorSection';
import { NotaryClientPortalSection } from './components/NotaryClientPortalSection';
import { NotaryArticlesSection } from './components/NotaryArticlesSection';
import { NotaryFaqSection } from './components/NotaryFaqSection';
import { NotaryConsultationForm } from './components/NotaryConsultationForm';
import { NotaryContactSection } from './components/NotaryContactSection';
import { NotaryFooter } from './components/NotaryFooter';
import { NotaryCustomizerDrawer } from './components/NotaryCustomizerDrawer';
import { NotaryThemeCodeViewer } from './components/NotaryThemeCodeViewer';
import { GoogleIntegrationModal } from './components/GoogleIntegrationModal';
import { PluginManagerModal } from './components/PluginManagerModal';
import { SetupWizardModal } from './components/SetupWizardModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { ShortcodesGutenbergModal } from './components/ShortcodesGutenbergModal';
import { LicenseManagerModal } from './components/LicenseManagerModal';
import { DEFAULT_NOTARY_SETTINGS } from './data/notaryData';
import { NotaryCustomizerSettings } from './types';

export default function App() {
  const [settings, setSettings] = useState<NotaryCustomizerSettings>(DEFAULT_NOTARY_SETTINGS);
  const [activeNav, setActiveNav] = useState<string>('beranda');
  const [themeCodeOpen, setThemeCodeOpen] = useState<boolean>(false);
  const [customizerOpen, setCustomizerOpen] = useState<boolean>(false);
  const [googleIntegrationOpen, setGoogleIntegrationOpen] = useState<boolean>(false);
  const [pluginManagerOpen, setPluginManagerOpen] = useState<boolean>(false);
  const [setupWizardOpen, setSetupWizardOpen] = useState<boolean>(false);
  const [systemStatusOpen, setSystemStatusOpen] = useState<boolean>(false);
  const [shortcodesOpen, setShortcodesOpen] = useState<boolean>(false);
  const [licenseManagerOpen, setLicenseManagerOpen] = useState<boolean>(false);
  const [consultationServicePrefill, setConsultationServicePrefill] = useState<string>('');
  const [consultationNotesPrefill, setConsultationNotesPrefill] = useState<string>('');

  // Apply CSS Variables dynamically based on customizer settings
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--notary-primary', settings.primaryColor);
    root.style.setProperty('--notary-secondary', settings.secondaryColor);
    root.style.setProperty('--notary-accent', settings.accentColor);
    root.style.setProperty('--notary-background', settings.backgroundColor);
    root.style.setProperty('--notary-text', settings.textColor);
    root.style.setProperty('--notary-heading', settings.headingColor);
    root.style.setProperty('--notary-border', settings.borderColor);
    root.style.setProperty('--notary-button', settings.buttonColor);
    root.style.setProperty('--notary-radius', settings.borderRadius);
  }, [settings]);

  const handleNavigate = (sectionId: string) => {
    setActiveNav(sectionId);
    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPortal = () => {
    const portalElem = document.getElementById('client-portal');
    if (portalElem) {
      portalElem.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveNav('client-portal');
  };

  const handleNavigateToConsultation = (serviceName: string, notes?: string) => {
    setConsultationServicePrefill(serviceName);
    if (notes) setConsultationNotesPrefill(notes);
    handleNavigate('konsultasi');
  };

  const handleUpdateSettings = (newSettings: NotaryCustomizerSettings) => {
    setSettings(newSettings);
  };

  return (
    <div
      className="min-h-screen flex flex-col antialiased selection:bg-[#D4AF37] selection:text-[#0A192F]"
      style={{
        backgroundColor: settings.backgroundColor || '#F8FAFC',
        color: settings.textColor || '#0F172A',
        fontFamily: `${settings.bodyFont || 'Plus Jakarta Sans'}, sans-serif`,
      }}
    >
      {/* Dynamic Custom CSS injection */}
      {settings.customCss && <style>{settings.customCss}</style>}

      {/* 1. Top Bar */}
      <NotaryTopBar
        settings={settings}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        onOpenThemeViewer={() => setThemeCodeOpen(true)}
        onOpenGoogleIntegration={() => setGoogleIntegrationOpen(true)}
        onOpenPluginManager={() => setPluginManagerOpen(true)}
        onOpenSetupWizard={() => setSetupWizardOpen(true)}
        onOpenSystemStatus={() => setSystemStatusOpen(true)}
        onOpenShortcodes={() => setShortcodesOpen(true)}
        onOpenLicenseManager={() => setLicenseManagerOpen(true)}
      />

      {/* 2. Sticky Header */}
      <NotaryHeader
        settings={settings}
        activeNav={activeNav}
        onNavigate={handleNavigate}
        onOpenPortal={handleOpenPortal}
        onOpenPluginManager={() => setPluginManagerOpen(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1">
        {/* 3. Hero Section */}
        <NotaryHero
          settings={settings}
          onOpenPortal={handleOpenPortal}
          onNavigateToServices={() => handleNavigate('layanan')}
          onNavigateToContact={() => handleNavigate('kontak')}
          onOpenGoogleIntegration={() => setGoogleIntegrationOpen(true)}
        />

        {/* 4. Trust Indicators */}
        <NotaryTrustIndicators />

        {/* 5. Profil Notaris & PPAT */}
        <NotaryProfileSection settings={settings} />

        {/* 6. Ruang Lingkup 19+ Layanan Notaris & PPAT */}
        <NotaryServicesSection settings={settings} />

        {/* 7. Cara Kerja & SOP 4 Langkah */}
        <NotaryWorkflowSection />

        {/* 8. Kalkulator Estimasi Biaya Layanan Notaris & PPAT */}
        <NotaryCostCalculatorSection
          onNavigateToConsultation={handleNavigateToConsultation}
          onOpenGoogleHub={() => setGoogleIntegrationOpen(true)}
        />

        {/* 9. Client Portal (Tracking Berkas, Dokumen & Log Audit) */}
        <NotaryClientPortalSection onOpenGoogleIntegration={() => setGoogleIntegrationOpen(true)} />

        {/* 10. Artikel & Wawasan Edukasi Hukum */}
        <NotaryArticlesSection />

        {/* 11. Tanya Jawab (FAQ) */}
        <NotaryFaqSection />

        {/* 12. Formulir Konsultasi Terjadwal */}
        <NotaryConsultationForm
          settings={settings}
          initialService={consultationServicePrefill}
          initialNotes={consultationNotesPrefill}
        />

        {/* 13. Peta & Informasi Kontak Kantor */}
        <NotaryContactSection settings={settings} />
      </main>

      {/* 14. Semantic Footer */}
      <NotaryFooter settings={settings} onNavigate={handleNavigate} onOpenPortal={handleOpenPortal} />

      {/* Drawers & Modals */}
      <NotaryCustomizerDrawer
        isOpen={customizerOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setCustomizerOpen(false)}
      />

      <SetupWizardModal
        isOpen={setupWizardOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setSetupWizardOpen(false)}
        onOpenPluginManager={() => setPluginManagerOpen(true)}
      />

      <SystemStatusModal isOpen={systemStatusOpen} onClose={() => setSystemStatusOpen(false)} />

      <ShortcodesGutenbergModal isOpen={shortcodesOpen} onClose={() => setShortcodesOpen(false)} />

      <LicenseManagerModal
        isOpen={licenseManagerOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setLicenseManagerOpen(false)}
      />

      <NotaryThemeCodeViewer isOpen={themeCodeOpen} onClose={() => setThemeCodeOpen(false)} />

      <GoogleIntegrationModal isOpen={googleIntegrationOpen} onClose={() => setGoogleIntegrationOpen(false)} />

      <PluginManagerModal isOpen={pluginManagerOpen} onClose={() => setPluginManagerOpen(false)} />
    </div>
  );
}
