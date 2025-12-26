import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { colors, typography, spacing, radius, components } from '@/constants/Colors';
import {
  SparklesIcon,
  SendIcon,
  PlusIcon,
  CheckCircleIcon,
  XIcon,
  SmileFaceIcon,
  MehFaceIcon,
  SadFaceIcon,
  LightbulbIcon,
  TargetIcon,
  EyeIcon,
  BookOpenIcon,
  RefreshIcon,
  TrashIcon,
} from '@/components/Icons';
import { useData } from '@/lib/DataContext';
import { useZoomAuth } from '@/lib/useZoomAuth';
import { getPastMeetings, meetingsToChalkSessions } from '@/lib/zoomService';

// Rating icons
const RATINGS = [
  { id: 'good' as const, label: 'Got it', Icon: SmileFaceIcon, color: colors.level.high },
  { id: 'okay' as const, label: 'Needs review', Icon: MehFaceIcon, color: colors.level.mid },
  { id: 'struggled' as const, label: 'Struggled', Icon: SadFaceIcon, color: colors.level.low },
];

// Universal struggle types
const STRUGGLES = [
  { id: 'understanding', label: 'Understanding', Icon: LightbulbIcon },
  { id: 'practice', label: 'Practice', Icon: TargetIcon },
  { id: 'memory', label: 'Memory', Icon: BookOpenIcon },
  { id: 'focus', label: 'Focus', Icon: EyeIcon },
];

// Recent topics for autocomplete (will be dynamic later)
const RECENT_TOPICS = ['Quadratic Equations', 'Chapter 5', 'Essay Writing', 'Verb Tenses'];

