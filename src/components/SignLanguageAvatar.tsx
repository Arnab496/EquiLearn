import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Hand, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ChevronRight, 
  Sliders, 
  Eye, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface SignLanguageAvatarProps {
  currentText?: string;
  isFloating?: boolean;
}

interface GestureDetail {
  label: string;
  category: string;
  meaning: string;
  handshape: string;
  location: string;
  movement: string;
  arrowPath: string;
  leftHandCoords: { x: number; y: number; rx?: number; ry?: number };
  rightHandCoords: { x: number; y: number; rx?: number; ry?: number };
  facialExpression: 'neutral' | 'question' | 'nod' | 'focus';
}

const EXTENDED_GESTURES: Record<string, GestureDetail> = {
  welcome: {
    label: 'WELCOME',
    category: 'Social & Greeting',
    meaning: 'Open dominant hand sweeps inward toward the center chest with welcoming posture',
    handshape: 'Flat open 5-handshape (fingers together)',
    location: 'Starts in front of body, sweeps inward',
    movement: 'Smooth inward arch toward chest',
    arrowPath: 'M 210,170 Q 180,185 150,195',
    leftHandCoords: { x: 105, y: 195 },
    rightHandCoords: { x: 165, y: 175 },
    facialExpression: 'nod'
  },
  learn: {
    label: 'LEARN',
    category: 'Academic Core',
    meaning: 'Fingertips grasp information upward from flat non-dominant palm to forehead temple',
    handshape: 'Open palm transforms into closed grasping fingertips',
    location: 'From non-dominant palm up to forehead',
    movement: 'Direct upward vertical lift into forehead',
    arrowPath: 'M 140,210 Q 155,160 160,110',
    leftHandCoords: { x: 125, y: 215 },
    rightHandCoords: { x: 168, y: 115 },
    facialExpression: 'focus'
  },
  science: {
    label: 'SCIENCE',
    category: 'STEM Concept',
    meaning: 'Both thumbs-down fist handshapes alternate circular pouring motions like beakers',
    handshape: 'A-handshapes with thumbs extended downward',
    location: 'Mid-chest neutral space',
    movement: 'Alternating vertical circles pouring inward',
    arrowPath: 'M 120,180 A 15,15 0 1,0 120,210',
    leftHandCoords: { x: 110, y: 185 },
    rightHandCoords: { x: 190, y: 195 },
    facialExpression: 'neutral'
  },
  biology: {
    label: 'BIOLOGY',
    category: 'STEM Concept',
    meaning: 'Two B-handshapes (open 4 fingers, thumb folded across palm) circle each other',
    handshape: 'B-handshape (flat 4 fingers up, thumb in)',
    location: 'Chest area, parallel hands',
    movement: 'Alternating forward orbital circles',
    arrowPath: 'M 180,185 A 18,18 0 1,0 180,215',
    leftHandCoords: { x: 115, y: 190 },
    rightHandCoords: { x: 185, y: 180 },
    facialExpression: 'focus'
  },
  energy: {
    label: 'ENERGY',
    category: 'STEM Concept',
    meaning: 'E-handshape slides down along biceps of dominant arm to emphasize power',
    handshape: 'E-handshape (curved fingers touching thumb)',
    location: 'Starting on shoulder down to elbow',
    movement: 'Firm downward stroke along arm muscle',
    arrowPath: 'M 100,160 L 130,220',
    leftHandCoords: { x: 95, y: 220 },
    rightHandCoords: { x: 120, y: 175 },
    facialExpression: 'focus'
  },
  equal: {
    label: 'EQUAL',
    category: 'Mathematics',
    meaning: 'Both bent hand fingertips tap together evenly horizontally',
    handshape: 'Bent open fingers pointing forward',
    location: 'Center chest',
    movement: 'Tap fingertips together twice',
    arrowPath: 'M 125,185 L 145,185 M 175,185 L 155,185',
    leftHandCoords: { x: 135, y: 185 },
    rightHandCoords: { x: 165, y: 185 },
    facialExpression: 'neutral'
  },
  help: {
    label: 'HELP',
    category: 'Assistance',
    meaning: 'Flat palm lifts a closed fist with thumb up directly upward',
    handshape: 'Non-dominant flat palm, dominant thumbs-up A-fist',
    location: 'Starts waist level, lifts to mid-chest',
    movement: 'Vertical upward supportive lift',
    arrowPath: 'M 150,225 L 150,175',
    leftHandCoords: { x: 145, y: 215 },
    rightHandCoords: { x: 155, y: 185 },
    facialExpression: 'nod'
  },
  understand: {
    label: 'UNDERSTAND',
    category: 'Cognitive',
    meaning: 'Index finger flicks upward beside the temple like an illuminating lightbulb',
    handshape: 'S-fist to flicking 1-index finger',
    location: 'Beside temple / eye level',
    movement: 'Snappy upward index flick',
    arrowPath: 'M 185,130 L 185,100',
    leftHandCoords: { x: 110, y: 210 },
    rightHandCoords: { x: 180, y: 105 },
    facialExpression: 'nod'
  },
  question: {
    label: 'QUESTION',
    category: 'Interactive',
    meaning: 'Index finger traces a question mark in the air and curls forward with furrowed brows',
    handshape: '1-finger curling into X-hook shape',
    location: 'In front of face',
    movement: 'Traces curve then curls down',
    arrowPath: 'M 160,120 Q 175,125 165,145 L 165,155',
    leftHandCoords: { x: 115, y: 200 },
    rightHandCoords: { x: 165, y: 140 },
    facialExpression: 'question'
  },
  read: {
    label: 'READ',
    category: 'Study Habit',
    meaning: 'V-fingers (eyes) scan downward across the open palm page like reading lines',
    handshape: 'V-handshape (index & middle like scanning eyes)',
    location: 'Across non-dominant palm',
    movement: 'Scanning downward zig-zag over palm',
    arrowPath: 'M 150,160 L 150,210',
    leftHandCoords: { x: 130, y: 205 },
    rightHandCoords: { x: 165, y: 170 },
    facialExpression: 'focus'
  }
};

