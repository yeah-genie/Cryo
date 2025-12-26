// Curriculum data for Smart Tag System
// Hierarchical topic structure for structured data collection

export interface Topic {
    id: string;
    name: string;
    children?: Topic[];
}

export interface Subject {
    id: string;
    name: string;
    icon: string;
    units: Topic[];
}

export const CURRICULUM: Subject[] = [
    {
        id: 'math',
        name: 'Mathematics',
        icon: '📐',
        units: [
            {
                id: 'algebra',
                name: 'Algebra',
                children: [
                    { id: 'linear-eq', name: 'Linear Equations' },
                    { id: 'quadratic-eq', name: 'Quadratic Equations' },
                    { id: 'factoring', name: 'Factoring' },
                    { id: 'polynomials', name: 'Polynomials' },
                ],
            },
            {
                id: 'functions',
                name: 'Functions',
                children: [
                    { id: 'linear-func', name: 'Linear Functions' },
                    { id: 'quadratic-func', name: 'Quadratic Functions' },
                    { id: 'exponential', name: 'Exponential Functions' },
                ],
            },
            {
                id: 'geometry',
                name: 'Geometry',
                children: [
                    { id: 'triangles', name: 'Triangles' },
                    { id: 'circles', name: 'Circles' },
                    { id: 'coordinate', name: 'Coordinate Geometry' },
                ],
            },
        ],
    },
    {
        id: 'english',
        name: 'English',
        icon: '📚',
        units: [
            {
                id: 'grammar',
                name: 'Grammar',
                children: [
                    { id: 'tenses', name: 'Tenses' },
                    { id: 'conditionals', name: 'Conditionals' },
                    { id: 'passive', name: 'Passive Voice' },
                ],
            },
            {
                id: 'reading',
                name: 'Reading',
                children: [
                    { id: 'comprehension', name: 'Comprehension' },
                    { id: 'vocabulary', name: 'Vocabulary' },
                ],
            },
        ],
    },
];

// Struggle types for quick tagging
export const STRUGGLE_TYPES = [
    { id: 'calculation', label: 'Calculation', emoji: '🔢' },
    { id: 'concept', label: 'Concept', emoji: '💡' },
    { id: 'application', label: 'Application', emoji: '🎯' },
    { id: 'focus', label: 'Focus', emoji: '👀' },
] as const;

// Emoji ratings
export const EMOJI_RATINGS = [
    { id: 'good', emoji: '😊', label: 'Good' },
    { id: 'okay', emoji: '😐', label: 'Okay' },
    { id: 'struggled', emoji: '😔', label: 'Struggled' },
] as const;

// Helper to get flat list of all topics
export function getAllTopics(): { id: string; name: string; path: string }[] {
    const result: { id: string; name: string; path: string }[] = [];

    for (const subject of CURRICULUM) {
        for (const unit of subject.units) {
            if (unit.children) {
                for (const topic of unit.children) {
                    result.push({
                        id: topic.id,
                        name: topic.name,
                        path: `${subject.name} > ${unit.name}`,
                    });
                }
            }
        }
    }

    return result;
}