export default function LogScreen() {
  const { students, addStudent, removeStudent, lessonLogs, addLessonLog, removeLessonLog, getLogsForDate } = useData();
  const { tokens: zoomTokens, isAuthenticated: isZoomAuth, signIn: zoomSignIn } = useZoomAuth();

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [rating, setRating] = useState<'good' | 'okay' | 'struggled' | null>(null);
  const [struggles, setStruggles] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = getLogsForDate(today);

  const toggleStruggle = (id: string) => {
    setStruggles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent = addStudent({ name: newStudentName.trim() });
    setNewStudentName('');
    setShowAddStudent(false);
    setSelectedStudentId(newStudent.id);
  };

  const handleDeleteStudent = (student: { id: string; name: string }) => {
    Alert.alert('Delete Student', `Remove ${student.name}? This will also delete their scheduled lessons.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          if (selectedStudentId === student.id) setSelectedStudentId(null);
          removeStudent(student.id);
        }
      },
    ]);
  };

  const handleExtractInsights = () => {
    if (!notes.trim()) return;
    setIsExtracting(true);
    setTimeout(() => {
      setAiInsights(`Key observation: Focus on ${topic || 'this topic'} next session. Consider shorter practice sets.`);
      setIsExtracting(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!selectedStudent || !rating) return;

    addLessonLog({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      date: today,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      topic: topic || 'General',
      rating,
      struggles,
      notes,
      aiInsights: aiInsights || undefined,
    });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Reset
    setSelectedStudentId(null);
    setTopic('');
    setRating(null);
    setStruggles([]);
    setNotes('');
    setAiInsights(null);
  };

  // Zoom에서 미팅 자동 가져오기
  const syncFromZoom = async () => {
    if (!zoomTokens?.accessToken) {
      Alert.alert(
        'Connect Zoom',
        'Connect your Zoom account to auto-import completed meetings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect', onPress: zoomSignIn },
        ]
      );
      return;
    }

    setIsSyncing(true);
    try {
      const meetings = await getPastMeetings(zoomTokens.accessToken, 7);
      const sessions = await meetingsToChalkSessions(zoomTokens.accessToken, meetings);

      let syncedCount = 0;
      for (const session of sessions) {
        // 이미 존재하는 기록인지 확인
        const existing = lessonLogs.find(l =>
          l.date === session.date && l.time === session.time
        );
        if (existing) continue;

        // 학생 찾기 또는 기본 학생
        let student = students.find(s =>
          s.name.toLowerCase().includes(session.studentName.toLowerCase())
        );
        if (!student && students.length > 0) {
          student = students[0];
        }

        addLessonLog({
          studentId: student?.id || 'zoom-import',
          studentName: session.studentName,
          date: session.date,
          time: session.time,
          topic: session.topic,
          rating: 'good',
          struggles: [],
          notes: `[Auto] Imported from Zoom • ${session.duration}min`,
        });
        syncedCount++;
      }

      if (syncedCount > 0) {
        Alert.alert('Synced!', `${syncedCount} sessions imported from Zoom`);
      } else {
        Alert.alert('Up to date', 'No new meetings found');
      }
    } catch (error) {
      console.error('Zoom sync error:', error);
      Alert.alert('Sync Failed', 'Could not sync with Zoom');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteLog = (logId: string, studentName: string) => {
    Alert.alert('Delete Log', `Remove this log for ${studentName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeLessonLog(logId) },
    ]);
  };

  const filteredTopics = RECENT_TOPICS.filter(t =>
    t.toLowerCase().includes(topic.toLowerCase()) && topic.length > 0
  );

  const getRatingIcon = (r: string) => {
    const rating = RATINGS.find(x => x.id === r);
    if (!rating) return null;
    return <rating.Icon size={14} color={rating.color} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Log Lesson</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {/* Today's Logs */}
        {todaysLogs.length > 0 && (
          <View style={styles.todayLogs}>
            <Text style={styles.todayLabel}>Today ({todaysLogs.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todaysLogs.map(log => (
                <View key={log.id} style={styles.logChip}>
                  {getRatingIcon(log.rating)}
                  <Text style={styles.logChipText}>{log.studentName}</Text>
                  <Text style={styles.logChipTime}>{log.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Student Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student</Text>
          <View style={styles.studentList}>
            {students.map(student => {
              const isSelected = selectedStudentId === student.id;
              return (
                <Pressable
                  key={student.id}
                  style={[styles.studentItem, isSelected && styles.studentItemSelected]}
                  onPress={() => setSelectedStudentId(student.id)}
                  onLongPress={() => handleDeleteStudent(student)}
                >
                  <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                    <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                      {student.name[0]}
                    </Text>
                  </View>
                  <Text style={[styles.studentName, isSelected && styles.studentNameSelected]}>
                    {student.name}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable style={styles.addStudentBtn} onPress={() => setShowAddStudent(true)}>
              <PlusIcon size={14} color={colors.accent.default} />
            </Pressable>
          </View>
        </View>

        {/* Topic + Rating */}
        {selectedStudent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What did you cover?</Text>

            <View style={styles.topicInputWrapper}>
              <TextInput
                style={styles.topicInput}
                placeholder="e.g., Chapter 3, Essay practice..."
                placeholderTextColor={colors.text.muted}
                value={topic}
                onChangeText={(v) => {
                  setTopic(v);
                  setShowTopicSuggestions(v.length > 0);
                }}
                onFocus={() => setShowTopicSuggestions(topic.length > 0)}
                onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
              />
              {showTopicSuggestions && filteredTopics.length > 0 && (
                <View style={styles.suggestions}>
                  {filteredTopics.map((t, i) => (
                    <Pressable key={i} style={styles.suggestionItem} onPress={() => { setTopic(t); setShowTopicSuggestions(false); }}>
                      <Text style={styles.suggestionText}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Text style={styles.subLabel}>How did it go?</Text>
            <View style={styles.ratingRow}>
              {RATINGS.map(r => {
                const isSelected = rating === r.id;
                return (
                  <Pressable
                    key={r.id}
                    style={[styles.ratingBtn, isSelected && { backgroundColor: `${r.color}15` }]}
                    onPress={() => setRating(r.id)}
                  >
                    <r.Icon size={28} color={isSelected ? r.color : colors.text.muted} />
                    <Text style={[styles.ratingLabel, isSelected && { color: r.color }]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.subLabel}>Where did they struggle? (optional)</Text>
            <View style={styles.struggleRow}>
              {STRUGGLES.map(type => {
                const isSelected = struggles.includes(type.id);
                return (
                  <Pressable
                    key={type.id}
                    style={[styles.struggleChip, isSelected && styles.struggleChipSelected]}
                    onPress={() => toggleStruggle(type.id)}
                  >
                    <type.Icon size={14} color={isSelected ? '#F59E0B' : colors.text.muted} />
                    <Text style={[styles.struggleText, isSelected && styles.struggleTextSelected]}>{type.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Notes */}
        {selectedStudent && rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Quick notes..."
              placeholderTextColor={colors.text.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {notes.length > 0 && (
              <TouchableOpacity style={styles.extractBtn} onPress={handleExtractInsights} disabled={isExtracting}>
                {isExtracting ? (
                  <ActivityIndicator size="small" color={colors.accent.default} />
                ) : (
                  <>
                    <SparklesIcon size={14} color={colors.accent.default} />
                    <Text style={styles.extractBtnText}>Extract Insights</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {aiInsights && (
              <View style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <CheckCircleIcon size={12} color={colors.accent.default} />
                  <Text style={styles.insightLabel}>AI Insight</Text>
                </View>
                <Text style={styles.insightText}>{aiInsights}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <SendIcon size={14} color={colors.bg.base} />
              <Text style={styles.saveBtnText}>Save Lesson</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Quick Add Student Modal */}
      <Modal visible={showAddStudent} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.quickModal}>
            <View style={styles.quickModalHeader}>
              <Text style={styles.quickModalTitle}>Add Student</Text>
              <TouchableOpacity onPress={() => setShowAddStudent(false)}>
                <XIcon size={18} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.quickInput}
              placeholder="Name"
              placeholderTextColor={colors.text.muted}
              value={newStudentName}
              onChangeText={setNewStudentName}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.quickSaveBtn, !newStudentName.trim() && styles.quickSaveBtnDisabled]}
              onPress={handleAddStudent}
              disabled={!newStudentName.trim()}
            >
              <Text style={styles.quickSaveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <CheckCircleIcon size={16} color="#22C55E" />
          <Text style={styles.toastText}>Lesson saved!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  content: { paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: 100 },

  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.lg },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  date: { ...typography.caption, color: colors.text.muted },

  todayLogs: { marginBottom: spacing['2xl'] },
  todayLabel: { ...typography.caption, color: colors.text.muted, marginBottom: spacing.sm },
  logChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.bg.secondary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, marginRight: spacing.sm },
  logChipText: { ...typography.small, color: colors.text.primary },
  logChipTime: { ...typography.caption, color: colors.text.muted },

  section: { marginBottom: spacing['2xl'] },
  sectionTitle: { ...typography.caption, color: colors.text.muted, marginBottom: spacing.md, textTransform: 'uppercase' },
  subLabel: { ...typography.caption, color: colors.text.muted, marginTop: spacing.lg, marginBottom: spacing.sm },

  studentList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  studentItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.bg.secondary },
  studentItemSelected: { backgroundColor: colors.accent.muted },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg.tertiary, alignItems: 'center', justifyContent: 'center' },
  avatarSelected: { backgroundColor: colors.accent.default },
  avatarText: { ...typography.caption, fontWeight: '600', color: colors.text.muted },
  avatarTextSelected: { color: colors.bg.base },
  studentName: { ...typography.small, color: colors.text.primary },
  studentNameSelected: { color: colors.accent.default },
  addStudentBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border.default, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },

  topicInputWrapper: { position: 'relative', zIndex: 10 },
  topicInput: { backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary },
  suggestions: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, marginTop: spacing.xs, overflow: 'hidden' },
  suggestionItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  suggestionText: { ...typography.body, color: colors.text.primary },

  ratingRow: { flexDirection: 'row', gap: spacing.md },
  ratingBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, backgroundColor: colors.bg.secondary, borderRadius: radius.md },
  ratingLabel: { ...typography.caption, color: colors.text.muted, marginTop: spacing.xs },

  struggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  struggleChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.bg.secondary, borderRadius: radius.full },
  struggleChipSelected: { backgroundColor: '#F59E0B20' },
  struggleText: { ...typography.caption, color: colors.text.secondary },
  struggleTextSelected: { color: '#F59E0B' },

  notesInput: { backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary, minHeight: 80, textAlignVertical: 'top' },
  extractBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.md, paddingVertical: spacing.md },
  extractBtnText: { ...typography.small, color: colors.accent.default },

  insightCard: { backgroundColor: colors.accent.subtle, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  insightLabel: { ...typography.caption, color: colors.accent.default },
  insightText: { ...typography.small, color: colors.text.secondary, lineHeight: 18 },

  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: components.button.lg, backgroundColor: colors.accent.default, borderRadius: radius.md, marginTop: spacing.xl },
  saveBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  quickModal: { backgroundColor: colors.bg.secondary, borderRadius: radius.lg, padding: spacing.xl, width: '100%', maxWidth: 320 },
  quickModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  quickModalTitle: { ...typography.h2, color: colors.text.primary },
  quickInput: { backgroundColor: colors.bg.tertiary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary, marginBottom: spacing.md },
  quickSaveBtn: { height: components.button.md, backgroundColor: colors.accent.default, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  quickSaveBtnDisabled: { backgroundColor: colors.bg.tertiary },
  quickSaveBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },

  // Toast
  toast: { position: 'absolute', bottom: 100, left: spacing.xl, right: spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: '#22C55E40' },
  toastText: { ...typography.body, color: colors.text.primary },
});
