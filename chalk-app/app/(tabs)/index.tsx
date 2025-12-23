import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import Colors, { spacing, typography, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { StudentPicker } from '@/components/ui/StudentPicker';
import { Toast, useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  LevelHighIcon,
  LevelMidIcon,
  LevelLowIcon,
  SparklesIcon,
  SendIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/components/Icons';
import { MOCK_STUDENTS, MOCK_OUTCOMES } from '@/data/mockData';
import { LevelType, OutcomeCheck } from '@/data/types';

// 레벨 라벨 정의
const LEVEL_LABELS: Record<LevelType, string> = {
  high: '잘함',
  mid: '보통',
  low: '어려움',
};

export default function TodayScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [outcomeChecks, setOutcomeChecks] = useState<OutcomeCheck[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedFeedback, setPolishedFeedback] = useState('');
  const [step, setStep] = useState(1);

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);

  useEffect(() => {
    if (selectedStudentId) {
      setOutcomeChecks(MOCK_OUTCOMES.map(o => ({ outcomeId: o.id, level: null })));
      setStep(2);
    }
  }, [selectedStudentId]);

  const handleLevelSelect = (outcomeId: string, level: LevelType) => {
    setOutcomeChecks(prev =>
      prev.map(check =>
        check.outcomeId === outcomeId ? { ...check, level } : check
      )
    );
  };

  const handlePolishFeedback = async () => {
    if (!feedback.trim()) return;
    setIsPolishing(true);

    setTimeout(() => {
      setPolishedFeedback(
        `안녕하세요, ${selectedStudent?.name} 학부모님.\n\n` +
        `오늘 수업에서 ${feedback}\n\n` +
        `궁금하신 점이 있으시면 편하게 말씀해 주세요. 감사합니다!`
      );
      setIsPolishing(false);
      toast.success('AI 수정 완료', '피드백이 다듬어졌어요');
    }, 1500);
  };

  const handleSend = async () => {
    const message = polishedFeedback || feedback;
    const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        toast.success('전송 완료', '카카오톡으로 이동했어요');
      } else {
        toast.error('전송 실패', '카카오톡을 열 수 없어요');
      }
    } catch (error) {
      toast.error('오류 발생', '다시 시도해주세요');
    }

    // Reset
    setSelectedStudentId(null);
    setFeedback('');
    setPolishedFeedback('');
    setStep(1);
    setOutcomeChecks([]);
  };

  const handleReset = () => {
    setSelectedStudentId(null);
    setFeedback('');
    setPolishedFeedback('');
    setStep(1);
    setOutcomeChecks([]);
  };

  const allOutcomesChecked = outcomeChecks.every(c => c.level !== null);

  // 탭바 높이 계산
  const tabBarHeight = 64 + Math.max(insets.bottom, 16) + 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Toast */}
      <Toast
        visible={toast.toast.visible}
        type={toast.toast.type}
        title={toast.toast.title}
        message={toast.toast.message}
        onDismiss={toast.hideToast}
      />

      {/* Background gradient */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            colorScheme === 'dark' ? 'rgba(255, 107, 53, 0.08)' : 'rgba(255, 107, 53, 0.05)',
            'transparent',
          ]}
          style={styles.glowTop}
        />
        <LinearGradient
          colors={[
            'transparent',
            colorScheme === 'dark' ? 'rgba(0, 245, 212, 0.05)' : 'rgba(0, 245, 212, 0.03)',
          ]}
          style={styles.glowBottom}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: tabBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>오늘의 수업</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>
        </Animated.View>

        {/* Empty State */}
        {MOCK_STUDENTS.length === 0 ? (
          <EmptyState
            type="students"
            title="아직 학생이 없어요"
            description="학생을 먼저 등록하면 수업을 기록할 수 있어요"
            actionLabel="학생 추가하기"
            onAction={() => {/* 학생 탭으로 이동 */}}
          />
        ) : (
          <>
            {/* Step 1: Student Selection - 드롭다운 방식 */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              style={styles.section}
            >
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                학생 선택
              </Text>
              
              <StudentPicker
                students={MOCK_STUDENTS}
                selectedId={selectedStudentId}
                onSelect={setSelectedStudentId}
              />
            </Animated.View>

            {/* Step 2: Outcome Checks */}
            {step >= 2 && selectedStudentId && (
              <Animated.View 
                entering={FadeInDown.springify()}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    학습 목표 달성도
                  </Text>
                  <Pressable onPress={handleReset}>
                    <Text style={[styles.resetText, { color: colors.textMuted }]}>
                      초기화
                    </Text>
                  </Pressable>
                </View>

                <GlowCard variant="glass" style={styles.outcomeCard} contentStyle={{ padding: 0 }}>
                  {MOCK_OUTCOMES.map((outcome, idx) => {
                    const check = outcomeChecks.find(c => c.outcomeId === outcome.id);
                    return (
                      <View
                        key={outcome.id}
                        style={[
                          styles.outcomeRow,
                          idx < MOCK_OUTCOMES.length - 1 && {
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border
                          }
                        ]}
                      >
                        <Text 
                          style={[styles.outcomeTitle, { color: colors.text }]}
                          accessibilityLabel={`${outcome.title} 달성도`}
                        >
                          {outcome.title}
                        </Text>
                        <View style={styles.levelButtons}>
                          {(['high', 'mid', 'low'] as LevelType[]).map((level) => (
                            <LevelButton
                              key={level}
                              level={level}
                              selected={check?.level === level}
                              onPress={() => handleLevelSelect(outcome.id, level)}
                              colors={colors}
                            />
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </GlowCard>

                {/* 레벨 범례 */}
                <View style={styles.levelLegend}>
                  {(['high', 'mid', 'low'] as LevelType[]).map((level) => (
                    <View key={level} style={styles.legendItem}>
                      <View style={[
                        styles.legendDot,
                        { backgroundColor: getLevelColor(level, colors) }
                      ]} />
                      <Text style={[styles.legendText, { color: colors.textMuted }]}>
                        {LEVEL_LABELS[level]}
                      </Text>
                    </View>
                  ))}
                </View>

                {allOutcomesChecked && (
                  <Animated.View entering={FadeInUp.springify()}>
                    <NeonButton
                      title="피드백 작성하기"
                      variant="outline"
                      glowColor="mint"
                      onPress={() => setStep(3)}
                      icon={<ChevronRightIcon size={18} color={colors.tintSecondary} />}
                      iconPosition="right"
                      fullWidth
                      style={{ marginTop: spacing.md }}
                    />
                  </Animated.View>
                )}
              </Animated.View>
            )}

            {/* Step 3: Feedback */}
            {step >= 3 && (
              <Animated.View 
                entering={FadeInDown.springify()}
                style={styles.section}
              >
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                  학부모 피드백
                </Text>

                <TextInput
                  style={[
                    styles.feedbackInput,
                    {
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.text,
                      borderColor: feedback ? colors.tint : colors.border,
                    },
                  ]}
                  placeholder="오늘 수업 내용을 간단히 적어주세요..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  value={feedback}
                  onChangeText={setFeedback}
                  accessibilityLabel="피드백 입력"
                  accessibilityHint="수업 내용을 입력하세요"
                />

                <NeonButton
                  title="AI로 다듬기"
                  variant="secondary"
                  glowColor="purple"
                  icon={<SparklesIcon size={18} color={colors.tintAccent} />}
                  onPress={handlePolishFeedback}
                  loading={isPolishing}
                  disabled={!feedback.trim()}
                  fullWidth
                  style={{ marginTop: spacing.md }}
                  textStyle={{ color: colors.tintAccent }}
                />

                {polishedFeedback && (
                  <Animated.View entering={FadeInUp.springify()}>
                    <GlowCard 
                      variant="neon" 
                      glowColor="mint"
                      style={styles.polishedCard}
                    >
                      <View style={styles.polishedHeader}>
                        <CheckCircleIcon size={16} color={colors.tintSecondary} />
                        <Text style={[styles.polishedLabel, { color: colors.tintSecondary }]}>
                          AI 수정 완료
                        </Text>
                      </View>
                      <Text style={[styles.polishedText, { color: colors.textSecondary }]}>
                        {polishedFeedback}
                      </Text>
                    </GlowCard>
                  </Animated.View>
                )}

                <NeonButton
                  title="카카오톡 전송"
                  variant="gradient"
                  glowColor="orange"
                  icon={<SendIcon size={18} color="#fff" />}
                  onPress={handleSend}
                  disabled={!feedback.trim() && !polishedFeedback}
                  fullWidth
                  style={{ marginTop: spacing.lg }}
                />
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// 레벨 버튼 컴포넌트 - 라벨 포함
function LevelButton({
  level,
  selected,
  onPress,
  colors,
}: {
  level: LevelType;
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  const levelColor = getLevelColor(level, colors);
  const bgColor = selected ? levelColor + '20' : 'transparent';
  const Icon = level === 'high' ? LevelHighIcon : level === 'mid' ? LevelMidIcon : LevelLowIcon;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.levelBtn,
        {
          backgroundColor: bgColor,
          borderColor: selected ? levelColor : 'transparent',
          borderWidth: selected ? 1.5 : 0,
          transform: [{ scale: pressed ? 0.9 : selected ? 1.05 : 1 }],
        },
      ]}
      onPress={onPress}
      accessibilityLabel={`${LEVEL_LABELS[level]} 선택`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Icon size={18} color={selected ? levelColor : colors.textMuted} />
    </Pressable>
  );
}

function getLevelColor(level: LevelType, colors: any) {
  switch (level) {
    case 'high': return colors.levelHigh;
    case 'mid': return colors.levelMid;
    case 'low': return colors.levelLow;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요 ☀️';
  if (hour < 18) return '좋은 오후에요 🌤️';
  return '좋은 저녁이에요 🌙';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    height: 400,
    borderRadius: 200,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  greeting: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  resetText: {
    ...typography.bodySmall,
  },
  outcomeCard: {
    // padding handled by contentStyle
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  outcomeTitle: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.md,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
  },
  feedbackInput: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    lineHeight: 22,
  },
  polishedCard: {
    marginTop: spacing.md,
  },
  polishedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  polishedLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  polishedText: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
});
