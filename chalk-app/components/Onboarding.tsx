import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, typography, spacing, radius, components } from '@/constants/Colors';
import { PencilIcon, CalendarIcon, ChartIcon, CheckCircleIcon } from '@/components/Icons';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = '@chalk_onboarding_complete';

interface OnboardingScreenProps {
    onComplete: () => void;
}

const STEPS = [
    {
        title: 'Welcome to Chalk',
        subtitle: 'The smart way to track your tutoring',
        Icon: PencilIcon,
    },
    {
        title: 'Log Lessons Fast',
        subtitle: '2 taps to record what you covered and how it went',
        Icon: PencilIcon,
    },
    {
        title: 'Schedule Made Easy',
        subtitle: 'Plan your week and never miss a session',
        Icon: CalendarIcon,
    },
    {
        title: 'Build Your Portfolio',
        subtitle: 'Track progress and share with parents',
        Icon: ChartIcon,
    },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [step, setStep] = useState(0);
    const [tutorName, setTutorName] = useState('');

    const isLastStep = step === STEPS.length;
    const currentStep = STEPS[step];

    const handleNext = async () => {
        if (step < STEPS.length) {
            setStep(step + 1);
        } else {
            // Save onboarding complete
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            if (tutorName.trim()) {
                await AsyncStorage.setItem('@chalk_tutor_name', tutorName.trim());
            }
            onComplete();
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        onComplete();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Skip button */}
                {step < STEPS.length && (
                    <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}

                {/* Step content */}
                {!isLastStep ? (
                    <View style={styles.stepContent}>
                        <View style={styles.iconContainer}>
                            <currentStep.Icon size={48} color={colors.accent.default} />
                        </View>
                        <Text style={styles.title}>{currentStep.title}</Text>
                        <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
                    </View>
                ) : (
                    <View style={styles.stepContent}>
                        <View style={styles.iconContainer}>
                            <CheckCircleIcon size={48} color={colors.accent.default} />
                        </View>
                        <Text style={styles.title}>What's your name?</Text>
                        <Text style={styles.subtitle}>So we can personalize your experience</Text>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Your name"
                            placeholderTextColor={colors.text.muted}
                            value={tutorName}
                            onChangeText={setTutorName}
                            autoFocus
                        />
                    </View>
                )}

                {/* Progress dots */}
                <View style={styles.dots}>
                    {[...Array(STEPS.length + 1)].map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === step && styles.dotActive]}
                        />
                    ))}
                </View>

                {/* Next button */}
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <Text style={styles.nextBtnText}>
                        {isLastStep ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Check if onboarding is complete
export async function isOnboardingComplete(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === 'true';
    } catch {
        return false;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.base },
    content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' },

    skipBtn: { position: 'absolute', top: 20, right: spacing.xl, zIndex: 10 },
    skipText: { ...typography.body, color: colors.text.muted },

    stepContent: { alignItems: 'center', paddingHorizontal: spacing.lg },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.accent.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing['2xl'],
    },
    title: { ...typography.h1, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.md },
    subtitle: { ...typography.body, color: colors.text.secondary, textAlign: 'center', lineHeight: 22 },

    nameInput: {
        width: '100%',
        maxWidth: 280,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.md,
        padding: spacing.lg,
        marginTop: spacing.xl,
        ...typography.body,
        color: colors.text.primary,
        textAlign: 'center',
    },

    dots: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing['3xl'], marginBottom: spacing.xl },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.bg.tertiary, marginHorizontal: 4 },
    dotActive: { backgroundColor: colors.accent.default, width: 24 },

    nextBtn: {
        height: components.button.lg,
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    nextBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },
});
