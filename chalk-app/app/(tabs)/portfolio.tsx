import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, typography, spacing, radius, components, gradients } from '@/constants/Colors';
import { ShareIcon, CheckCircleIcon, ZapIcon, BarChartIcon, SearchIcon } from '@/components/Icons';
import { useData } from '@/lib/DataContext';

// Badge components with SVG icons
const QuickResponseBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.yellow + '20' }]}>
        <ZapIcon size={18} color={colors.badge.yellow} />
    </View>
);

const ConsistentBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.emerald + '20' }]}>
        <BarChartIcon size={18} color={colors.badge.emerald} />
    </View>
);

const DetailedBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.blue + '20' }]}>
        <SearchIcon size={18} color={colors.badge.blue} />
    </View>
);

export default function PortfolioScreen() {
    const { students, lessonLogs, scheduledLessons } = useData();

    // Calculate stats
    const totalLessons = lessonLogs.length;
    const totalStudents = students.length;
    const goodLessons = lessonLogs.filter(l => l.rating === 'good').length;
    const retentionRate = totalLessons > 0 ? Math.round((goodLessons / totalLessons) * 100) : 0;

    // Recent activity (last 5 logs)
    const recentActivity = lessonLogs.slice(0, 5);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `📚 My Tutoring Portfolio\n\n✅ ${totalLessons}+ sessions completed\n👥 ${totalStudents} students\n🎯 ${retentionRate}% success rate\n\nPowered by Chalk`,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero Banner with Gradient */}
                <LinearGradient
                    colors={gradients.hero as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroBanner}
                >
                    <View style={styles.heroOverlay} />
                </LinearGradient>

                {/* Profile Card - overlapping banner */}
                <View style={styles.profileSection}>
                    <View style={styles.profileCard}>
                        {/* Avatar with verified badge */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>Y</Text>
                            </View>
                            <View style={styles.verifiedBadge}>
                                <CheckCircleIcon size={16} color="#FFFFFF" />
                            </View>
                        </View>

                        <Text style={styles.profileName}>Your Name</Text>
                        <Text style={styles.profileTitle}>Private Tutor</Text>

                        {/* Subject tags */}
                        <View style={styles.subjectTags}>
                            <View style={styles.subjectTag}>
                                <Text style={styles.subjectTagText}>Math</Text>
                            </View>
                            <View style={styles.subjectTag}>
                                <Text style={styles.subjectTagText}>Science</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.primaryBtn}>
                                <Text style={styles.primaryBtnText}>Inquire for Lessons</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secondaryRow}>
                            <TouchableOpacity style={styles.secondaryBtn}>
                                <Text style={styles.secondaryBtnText}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
                                <ShareIcon size={14} color={colors.text.secondary} />
                                <Text style={styles.secondaryBtnText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Bar */}
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>SESSIONS</Text>
                            <Text style={styles.statValue}>{totalLessons}+</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>RETENTION</Text>
                            <Text style={styles.statValue}>{retentionRate}%</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>STUDENTS</Text>
                            <Text style={styles.statValue}>{totalStudents}</Text>
                        </View>
                    </View>

                    {/* Verified Badges */}
                    <View style={styles.badgesCard}>
                        <Text style={styles.cardTitle}>Verified Reputation</Text>

                        <View style={styles.badgeRow}>
                            <QuickResponseBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Quick Response</Text>
                                <Text style={styles.badgeDesc}>Replies in &lt; 15 mins</Text>
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            <ConsistentBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Consistent</Text>
                                <Text style={styles.badgeDesc}>{scheduledLessons.length}+ sessions/week</Text>
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            <DetailedBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Detailed</Text>
                                <Text style={styles.badgeDesc}>High report quality</Text>
                            </View>
                        </View>
                    </View>

                    {/* Session Activity Timeline */}
                    <View style={styles.activityCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Verified Session Activity</Text>
                            <Text style={styles.cardSubtitle}>REAL-TIME</Text>
                        </View>

                        <View style={styles.timeline}>
                            {recentActivity.length === 0 ? (
                                <Text style={styles.emptyText}>No sessions yet</Text>
                            ) : (
                                recentActivity.map((log, idx) => (
                                    <View key={log.id} style={styles.timelineItem}>
                                        <View style={styles.timelineDot}>
                                            <View style={styles.timelineDotInner} />
                                        </View>
                                        {idx < recentActivity.length - 1 && <View style={styles.timelineLine} />}
                                        <View style={styles.timelineContent}>
                                            <View style={styles.timelineHeader}>
                                                <Text style={styles.timelineStudent}>
                                                    {log.studentName.split(' ')[0][0]}.
                                                    {log.studentName.split(' ')[1]?.[0] || ''}.
                                                </Text>
                                                <Text style={styles.timelineTime}>{log.date}</Text>
                                            </View>
                                            <Text style={styles.timelineTopic}>{log.topic}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>

                        <Text style={styles.privacyNote}>
                            Privacy: Student identities are anonymized. Data verified via session logs.
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.base },
    content: { paddingBottom: 100 },

    // Hero Banner
    heroBanner: {
        height: 160,
        position: 'relative',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },

    // Profile Section
    profileSection: {
        marginTop: -80,
        paddingHorizontal: spacing.lg,
    },

    // Profile Card
    profileCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing['2xl'],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: radius.lg,
        backgroundColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.bg.secondary,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.bg.secondary,
    },
    profileName: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    profileTitle: {
        ...typography.body,
        color: colors.accent.default,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    subjectTags: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    subjectTag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    subjectTagText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    actionRow: {
        width: '100%',
        marginBottom: spacing.sm,
    },
    primaryBtn: {
        height: components.button.lg,
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        ...typography.body,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    secondaryBtn: {
        flex: 1,
        height: components.button.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    secondaryBtnText: {
        ...typography.small,
        color: colors.text.secondary,
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.xs,
    },
    statValue: {
        ...typography.stat,
        color: colors.text.primary,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border.default,
        marginHorizontal: spacing.md,
    },

    // Badges Card
    badgesCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeInfo: {
        marginLeft: spacing.md,
    },
    badgeTitle: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
    },
    badgeDesc: {
        ...typography.caption,
        color: colors.text.muted,
    },

    // Activity Card
    activityCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    cardSubtitle: {
        ...typography.caption,
        color: colors.text.muted,
    },
    timeline: {
        position: 'relative',
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        position: 'relative',
    },
    timelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.bg.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    timelineDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent.default,
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 32,
        bottom: -spacing.lg,
        width: 2,
        backgroundColor: colors.border.default,
    },
    timelineContent: {
        flex: 1,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    timelineStudent: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
    },
    timelineTime: {
        ...typography.caption,
        color: colors.accent.default,
    },
    timelineTopic: {
        ...typography.caption,
        color: colors.text.muted,
        fontStyle: 'italic',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
        paddingVertical: spacing.xl,
    },
    privacyNote: {
        ...typography.caption,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
});
