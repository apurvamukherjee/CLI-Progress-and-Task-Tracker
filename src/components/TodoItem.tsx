import React, { useRef, useCallback, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { Todo } from '../types/todo';
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const PRIORITY_CONFIG = {
  low: { color: COLORS.priorityLow, label: 'Low', bg: COLORS.successLight },
  medium: { color: COLORS.priorityMedium, label: 'Med', bg: COLORS.warningLight },
  high: { color: COLORS.priorityHigh, label: 'High', bg: COLORS.primaryLight },
};

const SWIPE_THRESHOLD = -80;

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(40)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;

  const priority = PRIORITY_CONFIG[todo.priority];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(slideX, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  const handleDelete = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -400,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete(todo.id));
  }, [onDelete, todo.id]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => Math.abs(gs.dx) > 8 && Math.abs(gs.dy) < 20,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (gs.dx < 0) {
          translateX.setValue(gs.dx);
          deleteOpacity.setValue(Math.min(1, Math.abs(gs.dx) / 80));
        }
      },
      onPanResponderRelease: (
        _: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (gs.dx < SWIPE_THRESHOLD) {
          handleDelete();
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }),
            Animated.timing(deleteOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.deleteReveal, { opacity: deleteOpacity }]}>
        <Text style={styles.deleteRevealText}>Delete</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          todo.completed && styles.cardCompleted,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateX: Animated.add(translateX, slideX) },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.priorityStrip, { backgroundColor: priority.color }]} />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.checkArea}
          onPress={handleToggle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View
            style={[
              styles.checkbox,
              todo.completed && {
                backgroundColor: COLORS.success,
                borderColor: COLORS.success,
              },
            ]}
          >
            {todo.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[styles.title, todo.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityLabel, { color: priority.color }]}>
                {priority.label}
              </Text>
            </View>
            {todo.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryLabel}>{todo.category}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  deleteReveal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF4444',
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: SPACING.xl,
  },
  deleteRevealText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOW.md,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  cardCompleted: { backgroundColor: '#FAFAFA' },
  priorityStrip: { width: 4, alignSelf: 'stretch' },
  checkArea: { padding: SPACING.lg },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  content: { flex: 1, paddingVertical: SPACING.md },
  title: {
    ...TYPOGRAPHY.bodyMed,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  titleCompleted: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  priorityDot: { width: 5, height: 5, borderRadius: 999 },
  priorityLabel: { ...TYPOGRAPHY.captionBold, fontSize: 10 },
  categoryBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  categoryLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 10 },
  deleteBtn: { padding: SPACING.lg },
  deleteBtnText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
});

export default React.memo(TodoItem);