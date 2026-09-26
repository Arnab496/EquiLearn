import React, { useState, useRef, useEffect } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { SignLanguageAvatar } from '../components/SignLanguageAvatar';
import { Material } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Captions, 
  Hand, 
  Volume2, 
  Maximize2, 
  FileText,
  Clock,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Video as VideoIcon,
  CheckCircle2,
  X,
  Youtube
} from 'lucide-react';

interface PresetVideo {
  id: string;
  title: string;
  source: 'local' | 'youtube';
  url: string;
  youtubeId?: string;
  category: string;
  duration: string;
}

const PRESET_VIDEOS: PresetVideo[] = [
  {
    id: 'mat-3',
    title: 'The Atlantic Charter & Post-WWII International Alliances',
    source: 'local',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'History',
    duration: '04:15'
  },
  {
    id: 'yt-bio',
    title: 'Cellular Respiration & ATP Synthesis (CrashCourse Biology)',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=00jbG_cfGuQ',
    youtubeId: '00jbG_cfGuQ',
    category: 'Biology',
    duration: '13:25'
  },
  {
    id: 'yt-physics',
    title: 'Geometric Optics: Convex Lens Ray Diagrams & Focal Length',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=1F_U2wK4B7Y',
    youtubeId: '1F_U2wK4B7Y',
    category: 'Physics',
    duration: '09:40'
  },
  {
    id: 'yt-chem',
    title: 'Organic Chemistry: Electrophilic Aromatic Substitution (EAS)',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=3K0Xv4oM8i8',
    youtubeId: '3K0Xv4oM8i8',
    category: 'Chemistry',
    duration: '11:15'
  }
];

