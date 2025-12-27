import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
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

        {/* Google Calendar */}
        <Card style={styles.integrationCard}>
          <View style={styles.integrationRow}>
            <View style={layout.row}>
              <Image source={GoogleCalendarLogo} style={styles.logoImage} />
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Google Calendar</Text>
                <Text style={styles.integrationStatus}>
                  {googleAuth.isAuthenticated ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
            </View>
            <Button
              title={googleAuth.isAuthenticated ? "Disconnect" : "Connect"}
              size="sm"
              variant={googleAuth.isAuthenticated ? "outline" : "secondary"}
              onPress={() => googleAuth.isAuthenticated ? googleAuth.signOut() : googleAuth.signIn()}
            />
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
                  {zoomAuth.isAuthenticated ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
            </View>
            <Button
              title={zoomAuth.isAuthenticated ? "Disconnect" : "Connect"}
              size="sm"
              variant={zoomAuth.isAuthenticated ? "outline" : "secondary"}
              onPress={() => zoomAuth.isAuthenticated ? zoomAuth.signOut() : zoomAuth.signIn()}
            />
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
                  {stripeAuth.isAuthenticated ? 'Active' : 'Setup Required'}
                </Text>
              </View>
            </View>
            <Button
              title={stripeAuth.isAuthenticated ? "Manage" : "Connect"}
              size="sm"
              variant={stripeAuth.isAuthenticated ? "outline" : "secondary"}
              onPress={() => stripeAuth.isAuthenticated ? Alert.alert('Stripe', 'Opening Dashboard...') : stripeAuth.signIn()}
            />
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
    marginBottom: spacing.md,
    marginLeft: 4,
    letterSpacing: 1,
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
  },
  integrationName: {
    ...typography.small,
    color: colors.text.primary,
    fontWeight: '600',
  },
  integrationStatus: {
    ...typography.caption,
    color: colors.text.secondary,
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
