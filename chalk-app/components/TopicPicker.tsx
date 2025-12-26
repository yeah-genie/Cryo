import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { CURRICULUM, getAllTopics } from '@/lib/curriculum';
import { XIcon, CheckCircleIcon } from '@/components/Icons';

interface TopicPickerProps {
    visible: boolean;
    selectedTopics: string[];
    onSelect: (topics: string[]) => void;
    onClose: () => void;
}

export function TopicPicker({ visible, selectedTopics, onSelect, onClose }: TopicPickerProps) {
    const [selected, setSelected] = useState<string[]>(selectedTopics);
    const allTopics = getAllTopics();

    const toggleTopic = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleDone = () => {
        onSelect(selected);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Topics</Text>
                        <TouchableOpacity onPress={onClose}>
                            <XIcon size={18} color={colors.text.muted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {CURRICULUM.map(subject => (
                            <View key={subject.id} style={styles.subjectSection}>
                                <Text style={styles.subjectHeader}>{subject.icon} {subject.name}</Text>

                                {subject.units.map(unit => (
                                    <View key={unit.id} style={styles.unitSection}>
                                        <Text style={styles.unitHeader}>{unit.name}</Text>
                                        <View style={styles.topicGrid}>
                                            {unit.children?.map(topic => {
                                                const isSelected = selected.includes(topic.id);
                                                return (
                                                    <Pressable
                                                        key={topic.id}
                                                        style={[styles.topicChip, isSelected && styles.topicChipSelected]}
                                                        onPress={() => toggleTopic(topic.id)}
                                                    >
                                                        {isSelected && <CheckCircleIcon size={12} color={colors.accent.default} />}
                                                        <Text style={[styles.topicText, isSelected && styles.topicTextSelected]}>
                                                            {topic.name}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                        <Text style={styles.doneBtnText}>Done ({selected.length})</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: colors.bg.secondary,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    title: {
        ...typography.h2,
        color: colors.text.primary,
    },
    content: {
        padding: spacing.xl,
    },
    subjectSection: {
        marginBottom: spacing['2xl'],
    },
    subjectHeader: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    unitSection: {
        marginBottom: spacing.lg,
    },
    unitHeader: {
        ...typography.caption,
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    topicChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.md,
    },
    topicChipSelected: {
        backgroundColor: colors.accent.muted,
    },
    topicText: {
        ...typography.small,
        color: colors.text.secondary,
    },
    topicTextSelected: {
        color: colors.accent.default,
    },
    doneBtn: {
        margin: spacing.xl,
        height: 44,
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneBtnText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.bg.base,
    },
});
