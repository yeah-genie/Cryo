import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { layout } from '@/components/ui/Theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGoogleAuth } from '@/lib/useGoogleAuth';
import { useZoomAuth } from '@/lib/useZoomAuth';
import { useStripeAuth } from '@/lib/useStripeAuth';
import { CheckCircleIcon, ChevronRightIcon } from '@/components/Icons';

// Logo images
const GoogleCalendarLogo = require('@/assets/images/google-calendar.png');
const ZoomLogo = require('@/assets/images/zoom.png');
const StripeLogo = require('@/assets/images/stripe.png');

export default function AccountScreen() {
  const googleAuth = useGoogleAuth();
  const zoomAuth = useZoomAuth();
  const stripeAuth = useStripeAuth();

  const [connectingService, setConnectingService] = React.useState<string | null>(null);

  const handleGoogleConnect = async () => {
    if (!googleAuth.isReady) {
      Alert.alert('잠시만요', 'Google 연동을 준비 중입니다...');
      return;
    }
    try {
      setConnectingService('google');
      await googleAuth.signIn();
    } catch (error) {
      Alert.alert('연결 실패', 'Google 연동에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setConnectingService(null);
    }
  };

  const handleZoomConnect = async () => {
    try {
      setConnectingService('zoom');
      await zoomAuth.signIn();
    } catch (error) {
      Alert.alert('연결 실패', 'Zoom 연동에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setConnectingService(null);
    }
  };

  const handleStripeConnect = async () => {
    try {
      setConnectingService('stripe');
      await stripeAuth.signIn();
    } catch (error) {
      Alert.alert('연결 실패', 'Stripe 연동에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setConnectingService(null);
    }
  };

  const renderConnectButton = (
    service: 'google' | 'zoom' | 'stripe',
    isAuthenticated: boolean,
    onConnect: () => void,
    onDisconnect: () => void,
    isReady: boolean = true
  ) => {
    const isConnecting = connectingService === service;

    if (isConnecting) {
      return (
        <View style={styles.connectingContainer}>
          <ActivityIndicator size="small" color={colors.accent.default} />
          <Text style={styles.connectingText}>연결 중...</Text>
        </View>
      );
    }

    if (isAuthenticated) {
      return (
        <View style={styles.connectedContainer}>
          <CheckCircleIcon size={16} color={colors.status.success} />
          <Button
            title="Disconnect"
            size="sm"
            variant="outline"
            onPress={onDisconnect}
          />
        </View>
      );
    }

    return (
      <Button
        title="Connect"
        size="sm"
        variant="secondary"
        onPress={onConnect}
        disabled={!isReady}
      />
    );
  };

  return (
    <SafeAreaView style={layout.container} edges={['top']}>
      <ScrollView contentContainerStyle={layout.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={typography.h1}>Account</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AC</Text>
            </View>
            <View>
              <Text style={typography.h3}>Alex Chen</Text>
              <Text style={styles.profileEmail}>alex.chen@tutor.com</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO PLAN</Text>
            </View>
          </View>
        </Card>

        {/* Integrations Section */}
        <Text style={styles.sectionTitle}>INTEGRATIONS</Text>
        <Text style={styles.sectionSubtitle}>서비스를 연결하여 포트폴리오를 인증하세요</Text>

        {/* Google Calendar */}
        <Card style={styles.integrationCard}>
          <View style={styles.integrationRow}>
            <View style={layout.row}>
              <Image source={GoogleCalendarLogo} style={styles.logoImage} />
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Google Calendar</Text>
                <Text style={styles.integrationStatus}>
                  {googleAuth.isAuthenticated
                    ? `✓ ${googleAuth.user?.email || 'Connected'}`
                    : googleAuth.isReady
                      ? '수업 일정을 자동으로 가져옵니다'
                      : '준비 중...'}
                </Text>
              </View>
            </View>
            {renderConnectButton(
              'google',
              googleAuth.isAuthenticated,
              handleGoogleConnect,
              googleAuth.signOut,
              googleAuth.isReady
            )}
          </View>
        </Card>

        {/* Zoom */}
        <Card style={styles.integrationCard}>
          <View style={styles.integrationRow}>
            <View style={layout.row}>
              <Image source={ZoomLogo} style={styles.logoImage} />
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Zoom</Text>
                <Text style={styles.integrationStatus}>
                  {zoomAuth.isAuthenticated
                    ? `✓ ${zoomAuth.user?.email || 'Connected'}`
                    : '화상 수업 기록을 자동으로 가져옵니다'}
                </Text>
              </View>
            </View>
            {renderConnectButton(
              'zoom',
              zoomAuth.isAuthenticated,
              handleZoomConnect,
              zoomAuth.signOut
            )}
          </View>
        </Card>

        {/* Stripe */}
        <Card style={styles.integrationCard}>
          <View style={styles.integrationRow}>
            <View style={layout.row}>
              <Image source={StripeLogo} style={styles.logoImage} />
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Stripe</Text>
                <Text style={styles.integrationStatus}>
                  {stripeAuth.isAuthenticated
                    ? `✓ ${stripeAuth.account?.id || 'Connected'}`
                    : '결제 내역을 자동으로 가져옵니다'}
                </Text>
              </View>
            </View>
            {renderConnectButton(
              'stripe',
              stripeAuth.isAuthenticated,
              handleStripeConnect,
              stripeAuth.signOut
            )}
          </View>
        </Card>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Export Data</Text>
            <ChevronRightIcon size={20} color={colors.text.secondary} />
          </View>
          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <Text style={[styles.settingLabel, { color: colors.status.error }]}>Log Out</Text>
          </View>
        </Card>

        <Text style={styles.versionText}>Version 1.0.2 (Build 14)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  profileCard: {
    marginBottom: spacing['2xl'],
    padding: spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.bg.base,
  },
  profileEmail: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  proBadge: {
    backgroundColor: colors.accent.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.accent.default,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent.default,
    letterSpacing: 1,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
    marginLeft: 4,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  integrationCard: {
    marginBottom: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  integrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  integrationInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  integrationName: {
    ...typography.small,
    color: colors.text.primary,
    fontWeight: '600',
  },
  integrationStatus: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
  },
  connectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectingText: {
    ...typography.caption,
    color: colors.accent.default,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsCard: {
    marginBottom: spacing.xl,
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontSize: 15,
  },
  versionText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
