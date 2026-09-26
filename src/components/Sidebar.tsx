import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  Sparkles, 
  Bot, 
  GraduationCap, 
  BarChart3, 
  Sliders, 
  Home,
  ChevronLeft,
  ChevronRight,
  Hand
} from 'lucide-react';

export type NavigationTab = 
  | 'landing'
  | 'dashboard'
  | 'materials'
  | 'pdf'
  | 'video'
  | 'image'
  | 'audio'
  | 'summary'
  | 'assistant'
  | 'teacher'
  | 'analytics'
  | 'profile';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const NAV_ITEMS: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    accent: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: '#2EC4B6' },
    { id: 'materials', label: 'My Materials', icon: FolderOpen, accent: '#FF6B6B' },
    { id: 'pdf', label: 'PDF & OCR Reader', icon: FileText, badge: 'Dyslexia Mode', accent: '#9B8AFB' },
    { id: 'video', label: 'Video & Captions', icon: Video, badge: 'Whisper', accent: '#F4B942' },
    { id: 'image', label: 'Diagram Alt-Text', icon: ImageIcon, badge: 'Tactile', accent: '#2EC4B6' },
    { id: 'audio', label: 'Audio & Sign Lang', icon: Hand, badge: 'ASL Avatar', accent: '#8ACB88' },
    { id: 'summary', label: 'Smart Summaries', icon: Sparkles, badge: 'Quiz', accent: '#FF6B6B' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Voice', accent: '#9B8AFB' },
    { id: 'teacher', label: 'Teacher Hub', icon: GraduationCap, accent: '#2EC4B6' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, accent: '#F4B942' },
    { id: 'profile', label: 'Accessibility Profile', icon: Sliders, accent: '#2EC4B6' },
    { id: 'landing', label: 'Landing Page', icon: Home, accent: '#64748B' },
  ];

  return (
    <aside
      aria-label="Primary Platform Navigation"
      className={`relative h-[calc(100vh-4rem)] border-r border-[#E7EAF2] dark:border-slate-800 bg-[#FFFDF8]/70 dark:bg-[#0A101D]/70 backdrop-blur-md transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                isActive
                  ? 'bg-white dark:bg-slate-800/90 text-[#24324A] dark:text-white shadow-xs border border-[#E7EAF2] dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#24324A] dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span 
                  className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#2EC4B6]' : 'text-[#64748B]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span 
                      className="px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono tracking-tight shrink-0 ml-1.5"
                      style={{
                        backgroundColor: `${item.accent}15`,
                        color: item.accent
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
            EquiLearn v2.4 (AA)
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#24324A] hover:bg-slate-100 dark:hover:bg-slate-800 transition mx-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
