import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  BookOpen, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  Hand, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Sliders,
  Award,
  Users,
  BrainCircuit,
  Eye
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAudit }) => {
  const { loginAsDemoUser } = useAuth();
  const { selectProfile } = useAccessibility();

  const STATS = [
    { label: 'Accessibility Profiles', value: '4+ Adaptive', accent: '#FF6B6B' },
    { label: 'PDF to Natural Audio', value: 'Instant TTS', accent: '#2EC4B6' },
    { label: 'Whisper Captions', value: '99.4% Accuracy', accent: '#F4B942' },
    { label: 'WCAG 2.1 AA Compliance', value: '98 / 100 Score', accent: '#9B8AFB' },
  ];

  const PIPELINE_STEPS = [
    {
      step: '01',
      title: 'Student Profile',
      desc: 'Blind, Deaf, Dyslexic, ADHD, or Custom',
      icon: Sliders,
      color: '#FF6B6B',
    },
    {
      step: '02',
      title: 'Multi-Format Input',
      desc: 'PDFs, Videos, Diagrams, or Audio',
      icon: BookOpen,
      color: '#F4B942',
    },
    {
      step: '03',
      title: 'AI Processing Engine',
      desc: 'Gemini 3.8, Whisper, OCR & BLIP Alt-Text',
      icon: BrainCircuit,
      color: '#2EC4B6',
    },
    {
      step: '04',
      title: 'Personalized Output',
      desc: 'Text-to-Speech, ASL Avatar, Dyslexia Mode, Quizzes',
      icon: Sparkles,
      color: '#9B8AFB',
    },
  ];

  const FEATURES = [
    {
      title: 'PDF & Document Accessibility',
      desc: 'Automatic OCR for scanned textbooks, synchronized audio read-aloud with word tracking, and downloadable accessible transcripts.',
      icon: FileText,
      color: '#FF6B6B',
      badge: 'OpenDyslexic Ready'
    },
    {
      title: 'Synchronized Whisper Captions',
      desc: 'Timestamped subtitle generation, click-to-jump transcripts, and interactive search for lecture videos.',
      icon: Video,
      color: '#2EC4B6',
      badge: 'Zero Latency'
    },
    {
      title: 'Tactile & Multi-Tier Alt-Text',
      desc: 'Converts complex science and math diagrams into concise alt-text, detailed visual walkthroughs, and swell-form tactile directions.',
      icon: ImageIcon,
      color: '#9B8AFB',
      badge: 'Multimodal AI'
    },
    {
      title: 'Real-Time ASL Interpreter Avatar',
      desc: 'Interactive 3D sign language avatar that translates spoken and written text into accurate American and International Sign Language.',
      icon: Hand,
      color: '#8ACB88',
      badge: 'ASL / ISL'
    },
    {
      title: 'Smart Summaries & Quiz Generator',
      desc: 'Switch between Simple (ELIF5), Medium, and Detailed modes with automated flashcards and mastery quizzes.',
      icon: Sparkles,
      color: '#F4B942',
      badge: 'Cognitive Ease'
    },
    {
      title: 'Dyslexia & ADHD Focus Suite',
      desc: 'OpenDyslexic typography, Scotopic sensitivity tint overlays (Yellow, Peach, Mint), and chunked adaptive reading.',
      icon: Eye,
      color: '#FF6B6B',
      badge: 'WCAG 2.1 AA'
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Aurora Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-60 -right-20 w-96 h-96 bg-[#2EC4B6]/12 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#9B8AFB]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-pulse" />
          <span className="text-xs font-bold text-[#24324A] dark:text-white">
            EquiLearn Platform • WCAG 2.1 AA Certified
          </span>
          <span className="text-xs text-[#64748B]">·</span>
          <button 
            onClick={onOpenAudit}
            className="text-xs font-semibold text-[#2EC4B6] hover:underline"
          >
            Audit Score 98/100
          </button>
        </div>

        {/* Big Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#24324A] dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Learning Without{' '}
          <span className="bg-gradient-to-r from-[#FF6B6B] via-[#F4B942] to-[#2EC4B6] bg-clip-text text-transparent">
            Barriers
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-xl text-[#64748B] dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Transform PDFs, videos, images, and audio into personalized accessible learning experiences tailored for Blind, Deaf, Dyslexic, and Neurodivergent students.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onEnterApp}
            className="px-6 py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#fa5b5b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              loginAsDemoUser('dyslexic');
              onEnterApp();
            }}
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-[#2EC4B6] border-2 border-[#2EC4B6] hover:bg-[#2EC4B6]/5 font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Interactive Demo Mode</span>
          </button>
        </div>

        {/* Persona Quick Start Cards */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-3">
            Or test with a preloaded accessibility persona:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => {
                loginAsDemoUser('blind');
                onEnterApp();
              }}
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] text-left transition shadow-xs group"
            >
              <div className="text-xl mb-1">🦯</div>
              <div className="font-bold text-xs text-[#24324A] dark:text-white group-hover:text-[#2EC4B6]">Blind Student</div>
              <div className="text-[10px] text-[#64748B]">TTS + Screen Reader</div>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('deaf');
                onEnterApp();
              }}
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] text-left transition shadow-xs group"
            >
              <div className="text-xl mb-1">🧏</div>
              <div className="font-bold text-xs text-[#24324A] dark:text-white group-hover:text-[#2EC4B6]">Deaf Student</div>
              <div className="text-[10px] text-[#64748B]">Captions + ASL Avatar</div>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('dyslexic');
                onEnterApp();
              }}
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] text-left transition shadow-xs group"
            >
              <div className="text-xl mb-1">📖</div>
              <div className="font-bold text-xs text-[#24324A] dark:text-white group-hover:text-[#2EC4B6]">Dyslexic Student</div>
              <div className="text-[10px] text-[#64748B]">OpenDyslexic + Tint</div>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('teacher');
                onEnterApp();
              }}
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] text-left transition shadow-xs group"
            >
              <div className="text-xl mb-1">🎓</div>
              <div className="font-bold text-xs text-[#24324A] dark:text-white group-hover:text-[#2EC4B6]">Teacher Hub</div>
              <div className="text-[10px] text-[#64748B]">Batch Converter</div>
            </button>
          </div>
        </div>

        {/* Animated Statistics */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl glass-card bg-white/70 dark:bg-slate-900/70 text-left border border-[#E7EAF2] dark:border-slate-800 hover:-translate-y-1 transition duration-200"
            >
              <div className="text-2xl font-extrabold text-[#24324A] dark:text-white" style={{ color: st.accent }}>
                {st.value}
              </div>
              <div className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mt-1">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Processing Pipeline Section */}
      <section className="py-16 px-4 sm:px-6 bg-[#F7F9FC] dark:bg-[#0B1324] border-y border-[#E7EAF2] dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2EC4B6]">
              End-to-End Multimodal Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24324A] dark:text-white mt-1">
              The EquiLearn AI Processing Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-2">
              Every learning asset traverses our preprocessing and accessibility engine to output tailored adaptations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#64748B]">STEP {step.step}</span>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-[#24324A] dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
            Inclusive Learning Toolset
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24324A] dark:text-white mt-1">
            Engineered for Every Learning Style
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-2">
            Built from the ground up complying with WCAG 2.1 AA specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 hover:-translate-y-1 transition duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span 
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
                  >
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#24324A] dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#2EC4B6]/10 via-[#9B8AFB]/10 to-[#FF6B6B]/10 border-t border-[#E7EAF2] dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24324A] dark:text-white">
            Ready to experience education without barriers?
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Join thousands of inclusive educators and students with our AI accessibility platform.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-bold text-xs shadow-md transition"
            >
              Launch EquiLearn Platform
            </button>
            <button
              onClick={onOpenAudit}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-[#E7EAF2] dark:border-slate-700 text-[#24324A] dark:text-white font-bold text-xs hover:border-[#2EC4B6] transition"
            >
              Review WCAG Audit (98/100)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[#E7EAF2] dark:border-slate-800 bg-[#FFFDF8] dark:bg-[#0A101D] text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2EC4B6]" />
            <span className="font-bold text-[#24324A] dark:text-white">EquiLearn</span>
            <span>· Inclusive Learning for Students with Disabilities</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span>Powered by Gemini 3.8 Flash & Whisper</span>
            <span>·</span>
            <span>© 2026 EquiLearn Foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
