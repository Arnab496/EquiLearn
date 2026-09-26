import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMaterials } from '../context/MaterialsContext';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Keyboard, 
  Check, 
  ChevronDown, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  onOpenAccessibility: () => void;
  onOpenShortcuts: () => void;
  onOpenAudit: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAccessibility, 
  onOpenShortcuts, 
  onOpenAudit,
}) => {
  const { user, loginAsDemoUser, logout } = useAuth();
  const { settings, updateSetting, isSpeaking, stopSpeech, playSpeech } = useAccessibility();
  const { searchQuery, setSearchQuery, activeMaterial } = useMaterials();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Transcript Generated', desc: 'Whisper AI generated captions for Atlantic Charter video.', time: '10m ago' },
    { id: 2, title: 'Tactile Alt-Text Ready', desc: 'Swell-form guide prepared for Ray Optics diagram.', time: '1h ago' },
    { id: 3, title: 'Quiz Mastery', desc: 'You scored 100% on Cellular Respiration quiz!', time: 'Yesterday' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFDF8]/90 dark:bg-[#0A101D]/90 backdrop-blur-md border-b border-[#E7EAF2] dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand or Mobile Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B6B] via-[#F4B942] to-[#2EC4B6] p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#24324A] dark:text-white flex items-center gap-1">
                Equi<span className="text-[#2EC4B6]">Learn</span>
              </span>
              <span className="text-[10px] hidden sm:block text-[#64748B] dark:text-slate-400 font-medium -mt-1">
                Inclusive Learning Without Barriers
              </span>
            </div>
          </div>

          {/* Current Profile Pill */}
          <button
            onClick={onOpenAccessibility}
            title="Click to change accessibility profile"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/20 hover:bg-[#2EC4B6]/20 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6] animate-pulse" />
            <span>Profile: {settings.profile}</span>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accessible materials, diagrams, transcripts... (Alt+S)"
              className="w-full pl-9 pr-14 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 text-[#24324A] dark:text-white placeholder-[#64748B] focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition outline-none"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#64748B] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              Alt+S
            </kbd>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Speech Reader Button */}
          {isSpeaking ? (
            <button
              onClick={stopSpeech}
              title="Stop Reading Aloud"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold animate-pulse shadow-xs"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">Pause Speech</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeMaterial.content) {
                  playSpeech(activeMaterial.content);
                } else if (activeMaterial.summary) {
                  playSpeech(activeMaterial.summary);
                }
              }}
              title="Read Active Material Aloud (Alt+P)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#2EC4B6] hover:border-[#2EC4B6] text-xs font-semibold transition"
            >
              <Volume2 className="w-4 h-4 text-[#2EC4B6]" />
              <span className="hidden sm:inline">Read Aloud</span>
            </button>
          )}

          {/* Quick Accessibility Drawer Toggle */}
          <button
            onClick={onOpenAccessibility}
            title="Open Accessibility Suite (Alt+A)"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#2EC4B6] hover:border-[#2EC4B6] transition"
            aria-label="Open accessibility settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* WCAG Audit Quick Icon */}
          <button
            onClick={onOpenAudit}
            title="View WCAG 2.1 AA Audit Report"
            className="hidden sm:flex p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#2EC4B6] hover:border-[#2EC4B6] transition"
            aria-label="Open accessibility audit report"
          >
            <ShieldCheck className="w-4 h-4 text-[#2EC4B6]" />
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Navigation Shortcuts (?)"
            className="hidden sm:flex p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#2EC4B6] hover:border-[#2EC4B6] transition"
            aria-label="Open keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#F4B942] transition"
            aria-label="Toggle light or dark theme"
          >
            {settings.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700 hover:text-[#24324A] relative transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FF6B6B] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-[#E7EAF2] dark:border-slate-800 p-4 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E7EAF2] dark:border-slate-800">
                  <span className="text-xs font-bold text-[#24324A] dark:text-white">Notifications</span>
                  <span className="text-[10px] text-[#2EC4B6] font-semibold">3 Unread</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/60 text-xs">
                      <div className="font-semibold text-[#24324A] dark:text-white">{n.title}</div>
                      <div className="text-[11px] text-[#64748B] dark:text-slate-400">{n.desc}</div>
                      <div className="text-[9px] text-[#94a3b8] mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 hover:border-[#2EC4B6] transition"
              aria-label="User account menu"
            >
              <img
                src={user?.avatar || DEMO_USERS.dyslexic.avatar}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-xs font-bold text-[#24324A] dark:text-white hidden sm:block max-w-[100px] truncate">
                {user?.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-[#E7EAF2] dark:border-slate-800 p-3 z-50">
                <div className="p-2 border-b border-[#E7EAF2] dark:border-slate-800 mb-2">
                  <div className="font-bold text-xs text-[#24324A] dark:text-white">{user?.name}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{user?.email}</div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-[#2EC4B6]/15 text-[#2EC4B6] text-[10px] font-bold inline-block">
                    {user?.profileType} Profile Active
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-[10px] uppercase font-bold text-[#94a3b8] px-2 mb-1">
                    Switch Demo Persona:
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        loginAsDemoUser('blind');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-[#F7F9FC] dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Alex Chen (Blind Student)</span>
                      {user?.profileType === 'Blind' && <Check className="w-3 h-3 text-[#2EC4B6]" />}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemoUser('deaf');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-[#F7F9FC] dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Maya Patel (Deaf Student)</span>
                      {user?.profileType === 'Deaf' && <Check className="w-3 h-3 text-[#2EC4B6]" />}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemoUser('dyslexic');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-[#F7F9FC] dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Leo Morrison (Dyslexic)</span>
                      {user?.profileType === 'Dyslexia' && <Check className="w-3 h-3 text-[#2EC4B6]" />}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemoUser('teacher');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-[#F7F9FC] dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Dr. Aris Vance (Teacher Hub)</span>
                      {user?.role === 'teacher' && <Check className="w-3 h-3 text-[#2EC4B6]" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7EAF2] dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#FF6B6B] hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Guest Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
