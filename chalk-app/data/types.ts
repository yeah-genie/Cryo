// ===================================
// STUDENT TYPES
// ===================================
export type GradeLevel =
  | 'ELEMENTARY_5'
  | 'ELEMENTARY_6'
  | 'MIDDLE_1'
  | 'MIDDLE_2'
  | 'MIDDLE_3'
  | 'HIGH_1'
  | 'HIGH_2'
  | 'HIGH_3';

export const GRADE_NAMES: Record<GradeLevel, string> = {
  ELEMENTARY_5: '초5',
  ELEMENTARY_6: '초6',
  MIDDLE_1: '중1',
  MIDDLE_2: '중2',
  MIDDLE_3: '중3',
  HIGH_1: '고1',
  HIGH_2: '고2',
  HIGH_3: '고3',
};

export const GRADE_OPTIONS: GradeLevel[] = [
  'ELEMENTARY_5',
  'ELEMENTARY_6',
  'MIDDLE_1',
  'MIDDLE_2',
  'MIDDLE_3',
  'HIGH_1',
  'HIGH_2',
  'HIGH_3',
];

export interface Student {
  id: string;
  name: string;
  subject: string;
  grade: GradeLevel;
  currentTopic?: string;
  lessonsCount: number;
  phone?: string;
  diagnosis?: {
    gaps: DiagnosisGap[];
    estimatedWeeks: number;
  };
}

export interface DiagnosisGap {
  topicCode: string;
  topicName: string;
  grade: GradeLevel;
  estimatedHours: number;
  severity: 'CRITICAL' | 'MODERATE' | 'MINOR';
}

// ===================================
// LESSON TYPES
// ===================================
export type LevelType = 'high' | 'mid' | 'low';

export interface LearningOutcome {
  id: string;
  title: string;
}

export interface OutcomeCheck {
  outcomeId: string;
  level: LevelType | null;
}

export interface LessonRecord {
  id: string;
  studentId: string;
  date: string;
  outcomes: OutcomeCheck[];
  feedback?: string;
  polishedFeedback?: string;
}

// ===================================
// PORTFOLIO TYPES
// ===================================
export interface Badge {
  id: string;
  icon: 'fire' | 'target' | 'crown' | 'trending' | 'diamond' | 'star' | 'award';
  label: string;
  description: string;
  color: 'orange' | 'mint' | 'purple' | 'yellow' | 'blue';
  earned: boolean;
  earnedAt?: string;
}

export interface PortfolioStats {
  totalLessons: number;
  totalStudents: number;
  avgLevel: number;
  streak: number;
}

// ===================================
// TOPIC TYPES
// ===================================
export interface Topic {
  code: string;
  name: string;
  grade: GradeLevel;
  estimatedHours: number;
  difficulty: number;
  prerequisites: string[];
}

// ===================================
// UI TYPES
// ===================================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

