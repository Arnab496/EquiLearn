import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings, AccessibilityProfileType, ColorOverlayType, FontSizeTier, LineSpacingTier } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  selectProfile: (profile: AccessibilityProfileType) => void;
  playSpeech: (text: string) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  activeWord: string;
  triggerSoundCue: (type?: 'chime' | 'success' | 'alert') => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  profile: 'General',
  fontSize: 'normal',
  openDyslexic: false,
  lineSpacing: 'normal',
  colorOverlay: 'none',
  readingSpeed: 1.0,
  voicePitch: 1.0,
  selectedVoice: '',
  bionicReading: false,
  highContrast: false,
  soundCues: true,
  signLanguageAvatar: false,
  screenReaderMode: false,
  reducedMotion: false,
  captionSize: 'normal',
  theme: 'light',
};

const PROFILE_PRESETS: Record<AccessibilityProfileType, Partial<AccessibilitySettings>> = {
  General: {
    ...DEFAULT_SETTINGS,
    profile: 'General',
  },
  Blind: {
    profile: 'Blind',
    screenReaderMode: true,
    soundCues: true,
    readingSpeed: 1.25,
    highContrast: true,
  },
  'Low Vision': {
    profile: 'Low Vision',
    fontSize: 'xlarge',
    lineSpacing: 'relaxed',
    highContrast: true,
    captionSize: 'large',
    soundCues: true,
  },
  Deaf: {
    profile: 'Deaf',
    signLanguageAvatar: true,
    captionSize: 'large',
    soundCues: false,
    screenReaderMode: false,
  },
  'Hard of Hearing': {
    profile: 'Hard of Hearing',
    captionSize: 'large',
    signLanguageAvatar: true,
    soundCues: true,
  },
  Dyslexia: {
    profile: 'Dyslexia',
    openDyslexic: true,
    lineSpacing: 'relaxed',
    colorOverlay: 'yellow',
    bionicReading: false,
    fontSize: 'large',
  },
  ADHD: {
    profile: 'ADHD',
    lineSpacing: 'relaxed',
    colorOverlay: 'mint',
    bionicReading: true,
    fontSize: 'normal',
    readingSpeed: 1.1,
  },
  Custom: {
    profile: 'Custom',
  },
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('equilearn_accessibility');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWord, setActiveWord] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('equilearn_accessibility', JSON.stringify(settings));
    
    // Apply classes to body
    const body = document.body;

    // Font
    if (settings.openDyslexic) {
      body.classList.add('font-opendyslexic');
    } else {
      body.classList.remove('font-opendyslexic');
    }

    // High Contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark', 'bg-[#0A101D]', 'text-slate-100');
      body.classList.remove('bg-[#FFFDF8]', 'text-[#24324A]');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark', 'bg-[#0A101D]', 'text-slate-100');
      body.classList.add('bg-[#FFFDF8]', 'text-[#24324A]');
    }

    // Font size scaling
    if (settings.fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (settings.fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    } else if (settings.fontSize === 'xxlarge') {
      root.style.fontSize = '22px';
    } else {
      root.style.fontSize = '16px';
    }

    // Line spacing
    if (settings.lineSpacing === 'relaxed') {
      body.style.lineHeight = '1.85';
      body.style.letterSpacing = '0.02em';
    } else if (settings.lineSpacing === 'loose') {
      body.style.lineHeight = '2.1';
      body.style.letterSpacing = '0.04em';
    } else {
      body.style.lineHeight = '1.6';
      body.style.letterSpacing = 'normal';
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
      profile: key === 'profile' ? (value as AccessibilityProfileType) : prev.profile === 'Custom' ? 'Custom' : prev.profile,
    }));
  };

  const selectProfile = (profile: AccessibilityProfileType) => {
    const preset = PROFILE_PRESETS[profile] || {};
    setSettings((prev) => ({
      ...prev,
      ...preset,
      profile,
    }));
    triggerSoundCue('success');
  };

  const triggerSoundCue = (type: 'chime' | 'success' | 'alert' = 'chime') => {
    if (!settings.soundCues) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.setValueAtTime(260, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // AudioContext may be restricted by autoplay policy
    }
  };

  const playSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[#*`_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = settings.readingSpeed;
    utterance.pitch = settings.voicePitch;

    // Optional voice picker
    if (settings.selectedVoice) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.name === settings.selectedVoice);
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveWord('');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveWord('');
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const spokenWord = cleanText.substring(e.charIndex, e.charIndex + (e.charLength || 6));
        setActiveWord(spokenWord);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveWord('');
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        selectProfile,
        playSpeech,
        stopSpeech,
        isSpeaking,
        activeWord,
        triggerSoundCue,
        resetSettings,
      }}
    >
      {/* Dynamic Screen Color Tint Overlay */}
      {settings.colorOverlay !== 'none' && (
        <div
          className={`fixed inset-0 pointer-events-none z-[9999] transition-colors duration-300 overlay-${settings.colorOverlay}`}
          aria-hidden="true"
        />
      )}
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
