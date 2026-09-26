import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Alt + P', description: 'Play or pause Text-to-Speech audio reader' },
    { key: 'Alt + D', description: 'Toggle OpenDyslexic weighted font on/off' },
    { key: 'Alt + A', description: 'Open Accessibility Preferences Suite' },
    { key: 'Alt + S', description: 'Jump to Global Search input' },
    { key: 'Esc', description: 'Close any active modal, drawer, or dialog' },
    { key: 'Tab / Shift + Tab', description: 'Navigate forward / backward through interactive controls' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="glass-card bg-[#FFFDF8] dark:bg-[#0F172A] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E7EAF2] dark:border-slate-800 overflow-hidden"
      >
        <div className="p-5 border-b border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#9B8AFB]/15 flex items-center justify-center text-[#9B8AFB]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-base font-bold text-[#24324A] dark:text-white">
                Keyboard Navigation Shortcuts
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                WCAG 2.1 Accessible Keystrokes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#24324A] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E7EAF2] dark:border-slate-800 text-xs"
            >
              <span className="text-[#24324A] dark:text-slate-300 font-medium">{s.description}</span>
              <kbd className="px-2.5 py-1 rounded-md bg-[#F7F9FC] dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 font-mono font-semibold text-[#24324A] dark:text-white shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#E7EAF2] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#24324A] text-white text-xs font-semibold hover:bg-[#1A2536] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
