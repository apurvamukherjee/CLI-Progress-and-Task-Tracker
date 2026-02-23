import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { FilterType } from '../types/todo';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

const EMPTY_COPY: Record<FilterType, { emoji: string; title: string; sub: string }> = {
  all: { emoji: '🎉', title: "You're all clear!", sub: 'Add a task above to get started.' },
  pending: { emoji: '✅', title: 'Nothing pending!', sub: "You've completed everything." },
  completed: { emoji: '📭', title: 'No completed tasks', sub: 'Complete some tasks to see them here.' },
};

const EmptyState: React.FC<{ filter: FilterType }> = ({ filter }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const copy = EMPTY_COPY[filter];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <Text style={styles.emoji}>{copy.emoji}</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.sub}>{copy.sub}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: SPACING.xxxl * 2, paddingHorizontal: SPACING.xxxl,
  },
  emoji: { fontSize: 56, marginBottom: SPACING.lg },
  title: { ...TYPOGRAPHY.heading, color: COLORS.textPrimary, marginBottom: SPACING.sm, textAlign: 'center' },
  sub: { ...TYPOGRAPHY.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
});

export default EmptyState;