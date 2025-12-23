import { Student, LearningOutcome, Badge, PortfolioStats, Topic, GradeLevel } from './types';

// ===================================
// MOCK STUDENTS
// ===================================
export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: '김민수',
    subject: '수학',
    grade: 'MIDDLE_2',
    currentTopic: 'LINEAR-FUNC',
    lessonsCount: 12,
    phone: '010-1234-5678',
    diagnosis: {
      gaps: [
        {
          topicCode: 'COORDINATES',
          topicName: '좌표평면',
          grade: 'MIDDLE_1',
          estimatedHours: 4,
          severity: 'CRITICAL',
        },
        {
          topicCode: 'LINEAR-EQ-1',
          topicName: '일차방정식',
          grade: 'MIDDLE_1',
          estimatedHours: 6,
          severity: 'MODERATE',
        },
      ],
      estimatedWeeks: 6,
    },
  },
  {
    id: '2',
    name: '이서연',
    subject: '영어',
    grade: 'HIGH_1',
    lessonsCount: 8,
    phone: '010-2345-6789',
  },
  {
    id: '3',
    name: '박준호',
    subject: '수학',
    grade: 'MIDDLE_1',
    currentTopic: 'LINEAR-EQ-1',
    lessonsCount: 5,
    phone: '010-3456-7890',
  },
];

// ===================================
// MOCK LEARNING OUTCOMES
// ===================================
export const MOCK_OUTCOMES: LearningOutcome[] = [
  { id: '1', title: '일차방정식 풀이' },
  { id: '2', title: '인수분해' },
  { id: '3', title: '함수의 개념' },
];

// ===================================
// MOCK BADGES
// ===================================
export const MOCK_BADGES: Badge[] = [
  {
    id: '1',
    icon: 'fire',
    label: '10일 연속',
    description: '10일 연속으로 수업을 진행했어요',
    color: 'orange',
    earned: true,
    earnedAt: '2024-12-15',
  },
  {
    id: '2',
    icon: 'target',
    label: '첫 수업',
    description: '첫 수업을 완료했어요',
    color: 'mint',
    earned: true,
    earnedAt: '2024-11-01',
  },
  {
    id: '3',
    icon: 'crown',
    label: '성실왕',
    description: '한 달간 빠짐없이 기록했어요',
    color: 'purple',
    earned: true,
    earnedAt: '2024-12-01',
  },
  {
    id: '4',
    icon: 'trending',
    label: '목표 달성',
    description: '학생의 목표 단원을 완료했어요',
    color: 'mint',
    earned: false,
  },
  {
    id: '5',
    icon: 'diamond',
    label: '프리미엄',
    description: '50회 이상 수업을 기록했어요',
    color: 'blue',
    earned: false,
  },
];

// ===================================
// MOCK PORTFOLIO STATS
// ===================================
export const MOCK_STATS: PortfolioStats = {
  totalLessons: 42,
  totalStudents: 5,
  avgLevel: 78,
  streak: 12,
};

// ===================================
// MOCK TOPICS (간소화된 버전)
// ===================================
export const MOCK_TOPICS: Topic[] = [
  // 중1
  {
    code: 'NATURAL-NUM',
    name: '자연수의 성질',
    grade: 'MIDDLE_1',
    estimatedHours: 4,
    difficulty: 2,
    prerequisites: [],
  },
  {
    code: 'INTEGER',
    name: '정수와 유리수',
    grade: 'MIDDLE_1',
    estimatedHours: 6,
    difficulty: 2,
    prerequisites: ['NATURAL-NUM'],
  },
  {
    code: 'COORDINATES',
    name: '좌표평면',
    grade: 'MIDDLE_1',
    estimatedHours: 4,
    difficulty: 2,
    prerequisites: ['INTEGER'],
  },
  {
    code: 'LINEAR-EQ-1',
    name: '일차방정식',
    grade: 'MIDDLE_1',
    estimatedHours: 6,
    difficulty: 3,
    prerequisites: ['INTEGER'],
  },
  // 중2
  {
    code: 'LINEAR-FUNC',
    name: '일차함수',
    grade: 'MIDDLE_2',
    estimatedHours: 8,
    difficulty: 3,
    prerequisites: ['COORDINATES', 'LINEAR-EQ-1'],
  },
  {
    code: 'LINEAR-SYSTEM',
    name: '연립방정식',
    grade: 'MIDDLE_2',
    estimatedHours: 6,
    difficulty: 3,
    prerequisites: ['LINEAR-EQ-1'],
  },
  {
    code: 'INEQUALITY',
    name: '부등식',
    grade: 'MIDDLE_2',
    estimatedHours: 5,
    difficulty: 3,
    prerequisites: ['LINEAR-EQ-1'],
  },
  // 중3
  {
    code: 'QUADRATIC-EQ',
    name: '이차방정식',
    grade: 'MIDDLE_3',
    estimatedHours: 8,
    difficulty: 4,
    prerequisites: ['LINEAR-SYSTEM'],
  },
  {
    code: 'QUADRATIC-FUNC',
    name: '이차함수',
    grade: 'MIDDLE_3',
    estimatedHours: 10,
    difficulty: 4,
    prerequisites: ['LINEAR-FUNC', 'QUADRATIC-EQ'],
  },
];

// ===================================
// HELPER FUNCTIONS
// ===================================
export function getTopicsByGrade(grade: GradeLevel): Topic[] {
  return MOCK_TOPICS.filter(t => t.grade === grade);
}

export function getTopicByCode(code: string): Topic | undefined {
  return MOCK_TOPICS.find(t => t.code === code);
}

// 캘린더 히트맵 데이터 생성 (12주 = 84일)
export function generateCalendarData(): number[] {
  const days: number[] = [];
  const seed = 12345; // 고정 시드로 일관된 데이터
  
  for (let i = 0; i < 84; i++) {
    // 간단한 시드 기반 랜덤
    const rand = Math.abs(Math.sin(seed + i * 0.1)) % 1;
    if (rand > 0.65) {
      days.push(rand > 0.85 ? 3 : rand > 0.75 ? 2 : 1);
    } else {
      days.push(0);
    }
  }
  return days;
}

