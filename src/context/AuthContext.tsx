import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccessibilityProfileType } from '../types';
import { useAccessibility } from './AccessibilityContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAsDemoUser: (userKey: 'blind' | 'deaf' | 'dyslexic' | 'teacher' | 'adhd') => void;
  loginWithEmail: (email: string, name: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  switchProfile: (profileType: AccessibilityProfileType) => void;
}

export const DEMO_USERS: Record<string, User> = {
  blind: {
    id: 'user-blind',
    name: 'Alex Chen',
    email: 'alex.chen@equilearn.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    profileType: 'Blind',
    primaryAssistance: 'High-Fidelity Text-to-Speech & Screen Reader Optimized Navigation',
    stats: {
      materialsCompleted: 14,
      hoursLearned: 28.5,
      quizzesMastered: 9,
    },
  },
  deaf: {
    id: 'user-deaf',
    name: 'Maya Patel',
    email: 'maya.patel@equilearn.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    profileType: 'Deaf',
    primaryAssistance: 'Synchronized Whisper Captions & ASL Animated Sign Interpreter',
    stats: {
      materialsCompleted: 19,
      hoursLearned: 34.2,
      quizzesMastered: 15,
    },
  },
  dyslexic: {
    id: 'user-dyslexic',
    name: 'Leo Morrison',
    email: 'leo.morrison@equilearn.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    profileType: 'Dyslexia',
    primaryAssistance: 'OpenDyslexic Font, Soft Yellow Overlay & Interactive Line Focus Ruler',
    stats: {
      materialsCompleted: 22,
      hoursLearned: 41.0,
      quizzesMastered: 18,
    },
  },
  teacher: {
    id: 'user-teacher',
    name: 'Dr. Aris Vance',
    email: 'dr.vance@university.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    profileType: 'General',
    primaryAssistance: 'Curriculum Accessibility Coordinator & Batch Format Converter',
    stats: {
      materialsCompleted: 86,
      hoursLearned: 112.0,
      quizzesMastered: 42,
    },
  },
  adhd: {
    id: 'user-adhd',
    name: 'Samira Rao',
    email: 'samira.rao@equilearn.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    profileType: 'ADHD',
    primaryAssistance: 'Chunked Smart Summaries, Mint Overlay & Distraction-Free Focus Mode',
    stats: {
      materialsCompleted: 16,
      hoursLearned: 22.8,
      quizzesMastered: 12,
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectProfile } = useAccessibility();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('equilearn_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.dyslexic;
      }
    }
    // Default to Dyslexic student Leo for immediate rich demonstration
    return DEMO_USERS.dyslexic;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('equilearn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('equilearn_user');
    }
  }, [user]);

  const loginAsDemoUser = (userKey: 'blind' | 'deaf' | 'dyslexic' | 'teacher' | 'adhd') => {
    const selected = DEMO_USERS[userKey] || DEMO_USERS.dyslexic;
    setUser(selected);
    selectProfile(selected.profileType);
  };

  const loginWithEmail = (email: string, name: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      profileType: 'Dyslexia',
      primaryAssistance: 'Customized Adaptive Learning Suite',
      stats: {
        materialsCompleted: 1,
        hoursLearned: 0.5,
        quizzesMastered: 1,
      },
    };
    setUser(newUser);
    selectProfile('Dyslexia');
  };

  const loginWithGoogle = () => {
    loginAsDemoUser('dyslexic');
  };

  const logout = () => {
    setUser(null);
  };

  const switchProfile = (profileType: AccessibilityProfileType) => {
    if (user) {
      const updated = { ...user, profileType };
      setUser(updated);
      selectProfile(profileType);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDemoUser,
        loginWithEmail,
        loginWithGoogle,
        logout,
        switchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