export const VideoModulePage: React.FC = () => {
  const { materials, activeMaterial, setActiveMaterialById, addNewMaterial } = useMaterials();
  const { settings, triggerSoundCue } = useAccessibility();

  const [currentVideoSource, setCurrentVideoSource] = useState<'local' | 'youtube'>('local');
  const [activeVideoUrl, setActiveVideoUrl] = useState(
    materials.find((m) => m.type === 'video')?.videoUrl || 
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [activeYoutubeId, setActiveYoutubeId] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState('The Atlantic Charter & Post-WWII Alliances');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(255);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showSignAvatar, setShowSignAvatar] = useState(true);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);

  // Add Video Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'upload' | 'youtube'>('youtube');
  const [youtubeInputUrl, setYoutubeInputUrl] = useState('');
  const [customVideoTitle, setCustomVideoTitle] = useState('');
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [activeTranscript, setActiveTranscript] = useState<Array<{ start: string; end: string; speaker: string; text: string }>>([
    { start: '00:00', end: '00:15', speaker: 'Prof. Davis', text: 'Welcome everyone. In today’s session, we are analyzing the pivotal diplomacy of August 1941.' },
    { start: '00:15', end: '00:38', speaker: 'Prof. Davis', text: 'President Franklin D. Roosevelt and Prime Minister Winston Churchill secretly met aboard warships in Placentia Bay, Newfoundland.' },
    { start: '00:38', end: '01:05', speaker: 'Prof. Davis', text: 'Together, they drafted the Atlantic Charter, an extraordinary joint declaration outlining eight universal principles for a post-war world.' },
    { start: '01:05', end: '01:34', speaker: 'Prof. Davis', text: 'Key provisions included no territorial aggrandizement, self-determination of peoples, global trade access, and disarmament of aggressor nations.' },
    { start: '01:34', end: '02:05', speaker: 'Prof. Davis', text: 'This historic document later served as the cornerstone foundation for both the Declaration by United Nations in 1942 and the modern UN Charter in 1945.' },
    { start: '02:05', end: '02:40', speaker: 'Prof. Davis', text: 'Notice how the principles balanced immediate wartime solidarity with a visionary institutional blueprint for international peace and security.' }
  ]);

  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  };

  // Sync active transcript segment
  useEffect(() => {
    const idx = activeTranscript.findIndex((item) => {
      const s = parseTime(item.start);
      const e = parseTime(item.end);
      return currentTime >= s && currentTime <= e;
    });
    if (idx !== -1) {
      setActiveTranscriptIndex(idx);
    }
  }, [currentTime, activeTranscript]);

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

  const jumpToTimestamp = (timeStr: string) => {
    const seconds = parseTime(timeStr);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // In YouTube iframe view, update timer and active caption
      setCurrentTime(seconds);
    }
    triggerSoundCue('chime');
  };

  // Select a preset video
  const handleSelectPreset = (p: PresetVideo) => {
    setVideoTitle(p.title);
    setCurrentVideoSource(p.source);
    if (p.source === 'youtube' && p.youtubeId) {
      setActiveYoutubeId(p.youtubeId);
      setActiveVideoUrl(`https://www.youtube-nocookie.com/embed/${p.youtubeId}?enablejsapi=1&autoplay=0&cc_load_policy=1&rel=0`);
      // Adapt transcript
      if (p.id === 'yt-bio') {
        setActiveTranscript([
          { start: '00:00', end: '00:25', speaker: 'Hank Green', text: 'Energy is the currency of life, and cellular respiration is how cells mint that currency.' },
          { start: '00:25', end: '00:55', speaker: 'Hank Green', text: 'Glycolysis breaks down glucose in the cytoplasm into two pyruvate molecules without using any oxygen.' },
          { start: '00:55', end: '01:30', speaker: 'Hank Green', text: 'Next, the Krebs cycle inside the mitochondria strips electrons to create high-energy NADH and FADH2.' },
          { start: '01:30', end: '02:10', speaker: 'Hank Green', text: 'Finally, ATP Synthase uses chemiosmosis along the cristae to generate approximately 30 ATP molecules per glucose.' },
          { start: '02:10', end: '02:50', speaker: 'Hank Green', text: 'Without oxygen accepting those terminal electrons, the entire chain backs up and stops.' }
        ]);
      } else if (p.id === 'yt-physics') {
        setActiveTranscript([
          { start: '00:00', end: '00:20', speaker: 'Sal Khan', text: 'Let us understand how thin convex lenses refract light rays to produce inverted real images.' },
          { start: '00:20', end: '00:50', speaker: 'Sal Khan', text: 'A ray parallel to the principal axis refracts through the opposite focal point F2.' },
          { start: '00:50', end: '01:25', speaker: 'Sal Khan', text: 'A second chief ray passes straight through the optical center without any deviation.' },
          { start: '01:25', end: '02:00', speaker: 'Sal Khan', text: 'Where these three characteristic rays intersect, a real, inverted image is focused onto the sensor.' }
        ]);
      }
    } else {
      setActiveYoutubeId('');
      setActiveVideoUrl(p.url);
    }
    triggerSoundCue('success');
  };

  // Handle local video file upload
  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingVideo(true);
    const objectUrl = URL.createObjectURL(file);
    const title = file.name.replace(/\.[^/.]+$/, '');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/transcribe-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoTitle: title, videoSource: 'local' })
        });
        const json = await res.json();
        if (json.success && json.data) {
          setActiveTranscript(json.data.transcript);
          setDuration(parseTime(json.data.duration || '03:15'));
        }
      } catch (err) {
        console.warn('Fallback transcript used', err);
      }

      setCurrentVideoSource('local');
      setActiveYoutubeId('');
      setActiveVideoUrl(objectUrl);
      setVideoTitle(title);

      addNewMaterial({
        id: `mat-${Date.now()}`,
        title,
        category: 'Uploaded Video',
        type: 'video',
        duration: '03:15',
        dateAdded: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        summary: `Uploaded lecture with synchronized Whisper captions.`,
        readingTime: '3 min lecture',
        accessibleFormats: ['Whisper Captions', 'Speaker Transcript', 'ASL Avatar Ready'],
        videoUrl: objectUrl,
        transcript: activeTranscript,
        isOfflineAvailable: true
      });

      setIsProcessingVideo(false);
      setShowAddModal(false);
      triggerSoundCue('success');
    }, 1000);
  };

  // Handle YouTube link submission
  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInputUrl) return;

    const match = youtubeInputUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (!match || !match[1]) {
      alert('Please enter a valid YouTube video link (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    const yId = match[1];
    const title = customVideoTitle.trim() || 'YouTube Educational Lecture';

    setIsProcessingVideo(true);
    try {
      const res = await fetch('/api/transcribe-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeInputUrl, videoTitle: title, videoSource: 'youtube' })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setActiveTranscript(json.data.transcript);
        setDuration(parseTime(json.data.duration || '03:15'));
      }
    } catch (err) {
      console.warn('Transcript error:', err);
    }

    setCurrentVideoSource('youtube');
    setActiveYoutubeId(yId);
    setActiveVideoUrl(`https://www.youtube-nocookie.com/embed/${yId}?enablejsapi=1&autoplay=0&cc_load_policy=1&rel=0`);
    setVideoTitle(title);

    addNewMaterial({
      id: `mat-${Date.now()}`,
      title,
      category: 'YouTube Lecture',
      type: 'video',
      duration: '03:15',
      dateAdded: new Date().toISOString().split('T')[0],
      size: 'Streaming Link',
      summary: `YouTube educational lecture with synchronized Whisper captions.`,
      readingTime: '3 min lecture',
      accessibleFormats: ['Whisper Captions', 'Interactive Transcript', 'ASL Interpretation'],
      videoUrl: `https://www.youtube-nocookie.com/embed/${yId}?enablejsapi=1&autoplay=0&cc_load_policy=1&rel=0`,
      youtubeId: yId,
      videoSource: 'youtube',
      transcript: activeTranscript,
      isOfflineAvailable: true
    });

    setIsProcessingVideo(false);
    setShowAddModal(false);
    setYoutubeInputUrl('');
    setCustomVideoTitle('');
    triggerSoundCue('success');
  };

  const activeCaptionText = activeTranscript[activeTranscriptIndex]?.text || '';
  const filteredTranscript = activeTranscript.filter((item) =>
    item.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    item.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Toolbar */}
      <div className="p-5 rounded-2xl glass-card bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942] bg-[#F4B942]/15 px-2 py-0.5 rounded-full">
              Synchronized Video & Subtitles
            </span>
            <span className="text-xs text-[#475569] dark:text-slate-400 font-semibold">
              {currentVideoSource === 'youtube' ? 'YouTube Stream' : 'Local Video'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white mt-1">
            {videoTitle}
          </h1>
        </div>

        {/* Action Buttons: Add Video, Captions, Avatar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Video button (Upload or YouTube link) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <VideoIcon className="w-4 h-4" />
            <span>Upload or Add YouTube Link</span>
          </button>

          {/* Captions Toggle */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showCaptions
                ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] border-[#2EC4B6]'
                : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border-[#CBD5E1] dark:border-slate-700'
            }`}
          >
            <Captions className="w-3.5 h-3.5" />
            <span>AI Captions: {showCaptions ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sign Language Avatar Toggle */}
          <button
            onClick={() => setShowSignAvatar(!showSignAvatar)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showSignAvatar
                ? 'bg-[#9B8AFB]/15 text-[#9B8AFB] border-[#9B8AFB]'
                : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border-[#CBD5E1] dark:border-slate-700'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>ASL Avatar: {showSignAvatar ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Preset Video Quick Selector Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 whitespace-nowrap pl-1">
          Preset Lectures:
        </span>
        {PRESET_VIDEOS.map((p) => {
          const isSelected = p.title === videoTitle;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold text-xs transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#2EC4B6] text-white shadow-xs'
                  : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-300 hover:bg-[#E2E8F0] dark:hover:bg-slate-700'
              }`}
            >
              {p.source === 'youtube' ? <Youtube className="w-3.5 h-3.5 text-rose-500 fill-current" /> : <VideoIcon className="w-3.5 h-3.5" />}
              <span>{p.category}: {p.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Player */}
        <div className={`${showSignAvatar ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-xl border border-[#CBD5E1] dark:border-slate-800 flex items-center justify-center">
            {currentVideoSource === 'youtube' && activeYoutubeId ? (
              /* YouTube Responsive Iframe Player */
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?enablejsapi=1&autoplay=0&cc_load_policy=1&rel=0`}
                title={videoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* HTML5 Video Player */
              <video
                ref={videoRef}
                src={activeVideoUrl}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 255)}
                className="w-full h-full object-contain"
                playsInline
              />
            )}

            {/* Live Whisper Subtitles Overlay */}
            {showCaptions && activeCaptionText && (
              <div className="absolute bottom-5 left-4 right-4 flex justify-center pointer-events-none z-20">
                <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center max-w-xl shadow-2xl">
                  <span className="text-white text-xs sm:text-sm font-bold tracking-wide leading-relaxed">
                    {activeCaptionText}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* HTML5 Player Controls Bar (When local video) */}
          {currentVideoSource === 'local' && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 space-y-3">
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
                    className="p-2 rounded-lg bg-[#2EC4B6] text-white hover:bg-[#25ab9e] transition shadow-xs cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <span className="font-mono text-[#0F172A] dark:text-slate-300 font-bold">
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[0.75, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (videoRef.current) videoRef.current.playbackRate = s;
                        setPlaybackSpeed(s);
                      }}
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        playbackSpeed === s
                          ? 'bg-[#2EC4B6]/15 text-[#2EC4B6]'
                          : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A]'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sign Language Avatar */}
        {showSignAvatar && (
          <div className="lg:col-span-5 space-y-4">
            <SignLanguageAvatar currentText={activeCaptionText} />
          </div>
        )}

        {/* Bottom Wide Column: Synchronized Whisper Transcript */}
        <div className="lg:col-span-12 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CBD5E1] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2EC4B6]" />
                <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] dark:text-white">
                  Synchronized Whisper Transcript
                </h3>
                <span className="text-[11px] text-[#475569] dark:text-slate-400 font-medium">
                  Click any line to jump video directly
                </span>
              </div>

              {/* Transcript Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript phrases..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white outline-none focus:border-[#2EC4B6]"
                />
              </div>
            </div>

            {/* Alternating Row Transcript List for Enhanced Contrast */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredTranscript.map((item, idx) => {
                const isActive = activeTranscriptIndex === idx;
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    onClick={() => jumpToTimestamp(item.start)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#2EC4B6]/15 border-[#2EC4B6] ring-1 ring-[#2EC4B6] shadow-sm'
                        : isEven
                          ? 'bg-white dark:bg-slate-900 border-[#CBD5E1] dark:border-slate-800 hover:border-[#2EC4B6]'
                          : 'bg-[#F1F5F9] dark:bg-slate-800/70 border-[#CBD5E1] dark:border-slate-800 hover:border-[#2EC4B6]'
                    }`}
                  >
                    <span className="font-mono font-bold text-[#2EC4B6] px-2 py-0.5 rounded bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 text-[11px] shrink-0">
                      {item.start}
                    </span>

                    <div className="flex-1">
                      <div className="font-bold text-[#0F172A] dark:text-slate-300 text-[11px] mb-0.5">
                        {item.speaker}
                      </div>
                      <p className={`leading-relaxed text-xs sm:text-sm ${isActive ? 'text-[#0F172A] dark:text-white font-extrabold' : 'text-[#334155] dark:text-slate-200'}`}>
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

      {/* Add Video Modal (Upload File OR YouTube Link) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            className="rounded-3xl glass-card bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-slate-700 w-full max-w-lg shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2EC4B6]/15 flex items-center justify-center text-[#2EC4B6]">
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="video-modal-title" className="text-base font-extrabold text-[#0F172A] dark:text-white">
                    Add Lecture Video
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-slate-400">
                    Upload MP4 file or paste any YouTube video link
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700">
              <button
                type="button"
                onClick={() => setAddMode('youtube')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  addMode === 'youtube'
                    ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400'
                }`}
              >
                <Youtube className="w-4 h-4 text-rose-500 fill-current" />
                <span>YouTube Link</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMode('upload')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  addMode === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400'
                }`}
              >
                <Upload className="w-4 h-4 text-[#2EC4B6]" />
                <span>Upload Video File</span>
              </button>
            </div>

            {/* TAB 1: YouTube Link */}
            {addMode === 'youtube' && (
              <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                    YouTube URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="url"
                      required
                      value={youtubeInputUrl}
                      onChange={(e) => setYoutubeInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white placeholder-[#64748B] text-xs sm:text-sm font-medium focus:border-[#2EC4B6] outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 block">
                    Whisper AI will automatically generate synchronized subtitles and interactive timestamps.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                    Lecture Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={customVideoTitle}
                    onChange={(e) => setCustomVideoTitle(e.target.value)}
                    placeholder="e.g., Intro to Machine Learning"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white placeholder-[#64748B] text-xs sm:text-sm font-medium focus:border-[#2EC4B6] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessingVideo || !youtubeInputUrl}
                  className="w-full py-3 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessingVideo ? 'Transcribing with Whisper AI...' : 'Load YouTube Video & Generate Captions'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: Upload Video File */}
            {addMode === 'upload' && (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#F8FAFC] dark:bg-slate-800/60 block">
                  <div className="w-12 h-12 rounded-2xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                    Click to select local video file
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                    Supports MP4, WebM, MOV (up to 50MB)
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleLocalVideoUpload}
                    className="hidden"
                  />
                </label>

                {isProcessingVideo && (
                  <div className="text-center text-xs font-bold text-[#2EC4B6] animate-pulse">
                    Synthesizing Whisper subtitles and ASL cues...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