export const SignLanguageAvatar: React.FC<SignLanguageAvatarProps> = ({ 
  currentText = 'Welcome to inclusive learning without barriers.', 
  isFloating = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeGestureKey, setActiveGestureKey] = useState<string>('welcome');
  const [avatarMode, setAvatarMode] = useState<'ASL' | 'ISL'>('ASL');
  const [isMirrorView, setIsMirrorView] = useState(false);
  const [showMotionGuide, setShowMotionGuide] = useState(true);
  const [animationTick, setAnimationTick] = useState(0);

  // Sync gesture with incoming text
  useEffect(() => {
    if (!currentText) return;
    const lower = currentText.toLowerCase();
    const foundKey = Object.keys(EXTENDED_GESTURES).find((key) => lower.includes(key));
    if (foundKey) {
      setActiveGestureKey(foundKey);
    }
  }, [currentText]);

  // Smooth animation cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimationTick((prev) => (prev + 1) % 100);
    }, Math.max(16, Math.floor(40 / speed)));
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const activeGesture = EXTENDED_GESTURES[activeGestureKey] || EXTENDED_GESTURES.welcome;

  // Responsive hand wave calculation
  const oscillation = Math.sin((animationTick * Math.PI) / 25);
  const leftX = activeGesture.leftHandCoords.x + Math.cos((animationTick * Math.PI) / 25) * 6;
  const leftY = activeGesture.leftHandCoords.y + oscillation * 8;
  const rightX = activeGesture.rightHandCoords.x - Math.cos((animationTick * Math.PI) / 25) * 8;
  const rightY = activeGesture.rightHandCoords.y - oscillation * 10;

  return (
    <div className={`glass-card rounded-2xl p-4 sm:p-5 border border-[#2EC4B6]/30 overflow-hidden relative transition-all ${isFloating ? 'shadow-2xl max-w-sm' : 'w-full'}`}>
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-slate-800 gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2EC4B6]/15 flex items-center justify-center text-[#2EC4B6]">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
              ASL / ISL Sign Interpreter
              <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-pulse" />
            </h3>
            <span className="text-[11px] text-[#475569] dark:text-slate-400 font-medium">
              Synchronized 3D Animated Signing Engine
            </span>
          </div>
        </div>

        {/* View Options: ASL/ISL & Mirror View */}
        <div className="flex items-center gap-1.5">
          {/* Mirror toggle */}
          <button
            onClick={() => setIsMirrorView(!isMirrorView)}
            title="Toggle Learner Mirror View (Flips avatar horizontally so you can mimic directly)"
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
              isMirrorView
                ? 'bg-[#9B8AFB]/15 text-[#9B8AFB] border-[#9B8AFB]'
                : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border-[#CBD5E1] dark:border-slate-700'
            }`}
          >
            {isMirrorView ? '🪞 Mirror ON' : 'Front View'}
          </button>

          {/* ASL / ISL */}
          <div className="flex items-center bg-[#F1F5F9] dark:bg-slate-800 p-0.5 rounded-lg border border-[#CBD5E1] dark:border-slate-700">
            <button
              onClick={() => setAvatarMode('ASL')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition ${
                avatarMode === 'ASL' 
                  ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs' 
                  : 'text-[#64748B] dark:text-slate-400'
              }`}
            >
              ASL
            </button>
            <button
              onClick={() => setAvatarMode('ISL')}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md transition ${
                avatarMode === 'ISL' 
                  ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs' 
                  : 'text-[#64748B] dark:text-slate-400'
              }`}
            >
              ISL
            </button>
          </div>
        </div>
      </div>

      {/* Main Avatar Stage */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F0FAF9] via-[#E6F8F5] to-[#D5F3EE] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-[#2EC4B6]/25 shadow-inner">
        {/* Subtle coordinate grid background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2EC4B6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Vector Signer Graphic (Supports Mirror View transformation) */}
        <div className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${isMirrorView ? 'scale-x-[-1]' : ''}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full max-h-64 drop-shadow-lg">
            <defs>
              <linearGradient id="avatarSkin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE0B2" />
                <stop offset="100%" stopColor="#FFCC80" />
              </linearGradient>
              <linearGradient id="avatarShirt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2EC4B6" />
                <stop offset="100%" stopColor="#1B877D" />
              </linearGradient>
              <linearGradient id="avatarHair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3E2723" />
                <stop offset="100%" stopColor="#1B0000" />
              </linearGradient>
              <filter id="glow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2EC4B6" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Trajectory Motion Arrow Guide */}
            {showMotionGuide && activeGesture.arrowPath && (
              <path
                d={activeGesture.arrowPath}
                stroke="#FF6B6B"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                fill="none"
                opacity="0.8"
                className="animate-pulse"
              />
            )}

            {/* Torso & Shoulders */}
            <path
              d="M65,300 C65,235 95,210 150,210 C205,210 235,235 235,300 Z"
              fill="url(#avatarShirt)"
            />
            {/* White Collar */}
            <path d="M130,210 Q150,230 170,210 Z" fill="#FFFFFF" opacity="0.95" />

            {/* Neck */}
            <rect x="138" y="165" width="24" height="42" rx="6" fill="url(#avatarSkin)" />

            {/* Head & Face */}
            <ellipse cx="150" cy="122" rx="38" ry="46" fill="url(#avatarSkin)" filter="url(#glow)" />

            {/* Hair */}
            <path
              d="M110,118 C110,65 190,65 190,118 C190,88 165,76 145,82 C125,76 110,98 110,118 Z"
              fill="url(#avatarHair)"
            />

            {/* Non-manual facial markers based on gesture */}
            {/* Eyebrows */}
            <line
              x1="128"
              y1={activeGesture.facialExpression === 'question' ? 95 : 99 + oscillation * 2}
              x2="142"
              y2={activeGesture.facialExpression === 'question' ? 98 : 98 - oscillation * 1.5}
              stroke="#2B1A12"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="158"
              y1={activeGesture.facialExpression === 'question' ? 98 : 98 - oscillation * 1.5}
              x2="172"
              y2={activeGesture.facialExpression === 'question' ? 95 : 99 + oscillation * 2}
              stroke="#2B1A12"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Eyes */}
            <ellipse cx="135" cy="114" rx="4.5" ry="4.5" fill="#1E293B" />
            <ellipse cx="165" cy="114" rx="4.5" ry="4.5" fill="#1E293B" />
            <circle cx="136" cy="112" r="1.5" fill="#FFFFFF" />
            <circle cx="166" cy="112" r="1.5" fill="#FFFFFF" />

            {/* Nose */}
            <path d="M150,120 Q152,128 147,131 L153,131" stroke="#D39E79" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Mouth (articulating gesture meaning) */}
            <path
              d={`M142,${144 + oscillation * 2} Q150,${150 - oscillation * 2} 158,${144 + oscillation * 2}`}
              stroke="#C0625B"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Left Arm & Forearm */}
            <path
              d={`M90,240 Q${leftX - 15},${leftY + 25} ${leftX},${leftY}`}
              stroke="#2EC4B6"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Palm & Fingers */}
            <circle cx={leftX} cy={leftY} r="14" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1.5" />
            {/* Labeled Digits */}
            <circle cx={leftX - 5} cy={leftY - 12} r="3.2" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={leftX} cy={leftY - 15} r="3.5" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={leftX + 5} cy={leftY - 13} r="3.2" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={leftX + 9} cy={leftY - 7} r="3" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />

            {/* Right Arm & Forearm */}
            <path
              d={`M210,240 Q${rightX + 15},${rightY + 25} ${rightX},${rightY}`}
              stroke="#1B877D"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Palm & Fingers */}
            <circle cx={rightX} cy={rightY} r="14" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1.5" />
            {/* Right Digits */}
            <circle cx={rightX - 9} cy={rightY - 7} r="3" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={rightX - 5} cy={rightY - 13} r="3.2" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={rightX} cy={rightY - 15} r="3.5" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
            <circle cx={rightX + 5} cy={rightY - 12} r="3.2" fill="url(#avatarSkin)" stroke="#D39E79" strokeWidth="1" />
          </svg>
        </div>

        {/* Floating Active Sign Tag */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-xl border border-[#2EC4B6]/30 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6] animate-ping" />
          <span className="text-xs font-extrabold text-[#0F172A] dark:text-white tracking-wide">
            {activeGesture.label}
          </span>
          <span className="text-[10px] text-[#2EC4B6] font-semibold bg-[#2EC4B6]/10 px-1.5 py-0.5 rounded">
            {activeGesture.category}
          </span>
        </div>

        {/* Speed indicator overlay */}
        <div className="absolute top-3 right-3 text-[11px] font-mono font-bold text-[#0F172A] dark:text-white bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-lg border border-[#CBD5E1] dark:border-slate-800">
          Speed: {speed}x
        </div>
      </div>

      {/* Easy-To-Understand Instruction Callout */}
      <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-[#CBD5E1] dark:border-slate-700 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[#0F172A] dark:text-white font-bold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2EC4B6]" />
            How to Sign "{activeGesture.label}":
          </span>
          <span className="text-[10px] text-[#475569] dark:text-slate-400 font-normal">
            Step-by-Step Visual Guide
          </span>
        </div>
        <p className="text-[#334155] dark:text-slate-300 text-[11px] leading-relaxed font-medium">
          {activeGesture.meaning}
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-semibold text-[#475569] dark:text-slate-400">
          <div><span className="text-[#0F172A] dark:text-slate-200">Handshape:</span> {activeGesture.handshape}</div>
          <div><span className="text-[#0F172A] dark:text-slate-200">Movement:</span> {activeGesture.movement}</div>
        </div>
      </div>

      {/* Quick Playback & Speed Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause sign animation' : 'Play sign animation'}
            className="px-3 py-1.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Sign'}</span>
          </button>

          <button
            onClick={() => setAnimationTick(0)}
            title="Replay gesture animation from start"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slow-Motion & Speeds */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-slate-800 p-0.5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 text-xs">
          {[0.5, 0.75, 1.0, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition ${
                speed === s 
                  ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs' 
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
              }`}
            >
              {s === 0.5 ? '0.5x (Slow)' : `${s}x`}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Click Interactive Sign Library Chips */}
      <div className="mt-3 pt-3 border-t border-[#CBD5E1] dark:border-slate-800">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2">
          Click any word to practice sign:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(EXTENDED_GESTURES).map((key) => {
            const isSelected = activeGestureKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveGestureKey(key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition capitalize ${
                  isSelected
                    ? 'bg-[#2EC4B6] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-300 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6]'
                }`}
              >
                {EXTENDED_GESTURES[key].label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
