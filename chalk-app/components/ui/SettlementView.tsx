import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useData, Student, LessonLog } from '@/lib/DataContext';
import {
    CheckCircleIcon, ShareIcon, ChevronLeftIcon, ChevronRightIcon,
    AlertCircleIcon, DollarIcon
} from '@/components/Icons';

interface SettlementViewProps {
    onClose?: () => void;
}

interface StudentSettlement {
    student: Student;
    lessons: LessonLog[];
    totalHours: number;
    totalAmount: number;
    taxAmount: number;
    netAmount: number;
    unpaidCount: number;
}

export function SettlementView({ onClose }: SettlementViewProps) {
    const { students, lessonLogs, updateStudent } = useData();
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    // Parse month
    const [year, month] = currentMonth.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    // Filter logs for current month
    const monthLogs = useMemo(() => {
        return lessonLogs.filter(log => log.date.startsWith(currentMonth));
    }, [lessonLogs, currentMonth]);

    // Calculate settlement per student
    const settlements: StudentSettlement[] = useMemo(() => {
        return students.map(student => {
            const studentLogs = monthLogs.filter(log => log.studentId === student.id);
            const totalHours = studentLogs.reduce((sum, log) => sum + (log.duration || 60) / 60, 0);
            const hourlyRate = student.hourlyRate || 0;
            const totalAmount = totalHours * hourlyRate;
            const taxRate = student.taxRate || 0;
            const taxAmount = totalAmount * taxRate;
            const netAmount = totalAmount - taxAmount;
            const unpaidCount = studentLogs.filter(log => !log.isPaid).length;

            return {
                student,
                lessons: studentLogs,
                totalHours,
                totalAmount,
                taxAmount,
                netAmount,
                unpaidCount,
            };
        }).filter(s => s.lessons.length > 0);
    }, [students, monthLogs]);

    // Totals
    const totals = useMemo(() => {
        return settlements.reduce((acc, s) => ({
            lessons: acc.lessons + s.lessons.length,
            hours: acc.hours + s.totalHours,
            amount: acc.amount + s.totalAmount,
            tax: acc.tax + s.taxAmount,
            net: acc.net + s.netAmount,
            unpaid: acc.unpaid + s.unpaidCount,
        }), { lessons: 0, hours: 0, amount: 0, tax: 0, net: 0, unpaid: 0 });
    }, [settlements]);

    // Navigation
    const prevMonth = () => {
        const date = new Date(year, month - 2);
        setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    };

    const nextMonth = () => {
        const date = new Date(year, month);
        setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    };

    // Share settlement
    const handleShare = async (settlement?: StudentSettlement) => {
        let content = '';

        if (settlement) {
            content = `
📚 Lesson Settlement - ${monthName}

Student: ${settlement.student.name}
Lessons: ${settlement.lessons.length}
Hours: ${settlement.totalHours.toFixed(1)}h
Rate: $${(settlement.student.hourlyRate || 0).toLocaleString()}/hr

Total: $${settlement.totalAmount.toLocaleString()}
${settlement.taxAmount > 0 ? `Tax (${(settlement.student.taxRate || 0) * 100}%): -$${settlement.taxAmount.toLocaleString()}` : ''}
Net Amount: $${settlement.netAmount.toLocaleString()}

---
Sent via Chalk
      `.trim();
        } else {
            content = `
📚 Monthly Settlement - ${monthName}

Total Lessons: ${totals.lessons}
Total Hours: ${totals.hours.toFixed(1)}h
Gross Amount: $${totals.amount.toLocaleString()}
${totals.tax > 0 ? `Total Tax: -$${totals.tax.toLocaleString()}` : ''}
Net Amount: $${totals.net.toLocaleString()}

---
Students:
${settlements.map(s => `• ${s.student.name}: ${s.lessons.length} lessons - $${s.netAmount.toLocaleString()}`).join('\n')}

Sent via Chalk
      `.trim();
        }

        try {
            await Share.share({ message: content, title: `Settlement - ${monthName}` });
        } catch (error) {
            Alert.alert('Error', 'Failed to share settlement.');
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Month Navigation */}
            <View style={styles.monthNav}>
                <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                    <ChevronLeftIcon size={20} color={colors.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{monthName}</Text>
                <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                    <ChevronRightIcon size={20} color={colors.text.secondary} />
                </TouchableOpacity>
            </View>

            {/* Summary Card */}
            <Card variant="glow" style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                    <Text style={styles.summaryLabel}>Expected Income</Text>
                    {totals.unpaid > 0 && (
                        <View style={styles.unpaidBadge}>
                            <AlertCircleIcon size={12} color={colors.status.warning} />
                            <Text style={styles.unpaidText}>{totals.unpaid} unpaid</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.summaryAmount}>{formatCurrency(totals.net)}</Text>
                <View style={styles.summaryStats}>
                    <Text style={styles.summaryStatText}>
                        {totals.lessons} lessons · {totals.hours.toFixed(1)}h
                    </Text>
                    {totals.tax > 0 && (
                        <Text style={styles.summaryTax}>Tax: -{formatCurrency(totals.tax)}</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.shareAllBtn} onPress={() => handleShare()}>
                    <ShareIcon size={16} color={colors.accent.default} />
                    <Text style={styles.shareAllText}>Share Summary</Text>
                </TouchableOpacity>
            </Card>

            {/* Per-Student Breakdown */}
            <Text style={styles.sectionTitle}>BY STUDENT</Text>

            {settlements.length === 0 ? (
                <Card style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No lessons this month</Text>
                </Card>
            ) : (
                settlements.map(settlement => (
                    <Card key={settlement.student.id} style={styles.studentCard}>
                        <View style={styles.studentHeader}>
                            <View style={styles.studentInfo}>
                                <View style={[styles.studentDot, { backgroundColor: settlement.student.color || colors.accent.default }]} />
                                <View>
                                    <Text style={styles.studentName}>{settlement.student.name}</Text>
                                    <Text style={styles.studentMeta}>
                                        {settlement.lessons.length} lessons · {settlement.totalHours.toFixed(1)}h
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.amountCol}>
                                <Text style={styles.studentAmount}>{formatCurrency(settlement.netAmount)}</Text>
                                {settlement.unpaidCount > 0 ? (
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusUnpaid}>{settlement.unpaidCount} unpaid</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.statusBadge, styles.statusPaidBadge]}>
                                        <CheckCircleIcon size={10} color={colors.status.success} />
                                        <Text style={styles.statusPaid}>Paid</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Rate Info */}
                        <View style={styles.rateRow}>
                            <Text style={styles.rateText}>
                                {formatCurrency(settlement.student.hourlyRate || 0)}/hr
                            </Text>
                            {settlement.student.taxRate && settlement.student.taxRate > 0 && (
                                <Text style={styles.taxText}>
                                    Tax {(settlement.student.taxRate * 100).toFixed(1)}%: -{formatCurrency(settlement.taxAmount)}
                                </Text>
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => handleShare(settlement)}
                            >
                                <ShareIcon size={14} color={colors.accent.default} />
                                <Text style={styles.actionText}>Send Invoice</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))
            )}

            {/* Tip for setting rates */}
            {students.some(s => !s.hourlyRate) && (
                <Card style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💡 Tip</Text>
                    <Text style={styles.tipText}>
                        Set hourly rates for students in Profile → Students to auto-calculate income.
                    </Text>
                </Card>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        gap: spacing.lg,
    },
    navBtn: {
        padding: 8,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.full,
    },
    monthTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    // Summary
    summaryCard: {
        marginBottom: spacing.xl,
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    summaryLabel: {
        ...typography.caption,
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    unpaidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.status.warning + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    unpaidText: {
        fontSize: 10,
        color: colors.status.warning,
        fontWeight: '600',
    },
    summaryAmount: {
        fontSize: 42,
        fontWeight: '700',
        color: colors.text.primary,
        marginVertical: spacing.sm,
    },
    summaryStats: {
        alignItems: 'center',
    },
    summaryStatText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    summaryTax: {
        ...typography.caption,
        color: colors.status.error,
        marginTop: 4,
    },
    shareAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.accent.muted,
        borderRadius: radius.full,
    },
    shareAllText: {
        ...typography.small,
        color: colors.accent.default,
        fontWeight: '600',
    },
    // Section
    sectionTitle: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.md,
        letterSpacing: 1,
    },
    // Empty
    emptyCard: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
    },
    // Student Card
    studentCard: {
        marginBottom: spacing.md,
        padding: spacing.lg,
    },
    studentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    studentDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    studentName: {
        ...typography.h3,
        color: colors.text.primary,
    },
    studentMeta: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 2,
    },
    amountCol: {
        alignItems: 'flex-end',
    },
    studentAmount: {
        ...typography.h3,
        color: colors.text.primary,
        fontWeight: '700',
    },
    statusBadge: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.sm,
        backgroundColor: colors.status.warning + '20',
    },
    statusPaidBadge: {
        backgroundColor: colors.status.success + '20',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusUnpaid: {
        fontSize: 10,
        color: colors.status.warning,
        fontWeight: '600',
    },
    statusPaid: {
        fontSize: 10,
        color: colors.status.success,
        fontWeight: '600',
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    rateText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    taxText: {
        ...typography.caption,
        color: colors.status.error,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: spacing.md,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: colors.accent.muted,
        borderRadius: radius.md,
    },
    actionText: {
        ...typography.caption,
        color: colors.accent.default,
        fontWeight: '600',
    },
    // Tip
    tipCard: {
        marginTop: spacing.md,
        backgroundColor: colors.bg.tertiary,
        padding: spacing.md,
    },
    tipTitle: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    tipText: {
        ...typography.caption,
        color: colors.text.muted,
    },
});
