import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityProfileType } from '../types';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sliders,
  LogIn,
  GraduationCap
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToHome }) => {
  const { loginWithEmail, loginWithGoogle, loginAsDemoUser, user } = useAuth();
  const { triggerSoundCue, settings } = useAccessibility();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<AccessibilityProfileType>('Dyslexia');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      triggerSoundCue('alert');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      triggerSoundCue('alert');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password, name, selectedProfile, role);
      triggerSoundCue('success');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      triggerSoundCue('alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle(selectedProfile);
      triggerSoundCue('success');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
      triggerSoundCue('alert');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSelectDemo = (persona: 'blind' | 'deaf' | 'dyslexic' | 'teacher' | 'adhd') => {
    loginAsDemoUser(persona);
    triggerSoundCue('success');
    onSuccess();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#2EC4B6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#9B8AFB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Main Card */}
        <div className="rounded-3xl glass-card bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-slate-800 shadow-2xl p-6 sm:p-10 transition-colors">
          {/* Logo & Heading */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] via-[#F4B942] to-[#2EC4B6] p-0.5 shadow-md mb-2">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-[#2EC4B6]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back to EquiLearn' : 'Create Your Accessible Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 font-medium max-w-md mx-auto">
              Empowering students with disabilities through AI-powered inclusive learning tools.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google Authentication Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl border border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0F172A] dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition cursor-pointer mb-6"
          >
            {/* Real Google Colored SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#CBD5E1] dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-[#0F172A] px-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 absolute">
              Or with email credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div 
                role="alert" 
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300"
              >
                {errorMsg}
              </div>
            )}

            {/* Name input on Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white placeholder-[#64748B] focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] outline-none text-xs sm:text-sm font-medium transition"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white placeholder-[#64748B] focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] outline-none text-xs sm:text-sm font-medium transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] text-[#2EC4B6] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white placeholder-[#64748B] focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] outline-none text-xs sm:text-sm font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign Up: Accessibility Profile preset & Role */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                    Initial Profile
                  </label>
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value as AccessibilityProfileType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white text-xs sm:text-sm font-medium focus:border-[#2EC4B6] outline-none"
                  >
                    <option value="Dyslexia">Dyslexia (OpenDyslexic)</option>
                    <option value="Blind">Blind (TTS + Screen Reader)</option>
                    <option value="Deaf">Deaf (Captions + ASL)</option>
                    <option value="Hard of Hearing">Hard of Hearing</option>
                    <option value="Low Vision">Low Vision (High Contrast)</option>
                    <option value="ADHD">ADHD (Focus Chunking)</option>
                    <option value="General">Standard General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-200 mb-1.5">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white text-xs sm:text-sm font-medium focus:border-[#2EC4B6] outline-none"
                  >
                    <option value="student">Student Learner</option>
                    <option value="teacher">Educator / Teacher Hub</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In to EquiLearn' : 'Create Free Account'}</span>
            </button>
          </form>
        </div>

        {/* Demo Personas Quick Select Box */}
        <div className="rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#CBD5E1] dark:border-slate-800 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2EC4B6]" />
              Instant Demo Personas
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">1-Click Evaluation Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemo('blind')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] text-left transition"
            >
              <span className="text-lg">🦯</span>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-1">Blind</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">TTS Audio</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemo('deaf')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] text-left transition"
            >
              <span className="text-lg">🧏</span>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-1">Deaf</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">ASL Avatar</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemo('dyslexic')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] text-left transition"
            >
              <span className="text-lg">📖</span>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-1">Dyslexic</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">OpenDyslexic</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemo('adhd')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] text-left transition"
            >
              <span className="text-lg">⚡</span>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-1">ADHD</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">Mint Focus</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemo('teacher')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] text-left transition col-span-2 sm:col-span-1"
            >
              <span className="text-lg">🎓</span>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-1">Teacher</div>
              <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">Curriculum</div>
            </button>
          </div>
        </div>

        {/* Guest Continue Footer */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSuccess}
            className="text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:underline transition"
          >
            Continue as Guest Learner →
          </button>
        </div>
      </div>
    </div>
  );
};
