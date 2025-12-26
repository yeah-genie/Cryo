import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { useData } from '@/lib/DataContext';
import { ChartIcon } from '@/components/Icons';

export default function PortfolioScreen() {
  const { students } = useData();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Portfolio</Text>
        </View>

        {students.length === 0 ? (
          <View style={styles.emptyState}>
            <ChartIcon size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No data yet. Log some lessons!</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Performance Summary</Text>
            {/* Placeholder for charts */}
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>Charts coming soon...</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  content: { paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: 100 },
  header: { marginBottom: spacing.xl },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.text.muted },
  sectionTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.md },
  chartPlaceholder: { height: 200, backgroundColor: colors.bg.secondary, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { ...typography.caption, color: colors.text.muted },
});
