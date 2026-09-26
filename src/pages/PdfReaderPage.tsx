import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMaterials } from '../context/MaterialsContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Bookmark, 
  Download, 
  Upload, 
  Search, 
  Type, 
  Eye, 
  Sliders, 
  FileText, 
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const PdfReaderPage: React.FC = () => {
  const { settings, updateSetting, playSpeech, stopSpeech, isSpeaking, activeWord, triggerSoundCue } = useAccessibility();
  const { activeMaterial, bookmarks, toggleBookmark, addNewMaterial } = useMaterials();

  const [activePage, setActivePage] = useState(1);
  const [totalPages] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOcrMode, setIsOcrMode] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [customFileLoaded, setCustomFileLoaded] = useState(false);

  const isBookmarked = bookmarks.includes(activeMaterial.id);
  const content = activeMaterial.content || activeMaterial.summary;

  const handleDownloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeMaterial.title.replace(/\s+/g, '_')}_Transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerSoundCue('success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setTimeout(() => {
      setOcrLoading(false);
      setCustomFileLoaded(true);
      addNewMaterial({
        id: `mat-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Custom Upload',
        type: 'pdf',
        pages: 2,
        dateAdded: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        summary: 'Extracted accessible document text with automated OCR layer.',
        readingTime: '4 min read',
        accessibleFormats: ['TTS Ready', 'Dyslexia Mode', 'Text Search'],
        content: `Document: ${file.name}\n\nAutomated OCR extraction processed successfully by Gemini Vision OCR Engine.\n\nSection 1: Executive Overview\nAccessible educational resources must provide equivalent alternatives across perceivable, operable, understandable, and robust dimensions.\n\nSection 2: Core Findings\nApplying scotopic color tints and OpenDyslexic typography reduces visual distortion for approximately 80% of readers with reading differences.`
      });
      triggerSoundCue('success');
    }, 1200);
  };

  // Render text with word highlight if TTS is playing
  const renderTextContent = () => {
    if (!content) return null;

    const paragraphs = content.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      // If search matches
      const isSearchMatch = searchTerm && para.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        <p
          key={pIdx}
          className={`leading-relaxed transition-colors duration-150 ${
            isSearchMatch ? 'bg-amber-100 dark:bg-amber-950/40 p-2 rounded-lg' : ''
          }`}
        >
          {para.split(' ').map((word, wIdx) => {
            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
            const isWordActive = isSpeaking && activeWord && cleanWord === activeWord.toLowerCase();

            return (
              <span
                key={wIdx}
                className={`transition-colors duration-75 inline-block mx-0.5 rounded px-0.5 ${
                  isWordActive ? 'bg-[#FF6B6B] text-white font-bold scale-105 shadow-xs' : ''
                }`}
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Material Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/15 text-[#FF6B6B] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#24324A] dark:text-white truncate max-w-sm sm:max-w-md">
              {activeMaterial.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
              <span>{activeMaterial.category}</span>
              <span>·</span>
              <span>Page {activePage} of {totalPages}</span>
              <span>·</span>
              <span>{activeMaterial.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-2 bg-[#F7F9FC] dark:bg-slate-800 p-1.5 rounded-xl border border-[#E7EAF2] dark:border-slate-700">
          {/* Coral Play / Teal Pause */}
          {isSpeaking ? (
            <button
              onClick={stopSpeech}
              className="px-3.5 py-1.5 rounded-lg bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              aria-label="Pause text-to-speech reading"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => playSpeech(content)}
              className="px-3.5 py-1.5 rounded-lg bg-[#FF6B6B] hover:bg-[#fa5b5b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              aria-label="Play text-to-speech reading"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Audio</span>
            </button>
          )}

          {/* Lavender Speed Selector */}
          <div className="flex items-center gap-1 pl-1">
            {[0.75, 1.0, 1.25, 1.5].map((sp) => (
              <button
                key={sp}
                onClick={() => updateSetting('readingSpeed', sp)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  settings.readingSpeed === sp
                    ? 'bg-[#9B8AFB] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#24324A]'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => {
              toggleBookmark(activeMaterial.id);
              triggerSoundCue('chime');
            }}
            className={`p-2 rounded-xl border transition ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/30 text-[#F4B942] border-[#F4B942]'
                : 'bg-white dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700 hover:text-[#24324A]'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
            aria-label="Bookmark page"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Download Transcript */}
          <button
            onClick={handleDownloadTranscript}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#64748B] border border-[#E7EAF2] dark:border-slate-700 hover:text-[#2EC4B6] transition"
            title="Download Accessible Plain Text Transcript"
            aria-label="Download transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Custom PDF Upload */}
          <label className="p-2 rounded-xl bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20 border border-[#2EC4B6]/30 cursor-pointer transition flex items-center gap-1.5 text-xs font-bold">
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">Upload PDF</span>
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Active Reading View */}
        <div className="lg:col-span-3 space-y-4">
          {/* Document In-Page Search & Dyslexia Quick Bar */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search text in document..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F7F9FC] dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 text-[#24324A] dark:text-white outline-none focus:border-[#2EC4B6]"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Dyslexia Mode Fast Toggle */}
              <button
                onClick={() => {
                  updateSetting('openDyslexic', !settings.openDyslexic);
                  triggerSoundCue();
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  settings.openDyslexic
                    ? 'bg-[#FF6B6B]/15 text-[#FF6B6B] border-[#FF6B6B]'
                    : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>OpenDyslexic: {settings.openDyslexic ? 'ON' : 'OFF'}</span>
              </button>

              {/* Line Focus Ruler Fast Toggle */}
              <button
                onClick={() => {
                  updateSetting('lineFocusRuler', !settings.lineFocusRuler);
                  triggerSoundCue();
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  settings.lineFocusRuler
                    ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] border-[#2EC4B6]'
                    : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] border-[#E7EAF2] dark:border-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Line Focus: {settings.lineFocusRuler ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Reader Document Surface */}
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-sm relative min-h-[500px]">
            {ocrLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <div className="w-8 h-8 rounded-full border-4 border-[#2EC4B6] border-t-transparent animate-spin" />
                <div className="text-sm font-bold text-[#24324A] dark:text-white">Processing Document with Gemini OCR...</div>
                <div className="text-xs text-[#64748B]">Synthesizing accessible headings and structural text hierarchy</div>
              </div>
            ) : (
              <div className="prose max-w-none text-[#24324A] dark:text-slate-100 text-sm sm:text-base space-y-6">
                {renderTextContent()}
              </div>
            )}
          </div>

          {/* Page Navigation Footer */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 text-xs">
            <button
              disabled={activePage <= 1}
              onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] hover:text-[#24324A] disabled:opacity-40 font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="font-bold text-[#24324A] dark:text-white">
              Page {activePage} of {totalPages}
            </span>

            <button
              disabled={activePage >= totalPages}
              onClick={() => setActivePage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] hover:text-[#24324A] disabled:opacity-40 font-semibold flex items-center gap-1"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Accessibility Helpers & Key Definitions */}
        <div className="space-y-4">
          {/* Quick Audio Walkthrough Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2EC4B6]/10 to-transparent bg-white dark:bg-slate-900 border border-[#2EC4B6]/30">
            <div className="flex items-center gap-2 mb-2 text-[#2EC4B6]">
              <Volume2 className="w-4 h-4" />
              <h3 className="font-bold text-xs">Audio Reader Status</h3>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {isSpeaking ? (
                <span className="text-[#FF6B6B] font-bold">Currently speaking... Word highlighting active.</span>
              ) : (
                'Press Play or hit Alt+P to listen with synchronized word-by-word highlighting.'
              )}
            </p>
          </div>

          {/* Key Definitions Drawer */}
          {activeMaterial.definitions && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7EAF2] dark:border-slate-800">
                <h3 className="font-bold text-xs text-[#24324A] dark:text-white">
                  Glossary & Definitions
                </h3>
                <span className="text-[10px] text-[#2EC4B6] font-bold">
                  {activeMaterial.definitions.length} Terms
                </span>
              </div>

              <div className="space-y-2.5">
                {activeMaterial.definitions.map((def, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 text-xs">
                    <div className="font-bold text-[#2EC4B6]">{def.term}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-slate-300 mt-0.5 leading-snug">
                      {def.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Yield Key Points */}
          {activeMaterial.keyPoints && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-xs text-[#24324A] dark:text-white">
                Core Takeaways
              </h3>
              <ul className="space-y-2 text-xs text-[#64748B] dark:text-slate-300">
                {activeMaterial.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2EC4B6] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
