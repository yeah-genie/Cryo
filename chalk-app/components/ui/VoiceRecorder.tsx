import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { colors, radius, spacing, typography } from '@/constants/Colors';
import { Svg, Path, Rect } from 'react-native-svg';

function MicIcon({ size = 24, color = colors.text.primary, active = false }) {
    const fillColor = active ? colors.status.error : "none";
    const strokeColor = active ? colors.status.error : color;
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="9" y="3" width="6" height="12" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            <Path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 18V22M8 22H16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
    );
}

interface VoiceRecorderProps {
    onTranscription: (text: string) => void;
}

export function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);

    useEffect(() => {
        // Request permission on mount
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                setPermissionGranted(status === 'granted');
            } catch (error) {
                console.log('Audio permission error:', error);
            }
        })();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRecording) {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        if (!permissionGranted) {
            Alert.alert('Permission Required', 'Microphone access is needed to record voice memos.');
            return;
        }

        try {
            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Create and start recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingRef.current = recording;
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!recordingRef.current) return;

        setIsRecording(false);
        setIsProcessing(true);

        try {
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();
            recordingRef.current = null;

            // For now, since we don't have speech-to-text API integrated,
            // we'll note that a recording was made with the duration
            const recordedMinutes = Math.floor(duration / 60);
            const recordedSeconds = duration % 60;
            const durationStr = recordedMinutes > 0
                ? `${recordedMinutes}m ${recordedSeconds}s`
                : `${recordedSeconds}s`;

            // Reset audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            // Provide feedback that recording was captured
            // In a full implementation, this would send to a speech-to-text API
            onTranscription(`[Voice memo recorded: ${durationStr}] - Audio saved locally`);

        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to save recording.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToggleRecord = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>VOICE MEMO</Text>
                {isRecording && (
                    <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>{formatTime(duration)}</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.recordButton,
                    isRecording && styles.recordButtonActive,
                    isProcessing && styles.recordButtonProcessing
                ]}
                onPress={handleToggleRecord}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <Text style={styles.processingText}>Saving...</Text>
                ) : (
                    <View style={styles.buttonContent}>
                        <MicIcon size={24} color={isRecording ? colors.status.error : colors.accent.default} active={isRecording} />
                        <Text style={[
                            styles.buttonText,
                            isRecording ? { color: colors.status.error } : { color: colors.accent.default }
                        ]}>
                            {isRecording ? "Stop Recording" : "Tap to Record"}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {!permissionGranted && (
                <Text style={styles.permissionText}>
                    Microphone permission required
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    label: {
        ...typography.caption,
        color: colors.text.muted,
        letterSpacing: 1,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.status.error,
    },
    recordingText: {
        ...typography.caption,
        color: colors.status.error,
        fontVariant: ['tabular-nums'],
    },
    recordButton: {
        backgroundColor: colors.bg.secondary,
        paddingVertical: spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.default,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
    },
    recordButtonActive: {
        borderColor: colors.status.error,
        backgroundColor: `${colors.status.error}10`,
        borderStyle: 'solid',
    },
    recordButtonProcessing: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        ...typography.small,
        fontWeight: '600',
    },
    processingText: {
        ...typography.small,
        color: colors.text.secondary,
    },
    permissionText: {
        ...typography.caption,
        color: colors.status.warning,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
