import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  PieChart, 
  Activity,
  Users
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const PROFILE_DISTRIBUTION = [
    { label: 'Dyslexia & Reading Focus', percentage: 38, color: '#FF6B6B', count: '142 students' },
    { label: 'Deaf & Hard of Hearing', percentage: 26, color: '#2EC4B6', count: '98 students' },
    { label: 'Blind & Low Vision', percentage: 22, color: '#9B8AFB', count: '82 students' },
    { label: 'ADHD & Executive Focus', percentage: 14, color: '#F4B942', count: '52 students' }
  ];

  const MONTHLY_TRENDS = [
    { month: 'May', materials: 42, audioHours: 18, captions: 24 },
    { month: 'Jun', materials: 56, audioHours: 25, captions: 38 },
    { month: 'Jul', materials: 68, audioHours: 32, captions: 46 },
    { month: 'Aug', materials: 84, audioHours: 41, captions: 59 },
    { month: 'Sep', materials: 112, audioHours: 54, captions: 82 }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4B942]/15 text-[#F4B942] flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942]">
              Adaptive Telemetry
            </span>
            <h1 className="text-xl font-bold text-[#24324A] dark:text-white">
              Institutional Accessibility Analytics
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Measuring inclusivity metrics, reading retention, and profile utilization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/10 px-3 py-1.5 rounded-xl border border-[#2EC4B6]/20 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>94.2% Completion Rate</span>
          </span>
        </div>
      </div>

      {/* Grid: Bar Chart + Profile Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Materials & Audio Growth Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#24324A] dark:text-white">
                Monthly Accessibility Output
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Number of educational materials converted to accessible formats
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2EC4B6]" />
                <span className="text-[#64748B]">Materials</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#9B8AFB]" />
                <span className="text-[#64748B]">Audio Hours</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with Colorful Columns */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 border-b border-[#E7EAF2] dark:border-slate-800">
            {MONTHLY_TRENDS.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {/* Material Bar (Teal) */}
                  <div
                    className="w-5 rounded-t-lg bg-[#2EC4B6] transition-all duration-300 group-hover:opacity-90 relative"
                    style={{ height: `${(item.materials / 120) * 100}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#2EC4B6] bg-white dark:bg-slate-800 px-1 rounded shadow-xs transition-opacity">
                      {item.materials}
                    </span>
                  </div>

                  {/* Audio Bar (Lavender) */}
                  <div
                    className="w-5 rounded-t-lg bg-[#9B8AFB] transition-all duration-300 group-hover:opacity-90 relative"
                    style={{ height: `${(item.audioHours / 120) * 100}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#9B8AFB] bg-white dark:bg-slate-800 px-1 rounded shadow-xs transition-opacity">
                      {item.audioHours}h
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Profile Usage Distribution */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-sm text-[#24324A] dark:text-white">
              Accessibility Profile Utilization
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Active student demographic breakdown across 374 enrolled learners
            </p>
          </div>

          <div className="space-y-4">
            {PROFILE_DISTRIBUTION.map((dist, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#24324A] dark:text-white">{dist.label}</span>
                  <span className="font-mono font-bold" style={{ color: dist.color }}>
                    {dist.percentage}% ({dist.count})
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F7F9FC] dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dist.percentage}%`, backgroundColor: dist.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/60 text-xs text-[#64748B] dark:text-slate-300 border border-[#E7EAF2] dark:border-slate-700">
            <strong>Key Insight:</strong> Dyslexia and scotopic overlay accommodation requests rose by 45% this semester, followed by video sign-language interpreter utilization.
          </div>
        </div>
      </div>
    </div>
  );
};
