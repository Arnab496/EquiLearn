import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Hand } from 'lucide-react';

interface SignLanguageAvatarProps {
  currentText?: string;
  isFloating?: boolean;
}

// Predefined sign gesture animations
const ASL_GESTURES: Record<string, { label: string; meaning: string; motion: string }> = {
  welcome: { label: 'WELCOME', meaning: 'Open hand sweeping inward towards chest with slight head bow', motion: 'sweep-in' },
  learn: { label: 'LEARN', meaning: 'Fingertips grasp upward from flat palm to forehead', motion: 'grasp-forehead' },
  biology: { label: 'BIOLOGY', meaning: 'Two B-handshapes circling each other alternatingly', motion: 'circle-alternate' },
  energy: { label: 'ENERGY', meaning: 'E-handshape moving along biceps muscle to show power', motion: 'flex-muscle' },
  equal: { label: 'EQUAL', meaning: 'Both bent hand fingertips tap together evenly', motion: 'tap-fingertips' },
  help: { label: 'HELP', meaning: 'Flat palm lifting a closed fist with thumb up', motion: 'lift-fist' },
  science: { label: 'SCIENCE', meaning: 'Both thumbs down alternating circular pouring motions', motion: 'pour-alternate' },
  history: { label: 'HISTORY', meaning: 'H-handshape tapping downward twice rhythmically', motion: 'tap-down' },
  understand: { label: 'UNDERSTAND', meaning: 'Index finger flicking up next to temple like a lightbulb', motion: 'flick-temple' },
  default: { label: 'ACTIVE LISTENING', meaning: 'Attentive open posture with responsive facial affirmation', motion: 'neutral-ready' },
};

