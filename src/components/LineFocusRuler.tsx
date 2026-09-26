import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export const LineFocusRuler: React.FC = () => {
  const { settings } = useAccessibility();
  const [mouseY, setMouseY] = useState<number>(window.innerHeight / 2);

  useEffect(() => {
    if (!settings.lineFocusRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && e.altKey) {
        setMouseY((prev) => Math.min(window.innerHeight - 80, prev + 35));
      } else if (e.key === 'ArrowUp' && e.altKey) {
        setMouseY((prev) => Math.max(80, prev - 35));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings.lineFocusRuler]);

  if (!settings.lineFocusRuler) return null;

  const rulerHeight = 64; // height of the transparent reading window

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] transition-opacity duration-200" aria-hidden="true">
      {/* Top dim overlay */}
      <div
        className="absolute top-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[0.5px] transition-all duration-75"
        style={{ height: `${Math.max(0, mouseY - rulerHeight / 2)}px` }}
      />

      {/* Focus guide window */}
      <div
        className="absolute left-0 right-0 border-y-2 border-[#2EC4B6]/70 shadow-[0_0_20px_rgba(46,196,182,0.15)] bg-transparent transition-all duration-75"
        style={{
          top: `${Math.max(0, mouseY - rulerHeight / 2)}px`,
          height: `${rulerHeight}px`,
        }}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-[#2EC4B6] bg-white/90 shadow-sm border border-[#2EC4B6]/30">
          Focus Ruler (Alt+↑/↓)
        </div>
      </div>

      {/* Bottom dim overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[0.5px] transition-all duration-75"
        style={{
          top: `${Math.min(window.innerHeight, mouseY + rulerHeight / 2)}px`,
        }}
      />
    </div>
  );
};
