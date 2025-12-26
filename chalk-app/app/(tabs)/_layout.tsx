import React from 'react';
import { Tabs } from 'expo-router';

import { colors, spacing } from '@/constants/Colors';
import { PencilIcon, CalendarIcon, ChartIcon, UsersIcon } from '@/components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.default,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.bg.secondary,
          borderTopColor: colors.border.light,
          borderTopWidth: 0.5,
          height: 80,
          paddingTop: spacing.sm,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Log',
          tabBarIcon: ({ color }) => <PencilIcon size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <CalendarIcon size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <ChartIcon size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <UsersIcon size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
