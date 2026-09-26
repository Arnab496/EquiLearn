import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityProfileType } from '../types';
import { 
  Sliders, 
  Check, 
  Type, 
  Eye, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AccessibilityProfilePage: React.FC = () => {
  const { settings, selectProfile, updateSetting, playSpeech, triggerSoundCue, resetSettings } = useAccessibility();

  const PROFILES: Array<{
    id: AccessibilityProfileType;
    label: string;
    icon: string;
    accent: string;
    description: string;
    highlights: string[];
  }> = [
    {
      id: 'Blind',
      label: 'Blind Student',
      icon: '🦯',
      accent: '#9B8AFB',
      description: 'Audio-first learning environment with automated screen-reader optimizations, detailed tactile alt-text, and auditory cues.',
      highlights: ['Automatic TTS for new materials', 'Spatial and tactile diagram descriptions', 'Screen-reader landmarks and skip links']
    },
    {
      id: 'Low Vision',
      label: 'Low Vision',
      icon: '🔍',
      accent: '#2EC4B6',
      description: 'Enlarged scalable typography, boosted high-contrast borders, magnified interactive targets, and uncluttered layout.',
      highlights: ['20px+ scaled typography', 'High-contrast 140% filter', 'Enlarged caption text and focal outlines']
    },
    {
      id: 'Deaf',
      label: 'Deaf Student',
      icon: '🧏',
      accent: '#2EC4B6',
      description: 'Visual-first presentation with Whisper synchronized lecture captions, interactive transcripts, and real-time ASL sign language avatar.',
      highlights: ['Always-on Whisper captions', '3D ASL sign language interpretation', 'Click-to-jump transcripts']
    },
    {
      id: 'Hard of Hearing',
      label: 'Hard of Hearing',
      icon: '🦻',
      accent: '#8ACB88',
      description: 'High-clarity synchronized captions combined with enhanced vocal frequencies and visual alerts.',
      highlights: ['Synchronized subtitles', 'Audio waveform visualizer', 'Sign language avatar support']
    },
    {
      id: 'Dyslexia',
      label: 'Dyslexia Accommodation',
      icon: '📖',
      accent: '#FF6B6B',
      description: 'OpenDyslexic typography with weighted bottoms to prevent rotation, Scotopic sensitivity tints (Yellow/Peach), and line spacing.',
      highlights: ['OpenDyslexic font engine', 'Soft yellow scotopic color tint', 'Interactive line focus reading ruler']
    },
    {
      id: 'ADHD',
      label: 'ADHD & Focus',
      icon: '⚡',
      accent: '#F4B942',
      description: 'Distraction-free environment with interactive line focus rulers, chunked 3-tier summaries, and mint-tinted contrast.',
      highlights: ['Line focus reading ruler (Alt+↑/↓)', 'Chunked bullet summaries', 'Mint focus overlay']
    },
    {
      id: 'Custom',
      label: 'Custom Personalized Suite',
      icon: '⚙️',
      accent: '#64748B',
      description: 'Full manual control over every visual, typographic, auditory, and cognitive parameter.',
      highlights: ['Custom font sizes and line heights', 'All 6 tint overlays', 'Adjustable TTS voice speeds']
    }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EC4B6]">
              Personalized Accommodations
            </span>
            <h1 className="text-xl font-bold text-[#24324A] dark:text-white">
              Accessibility Profile Engine
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Select or customize your profile. Changes apply instantly across the entire platform.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetSettings();
            triggerSoundCue('chime');
          }}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 text-xs font-semibold text-[#64748B] hover:text-[#24324A] flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Profile Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROFILES.map((p) => {
          const isActive = settings.profile === p.id;

          return (
            <div
              key={p.id}
              onClick={() => selectProfile(p.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-[#2EC4B6] ring-2 ring-[#2EC4B6]/20 shadow-md'
                  : 'bg-white/70 dark:bg-slate-900/60 border-[#E7EAF2] dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl" aria-hidden="true">{p.icon}</span>
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#64748B]">Click to Activate</span>
                  )}
                </div>

                <h3 className="font-bold text-base text-[#24324A] dark:text-white mb-1.5">
                  {p.label}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#E7EAF2] dark:border-slate-800 text-[11px] text-[#64748B] dark:text-slate-400">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2EC4B6] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Sample Preview Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF2] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2EC4B6]" />
            <h2 className="font-bold text-sm text-[#24324A] dark:text-white">
              Live Accessibility Adaptation Preview
            </h2>
          </div>
          <button
            onClick={() => playSpeech("Notice how letters remain stable and weighted at the bottom. Color overlays reduce visual glare and eye strain.")}
            className="px-3 py-1.5 rounded-lg bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice Synthesis</span>
          </button>
        </div>

        <div className="p-6 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/60 border border-[#E7EAF2] dark:border-slate-700 leading-relaxed text-[#24324A] dark:text-slate-100">
          <h3 className="text-base font-bold mb-2">
            Sample Paragraph: How Your Active Accommodations Adapt Text
          </h3>
          <p>
            When educational materials adapt dynamically to cognitive and sensory profiles, students experience 3x higher comprehension retention. Notice how your current font ({settings.openDyslexic ? 'OpenDyslexic' : 'Standard'}), line spacing ({settings.lineSpacing}), and scotopic color tint ({settings.colorOverlay}) work together to eliminate barriers.
          </p>
        </div>
      </div>
    </div>
  );
};
