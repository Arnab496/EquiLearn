import React, { useState } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { SignLanguageAvatar } from '../components/SignLanguageAvatar';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  Upload, 
  Volume2, 
  Hand, 
  Sparkles, 
  FileText,
  Clock,
  Radio
} from 'lucide-react';

export const AudioSignModulePage: React.FC = () => {
  const { materials, activeMaterial } = useMaterials();
  const { playSpeech, stopSpeech, isSpeaking, triggerSoundCue } = useAccessibility();

  const audioMaterial = materials.find((m) => m.type === 'audio') || activeMaterial;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(225); // 3m 45s
  const [isRecording, setIsRecording] = useState(false);

  const transcript = audioMaterial.audioTranscript || `Today we examine Electrophilic Aromatic Substitution, commonly abbreviated as EAS. 
Benzene is an extraordinarily stable, resonance-delocalized pi electron system. Despite its unsaturation, benzene does not readily undergo addition reactions like alkenes because addition would destroy its prized aromatic stabilization energy of 36 kcal/mol.

Instead, benzene reacts with strong electrophiles via substitution. The mechanism follows two key steps:
Step 1: The aromatic pi electron cloud attacks an activated electrophile, such as a nitronium ion (NO2+) or bromonium complex (Br+). This forms a resonance-stabilized arenium ion, also called a sigma complex or Wheland intermediate. Notice that the ring temporarily loses aromaticity in this step, making this the rate-determining endothermic step.

Step 2: A weak base deprotonates the sp3-hybridized carbon of the arenium intermediate. The electron pair from the C-H bond collapses back into the ring system, completely restoring aromatic resonance. The net result: a hydrogen atom is substituted by the electrophile, while the aromatic stability remains intact.`;

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      playSpeech(transcript);
      setIsPlaying(true);
    }
  };

  const handleRecordMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported by your browser.');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);
    triggerSoundCue('chime');

    recognition.onresult = (e: any) => {
      const spokenText = e.results[0][0].transcript;
      setIsRecording(false);
      triggerSoundCue('success');
      playSpeech(spokenText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8ACB88]/15 text-[#8ACB88] flex items-center justify-center">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ACB88]">
              Speech & Sign Language Module
            </span>
            <h1 className="text-lg font-bold text-[#24324A] dark:text-white">
              {audioMaterial.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Record Live Microphone */}
          <button
            onClick={handleRecordMic}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse border-rose-500'
                : 'bg-white dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700 hover:text-[#24324A]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? 'Listening...' : 'Live Mic to Sign'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Sign Avatar on Left, Interactive Audio Player & Transcript on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: ASL Sign Avatar Stage */}
        <div className="lg:col-span-5 space-y-4">
          <SignLanguageAvatar currentText={transcript} />
        </div>

        {/* Right 7 Cols: Audio Visualizer & Synchronized Transcript */}
        <div className="lg:col-span-7 space-y-4">
          {/* Audio Player Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${isPlaying ? 'text-[#2EC4B6] animate-pulse' : 'text-[#64748B]'}`} />
                <span className="text-xs font-bold text-[#24324A] dark:text-white">
                  Audio Stream & Waveform
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-[#64748B]">
                Duration: {audioMaterial.duration || '03:45'}
              </span>
            </div>

            {/* Simulated Animated Audio Waveform */}
            <div className="h-16 bg-[#F7F9FC] dark:bg-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-1 overflow-hidden border border-[#E7EAF2] dark:border-slate-700">
              {Array.from({ length: 40 }).map((_, idx) => {
                const height = isPlaying
                  ? Math.max(15, Math.sin(idx * 0.4 + Date.now() * 0.002) * 85 + 20)
                  : (idx % 4) * 8 + 10;

                return (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full transition-all duration-100"
                    style={{
                      height: `${height}%`,
                      backgroundColor: idx % 2 === 0 ? '#2EC4B6' : '#9B8AFB'
                    }}
                  />
                );
              })}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTogglePlay}
                className="px-4 py-2 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Audio' : 'Play Lecture'}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeech();
                  setIsPlaying(false);
                  triggerSoundCue('chime');
                }}
                className="p-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] hover:text-[#24324A] border border-[#E7EAF2] dark:border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Transcript Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E7EAF2] dark:border-slate-800 text-xs font-bold text-[#24324A] dark:text-white">
              <FileText className="w-4 h-4 text-[#8ACB88]" />
              <span>Full Lecture Transcript</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/60 text-xs leading-relaxed text-[#24324A] dark:text-slate-200 max-h-64 overflow-y-auto whitespace-pre-line font-medium">
              {transcript}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
