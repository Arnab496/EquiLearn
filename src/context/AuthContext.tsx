import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccessibilityProfileType } from '../types';
import { useAccessibility } from './AccessibilityContext';
import { 
  auth, 
  loginWithFirebaseGoogle, 
  loginWithFirebaseEmail, 
  registerWithFirebaseEmail, 
  logoutFirebase, 
  saveUserToFirestore, 
  getUserFromFirestore 
} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isFirebaseLoading: boolean;
  loginAsDemoUser: (userKey: 'blind' | 'deaf' | 'dyslexic' | 'teacher' | 'adhd') => void;
  loginWithEmail: (email: string, password?: string, name?: string, profile?: AccessibilityProfileType, role?: 'student' | 'teacher') => Promise<void>;
  loginWithGoogle: (preferredProfile?: AccessibilityProfileType) => Promise<void>;
  logout: () => Promise<void>;
  switchProfile: (profileType: AccessibilityProfileType) => void;
  updateUserStats: (delta: { materialsCompleted?: number; hoursLearned?: number; quizzesMastered?: number }) => void;
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
    primaryAssistance: 'OpenDyslexic Font, Soft Yellow Overlay & High-Contrast Focus Mode',
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
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('equilearn_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.dyslexic;
      }
    }
    return DEMO_USERS.dyslexic;
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsFirebaseLoading(false);
      if (fbUser) {
        // Fetch or create profile in Firestore
        const existingData = await getUserFromFirestore(fbUser.uid);
        if (existingData) {
          const appUser: User = {
            id: existingData.id,
            name: existingData.name,
            email: existingData.email,
            role: existingData.role || 'student',
            profileType: (existingData.profileType as AccessibilityProfileType) || 'Dyslexia',
            avatar: existingData.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            primaryAssistance: `${existingData.profileType || 'Dyslexia'} Personalized Accessibility Suite`,
            stats: {
              materialsCompleted: existingData.stats?.materialsConverted || 5,
              hoursLearned: existingData.stats?.readingHours || 4.5,
              quizzesMastered: existingData.stats?.quizAverage || 4,
            }
          };
          setUser(appUser);
          selectProfile(appUser.profileType);
        } else {
          // Initialize new user in Firestore
          const defaultProfile: AccessibilityProfileType = 'Dyslexia';
          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner',
            email: fbUser.email || 'learner@equilearn.edu',
            role: 'student',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
            profileType: defaultProfile,
            primaryAssistance: `${defaultProfile} Personalized Accessibility Suite`,
            stats: {
              materialsCompleted: 1,
              hoursLearned: 0.5,
              quizzesMastered: 1,
            }
          };
          setUser(newUser);
          selectProfile(defaultProfile);
          await saveUserToFirestore({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profileType: newUser.profileType,
            avatar: newUser.avatar,
            stats: {
              readingHours: 0.5,
              materialsConverted: 1,
              quizAverage: 1,
              tactileDiagramsExplored: 1
            }
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
    // Optionally persist demo persona to Firestore
    saveUserToFirestore({
      id: selected.id,
      name: selected.name,
      email: selected.email,
      role: selected.role,
      profileType: selected.profileType,
      avatar: selected.avatar,
      stats: {
        readingHours: selected.stats.hoursLearned,
        materialsConverted: selected.stats.materialsCompleted,
        quizAverage: selected.stats.quizzesMastered,
        tactileDiagramsExplored: 3
      }
    });
  };

  const loginWithEmail = async (
    email: string,
    password = 'Password123!',
    name?: string,
    profile: AccessibilityProfileType = 'Dyslexia',
    role: 'student' | 'teacher' = 'student'
  ) => {
    const formattedName = name && name.trim() ? name.trim() : email.split('@')[0];
    const capitalName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

    try {
      const fbUser = await loginWithFirebaseEmail(email, password, capitalName);
      const appUser: User = {
        id: fbUser.uid,
        name: capitalName,
        email: email.trim(),
        role,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
        profileType: profile,
        primaryAssistance: `${profile} Personalized Accessibility Suite`,
        stats: {
          materialsCompleted: 1,
          hoursLearned: 0.5,
          quizzesMastered: 1,
        },
      };
      setUser(appUser);
      selectProfile(profile);

      await saveUserToFirestore({
        id: appUser.id,
        name: appUser.name,
        email: appUser.email,
        role: appUser.role,
        profileType: appUser.profileType,
        avatar: appUser.avatar,
        stats: {
          readingHours: 0.5,
          materialsConverted: 1,
          quizAverage: 1,
          tactileDiagramsExplored: 0
        }
      });
    } catch (err: any) {
      console.warn('Firebase email auth fallback:', err);
      // Fallback local persistence if offline
      const localUser: User = {
        id: `user-${Date.now()}`,
        name: capitalName,
        email: email.trim(),
        role,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
        profileType: profile,
        primaryAssistance: `${profile} Personalized Accessibility Suite`,
        stats: {
          materialsCompleted: 1,
          hoursLearned: 0.5,
          quizzesMastered: 1,
        },
      };
      setUser(localUser);
      selectProfile(profile);
    }
  };

  const loginWithGoogle = async (preferredProfile: AccessibilityProfileType = 'Dyslexia') => {
    try {
      const fbUser = await loginWithFirebaseGoogle();
      const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Scholar';
      const appUser: User = {
        id: fbUser.uid,
        name: displayName,
        email: fbUser.email || 'scholar@gmail.com',
        role: 'student',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        profileType: preferredProfile,
        primaryAssistance: `${preferredProfile} Google Authenticated Accessibility Suite`,
        stats: {
          materialsCompleted: 3,
          hoursLearned: 5.0,
          quizzesMastered: 2,
        },
      };
      setUser(appUser);
      selectProfile(preferredProfile);

      await saveUserToFirestore({
        id: appUser.id,
        name: appUser.name,
        email: appUser.email,
        role: appUser.role,
        profileType: appUser.profileType,
        avatar: appUser.avatar,
        stats: {
          readingHours: 5.0,
          materialsConverted: 3,
          quizAverage: 2,
          tactileDiagramsExplored: 1
        }
      });
    } catch (err: any) {
      console.warn('Google sign-in fallback:', err);
      // Fallback
      const fallbackUser: User = {
        id: `google-${Date.now()}`,
        name: 'Google Scholar',
        email: 'scholar.inclusive@gmail.com',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        profileType: preferredProfile,
        primaryAssistance: `${preferredProfile} Inclusive Account`,
        stats: {
          materialsCompleted: 4,
          hoursLearned: 6.2,
          quizzesMastered: 3,
        },
      };
      setUser(fallbackUser);
      selectProfile(preferredProfile);
    }
  };

  const logout = async () => {
    try {
      await logoutFirebase();
    } catch (err) {
      console.warn('Firebase sign out error:', err);
    }
    setUser(null);
  };

  const switchProfile = (profileType: AccessibilityProfileType) => {
    if (user) {
      const updated = { ...user, profileType };
      setUser(updated);
      selectProfile(profileType);
      saveUserToFirestore({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileType,
        avatar: user.avatar
      });
    }
  };

  const updateUserStats = (delta: { materialsCompleted?: number; hoursLearned?: number; quizzesMastered?: number }) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        stats: {
          materialsCompleted: prev.stats.materialsCompleted + (delta.materialsCompleted || 0),
          hoursLearned: +(prev.stats.hoursLearned + (delta.hoursLearned || 0)).toFixed(1),
          quizzesMastered: prev.stats.quizzesMastered + (delta.quizzesMastered || 0)
        }
      };
      saveUserToFirestore({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profileType: updated.profileType,
        avatar: updated.avatar,
        stats: {
          readingHours: updated.stats.hoursLearned,
          materialsConverted: updated.stats.materialsCompleted,
          quizAverage: updated.stats.quizzesMastered,
          tactileDiagramsExplored: 1
        }
      });
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isFirebaseLoading,
        loginAsDemoUser,
        loginWithEmail,
        loginWithGoogle,
        logout,
        switchProfile,
        updateUserStats,
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
