import { createClient } from '@supabase/supabase-js';

// Supabase config - use environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Student {
    id: string;
    tutor_id: string;
    name: string;
    grade?: string;
    subject?: string;
    parent_phone?: string;
    notes?: string;
    created_at: string;
    // Computed/joined
    lesson_count?: number;
    deficit_count?: number;
}

export interface Lesson {
    id: string;
    tutor_id: string;
    student_id: string;
    date: string;
    duration_minutes?: number;
    topics: string[];
    emoji_rating: 'good' | 'okay' | 'struggled' | null;
    struggle_types: string[];
    notes?: string;
    ai_extracted?: {
        topics?: string[];
        struggle_types?: string[];
        key_observations?: string[];
    };
    parent_report?: string;
    sent_to_parent: boolean;
    sent_at?: string;
    created_at: string;
    // Joined
    student?: Student;
}

export interface DeficitPattern {
    id: string;
    student_id: string;
    topic_id?: string;
    topic_name: string;
    occurrence_count: number;
    last_occurrence: string;
    struggle_types: string[];
    suggested_action?: string;
    is_resolved: boolean;
}

export interface Curriculum {
    id: string;
    subject: string;
    parent_id?: string;
    name: string;
    level: number;
    sort_order: number;
}

// ============ STUDENTS ============
export async function getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

    if (error) throw error;
    return data || [];
}

export async function createStudent(student: Partial<Student>) {
    const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();

    if (error) throw error;
    return data as Student;
}

// ============ LESSONS ============
export async function getLessons(limit = 10): Promise<Lesson[]> {
    const { data, error } = await supabase
        .from('lessons')
        .select(`*, student:students(id, name, grade, subject)`)
        .order('date', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

export async function createLesson(lesson: Partial<Lesson>) {
    const { data, error } = await supabase
        .from('lessons')
        .insert(lesson)
        .select()
        .single();

    if (error) throw error;
    return data as Lesson;
}

export async function getTodayLessons(): Promise<Lesson[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('lessons')
        .select(`*, student:students(id, name, grade, subject)`)
        .eq('date', today)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// ============ STATS ============
export async function getPortfolioStats() {
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, date, emoji_rating');

    if (lessonsError) throw lessonsError;

    const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id');

    if (studentsError) throw studentsError;

    // Calculate stats
    const totalLessons = lessons?.length || 0;
    const totalStudents = students?.length || 0;

    // Calculate streak
    const dates = (lessons || [])
        .map(l => l.date)
        .sort()
        .reverse();

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(dateStr)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    // This week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const thisWeekLessons = (lessons || []).filter(l => {
        const lessonDate = new Date(l.date);
        return lessonDate >= weekStart;
    });

    // Success rate (good ratings)
    const ratedLessons = (lessons || []).filter(l => l.emoji_rating);
    const goodLessons = ratedLessons.filter(l => l.emoji_rating === 'good');
    const successRate = ratedLessons.length > 0
        ? Math.round((goodLessons.length / ratedLessons.length) * 100)
        : 0;

    return {
        totalLessons,
        totalStudents,
        streak,
        thisWeekCompleted: thisWeekLessons.length,
        successRate,
    };
}

// ============ DEFICITS ============
export async function getDeficitPatterns(): Promise<DeficitPattern[]> {
    const { data, error } = await supabase
        .from('deficit_patterns')
        .select('*')
        .eq('is_resolved', false)
        .order('occurrence_count', { ascending: false })
        .limit(5);

    if (error) throw error;
    return data || [];
}
