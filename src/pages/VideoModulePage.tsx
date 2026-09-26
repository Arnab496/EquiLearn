import React, { useState, useRef, useEffect } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { SignLanguageAvatar } from '../components/SignLanguageAvatar';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Captions, 
  Hand, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sliders, 
  FileText,
  Clock,
  User,
  Sparkles
} from 'lucide-react';

export const VideoModulePage: React.FC = () => {
  const { materials, activeMaterial, setActiveMaterialById } = useMaterials();
  const { settings, updateSetting } = useAccessibility();

  // Pick history video material if not active
  const videoMaterial = materials.find((m) => m.type === 'video') || activeMaterial;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(255); // 4m 15s in sec
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showSignAvatar, setShowSignAvatar] = useState(true);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const transcript = videoMaterial.transcript || [
    { start: '00:00', end: '00:15', speaker: 'Prof. Davis', text: 'Welcome everyone. In today’s session, we are analyzing the pivotal diplomacy of August 1941.' },
    { start: '00:15', end: '00:38', speaker: 'Prof. Davis', text: 'President Franklin D. Roosevelt and Prime Minister Winston Churchill secretly met aboard warships in Placentia Bay, Newfoundland.' },
    { start: '00:38', end: '01:05', speaker: 'Prof. Davis', text: 'Together, they drafted the Atlantic Charter, an extraordinary joint declaration outlining eight universal principles for a post-war world.' },
    { start: '01:05', end: '01:34', speaker: 'Prof. Davis', text: 'Key provisions included no territorial aggrandizement, self-determination of peoples, global trade access, and disarmament of aggressor nations.' },
    { start: '01:34', end: '02:05', speaker: 'Prof. Davis', text: 'This historic document later served as the cornerstone foundation for both the Declaration by United Nations in 1942 and the modern UN Charter in 1945.' },
    { start: '02:05', end: '02:40', speaker: 'Prof. Davis', text: 'Notice how the principles balanced immediate wartime solidarity with a visionary institutional blueprint for international peace and security.' }
  ];

  // Helper to convert mm:ss to seconds
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  };

  // Sync active transcript with current video time
  useEffect(() => {
    const idx = transcript.findIndex((item) => {
      const s = parseTime(item.start);
      const e = parseTime(item.end);
      return currentTime >= s && currentTime <= e;
    });
    if (idx !== -1) {
      setActiveTranscriptIndex(idx);
    }
  }, [currentTime, transcript]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Jump video to transcript timestamp
  const jumpToTimestamp = (timeStr: string) => {
    const seconds = parseTime(timeStr);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const activeCaptionText = transcript[activeTranscriptIndex]?.text || '';

  const filteredTranscript = transcript.filter((item) =>
    item.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    item.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942]">
            Synchronized Lecture Module
          </span>
          <h1 className="text-lg font-bold text-[#24324A] dark:text-white">
            {videoMaterial.title}
          </h1>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2">
          {/* Captions Toggle */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              showCaptions
                ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] border-[#2EC4B6]'
                : 'bg-white dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700'
            }`}
          >
            <Captions className="w-3.5 h-3.5" />
            <span>AI Captions: {showCaptions ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sign Language Avatar Toggle */}
          <button
            onClick={() => setShowSignAvatar(!showSignAvatar)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              showSignAvatar
                ? 'bg-[#9B8AFB]/15 text-[#9B8AFB] border-[#9B8AFB]'
                : 'bg-white dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>ASL Avatar: {showSignAvatar ? 'VISIBLE' : 'HIDDEN'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Sign Avatar on Left, Interactive Transcript on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 or 8 Cols: Video + Player Controls */}
        <div className={`${showSignAvatar ? 'lg:col-span-7' : 'lg:col-span-8'} space-y-4`}>
          {/* Video Container with Overlaid Captions */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-[#E7EAF2] dark:border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoMaterial.videoUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 255)}
              className="w-full h-full object-contain"
              playsInline
            />

            {/* Live Whisper Subtitles Overlay */}
            {showCaptions && activeCaptionText && (
              <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
                <div className="bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center max-w-xl shadow-2xl">
                  <span className="text-white text-xs sm:text-sm font-semibold tracking-wide leading-relaxed">
                    {activeCaptionText}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 space-y-3">
            {/* Progress Scrubber */}
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const newT = parseFloat(e.target.value);
                if (videoRef.current) videoRef.current.currentTime = newT;
                setCurrentTime(newT);
              }}
              className="w-full accent-[#2EC4B6] cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-[#2EC4B6] text-white hover:bg-[#25ab9e] transition shadow-xs"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <span className="font-mono text-[#64748B] font-medium">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </span>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1">
                {[0.75, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.playbackRate = s;
                      setPlaybackSpeed(s);
                    }}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      playbackSpeed === s
                        ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] font-bold'
                        : 'text-[#64748B] dark:text-slate-300 hover:text-[#24324A] dark:hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Side: ASL Sign Avatar (if enabled) */}
        {showSignAvatar && (
          <div className="lg:col-span-5 space-y-4">
            <SignLanguageAvatar currentText={activeCaptionText} />
          </div>
        )}

        {/* Right Cols: Searchable Click-to-Jump Transcript */}
        <div className="lg:col-span-12 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7EAF2] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2EC4B6]" />
                <h3 className="font-bold text-sm text-[#24324A] dark:text-white">
                  Synchronized Whisper Transcript
                </h3>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">Click any line to jump video</span>
              </div>

              {/* Transcript Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript phrases..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F7F9FC] dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 text-[#24324A] dark:text-white outline-none focus:border-[#2EC4B6]"
                />
              </div>
            </div>

            {/* Timestamped Transcript Feed */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
              {filteredTranscript.map((item, idx) => {
                const isActive = activeTranscriptIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => jumpToTimestamp(item.start)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#2EC4B6]/10 border-[#2EC4B6] shadow-xs'
                        : 'bg-[#F7F9FC] dark:bg-slate-800/60 border-[#E7EAF2] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="font-mono font-bold text-[#2EC4B6] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-[#2EC4B6]/20 text-[10px]">
                        {item.start}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-[#64748B] dark:text-slate-400 text-[11px] mb-0.5">
                        {item.speaker}
                      </div>
                      <p className={`leading-relaxed ${isActive ? 'text-[#24324A] dark:text-white font-bold' : 'text-[#64748B] dark:text-slate-300'}`}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
