import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { layout } from '@/components/ui/Theme';
import { Card } from '@/components/ui/Card';
import { useData } from '@/lib/DataContext';
import { useGoogleAuth } from '@/lib/useGoogleAuth';
import { useZoomAuth } from '@/lib/useZoomAuth';
import { ChartIcon, ClockIcon, UsersIcon, VerifiedBadge, CheckCircleIcon } from '@/components/Icons';

export default function PortfolioScreen() {
  const { lessonLogs, students } = useData();
  const googleAuth = useGoogleAuth();
  const zoomAuth = useZoomAuth();

  // Statistics
  const totalSessions = lessonLogs.length;
  const totalDuration = lessonLogs.reduce((sum, log) => sum + (log.duration || 60), 0) / 60; // hours
  const totalStudents = students.length;

  return (
    <SafeAreaView style={layout.container} edges={['top']}>
      <ScrollView contentContainerStyle={layout.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={typography.h1}>Portfolio</Text>
          <View style={styles.verifiedContainer}>
            {googleAuth.isAuthenticated && (
                <View style={styles.badge}>
                    <VerifiedBadge size={14} color={colors.accent.default} />
                    <Text style={styles.badgeText}>Google Verified</Text>
                </View>
            )}
            {zoomAuth.isAuthenticated && (
                <View style={styles.badge}>
                    <VerifiedBadge size={14} color="#2D8CFF" />
                    <Text style={styles.badgeText}>Zoom Verified</Text>
                </View>
            )}
          </View>
        </View>

        {/* Hero Stats */}
        <View style={styles.heroGrid}>
            <Card variant="glow" style={styles.heroCard}>
                <View style={styles.iconCircle}>
                    <ChartIcon size={24} color={colors.accent.default} />
                </View>
                <Text style={styles.heroValue}>{totalSessions}</Text>
                <Text style={styles.heroLabel}>Total Sessions</Text>
            </Card>
            <Card style={styles.heroCard}>
                <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
                    <ClockIcon size={24} color={colors.status.warning} />
                </View>
                <Text style={styles.heroValue}>{totalDuration.toFixed(1)}h</Text>
                <Text style={styles.heroLabel}>Teaching Hours</Text>
            </Card>
        </View>

        {/* Weekly Activity (Placeholder for Chart) */}
        <Text style={styles.sectionTitle}>WEEKLY ACTIVITY</Text>
        <Card style={styles.chartCard}>
            <View style={styles.chartBars}>
                {[4, 2, 5, 3, 6, 2, 1].map((h, i) => (
                    <View key={i} style={styles.barContainer}>
                        <View style={[styles.bar, { height: h * 20 }]} />
                        <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* Students Summary */}
        <Text style={styles.sectionTitle}>STUDENTS</Text>
        <Card style={styles.studentsCard}>
            <View style={styles.studentStatRow}>
                <View style={layout.row}>
                    <UsersIcon size={20} color={colors.text.secondary} />
                    <Text style={styles.studentStatLabel}>Active Students</Text>
                </View>
                <Text style={typography.h3}>{totalStudents}</Text>
            </View>
            {students.slice(0, 3).map((s, i) => (
                <View key={s.id} style={styles.studentRow}>
                    <View style={styles.studentAvatar}>
                        <Text style={styles.studentInitials}>{s.name[0]}</Text>
                    </View>
                    <Text style={styles.studentName}>{s.name}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.studentSubject}>{s.subject || 'General'}</Text>
                </View>
            ))}
            {students.length > 3 && (
                <Text style={styles.moreText}>+ {students.length - 3} more</Text>
            )}
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  verifiedContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 4,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
  },
  heroGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  heroCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroValue: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  heroLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
    marginLeft: 4,
    letterSpacing: 1,
  },
  chartCard: {
    marginBottom: spacing['2xl'],
    padding: 24,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 8,
    backgroundColor: colors.accent.default,
    borderRadius: 4,
    opacity: 0.8,
  },
  barLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  studentsCard: {
    marginBottom: 20,
  },
  studentStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  studentStatLabel: {
    ...typography.body,
    marginLeft: 8,
    color: colors.text.secondary,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
  },
  studentName: {
    ...typography.body,
    fontSize: 15,
    color: colors.text.primary,
  },
  studentSubject: {
    ...typography.caption,
    color: colors.text.muted,
  },
  moreText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
