import React, { useState } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  HardDrive, 
  X,
  Sparkles,
  Download
} from 'lucide-react';

export const OfflineStatusBanner: React.FC = () => {
  const { 
    isOnline, 
    offlineSyncStatus, 
    cachedCount, 
    cacheSize, 
    materials, 
    cacheAllMaterialsOffline, 
    clearOfflineCache 
  } = useMaterials();
  const { triggerSoundCue } = useAccessibility();

  const [showManager, setShowManager] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCacheAll = async () => {
    setIsProcessing(true);
    await cacheAllMaterialsOffline();
    setIsProcessing(false);
    triggerSoundCue('success');
  };

  const handleClear = async () => {
    setIsProcessing(true);
    await clearOfflineCache();
    setIsProcessing(false);
    triggerSoundCue('alert');
  };

  return (
    <>
      {/* Offline Alert Strip (Visible when internet is disconnected) */}
      {!isOnline && (
        <div 
          role="status" 
          aria-live="polite"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-40 relative"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              You are currently offline. Full accessibility access remains active with {cachedCount} cached learning materials!
            </span>
          </div>
          <button
            onClick={() => setShowManager(true)}
            className="underline hover:no-underline text-white font-extrabold text-[11px] px-2 py-0.5 rounded bg-black/20"
          >
            Manage Offline Storage
          </button>
        </div>
      )}

      {/* Offline Storage Manager Modal */}
      {showManager && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-manager-title"
            className="glass-card bg-[#FFFDF8] dark:bg-[#0F172A] text-[#24324A] dark:text-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#2EC4B6]/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="offline-manager-title" className="text-base font-bold text-[#24324A] dark:text-white">
                    Offline Browser Storage
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    IndexedDB Cache for Accessible Learning
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManager(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#24324A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Storage Stats Box */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Cached Materials</div>
                  <div className="text-2xl font-extrabold text-[#2EC4B6]">
                    {cachedCount} <span className="text-xs text-[#64748B] font-normal">of {materials.length} stored</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Browser Storage Used</div>
                  <div className="text-base font-extrabold font-mono text-[#24324A] dark:text-white">
                    {cacheSize}
                  </div>
                </div>
              </div>

              {/* Status explanation */}
              <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
                All converted materials, OCR text layers, OpenDyslexic structures, and transcriptions are saved locally within your browser's persistent IndexedDB database. You can read, listen to, and study these materials without an active internet connection.
              </p>

              {/* Cached list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                  Cached Offline Catalog:
                </div>
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="truncate max-w-[280px]">
                      <div className="font-bold text-[#24324A] dark:text-white truncate">{m.title}</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">
                        {m.category} · {m.type.toUpperCase()} · {m.offlineSize || 'Cached'}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-[11px] text-[#2EC4B6]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={handleClear}
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cache</span>
                </button>

                <button
                  onClick={handleCacheAll}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isProcessing ? 'Caching...' : 'Sync All Offline'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
