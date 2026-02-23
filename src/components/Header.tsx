/**
 * Header — Static presentational header.
 * Displays greeting, date, and today's task count.
 * Background is the coral-red brand color (matching design reference).
 */

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  pendingCount: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const Header: React.FC<Props> = ({ pendingCount }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.date}>{getFormattedDate()}</Text>
        </View>

        {/* Avatar placeholder */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
      </View>

      <View style={styles.taskCountRow}>
        <Text style={styles.taskCountNumber}>{pendingCount}</Text>
        <Text style={styles.taskCountLabel}>
          {pendingCount === 1 ? 'task remaining' : 'tasks remaining'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.heading,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  taskCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  taskCountNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -2,
    lineHeight: 52,
  },
  taskCountLabel: {
    ...TYPOGRAPHY.heading,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
});

export default React.memo(Header);