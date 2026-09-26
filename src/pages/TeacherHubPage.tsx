import React, { useState } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  GraduationCap, 
  Upload, 
  Download, 
  CheckCircle2, 
  FileText, 
  Users, 
  Award, 
  Sparkles,
  BarChart,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const TeacherHubPage: React.FC = () => {
  const { materials, addNewMaterial } = useMaterials();
  const { triggerSoundCue } = useAccessibility();

  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const STUDENTS = [
    { name: 'Alex Chen', profile: 'Blind', completed: 14, readingSpeed: '1.25x', status: 'On Track' },
    { name: 'Maya Patel', profile: 'Deaf', completed: 19, readingSpeed: '1.0x', status: 'Advanced' },
    { name: 'Leo Morrison', profile: 'Dyslexia', completed: 22, readingSpeed: '1.0x', status: 'On Track' },
    { name: 'Samira Rao', profile: 'ADHD', completed: 16, readingSpeed: '1.1x', status: 'Needs Quiz Review' },
  ];

  const handleBatchConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionSuccess(true);
      triggerSoundCue('success');
      setTimeout(() => setConversionSuccess(false), 3000);
    }, 1500);
  };

  const handleDownloadReport = () => {
    const csvContent = "Student Name,Profile,Materials Completed,Reading Speed,Status\n" +
      STUDENTS.map(s => `"${s.name}","${s.profile}",${s.completed},"${s.readingSpeed}","${s.status}"`).join("\n");

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `EquiLearn_Class_Accessibility_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerSoundCue('success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2EC4B6]">
              Educator Command Center
            </span>
            <h1 className="text-xl font-bold text-[#24324A] dark:text-white">
              Teacher Hub & Curriculum Accessibility
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Dr. Aris Vance · Department of Accessible STEM Curriculum
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 hover:border-[#2EC4B6] text-xs font-bold text-[#24324A] dark:text-white flex items-center gap-2 shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5 text-[#2EC4B6]" />
          <span>Export Compliance Report (CSV)</span>
        </button>
      </div>

      {/* Batch Conversion Engine Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2EC4B6]/10 via-[#9B8AFB]/10 to-[#F4B942]/10 border border-[#2EC4B6]/30 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2EC4B6]" />
            <h2 className="font-bold text-sm text-[#24324A] dark:text-white">
              Automated 4-in-1 Accessible Format Generator
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#2EC4B6] bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-[#2EC4B6]/30">
            Powered by Gemini Vision & Whisper
          </span>
        </div>

        <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed max-w-3xl">
          Upload any standard syllabus, PDF lecture, or slide deck. EquiLearn automatically extracts clean OCR text, generates synchronized TTS audio, produces tactile diagram alt-text, and formulates 3-tier summaries.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleBatchConvert}
            disabled={isConverting}
            className="px-5 py-2.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>{isConverting ? 'Processing 4 Formats...' : 'Run Batch Accessibility Pipeline'}</span>
          </button>

          {conversionSuccess && (
            <span className="text-xs font-bold text-[#2EC4B6] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All 4 Formats Generated and Distributed to Student Portals!</span>
            </span>
          )}
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF2] dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-[#24324A] dark:text-white">
              Student Accommodation Roster & Usage
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Active student tracking with personalized settings verification
            </p>
          </div>
          <span className="text-xs font-bold text-[#64748B]">
            4 Active Accommodations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7EAF2] dark:border-slate-800 text-[#64748B]">
                <th className="py-2.5 font-bold">Student Name</th>
                <th className="py-2.5 font-bold">Profile</th>
                <th className="py-2.5 font-bold">Completed Lessons</th>
                <th className="py-2.5 font-bold">TTS Speed</th>
                <th className="py-2.5 font-bold">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF2] dark:divide-slate-800 font-medium">
              {STUDENTS.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#F7F9FC] dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-[#24324A] dark:text-white">{s.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#2EC4B6]/15 text-[#2EC4B6]">
                      {s.profile}
                    </span>
                  </td>
                  <td className="py-3">{s.completed} Materials</td>
                  <td className="py-3 font-mono">{s.readingSpeed}</td>
                  <td className="py-3">
                    <span className="text-[#8ACB88] font-semibold">{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
