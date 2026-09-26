import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityProfileType, ColorOverlayType, FontSizeTier, LineSpacingTier } from '../types';
import { 
  Sliders, 
  X, 
  RotateCcw, 
  Type, 
  Eye, 
  Volume2, 
  Sparkles, 
  Glasses, 
  Check, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Palette,
  Maximize2
} from 'lucide-react';

interface AccessibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: () => void;
}

const PROFILES: Array<{ id: AccessibilityProfileType; label: string; desc: string; icon: string }> = [
  { id: 'Blind', label: 'Blind', desc: 'Screen reader, high audio feedback', icon: '🦯' },
  { id: 'Low Vision', label: 'Low Vision', desc: 'Enlarged text, high contrast', icon: '🔍' },
  { id: 'Deaf', label: 'Deaf', desc: 'Visual subtitles, sign language avatar', icon: '🧏' },
  { id: 'Hard of Hearing', label: 'Hard of Hearing', desc: 'High-clarity captions, boosted audio', icon: '🦻' },
  { id: 'Dyslexia', label: 'Dyslexia', desc: 'OpenDyslexic font, yellow tint, contrast', icon: '📖' },
  { id: 'ADHD', label: 'ADHD', desc: 'Chunked summaries, high contrast, mint tint', icon: '⚡' },
  { id: 'General', label: 'Standard', desc: 'Balanced default interface', icon: '✨' },
];

const OVERLAYS: Array<{ id: ColorOverlayType; label: string; bg: string }> = [
  { id: 'none', label: 'None', bg: 'bg-white border-dashed' },
  { id: 'yellow', label: 'Yellow (Warm)', bg: 'bg-amber-200' },
  { id: 'peach', label: 'Peach (Calm)', bg: 'bg-orange-200' },
  { id: 'mint', label: 'Mint (Focus)', bg: 'bg-emerald-200' },
  { id: 'blue', label: 'Soft Blue', bg: 'bg-sky-200' },
  { id: 'rose', label: 'Rose (Gentle)', bg: 'bg-rose-200' },
];