export const SignLanguageAvatar: React.FC<SignLanguageAvatarProps> = ({ currentText = 'Welcome to inclusive learning without barriers.', isFloating = false }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeGestureKey, setActiveGestureKey] = useState<string>('welcome');
  const [avatarMode, setAvatarMode] = useState<'ASL' | 'ISL'>('ASL');
  const [animationTick, setAnimationTick] = useState(0);

  // Sync gesture with incoming text
  useEffect(() => {
    if (!currentText) return;
    const lower = currentText.toLowerCase();
    const foundKey = Object.keys(ASL_GESTURES).find((key) => key !== 'default' && lower.includes(key));
    if (foundKey) {
      setActiveGestureKey(foundKey);
    } else {
      setActiveGestureKey('learn');
    }
  }, [currentText]);

  // Animation cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimationTick((prev) => (prev + 1) % 100);
    }, 50 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const activeGesture = ASL_GESTURES[activeGestureKey] || ASL_GESTURES.default;

  // Hand position coordinates based on tick & gesture
  const handPhase = Math.sin((animationTick * Math.PI) / 25);
  const leftHandY = 190 + handPhase * 18;
  const rightHandY = 185 - handPhase * 20;
  const leftHandX = 110 + Math.cos((animationTick * Math.PI) / 25) * 12;
  const rightHandX = 190 - Math.cos((animationTick * Math.PI) / 25) * 14;

  return (
    <div className={`glass-card rounded-2xl p-4 border border-[#2EC4B6]/30 overflow-hidden relative ${isFloating ? 'shadow-2xl max-w-sm' : 'w-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF2] mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2EC4B6]/15 flex items-center justify-center text-[#2EC4B6]">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#24324A] flex items-center gap-1.5">
              Sign Language Avatar
              <span className="inline-block w-2 h-2 rounded-full bg-[#2EC4B6] animate-pulse" />
            </h3>
            <span className="text-[11px] text-[#64748B]">Real-time ASL / ISL Interpretation</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F7F9FC] p-1 rounded-lg border border-[#E7EAF2]">
          <button
            onClick={() => setAvatarMode('ASL')}
            className={`px-2 py-0.5 text-xs font-semibold rounded ${avatarMode === 'ASL' ? 'bg-white text-[#2EC4B6] shadow-sm' : 'text-[#64748B]'}`}
          >
            ASL
          </button>
          <button
            onClick={() => setAvatarMode('ISL')}
            className={`px-2 py-0.5 text-xs font-semibold rounded ${avatarMode === 'ISL' ? 'bg-white text-[#2EC4B6] shadow-sm' : 'text-[#64748B]'}`}
          >
            ISL
          </button>
        </div>
      </div>

      {/* Avatar Stage Container */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F0FAF9] to-[#E2F7F4] rounded-xl flex items-center justify-center overflow-hidden border border-[#2EC4B6]/20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2EC4B6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 2D/3D Styled Vector Signer Graphic */}
        <svg viewBox="0 0 300 300" className="w-full h-full max-h-56 drop-shadow-md">
          <defs>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFDFC4" />
              <stop offset="100%" stopColor="#F0C29E" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2EC4B6" />
              <stop offset="100%" stopColor="#1E8C82" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#31221D" />
              <stop offset="100%" stopColor="#1A120F" />
            </linearGradient>
          </defs>

          {/* Shoulders & Torso */}
          <path
            d="M70,300 C70,240 100,215 150,215 C200,215 230,240 230,300 Z"
            fill="url(#shirtGrad)"
          />
          {/* Collar */}
          <path
            d="M130,215 Q150,235 170,215 Z"
            fill="#FFF"
            opacity="0.9"
          />

          {/* Neck */}
          <rect x="138" y="165" width="24" height="40" rx="6" fill="url(#skinGrad)" />

          {/* Head & Face */}
          <ellipse cx="150" cy="120" rx="38" ry="46" fill="url(#skinGrad)" />

          {/* Hair */}
          <path
            d="M110,115 C110,65 190,65 190,115 C190,85 165,75 145,82 C125,75 110,95 110,115 Z"
            fill="url(#hairGrad)"
          />

          {/* Expressive Facial Features (Essential for ASL Grammatical Non-Manual Markers) */}
          {/* Eyebrows (animated tilt) */}
          <line
            x1="128"
            y1={98 + handPhase * 2}
            x2="142"
            y2={97 - handPhase * 1.5}
            stroke="#2B1A12"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="158"
            y1={97 - handPhase * 1.5}
            x2="172"
            y2={98 + handPhase * 2}
            stroke="#2B1A12"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <ellipse cx="135" cy="112" rx="4" ry="4" fill="#24324A" />
          <ellipse cx="165" cy="112" rx="4" ry="4" fill="#24324A" />
          <circle cx="136" cy="110" r="1.5" fill="#FFF" />
          <circle cx="166" cy="110" r="1.5" fill="#FFF" />

          {/* Nose */}
          <path d="M150,118 Q152,126 148,129 L154,129" stroke="#D39E79" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mouth / Non-manual sign articulation */}
          <path
            d={`M142,${142 + handPhase * 2} Q150,${148 - handPhase * 3} 158,${142 + handPhase * 2}`}
            stroke="#C0625B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Left Arm & Active Hand */}
          <path
            d={`M90,240 Q${leftHandX - 10},${leftHandY + 20} ${leftHandX},${leftHandY}`}
            stroke="#2EC4B6"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Hand Palm & Fingers */}
          <circle cx={leftHandX} cy={leftHandY} r="14" fill="url(#skinGrad)" stroke="#D39E79" strokeWidth="1.5" />
          <circle cx={leftHandX - 4} cy={leftHandY - 12} r="3" fill="url(#skinGrad)" />
          <circle cx={leftHandX + 1} cy={leftHandY - 14} r="3.2" fill="url(#skinGrad)" />
          <circle cx={leftHandX + 6} cy={leftHandY - 12} r="3" fill="url(#skinGrad)" />

          {/* Right Arm & Active Hand */}
          <path
            d={`M210,240 Q${rightHandX + 10},${rightHandY + 20} ${rightHandX},${rightHandY}`}
            stroke="#1E8C82"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Hand Palm & Fingers */}
          <circle cx={rightHandX} cy={rightHandY} r="14" fill="url(#skinGrad)" stroke="#D39E79" strokeWidth="1.5" />
          <circle cx={rightHandX - 6} cy={rightHandY - 12} r="3" fill="url(#skinGrad)" />
          <circle cx={rightHandX - 1} cy={rightHandY - 14} r="3.2" fill="url(#skinGrad)" />
          <circle cx={rightHandX + 4} cy={rightHandY - 12} r="3" fill="url(#skinGrad)" />
        </svg>

        {/* Current Active Sign Badge */}
        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2EC4B6]/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#2EC4B6]" />
            <span className="text-xs font-bold text-[#24324A]">{activeGesture.label}</span>
            <span className="text-[11px] text-[#64748B] truncate hidden sm:inline">({activeGesture.meaning})</span>
          </div>
          <span className="text-[10px] font-mono font-medium text-[#2EC4B6] bg-[#2EC4B6]/10 px-1.5 py-0.5 rounded">
            {speed}x
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause avatar signing' : 'Play avatar signing'}
            className="p-2 rounded-lg bg-[#2EC4B6] text-white hover:bg-[#25ab9e] transition shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={() => setAnimationTick(0)}
            aria-label="Replay current sign gesture"
            className="p-2 rounded-lg bg-[#F7F9FC] text-[#64748B] hover:text-[#24324A] border border-[#E7EAF2] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed presets */}
        <div className="flex items-center gap-1">
          {[0.75, 1.0, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs font-medium rounded ${speed === s ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] font-bold' : 'text-[#64748B] hover:bg-[#F7F9FC]'}`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Gesture Quick Select */}
        <select
          value={activeGestureKey}
          onChange={(e) => setActiveGestureKey(e.target.value)}
          aria-label="Select Sign Language Gesture"
          className="text-xs bg-[#F7F9FC] border border-[#E7EAF2] rounded-lg px-2 py-1 text-[#24324A] font-medium focus:ring-1 focus:ring-[#2EC4B6]"
        >
          {Object.keys(ASL_GESTURES).map((k) => (
            <option key={k} value={k}>
              {ASL_GESTURES[k].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
