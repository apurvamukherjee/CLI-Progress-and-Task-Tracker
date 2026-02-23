import React, { useRef, useEffect } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from '../constants/theme';

interface StatsData {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

interface Props {
  stats: StatsData;
}

const StatCard: React.FC<{ label: string; value: number; color: string; bg: string; emoji: string }> = ({
  label, value, color, bg, emoji,
}) => (
  <View style={[styles.statCard, { backgroundColor: bg }]}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProgressBar: React.FC<{ rate: number }> = ({ rate }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: rate,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [rate]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.ringWrapper}>
      <View style={styles.circleTrack}>
        <View style={styles.circleInner}>
          <Text style={styles.ringPercent}>{rate}%</Text>
          <Text style={styles.ringDone}>done</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width }]} />
      </View>
    </View>
  );
};

const TodoStats: React.FC<Props> = ({ stats }) => (
  <View style={styles.wrapper}>
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <ProgressBar rate={stats.completionRate} />
        <Text style={styles.progressLabel}>Progress</Text>
      </View>
      <View style={styles.rightSection}>
        <StatCard label="Total" value={stats.total} color={COLORS.accent} bg={COLORS.surfaceAlt} emoji="📋" />
        <StatCard label="Left" value={stats.pending} color={COLORS.primaryDark} bg={COLORS.primaryLight} emoji="⏳" />
        <StatCard label="Done" value={stats.completed} color={COLORS.success} bg={COLORS.successLight} emoji="✅" />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.md,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  leftSection: { alignItems: 'center', marginRight: SPACING.xl },
  progressLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.sm },
  rightSection: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, borderRadius: RADIUS.md, gap: 2 },
  statEmoji: { fontSize: 16, marginBottom: 2 },
  statValue: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 10 },
  ringWrapper: { alignItems: 'center', width: 80 },
  circleTrack: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 7,
    borderColor: COLORS.primaryLight,
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  circleInner: { alignItems: 'center' },
  ringPercent: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
  ringDone: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '500' },
  barTrack: {
    width: 72, height: 4, backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full, marginTop: SPACING.xs, overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
});

export default React.memo(TodoStats);