export const AccessibilityDrawer: React.FC<AccessibilityDrawerProps> = ({ isOpen, onClose, onOpenAudit }) => {
  const { settings, updateSetting, selectProfile, resetSettings, triggerSoundCue } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9995] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside 
        aria-label="Accessibility Preferences Panel" 
        className="relative w-full max-w-md bg-[#FFFDF8] dark:bg-[#0F172A] h-full shadow-2xl overflow-y-auto border-l border-[#E7EAF2] dark:border-slate-800 z-10 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between sticky top-0 bg-[#FFFDF8]/95 dark:bg-[#0F172A]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2EC4B6]/15 flex items-center justify-center text-[#2EC4B6]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#24324A] dark:text-white">
                Accessibility Suite
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                WCAG 2.1 AA Adaptive Profile Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetSettings();
                triggerSoundCue('chime');
              }}
              title="Reset all settings to default"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#24324A] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Reset accessibility settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#24324A] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close accessibility panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1">
          {/* Quick Profile Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Pre-Configured Profile
              </label>
              <span className="text-[11px] font-semibold text-[#2EC4B6]">
                {settings.profile} Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map((p) => {
                const isActive = settings.profile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectProfile(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition relative flex items-start gap-2.5 ${
                      isActive
                        ? 'border-[#2EC4B6] bg-[#2EC4B6]/10 text-[#24324A] dark:text-white shadow-xs'
                        : 'border-[#E7EAF2] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <span className="text-lg" aria-hidden="true">{p.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{p.label}</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400 line-clamp-1">{p.desc}</div>
                    </div>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6] absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography & Dyslexia */}
          <div className="space-y-3 pt-3 border-t border-[#E7EAF2] dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#FF6B6B]" />
              Typography & Dyslexia
            </label>

            {/* OpenDyslexic Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E7EAF2] dark:border-slate-800">
              <div>
                <div className="text-sm font-semibold text-[#24324A] dark:text-white">OpenDyslexic Font</div>
                <div className="text-xs text-[#64748B] dark:text-slate-400">Weighted bottom letters to prevent flipping</div>
              </div>
              <button
                role="switch"
                aria-checked={settings.openDyslexic}
                onClick={() => {
                  updateSetting('openDyslexic', !settings.openDyslexic);
                  triggerSoundCue();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.openDyslexic ? 'bg-[#FF6B6B]' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${settings.openDyslexic ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Font Size Selector */}
            <div>
              <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-1.5">Font Size Scaling</span>
              <div className="grid grid-cols-4 gap-1.5 bg-[#F7F9FC] dark:bg-slate-900 p-1 rounded-xl border border-[#E7EAF2] dark:border-slate-800">
                {(['normal', 'large', 'xlarge', 'xxlarge'] as FontSizeTier[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateSetting('fontSize', sz)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                      settings.fontSize === sz ? 'bg-white dark:bg-slate-800 text-[#24324A] dark:text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400'
                    }`}
                  >
                    {sz === 'xxlarge' ? '2XL' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Spacing */}
            <div>
              <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-1.5">Line Spacing</span>
              <div className="grid grid-cols-3 gap-1.5 bg-[#F7F9FC] dark:bg-slate-900 p-1 rounded-xl border border-[#E7EAF2] dark:border-slate-800">
                {(['normal', 'relaxed', 'loose'] as LineSpacingTier[]).map((sp) => (
                  <button
                    key={sp}
                    onClick={() => updateSetting('lineSpacing', sp)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                      settings.lineSpacing === sp ? 'bg-white dark:bg-slate-800 text-[#24324A] dark:text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cognitive & Focus Tools */}
          <div className="space-y-3 pt-3 border-t border-[#E7EAF2] dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#2EC4B6]" />
              Cognitive & Reading Guides
            </label>

            {/* Screen Color Tint Overlay */}
            <div>
              <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                Scotopic Sensitivity Tint Overlay
              </span>
              <div className="grid grid-cols-3 gap-2">
                {OVERLAYS.map((ol) => {
                  const isActive = settings.colorOverlay === ol.id;
                  return (
                    <button
                      key={ol.id}
                      onClick={() => {
                        updateSetting('colorOverlay', ol.id);
                        triggerSoundCue();
                      }}
                      className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                        isActive
                          ? 'border-[#2EC4B6] ring-2 ring-[#2EC4B6]/20 bg-white dark:bg-slate-800 text-[#24324A] dark:text-white'
                          : 'border-[#E7EAF2] dark:border-slate-800 hover:border-slate-300 text-[#64748B] dark:text-slate-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border border-slate-300 ${ol.bg}`} />
                      <span className="truncate">{ol.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Auditory & Visual Assist */}
          <div className="space-y-3 pt-3 border-t border-[#E7EAF2] dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#9B8AFB]" />
              Auditory & Hearing Controls
            </label>

            {/* Sign Language Avatar Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E7EAF2] dark:border-slate-800">
              <div>
                <div className="text-sm font-semibold text-[#24324A] dark:text-white">ASL Sign Language Avatar</div>
                <div className="text-xs text-[#64748B] dark:text-slate-400">Display 3D sign interpreter for video & audio</div>
              </div>
              <button
                role="switch"
                aria-checked={settings.signLanguageAvatar}
                onClick={() => {
                  updateSetting('signLanguageAvatar', !settings.signLanguageAvatar);
                  triggerSoundCue();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.signLanguageAvatar ? 'bg-[#9B8AFB]' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${settings.signLanguageAvatar ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Reading Speed Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400 mb-1">
                <span>Text-to-Speech Speed</span>
                <span className="font-mono font-bold text-[#2EC4B6]">{settings.readingSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="2.0"
                step="0.1"
                value={settings.readingSpeed}
                onChange={(e) => updateSetting('readingSpeed', parseFloat(e.target.value))}
                className="w-full accent-[#2EC4B6]"
              />
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E7EAF2] dark:border-slate-800">
              <div>
                <div className="text-sm font-semibold text-[#24324A] dark:text-white">High Contrast Filter</div>
                <div className="text-xs text-[#64748B] dark:text-slate-400">Enhance borders and text edges (140% contrast)</div>
              </div>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => {
                  updateSetting('highContrast', !settings.highContrast);
                  triggerSoundCue();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.highContrast ? 'bg-[#F4B942]' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${settings.highContrast ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer: WCAG Audit trigger */}
        <div className="p-4 border-t border-[#E7EAF2] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900">
          <button
            onClick={() => {
              onClose();
              onOpenAudit();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Inspect Live WCAG 2.1 AA Audit Report (98/100)
          </button>
        </div>
      </aside>
    </div>
  );
};
