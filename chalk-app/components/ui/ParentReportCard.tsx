import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Card } from './Card';
import { Button } from './Button';
import { SparklesIcon, ShareIcon } from '@/components/Icons';
import { generateParentReport } from '@/services/geminiService';

interface LessonLogSummary {
    topic: string;
    rating: string;
    date: string;
    notes?: string;
}

interface ParentReportCardProps {
    studentName: string;
    studentId: string;
    logs: LessonLogSummary[];
}

export function ParentReportCard({ studentName, studentId, logs }: ParentReportCardProps) {
    const [report, setReport] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const recentLogs = logs.slice(0, 5);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const generatedReport = await generateParentReport(studentName, recentLogs);
            setReport(generatedReport);
        } catch (error) {
            Alert.alert('오류', '리포트 생성에 실패했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!report) return;

        const fullReport = `
📚 ${studentName} 학습 리포트

${report}

---
최근 수업 내역:
${recentLogs.map(l => `• ${l.date}: ${l.topic} (${l.rating === 'good' ? '✅ 잘함' : l.rating === 'okay' ? '⚠️ 보통' : '❌ 어려움'})`).join('\n')}

Chalk - 과외 포트폴리오 앱
    `.trim();

        try {
            await Share.share({
                message: fullReport,
                title: `${studentName} 학습 리포트`,
            });
        } catch (error) {
            Alert.alert('오류', '공유에 실패했습니다.');
        }
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>학부모 리포트</Text>
                <Text style={styles.subtitle}>{studentName}님</Text>
            </View>

            {logs.length === 0 ? (
                <Text style={styles.emptyText}>수업 기록이 없습니다.</Text>
            ) : (
                <>
                    {/* Recent Lessons Summary */}
                    <View style={styles.lessonsSection}>
                        <Text style={styles.sectionLabel}>최근 수업</Text>
                        {recentLogs.map((log, i) => (
                            <View key={i} style={styles.lessonRow}>
                                <View style={[styles.ratingDot, {
                                    backgroundColor: log.rating === 'good' ? colors.status.success :
                                        log.rating === 'okay' ? colors.status.warning : colors.status.error
                                }]} />
                                <Text style={styles.lessonTopic}>{log.topic}</Text>
                                <Text style={styles.lessonDate}>{log.date}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Generate Report */}
                    {!report ? (
                        <Button
                            title="AI 리포트 생성"
                            variant="secondary"
                            size="sm"
                            loading={isGenerating}
                            onPress={handleGenerate}
                            icon={<SparklesIcon size={16} color={colors.accent.default} />}
                            style={{ marginTop: spacing.md }}
                        />
                    ) : (
                        <View style={styles.reportSection}>
                            <View style={styles.reportHeader}>
                                <SparklesIcon size={14} color={colors.accent.default} />
                                <Text style={styles.reportLabel}>AI 생성 리포트</Text>
                            </View>
                            <Text style={styles.reportText}>{report}</Text>

                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <ShareIcon size={16} color={colors.accent.default} />
                                <Text style={styles.shareText}>학부모에게 공유</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 2,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
        paddingVertical: spacing.lg,
    },
    lessonsSection: {
        marginBottom: spacing.md,
    },
    sectionLabel: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 8,
    },
    ratingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    lessonTopic: {
        ...typography.small,
        color: colors.text.primary,
        flex: 1,
    },
    lessonDate: {
        ...typography.caption,
        color: colors.text.muted,
    },
    reportSection: {
        marginTop: spacing.md,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    reportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: spacing.sm,
    },
    reportLabel: {
        ...typography.caption,
        color: colors.accent.default,
        fontWeight: '600',
    },
    reportText: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    shareText: {
        ...typography.small,
        color: colors.accent.default,
        fontWeight: '600',
    },
});
