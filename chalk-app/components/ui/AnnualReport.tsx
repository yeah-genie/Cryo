import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { useData } from '@/lib/DataContext';
import { TrendingUpIcon, CalendarIcon } from '@/components/Icons';

interface AnnualReportProps {
    year?: number;
}

export function AnnualReport({ year = new Date().getFullYear() }: AnnualReportProps) {
    const { lessonLogs, students } = useData();

    // Calculate monthly data
    const monthlyData = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
            const monthLogs = lessonLogs.filter(log => log.date.startsWith(monthStr));

            let totalHours = 0;
            let totalAmount = 0;

            monthLogs.forEach(log => {
                const student = students.find(s => s.id === log.studentId);
                const hours = (log.duration || 60) / 60;
                totalHours += hours;
                totalAmount += hours * (student?.hourlyRate || 0);
            });

            return {
                month: i,
                name: new Date(year, i).toLocaleDateString('en-US', { month: 'short' }),
                lessons: monthLogs.length,
                hours: totalHours,
                amount: totalAmount,
            };
        });

        return months;
    }, [lessonLogs, students, year]);

    // Totals
    const totals = useMemo(() => {
        return monthlyData.reduce((acc, m) => ({
            lessons: acc.lessons + m.lessons,
            hours: acc.hours + m.hours,
            amount: acc.amount + m.amount,
        }), { lessons: 0, hours: 0, amount: 0 });
    }, [monthlyData]);

    // Find max for chart scaling
    const maxAmount = Math.max(...monthlyData.map(m => m.amount), 1);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Year Header */}
            <View style={styles.header}>
                <CalendarIcon size={20} color={colors.accent.default} />
                <Text style={styles.yearTitle}>{year} Annual Report</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>${totals.amount.toLocaleString()}</Text>
                    <Text style={styles.summaryLabel}>Total Income</Text>
                </Card>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{totals.lessons}</Text>
                    <Text style={styles.summaryLabel}>Lessons</Text>
                </Card>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{totals.hours.toFixed(0)}h</Text>
                    <Text style={styles.summaryLabel}>Hours</Text>
                </Card>
            </View>

            {/* Monthly Chart */}
            <Card style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <TrendingUpIcon size={16} color={colors.accent.default} />
                    <Text style={styles.chartTitle}>Monthly Income</Text>
                </View>
                <View style={styles.chart}>
                    {monthlyData.map(month => (
                        <View key={month.month} style={styles.barContainer}>
                            <Text style={styles.barValue}>
                                {month.amount > 0 ? `$${(month.amount / 1000).toFixed(0)}k` : ''}
                            </Text>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max((month.amount / maxAmount) * 100, month.amount > 0 ? 8 : 2),
                                        backgroundColor: month.amount > 0 ? colors.accent.default : colors.bg.tertiary,
                                    }
                                ]}
                            />
                            <Text style={styles.barLabel}>{month.name}</Text>
                        </View>
                    ))}
                </View>
            </Card>

            {/* Monthly Breakdown */}
            <Text style={styles.sectionTitle}>MONTHLY BREAKDOWN</Text>
            {monthlyData.filter(m => m.lessons > 0).reverse().map(month => (
                <Card key={month.month} style={styles.monthCard}>
                    <View style={styles.monthRow}>
                        <View>
                            <Text style={styles.monthName}>{month.name} {year}</Text>
                            <Text style={styles.monthMeta}>
                                {month.lessons} lessons · {month.hours.toFixed(1)}h
                            </Text>
                        </View>
                        <Text style={styles.monthAmount}>${month.amount.toLocaleString()}</Text>
                    </View>
                </Card>
            ))}

            {totals.lessons === 0 && (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No lesson data for {year}</Text>
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: spacing.xl,
    },
    yearTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    // Summary
    summaryRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.sm,
    },
    summaryValue: {
        ...typography.h2,
        color: colors.text.primary,
        fontSize: 20,
    },
    summaryLabel: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 4,
    },
    // Chart
    chartCard: {
        marginBottom: spacing.xl,
        padding: spacing.lg,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: spacing.lg,
    },
    chartTitle: {
        ...typography.small,
        color: colors.accent.default,
        fontWeight: '600',
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bar: {
        width: '70%',
        borderRadius: radius.sm,
        minHeight: 2,
    },
    barValue: {
        fontSize: 8,
        color: colors.text.muted,
        marginBottom: 4,
    },
    barLabel: {
        fontSize: 9,
        color: colors.text.muted,
        marginTop: 8,
    },
    // Section
    sectionTitle: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.md,
        letterSpacing: 1,
    },
    // Month Card
    monthCard: {
        marginBottom: spacing.sm,
        padding: spacing.md,
    },
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthName: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
    },
    monthMeta: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 2,
    },
    monthAmount: {
        ...typography.h3,
        color: colors.text.primary,
    },
    // Empty
    empty: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
    },
});
