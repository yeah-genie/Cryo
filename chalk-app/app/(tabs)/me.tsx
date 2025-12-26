import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { colors, typography, spacing, radius, components } from '@/constants/Colors';
import {
    ChevronRightIcon,
    ClockIcon,
    VideoIcon,
    UsersIcon,
    CalendarIcon,
    BarChartIcon,
    CheckCircleIcon,
} from '@/components/Icons';
import { useData } from '@/lib/DataContext';
import { useGoogleAuth } from '@/lib/useGoogleAuth';
import { useZoomAuth } from '@/lib/useZoomAuth';
import { useStripeAuth } from '@/lib/useStripeAuth';
import { getCalendarEvents, calculateCalendarStats, CalendarStats } from '@/lib/calendarService';

// Stat card with trend and SVG icon
const StatCard = ({ label, value, change, isUp, Icon }: {
    label: string;
    value: string;
    change: string;
    isUp: boolean;
    Icon: React.FC<{ size?: number; color?: string }>;
}) => (
    <View style={styles.statCard}>
        <View style={styles.statCardHeader}>
            <View style={styles.statIconContainer}>
                <Icon size={18} color={colors.accent.default} />
            </View>
            <View style={[styles.changeBadge, isUp ? styles.changeUp : styles.changeDown]}>
                <Text style={[styles.changeText, isUp ? styles.changeTextUp : styles.changeTextDown]}>
                    {isUp ? '↑' : '↓'} {change}
                </Text>
            </View>
        </View>
        <Text style={styles.statCardLabel}>{label}</Text>
        <Text style={styles.statCardValue}>{value}</Text>
    </View>
);

