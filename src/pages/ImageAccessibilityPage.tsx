import React, { useState } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Upload, 
  Copy, 
  Check, 
  Eye, 
  Hand, 
  BookOpen, 
  FileText,
  RotateCcw
} from 'lucide-react';

export const ImageAccessibilityPage: React.FC = () => {
  const { materials, activeMaterial } = useMaterials();
  const { playSpeech, stopSpeech, isSpeaking, triggerSoundCue } = useAccessibility();

  const imageMaterial = materials.find((m) => m.type === 'image') || activeMaterial;

  const [activeTab, setActiveTab] = useState<'alt' | 'detailed' | 'tactile' | 'simple'>('alt');
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const [altData, setAltData] = useState({
    altText: imageMaterial.altText || 'Convex lens ray optics diagram showing real inverted image formation.',
    detailed: imageMaterial.detailedDescription || 'A thin convex lens on a horizontal principal axis refracts three characteristic rays: a parallel ray through the focal point, a focal ray emerging parallel, and a central undeflected ray, converging to form an inverted real arrow on the right.',
    tactile: imageMaterial.tactileDescription || 'Tactile graphic guide: Place index finger on horizontal principal axis. Feel the vertical lens oval in center. Trace the three raised ray lines meeting at the inverted arrow on the right.',
    simple: 'This diagram explains how magnifying glasses bend light rays together to project an upside-down picture onto a wall or camera sensor.'
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerSoundCue('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCustomImage(base64);
      setIsAnalyzing(true);

      try {
        const res = await fetch('/api/alt-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            diagramContext: file.name
          })
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAltData({
            altText: json.data.altText,
            detailed: json.data.detailedDescription,
            tactile: json.data.tactileDescription,
            simple: json.data.simplifiedExplanation
          });
          triggerSoundCue('success');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentDescriptionText = 
    activeTab === 'alt' ? altData.altText :
    activeTab === 'detailed' ? altData.detailed :
    activeTab === 'tactile' ? altData.tactile : altData.simple;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EC4B6]">
              Multimodal Vision Accessibility
            </span>
            <h1 className="text-lg font-bold text-[#24324A] dark:text-white">
              {imageMaterial.title}
            </h1>
          </div>
        </div>

        {/* Upload Custom Diagram */}
        <label className="px-4 py-2 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom Diagram</span>
          <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
        </label>
      </div>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Diagram Display & SVG Tactile Overlay */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Original Educational Diagram
              </span>
              <span className="text-[11px] font-semibold text-[#2EC4B6] bg-[#2EC4B6]/10 px-2 py-0.5 rounded-full">
                High-Resolution
              </span>
            </div>

            {/* Diagram Visual with SVG Ray Optics overlay */}
            <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 aspect-[4/3] flex items-center justify-center border border-[#E7EAF2] dark:border-slate-800">
              {customImage ? (
                <img src={customImage} alt={altData.altText} className="w-full h-full object-contain" />
              ) : (
                /* Crisp Technical SVG Diagram of Ray Optics */
                <svg viewBox="0 0 500 300" className="w-full h-full max-h-72 p-2">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2EC4B6" />
                    </marker>
                    <marker id="redArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF6B6B" />
                    </marker>
                    <marker id="greenArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8ACB88" />
                    </marker>
                  </defs>

                  {/* Principal Axis */}
                  <line x1="20" y1="150" x2="480" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="400" y="140" fill="#64748B" fontSize="11" fontWeight="bold">Principal Axis</text>

                  {/* Convex Lens */}
                  <path d="M250,30 Q270,150 250,270 Q230,150 250,30 Z" fill="#2EC4B6" fillOpacity="0.25" stroke="#2EC4B6" strokeWidth="2.5" />
                  <line x1="250" y1="20" x2="250" y2="280" stroke="#2EC4B6" strokeWidth="1" strokeDasharray="4,4" />
                  <text x="235" y="295" fill="#2EC4B6" fontSize="11" fontWeight="bold">Convex Lens</text>

                  {/* Focal Points */}
                  <circle cx="150" cy="150" r="4" fill="#F4B942" />
                  <text x="145" y="170" fill="#F4B942" fontSize="12" fontWeight="bold">F1</text>

                  <circle cx="350" cy="150" r="4" fill="#F4B942" />
                  <text x="345" y="170" fill="#F4B942" fontSize="12" fontWeight="bold">F2</text>

                  {/* Object Arrow (Left, Upright Red) */}
                  <line x1="80" y1="150" x2="80" y2="60" stroke="#FF6B6B" strokeWidth="4" markerEnd="url(#redArrow)" />
                  <text x="50" y="55" fill="#FF6B6B" fontSize="12" fontWeight="bold">Object (do)</text>

                  {/* Light Rays */}
                  {/* Ray 1: Parallel then through F2 */}
                  <line x1="80" y1="60" x2="250" y2="60" stroke="#38BDF8" strokeWidth="2" />
                  <line x1="250" y1="60" x2="420" y2="240" stroke="#38BDF8" strokeWidth="2" />

                  {/* Ray 2: Chief ray through optical center */}
                  <line x1="80" y1="60" x2="420" y2="240" stroke="#A855F7" strokeWidth="2" />

                  {/* Ray 3: Through F1 then parallel */}
                  <line x1="80" y1="60" x2="250" y2="240" stroke="#F59E0B" strokeWidth="2" />
                  <line x1="250" y1="240" x2="420" y2="240" stroke="#F59E0B" strokeWidth="2" />

                  {/* Real Inverted Image (Right, Downward Green) */}
                  <line x1="420" y1="150" x2="420" y2="240" stroke="#8ACB88" strokeWidth="4" markerEnd="url(#greenArrow)" />
                  <text x="430" y="245" fill="#8ACB88" fontSize="12" fontWeight="bold">Real Image (di)</text>
                </svg>
              )}
            </div>

            {/* Quick Caption */}
            <p className="text-xs text-[#64748B] dark:text-slate-400 italic">
              Figure 1.2: Thin convex lens ray tracing with focal lengths equidistant from optical center.
            </p>
          </div>
        </div>

        {/* Right 6 Cols: AI Accessibility Suite */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-5">
            {/* 4 Multi-Tier Accessibility Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl border border-[#E7EAF2] dark:border-slate-700">
              <button
                onClick={() => setActiveTab('alt')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'alt'
                    ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#24324A]'
                }`}
              >
                Alt-Text
              </button>
              <button
                onClick={() => setActiveTab('detailed')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'detailed'
                    ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#24324A]'
                }`}
              >
                Visual Walkthrough
              </button>
              <button
                onClick={() => setActiveTab('tactile')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'tactile'
                    ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#24324A]'
                }`}
              >
                Tactile Guide
              </button>
              <button
                onClick={() => setActiveTab('simple')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'simple'
                    ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                    : 'text-[#64748B] hover:text-[#24324A]'
                }`}
              >
                Simplified
              </button>
            </div>

            {/* Description Body Box */}
            <div className="p-5 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/60 border border-[#E7EAF2] dark:border-slate-700 min-h-[180px] flex flex-col justify-between">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <Sparkles className="w-6 h-6 text-[#2EC4B6] animate-spin" />
                  <span className="text-xs font-bold text-[#24324A] dark:text-white">Generating Multimodal Descriptions...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#24324A] dark:text-slate-100 leading-relaxed font-medium">
                  {currentDescriptionText}
                </p>
              )}

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-[#E7EAF2] dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeech}
                      className="px-3 py-1.5 rounded-lg bg-[#FF6B6B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Audio</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => playSpeech(currentDescriptionText)}
                      className="px-3 py-1.5 rounded-lg bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read Aloud</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleCopy(currentDescriptionText)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-600 text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:text-[#24324A] dark:hover:text-white flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2EC4B6]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Key Visual Landmarks list */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Key Diagram Components:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#24324A] dark:text-slate-200">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700">
                  <span className="font-bold text-[#FF6B6B]">Object (do):</span> Upright vertical red arrow
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700">
                  <span className="font-bold text-[#8ACB88]">Real Image (di):</span> Inverted green arrow
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700">
                  <span className="font-bold text-[#F4B942]">Focal Points:</span> F1 and F2 equidistant
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700">
                  <span className="font-bold text-[#2EC4B6]">Lens Type:</span> Biconvex converging glass
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
