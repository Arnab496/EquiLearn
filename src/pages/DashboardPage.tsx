import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMaterials } from '../context/MaterialsContext';
import { NavigationTab } from '../components/Sidebar';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  Play, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Hand,
  TrendingUp,
  BookOpen
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenAccessibility: () => void;
  onOpenAudit: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigate, 
  onOpenAccessibility,
  onOpenAudit 
}) => {
  const { user } = useAuth();
  const { settings, playSpeech } = useAccessibility();
  const { materials, setActiveMaterialById } = useMaterials();

  const STAT_CARDS = [
    {
      title: 'Materials Accessible',
      value: `${materials.length} Ready`,
      desc: 'PDFs, Videos, Diagrams',
      gradient: 'from-[#FF6B6B]/15 to-[#FF8E8E]/5',
      borderColor: 'border-[#FF6B6B]/30',
      textColor: 'text-[#FF6B6B]',
      icon: FileText
    },
    {
      title: 'Audio Generated',
      value: '42.5 Mins',
      desc: 'Natural Speech Synthesis',
      gradient: 'from-[#2EC4B6]/15 to-[#5BE3D7]/5',
      borderColor: 'border-[#2EC4B6]/30',
      textColor: 'text-[#2EC4B6]',
      icon: Volume2
    },
    {
      title: 'Captions Created',
      value: '18 Lectures',
      desc: 'Whisper-Synced Timestamps',
      gradient: 'from-[#F4B942]/15 to-[#F9D282]/5',
      borderColor: 'border-[#F4B942]/30',
      textColor: 'text-[#F4B942]',
      icon: Video
    },
    {
      title: 'Accessibility Score',
      value: '98 / 100',
      desc: 'WCAG 2.1 AA Compliant',
      gradient: 'from-[#9B8AFB]/15 to-[#C4BAFF]/5',
      borderColor: 'border-[#9B8AFB]/30',
      textColor: 'text-[#9B8AFB]',
      icon: ShieldCheck,
      onClick: onOpenAudit
    }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-[#F7F9FC] to-[#EFFBF9] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 border border-[#E7EAF2] dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#2EC4B6]/15 text-[#2EC4B6] mb-3">
            <span>Adaptive Mode: {settings.profile} Profile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24324A] dark:text-white tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
            {user?.primaryAssistance || 'Your accessible learning environment is active and configured to your custom preferences.'}
          </p>

          {/* Quick Action Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('pdf')}
              className="px-4 py-2 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open Biology Study Guide</span>
            </button>

            <button
              onClick={onOpenAccessibility}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-[#24324A] dark:text-white border border-[#E7EAF2] dark:border-slate-700 hover:border-[#2EC4B6] text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-[#2EC4B6]" />
              <span>Adjust Accessibility Suite</span>
            </button>
          </div>
        </div>

        {/* Decorative Floating Pill */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 p-5 rounded-2xl glass-card max-w-xs border border-[#2EC4B6]/30 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2EC4B6]/15 flex items-center justify-center text-[#2EC4B6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#24324A] dark:text-white">Active Enhancements</div>
              <div className="text-[10px] text-[#64748B]">Real-time adjustments</div>
            </div>
          </div>
          <div className="space-y-1 text-[11px] text-[#64748B] dark:text-slate-300">
            <div className="flex justify-between">
              <span>Dyslexia Font:</span>
              <span className="font-semibold text-[#24324A] dark:text-white">{settings.openDyslexic ? 'Enabled' : 'Standard'}</span>
            </div>
            <div className="flex justify-between">
              <span>Color Tint:</span>
              <span className="font-semibold capitalize text-[#24324A] dark:text-white">{settings.colorOverlay}</span>
            </div>
            <div className="flex justify-between">
              <span>TTS Voice Speed:</span>
              <span className="font-semibold text-[#24324A] dark:text-white">{settings.readingSpeed}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={stat.onClick}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-white dark:bg-slate-900/80 border ${stat.borderColor} transition shadow-xs hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 ${stat.textColor} shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#24324A] dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                {stat.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Learning Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#24324A] dark:text-white">
              Continue Learning
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Interactive materials optimized for your accessibility profile
            </p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="text-xs font-bold text-[#2EC4B6] hover:underline flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map((mat) => {
            const isPdf = mat.type === 'pdf';
            const isVideo = mat.type === 'video';
            const isImage = mat.type === 'image';
            const isAudio = mat.type === 'audio';

            const targetTab: NavigationTab = isPdf ? 'pdf' : isVideo ? 'video' : isImage ? 'image' : 'audio';

            return (
              <div
                key={mat.id}
                onClick={() => {
                  setActiveMaterialById(mat.id);
                  onNavigate(targetTab);
                }}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B]">
                      {mat.category}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {mat.readingTime || mat.duration}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#24324A] dark:text-white line-clamp-2 group-hover:text-[#2EC4B6] transition">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-2 line-clamp-2">
                    {mat.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#2EC4B6]">
                  <span className="capitalize">{mat.type} Reader</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launchpad & Accessibility Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: AI Assistant Prompt */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#9B8AFB]/10 to-transparent bg-white dark:bg-slate-900 border border-[#9B8AFB]/30 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#9B8AFB]/15 text-[#9B8AFB] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#24324A] dark:text-white">
              AI Learning Assistant (Gemini 3.8)
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
              Ask questions with your voice, simplify dense concepts, or generate flashcards in plain language.
            </p>
          </div>
          <button
            onClick={() => onNavigate('assistant')}
            className="mt-4 py-2 px-4 rounded-xl bg-[#9B8AFB] hover:bg-[#8b79f8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            Launch Assistant
          </button>
        </div>

        {/* Card 2: ASL Interpreter Avatar */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2EC4B6]/10 to-transparent bg-white dark:bg-slate-900 border border-[#2EC4B6]/30 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center mb-3">
              <Hand className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#24324A] dark:text-white">
              Sign Language Avatar (ASL/ISL)
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
              Interactive 3D animated interpreter fingerspelling and gesturing educational lecture audio.
            </p>
          </div>
          <button
            onClick={() => onNavigate('audio')}
            className="mt-4 py-2 px-4 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            Open Sign Interpreter
          </button>
        </div>

        {/* Card 3: Summary & Quiz Mode */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FF6B6B]/10 to-transparent bg-white dark:bg-slate-900 border border-[#FF6B6B]/30 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/15 text-[#FF6B6B] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#24324A] dark:text-white">
              Smart Summaries & Quizzes
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
              Explore 3-tier summaries (Simple, Medium, Detailed), key definitions, and test your knowledge.
            </p>
          </div>
          <button
            onClick={() => onNavigate('summary')}
            className="mt-4 py-2 px-4 rounded-xl bg-[#FF6B6B] hover:bg-[#fa5b5b] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            Practice Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
