import React, { useState, useEffect } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { MaterialsProvider } from './context/MaterialsContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { AccessibilityDrawer } from './components/AccessibilityDrawer';
import { AccessibilityAuditModal } from './components/AccessibilityAuditModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { SkipLink } from './components/SkipLink';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaterialsLibraryPage } from './pages/MaterialsLibraryPage';
import { PdfReaderPage } from './pages/PdfReaderPage';
import { VideoModulePage } from './pages/VideoModulePage';
import { ImageAccessibilityPage } from './pages/ImageAccessibilityPage';
import { AudioSignModulePage } from './pages/AudioSignModulePage';
import { SummaryQuizPage } from './pages/SummaryQuizPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { TeacherHubPage } from './pages/TeacherHubPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AccessibilityProfilePage } from './pages/AccessibilityProfilePage';
import { LoginPage } from './pages/LoginPage';

import { Sliders, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { settings, updateSetting, playSpeech, stopSpeech, isSpeaking, triggerSoundCue } = useAccessibility();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAccessibilityDrawerOpen, setIsAccessibilityDrawerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Global Keyboard Navigation Handlers (WCAG 2.1 AA)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A: Open Accessibility Drawer
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAccessibilityDrawerOpen((prev) => !prev);
        triggerSoundCue();
      }
      // Alt + D: Toggle OpenDyslexic Font
      else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        updateSetting('openDyslexic', !settings.openDyslexic);
        triggerSoundCue('success');
      }
      // Alt + P: Play / Pause Speech Reader
      else if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (isSpeaking) {
          stopSpeech();
        } else {
          playSpeech("EquiLearn adaptive reading assistant is active.");
        }
      }
      // ?: Open Keyboard Shortcuts
      else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }
      // Esc: Close any active modal
      else if (e.key === 'Escape') {
        setIsAccessibilityDrawerOpen(false);
        setIsAuditModalOpen(false);
        setIsShortcutsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, isSpeaking]);

  const renderActivePage = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onEnterApp={() => setCurrentTab('dashboard')}
            onOpenAudit={() => setIsAuditModalOpen(true)}
            onOpenLogin={() => setCurrentTab('login')}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
            onOpenAudit={() => setIsAuditModalOpen(true)}
          />
        );
      case 'materials':
        return <MaterialsLibraryPage onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'pdf':
        return <PdfReaderPage />;
      case 'video':
        return <VideoModulePage />;
      case 'image':
        return <ImageAccessibilityPage />;
      case 'audio':
        return <AudioSignModulePage />;
      case 'summary':
        return <SummaryQuizPage />;
      case 'assistant':
        return <AiAssistantPage />;
      case 'teacher':
        return <TeacherHubPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <AccessibilityProfilePage />;
      case 'login':
        return (
          <LoginPage
            onSuccess={() => setCurrentTab('dashboard')}
            onBackToHome={() => setCurrentTab('landing')}
          />
        );
      default:
        return (
          <DashboardPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
            onOpenAudit={() => setIsAuditModalOpen(true)}
          />
        );
    }
  };

  const isLanding = currentTab === 'landing';
  const isLoginPage = currentTab === 'login';

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#2EC4B6]/20">
      {/* WCAG Skip Navigation Link */}
      <SkipLink />

      {/* Offline Status & Storage Alert Strip */}
      <OfflineStatusBanner />

      {/* Top Navbar */}
      <Navbar
        onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onNavigateToLogin={() => setCurrentTab('login')}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible Sidebar (Hidden on landing & login pages) */}
        {!isLanding && !isLoginPage && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        {/* Scrollable Center Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto outline-none transition-colors"
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Accessibility Preferences Drawer */}
      <AccessibilityDrawer
        isOpen={isAccessibilityDrawerOpen}
        onClose={() => setIsAccessibilityDrawerOpen(false)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
      />

      {/* WCAG 2.1 AA Audit Report Modal */}
      <AccessibilityAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Floating Assistive Accessibility Button */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsAuditModalOpen(true)}
          title="WCAG 2.1 AA Audit Score: 98/100"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-[#2EC4B6]/40 text-[#2EC4B6] font-bold text-xs shadow-lg hover:shadow-xl transition"
        >
          <ShieldCheck className="w-4 h-4 text-[#2EC4B6]" />
          <span>98 / 100 WCAG</span>
        </button>

        <button
          onClick={() => setIsAccessibilityDrawerOpen(true)}
          title="Open Accessibility Controls (Alt+A)"
          className="p-3.5 rounded-full bg-[#2EC4B6] hover:bg-[#25ab9e] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Open accessibility suite"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <MaterialsProvider>
          <AppContent />
        </MaterialsProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