export default function MeScreen() {
    const { students, lessonLogs, scheduledLessons } = useData();
    const [notifications, setNotifications] = useState(true);

    // Auth hooks
    const { tokens, isAuthenticated, signIn, signOut, isLoading: authLoading } = useGoogleAuth();
    const { tokens: zoomTokens, isAuthenticated: isZoomAuth, signIn: zoomSignIn, signOut: zoomSignOut, isLoading: zoomLoading } = useZoomAuth();
    const { tokens: stripeTokens, isAuthenticated: isStripeAuth, signIn: stripeSignIn, signOut: stripeSignOut, isLoading: stripeLoading } = useStripeAuth();

    const [calendarStats, setCalendarStats] = useState<CalendarStats | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Calculate hours from lessons (estimate 60 mins each)
    const totalHours = calendarStats?.totalHours || lessonLogs.length;
    const thisMonthLessons = calendarStats?.totalSessions || lessonLogs.filter(l => {
        const logDate = new Date(l.date);
        const now = new Date();
        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }).length;

    // Fetch calendar data when authenticated
    useEffect(() => {
        if (isAuthenticated && tokens?.accessToken) {
            syncCalendar();
        }
    }, [isAuthenticated, tokens]);

    const syncCalendar = async () => {
        if (!tokens?.accessToken) return;

        setIsSyncing(true);
        try {
            const events = await getCalendarEvents(tokens.accessToken, 30);
            const stats = calculateCalendarStats(events);
            setCalendarStats(stats);
        } catch (error) {
            console.error('Calendar sync error:', error);
            Alert.alert('Sync Error', 'Failed to sync calendar. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleGoogleConnect = async () => {
        if (isAuthenticated) {
            Alert.alert('Disconnect Google', 'Stop syncing your Google Calendar?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Disconnect', style: 'destructive', onPress: signOut },
            ]);
        } else {
            await signIn();
        }
    };

    const handleExportData = async () => {
        try {
            const exportData = {
                exportedAt: new Date().toISOString(),
                students: students,
                lessonLogs: lessonLogs,
                scheduledLessons: scheduledLessons,
                stats: {
                    totalHours,
                    thisMonthLessons,
                    totalStudents: students.length,
                }
            };

            const jsonString = JSON.stringify(exportData, null, 2);

            // Use Share API to export
            const { Share } = await import('react-native');
            await Share.share({
                message: jsonString,
                title: 'Chalk Data Export',
            });
        } catch (error) {
            Alert.alert('Export Failed', 'Could not export data. Please try again.');
        }
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout? This will clear all local data.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    // Clear all stored tokens
                    await signOut();
                    if (isZoomAuth) await zoomSignOut();
                    if (isStripeAuth) await stripeSignOut();
                    Alert.alert('Logged Out', 'All integrations disconnected.');
                }
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Good day</Text>
                    <Text style={styles.subtitle}>Here's your tutoring business overview.</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Total Hours"
                        value={`${totalHours}`}
                        change={calendarStats ? 'synced' : '12%'}
                        isUp={true}
                        Icon={ClockIcon}
                    />
                    <StatCard
                        label="Sessions"
                        value={`${thisMonthLessons}`}
                        change={calendarStats ? `${calendarStats.weeklyAverage}/wk` : '5%'}
                        isUp={true}
                        Icon={VideoIcon}
                    />
                    <StatCard
                        label="Students"
                        value={`${calendarStats?.uniqueStudents || students.length}`}
                        change="2"
                        isUp={true}
                        Icon={UsersIcon}
                    />
                    <StatCard
                        label="Meet Sessions"
                        value={`${calendarStats?.meetSessions || scheduledLessons.length}`}
                        change={calendarStats ? 'verified' : 'Weekly'}
                        isUp={true}
                        Icon={CalendarIcon}
                    />
                </View>

                {/* Weekly Overview Chart placeholder */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <View style={styles.chartTitleRow}>
                            <BarChartIcon size={16} color={colors.text.muted} />
                            <Text style={styles.cardTitle}>Weekly Teaching Load</Text>
                        </View>
                        <View style={styles.chartPeriod}>
                            <Text style={styles.chartPeriodText}>Last 7 Days</Text>
                        </View>
                    </View>

                    {/* Simple bar chart */}
                    <View style={styles.chartBars}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                            const height = [40, 65, 30, 80, 50, 100, 20][idx];
                            const isHigh = height > 70;
                            return (
                                <View key={day} style={styles.barContainer}>
                                    <View style={[styles.bar, { height }, isHigh && styles.barHighlight]} />
                                    <Text style={styles.barLabel}>{day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Integrations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Integrations</Text>

                    <TouchableOpacity
                        style={styles.integrationRow}
                        onPress={handleGoogleConnect}
                        disabled={authLoading}
                    >
                        <View style={styles.integrationLeft}>
                            <View style={[styles.integrationIcon, { backgroundColor: '#4285F420' }]}>
                                <CalendarIcon size={18} color="#4285F4" />
                            </View>
                            <View style={styles.integrationTextContainer}>
                                <Text style={styles.settingLabel}>Google Calendar</Text>
                                <Text style={styles.integrationDesc} numberOfLines={1}>
                                    {isAuthenticated ? 'Connected' : 'Sync your schedule'}
                                </Text>
                            </View>
                        </View>
                        {authLoading || isSyncing ? (
                            <ActivityIndicator size="small" color={colors.accent.default} />
                        ) : isAuthenticated ? (
                            <CheckCircleIcon size={20} color={colors.status.success} />
                        ) : (
                            <View style={styles.connectBtn}>
                                <Text style={styles.connectBtnText}>Connect</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.integrationRow}
                        onPress={isZoomAuth ? zoomSignOut : zoomSignIn}
                        disabled={zoomLoading}
                    >
                        <View style={styles.integrationLeft}>
                            <View style={[styles.integrationIcon, { backgroundColor: '#2D8CFF20' }]}>
                                <VideoIcon size={18} color="#2D8CFF" />
                            </View>
                            <View style={styles.integrationTextContainer}>
                                <Text style={styles.settingLabel}>Zoom</Text>
                                <Text style={styles.integrationDesc} numberOfLines={1}>
                                    {isZoomAuth ? 'Connected' : 'Sync your meetings'}
                                </Text>
                            </View>
                        </View>
                        {zoomLoading ? (
                            <ActivityIndicator size="small" color={colors.accent.default} />
                        ) : isZoomAuth ? (
                            <CheckCircleIcon size={20} color={colors.status.success} />
                        ) : (
                            <View style={styles.connectBtn}>
                                <Text style={styles.connectBtnText}>Connect</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.integrationRow}
                        onPress={isStripeAuth ? stripeSignOut : stripeSignIn}
                        disabled={stripeLoading}
                    >
                        <View style={styles.integrationLeft}>
                            <View style={[styles.integrationIcon, { backgroundColor: '#635BFF20' }]}>
                                <ClockIcon size={18} color="#635BFF" />
                            </View>
                            <View style={styles.integrationTextContainer}>
                                <Text style={styles.settingLabel}>Stripe</Text>
                                <Text style={styles.integrationDesc} numberOfLines={1}>
                                    {isStripeAuth ? 'Connected' : 'Track your earnings'}
                                </Text>
                            </View>
                        </View>
                        {stripeLoading ? (
                            <ActivityIndicator size="small" color={colors.accent.default} />
                        ) : isStripeAuth ? (
                            <CheckCircleIcon size={20} color={colors.status.success} />
                        ) : (
                            <View style={styles.connectBtn}>
                                <Text style={styles.connectBtnText}>Connect</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Push Notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: colors.bg.tertiary, true: colors.accent.default }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Language</Text>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>English</Text>
                            <ChevronRightIcon size={16} color={colors.text.muted} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
                        <Text style={styles.settingLabel}>Export Data</Text>
                        <ChevronRightIcon size={16} color={colors.text.muted} />
                    </TouchableOpacity>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                        <Text style={styles.settingLabel}>Logout</Text>
                        <ChevronRightIcon size={16} color={colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={[styles.settingLabel, { color: colors.status.error }]}>Delete Account</Text>
                        <ChevronRightIcon size={16} color={colors.status.error} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Chalk v1.0.0</Text>
                    <Text style={styles.footerText}>Built for tutors, by tutors.</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.base },
    content: { paddingHorizontal: spacing.lg, paddingTop: 56, paddingBottom: 100 },

    // Header
    header: { marginBottom: spacing['2xl'] },
    greeting: { ...typography.h1, color: colors.text.primary },
    subtitle: { ...typography.body, color: colors.text.muted, marginTop: spacing.xs },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing['2xl'],
    },
    statCard: {
        width: '47%',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    statCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        backgroundColor: colors.accent.muted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changeBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    changeUp: { backgroundColor: '#22C55E20' },
    changeDown: { backgroundColor: '#EF444420' },
    changeText: { ...typography.caption },
    changeTextUp: { color: colors.status.success },
    changeTextDown: { color: colors.status.error },
    statCardLabel: { ...typography.caption, color: colors.text.muted },
    statCardValue: { ...typography.stat, color: colors.text.primary, marginTop: spacing.xs },

    // Chart Card
    chartCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginBottom: spacing['2xl'],
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    chartTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    cardTitle: { ...typography.h3, color: colors.text.primary },
    chartPeriod: {
        backgroundColor: colors.bg.tertiary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
    },
    chartPeriodText: { ...typography.caption, color: colors.text.secondary },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 24,
        backgroundColor: colors.accent.hover,
        borderRadius: radius.xs,
        marginBottom: spacing.sm,
    },
    barHighlight: {
        backgroundColor: colors.accent.default,
    },
    barLabel: {
        ...typography.micro,
        color: colors.text.muted,
    },

    // Section
    section: { marginBottom: spacing['2xl'] },
    sectionTitle: {
        ...typography.caption,
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginBottom: spacing.md,
    },

    // Integrations
    integrationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    integrationLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    integrationIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    integrationTextContainer: {
        flex: 1,
    },
    integrationDesc: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 2,
    },
    connectBtn: {
        backgroundColor: colors.accent.default,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
    },
    connectBtnText: {
        ...typography.caption,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    comingSoonBadge: {
        backgroundColor: colors.bg.tertiary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    comingSoonText: {
        ...typography.micro,
        color: colors.text.muted,
    },

    // Settings
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    settingLabel: { ...typography.body, color: colors.text.primary },
    settingRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    settingValue: { ...typography.body, color: colors.text.muted },

    // Footer
    footer: { alignItems: 'center', paddingVertical: spacing.xl },
    footerText: { ...typography.caption, color: colors.text.muted },
});
