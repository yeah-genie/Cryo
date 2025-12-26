import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { colors, typography, spacing, radius, components } from '@/constants/Colors';
import { PlusIcon, XIcon, CheckCircleIcon, CalendarIcon, TrashIcon, RefreshIcon } from '@/components/Icons';
import { useData } from '@/lib/DataContext';
import { useGoogleAuth } from '@/lib/useGoogleAuth';
import { getCalendarEvents, eventToChalkSchedule } from '@/lib/calendarService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

export default function ScheduleScreen() {
    const { students, scheduledLessons, addScheduledLesson, updateScheduledLesson, removeScheduledLesson, getLogsForDate, addStudent } = useData();
    const { tokens, isAuthenticated: isGoogleAuth, signIn: googleSignIn } = useGoogleAuth();

    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncCount, setLastSyncCount] = useState(0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [form, setForm] = useState({
        studentId: '',
        day: 1,
        time: '15:00',
        duration: '60',
        recurring: true,
    });

    const today = new Date();
    const currentDay = today.getDay();
    const todayStr = today.toISOString().split('T')[0];
    const todaysLogs = getLogsForDate(todayStr);

    // Get week dates
    const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date.getDate());
        }
        return dates;
    };
    const weekDates = getWeekDates();

    const getLessonsForDay = (day: number) => {
        return scheduledLessons.filter(l => l.day === day).sort((a, b) => a.time.localeCompare(b.time));
    };

    const handleAddLesson = () => {
        const student = students.find(s => s.id === form.studentId);
        if (!student) return;

        addScheduledLesson({
            studentId: student.id,
            studentName: student.name,
            day: form.day,
            time: form.time,
            duration: parseInt(form.duration) || 60,
            subject: student.subject,
            recurring: form.recurring,
        });

        setShowAddModal(false);
        setForm({ studentId: '', day: 1, time: '15:00', duration: '60', recurring: true });
    };

    const handleDeleteLesson = (id: string, name: string) => {
        Alert.alert('Delete Lesson', `Remove ${name}'s scheduled lesson?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => removeScheduledLesson(id) },
        ]);
    };

    const handleEditLesson = (lesson: typeof scheduledLessons[0]) => {
        setEditingLesson(lesson.id);
        setForm({
            studentId: lesson.studentId,
            day: lesson.day,
            time: lesson.time,
            duration: lesson.duration.toString(),
            recurring: lesson.recurring,
        });
        setShowAddModal(true);
    };

    const handleSaveLesson = () => {
        const student = students.find(s => s.id === form.studentId);
        if (!student) return;

        if (editingLesson) {
            // Update existing lesson
            updateScheduledLesson(editingLesson, {
                studentId: student.id,
                studentName: student.name,
                day: form.day,
                time: form.time,
                duration: parseInt(form.duration) || 60,
                subject: student.subject,
                recurring: form.recurring,
            });
        } else {
            // Add new lesson
            addScheduledLesson({
                studentId: student.id,
                studentName: student.name,
                day: form.day,
                time: form.time,
                duration: parseInt(form.duration) || 60,
                subject: student.subject,
                recurring: form.recurring,
            });
        }

        setShowAddModal(false);
        setEditingLesson(null);
        setForm({ studentId: '', day: 1, time: '15:00', duration: '60', recurring: true });
    };

    // Google Calendar에서 일정 동기화
    const syncFromCalendar = async () => {
        if (!tokens?.accessToken) {
            Alert.alert(
                'Connect Google Calendar',
                'Connect your Google Calendar to auto-sync your tutoring schedule.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Connect', onPress: googleSignIn },
                ]
            );
            return;
        }

        setIsSyncing(true);
        try {
            const events = await getCalendarEvents(tokens.accessToken, 30);
            let syncedCount = 0;

            for (const event of events) {
                const schedule = eventToChalkSchedule(event);
                if (!schedule) continue;

                // 이미 존재하는 일정인지 확인
                const existingIds = scheduledLessons.map(l =>
                    (l as any).externalId
                ).filter(Boolean);
                if (existingIds.includes(schedule.externalId)) continue;

                // 학생 찾기 또는 생성
                let student = students.find(s =>
                    s.name.toLowerCase() === schedule.studentName.toLowerCase()
                );
                if (!student) {
                    student = addStudent({
                        name: schedule.studentName,
                        subject: event.summary || 'Tutoring',
                    });
                }

                // 일정 추가
                addScheduledLesson({
                    studentId: student.id,
                    studentName: student.name,
                    day: schedule.day,
                    time: schedule.time,
                    duration: schedule.duration,
                    subject: student.subject,
                    recurring: schedule.recurring,
                });
                syncedCount++;
            }

            setLastSyncCount(syncedCount);
            if (syncedCount > 0) {
                Alert.alert('Synced!', `${syncedCount} lessons imported from Google Calendar`);
            } else {
                Alert.alert('Up to date', 'No new lessons found in your calendar');
            }
        } catch (error) {
            console.error('Calendar sync error:', error);
            Alert.alert('Sync Failed', 'Could not sync with Google Calendar');
        } finally {
            setIsSyncing(false);
        }
    };

    const upcomingToday = getLessonsForDay(currentDay);
    const loggedStudentIds = todaysLogs.map(l => l.studentId);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Schedule</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={[styles.syncBtn, isGoogleAuth && styles.syncBtnConnected]}
                            onPress={syncFromCalendar}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <ActivityIndicator size="small" color={colors.accent.default} />
                            ) : (
                                <RefreshIcon size={16} color={isGoogleAuth ? colors.accent.default : colors.text.muted} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                            <PlusIcon size={16} color={colors.bg.base} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Today's Lessons */}
                {upcomingToday.length > 0 && (
                    <View style={styles.todaySection}>
                        <Text style={styles.todayTitle}>Today</Text>
                        {upcomingToday.map(lesson => {
                            const isLogged = loggedStudentIds.includes(lesson.studentId);
                            return (
                                <View key={lesson.id} style={[styles.todayCard, isLogged && styles.todayCardLogged]}>
                                    <View style={styles.timeBlock}>
                                        <Text style={styles.timeText}>{lesson.time}</Text>
                                        <Text style={styles.durationText}>{lesson.duration}min</Text>
                                    </View>
                                    <View style={styles.lessonInfo}>
                                        <Text style={styles.lessonStudent}>{lesson.studentName}</Text>
                                        {lesson.subject && <Text style={styles.lessonSubject}>{lesson.subject}</Text>}
                                    </View>
                                    {isLogged ? (
                                        <View style={styles.loggedBadge}>
                                            <CheckCircleIcon size={12} color={colors.level.high} />
                                            <Text style={styles.loggedText}>Logged</Text>
                                        </View>
                                    ) : lesson.recurring ? (
                                        <View style={styles.recurringBadge}>
                                            <Text style={styles.recurringText}>Weekly</Text>
                                        </View>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Week View */}
                <View style={styles.weekSection}>
                    <Text style={styles.sectionTitle}>This Week</Text>
                    <View style={styles.weekGrid}>
                        {DAYS.map((day, idx) => {
                            const dayLessons = getLessonsForDay(idx);
                            const isToday = idx === currentDay;
                            return (
                                <Pressable
                                    key={day}
                                    style={[styles.dayColumn, isToday && styles.dayColumnToday]}
                                    onPress={() => { setForm(p => ({ ...p, day: idx })); setShowAddModal(true); }}
                                >
                                    <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day}</Text>
                                    <Text style={[styles.dayDate, isToday && styles.dayDateToday]}>{weekDates[idx]}</Text>
                                    <View style={styles.dayLessons}>
                                        {dayLessons.map(lesson => (
                                            <View key={lesson.id} style={styles.lessonDot}>
                                                <Text style={styles.lessonDotTime}>{lesson.time.slice(0, 2)}</Text>
                                            </View>
                                        ))}
                                        {dayLessons.length === 0 && <Text style={styles.emptyDay}>-</Text>}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* All Scheduled */}
                <View style={styles.allSection}>
                    <Text style={styles.sectionTitle}>All Lessons ({scheduledLessons.length})</Text>
                    {scheduledLessons.length === 0 ? (
                        <Text style={styles.emptyText}>No scheduled lessons yet</Text>
                    ) : (
                        scheduledLessons.map(lesson => (
                            <Pressable
                                key={lesson.id}
                                style={styles.lessonRow}
                                onPress={() => handleEditLesson(lesson)}
                            >
                                <View style={styles.lessonDayBadge}>
                                    <Text style={styles.lessonDayText}>{DAYS[lesson.day]}</Text>
                                </View>
                                <View style={styles.lessonDetails}>
                                    <Text style={styles.lessonName}>{lesson.studentName}</Text>
                                    <Text style={styles.lessonMeta}>{lesson.time} · {lesson.duration}min</Text>
                                </View>
                                <View style={styles.lessonActions}>
                                    {lesson.recurring && <CheckCircleIcon size={14} color={colors.accent.default} />}
                                    <TouchableOpacity
                                        onPress={() => handleDeleteLesson(lesson.id, lesson.studentName)}
                                        style={styles.deleteBtn}
                                    >
                                        <TrashIcon size={16} color={colors.status.error} />
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>

            </ScrollView>

            {/* Add Modal */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingLesson ? 'Edit Lesson' : 'Schedule Lesson'}</Text>
                            <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingLesson(null); setForm({ studentId: '', day: 1, time: '15:00', duration: '60', recurring: true }); }}>
                                <XIcon size={18} color={colors.text.muted} />
                            </TouchableOpacity>
                        </View>

                        {/* Student Selection */}
                        <Text style={styles.inputLabel}>Student *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentPicker}>
                            {students.map(student => (
                                <Pressable
                                    key={student.id}
                                    style={[styles.studentOption, form.studentId === student.id && styles.studentOptionSelected]}
                                    onPress={() => setForm(p => ({ ...p, studentId: student.id }))}
                                >
                                    <Text style={[styles.studentOptionText, form.studentId === student.id && styles.studentOptionTextSelected]}>
                                        {student.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Day */}
                        <Text style={styles.inputLabel}>Day</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker}>
                            {DAYS.map((day, idx) => (
                                <Pressable
                                    key={idx}
                                    style={[styles.dayOption, form.day === idx && styles.dayOptionSelected]}
                                    onPress={() => setForm(p => ({ ...p, day: idx }))}
                                >
                                    <Text style={[styles.dayOptionText, form.day === idx && styles.dayOptionTextSelected]}>{day}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Time */}
                        <Text style={styles.inputLabel}>Time</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePicker}>
                            {TIME_SLOTS.map(time => (
                                <Pressable
                                    key={time}
                                    style={[styles.timeOption, form.time === time && styles.timeOptionSelected]}
                                    onPress={() => setForm(p => ({ ...p, time }))}
                                >
                                    <Text style={[styles.timeOptionText, form.time === time && styles.timeOptionTextSelected]}>{time}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Duration */}
                        <Text style={styles.inputLabel}>Duration</Text>
                        <View style={styles.durationRow}>
                            {['30', '45', '60', '90', '120'].map(dur => (
                                <Pressable
                                    key={dur}
                                    style={[styles.durationOption, form.duration === dur && styles.durationOptionSelected]}
                                    onPress={() => setForm(p => ({ ...p, duration: dur }))}
                                >
                                    <Text style={[styles.durText, form.duration === dur && styles.durTextSelected]}>{dur}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Recurring */}
                        <Pressable style={styles.recurringToggle} onPress={() => setForm(p => ({ ...p, recurring: !p.recurring }))}>
                            <View style={[styles.checkbox, form.recurring && styles.checkboxChecked]}>
                                {form.recurring && <CheckCircleIcon size={14} color={colors.bg.base} />}
                            </View>
                            <Text style={styles.recurringLabel}>Repeat weekly</Text>
                        </Pressable>

                        <TouchableOpacity
                            style={[styles.saveBtn, !form.studentId && styles.saveBtnDisabled]}
                            onPress={handleSaveLesson}
                            disabled={!form.studentId}
                        >
                            <Text style={styles.saveBtnText}>{editingLesson ? 'Save Changes' : 'Add to Schedule'}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.base },
    content: { paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: 100 },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing['2xl'] },
    pageTitle: { ...typography.h1, color: colors.text.primary },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    syncBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg.tertiary, alignItems: 'center', justifyContent: 'center' },
    syncBtnConnected: { backgroundColor: colors.accent.muted },
    addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent.default, alignItems: 'center', justifyContent: 'center' },

    todaySection: { marginBottom: spacing['2xl'] },
    todayTitle: { ...typography.h2, color: colors.text.primary, marginBottom: spacing.md },
    todayCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent.muted, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.xs },
    todayCardLogged: { opacity: 0.6 },
    timeBlock: { alignItems: 'center', marginRight: spacing.lg },
    timeText: { ...typography.h2, color: colors.accent.default },
    durationText: { ...typography.caption, color: colors.text.muted },
    lessonInfo: { flex: 1 },
    lessonStudent: { ...typography.body, color: colors.text.primary, fontWeight: '500' },
    lessonSubject: { ...typography.caption, color: colors.text.muted },
    recurringBadge: { backgroundColor: colors.bg.tertiary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
    recurringText: { ...typography.caption, color: colors.text.muted, fontSize: 10 },
    loggedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#34D39920', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
    loggedText: { ...typography.caption, color: colors.level.high, fontSize: 10 },

    weekSection: { marginBottom: spacing['2xl'] },
    sectionTitle: { ...typography.caption, color: colors.text.muted, textTransform: 'uppercase', marginBottom: spacing.md },
    weekGrid: { flexDirection: 'row', gap: spacing.xs },
    dayColumn: { flex: 1, backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', minHeight: 100 },
    dayColumnToday: { backgroundColor: colors.accent.muted },
    dayLabel: { ...typography.caption, color: colors.text.muted, fontWeight: '600' },
    dayLabelToday: { color: colors.accent.default },
    dayDate: { ...typography.body, color: colors.text.primary, fontWeight: '600', marginTop: 2 },
    dayDateToday: { color: colors.accent.default },
    dayLessons: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
    lessonDot: { backgroundColor: colors.accent.default, borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2, marginBottom: 2 },
    lessonDotTime: { ...typography.micro, color: colors.bg.base, fontWeight: '600' },
    emptyDay: { ...typography.caption, color: colors.text.muted },

    allSection: { marginBottom: spacing['2xl'] },
    emptyText: { ...typography.body, color: colors.text.muted, textAlign: 'center', paddingVertical: spacing.xl },
    lessonRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xs },
    lessonDayBadge: { backgroundColor: colors.bg.tertiary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm, marginRight: spacing.md },
    lessonDayText: { ...typography.caption, color: colors.text.primary, fontWeight: '600' },
    lessonDetails: { flex: 1 },
    lessonName: { ...typography.body, color: colors.text.primary },
    lessonMeta: { ...typography.caption, color: colors.text.muted },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modal: { backgroundColor: colors.bg.secondary, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, paddingBottom: spacing['3xl'], maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
    modalTitle: { ...typography.h2, color: colors.text.primary },

    inputLabel: { ...typography.caption, color: colors.text.muted, marginBottom: spacing.xs, marginTop: spacing.md },

    studentPicker: { flexDirection: 'row', marginBottom: spacing.sm },
    studentOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, marginRight: spacing.sm },
    studentOptionSelected: { backgroundColor: colors.accent.default },
    studentOptionText: { ...typography.body, color: colors.text.secondary },
    studentOptionTextSelected: { color: colors.bg.base, fontWeight: '600' },

    dayPicker: { flexDirection: 'row', marginBottom: spacing.sm },
    dayOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, marginRight: spacing.xs },
    dayOptionSelected: { backgroundColor: colors.accent.default },
    dayOptionText: { ...typography.small, color: colors.text.secondary },
    dayOptionTextSelected: { color: colors.bg.base, fontWeight: '600' },

    timePicker: { flexDirection: 'row', marginBottom: spacing.sm },
    timeOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, marginRight: spacing.xs },
    timeOptionSelected: { backgroundColor: colors.accent.default },
    timeOptionText: { ...typography.small, color: colors.text.secondary },
    timeOptionTextSelected: { color: colors.bg.base, fontWeight: '600' },

    durationRow: { flexDirection: 'row', gap: spacing.xs },
    durationOption: { flex: 1, paddingVertical: spacing.md, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, alignItems: 'center' },
    durationOptionSelected: { backgroundColor: colors.accent.default },
    durText: { ...typography.small, color: colors.text.secondary },
    durTextSelected: { color: colors.bg.base, fontWeight: '600' },

    recurringToggle: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
    checkbox: { width: 22, height: 22, borderRadius: 4, backgroundColor: colors.bg.tertiary, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { backgroundColor: colors.accent.default },
    recurringLabel: { ...typography.body, color: colors.text.primary },

    lessonActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    deleteBtn: { padding: spacing.sm },

    saveBtn: { height: components.button.lg, backgroundColor: colors.accent.default, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
    saveBtnDisabled: { backgroundColor: colors.bg.tertiary },
    saveBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },
});
