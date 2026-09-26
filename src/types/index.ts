export type AccessibilityProfileType =
  | 'General'
  | 'Blind'
  | 'Low Vision'
  | 'Deaf'
  | 'Hard of Hearing'
  | 'Dyslexia'
  | 'ADHD'
  | 'Custom';

export type ColorOverlayType = 'none' | 'yellow' | 'peach' | 'mint' | 'blue' | 'rose';
export type FontSizeTier = 'normal' | 'large' | 'xlarge' | 'xxlarge';
export type LineSpacingTier = 'normal' | 'relaxed' | 'loose';

export interface AccessibilitySettings {
  profile: AccessibilityProfileType;
  fontSize: FontSizeTier;
  openDyslexic: boolean;
  lineSpacing: LineSpacingTier;
  colorOverlay: ColorOverlayType;
  readingSpeed: number;
  voicePitch: number;
  selectedVoice: string;
  bionicReading: boolean;
  highContrast: boolean;
  soundCues: boolean;
  signLanguageAvatar: boolean;
  screenReaderMode: boolean;
  reducedMotion: boolean;
  captionSize: 'normal' | 'large' | 'huge';
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  profileType: AccessibilityProfileType;
  primaryAssistance: string;
  stats: {
    materialsCompleted: number;
    hoursLearned: number;
    quizzesMastered: number;
  };
}

export interface Material {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'video' | 'image' | 'audio';
  pages?: number;
  duration?: string;
  dateAdded: string;
  size: string;
  summary: string;
  readingTime: string;
  accessibleFormats: string[];
  content?: string;
  diagramUrl?: string;
  altText?: string;
  detailedDescription?: string;
  tactileDescription?: string;
  videoUrl?: string;
  transcript?: Array<{
    start: string;
    end: string;
    speaker: string;
    text: string;
  }>;
  audioTranscript?: string;
  definitions?: Array<{ term: string; definition: string }>;
  keyPoints?: string[];
  isOfflineAvailable?: boolean;
  cachedAt?: string;
  offlineSize?: string;
  isCustomUploaded?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface SummaryData {
  simpleSummary: string;
  mediumSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  definitions: Array<{ term: string; definition: string }>;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}
