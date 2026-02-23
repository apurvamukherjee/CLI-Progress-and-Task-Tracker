import React, { useState, useRef, useCallback } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Priority } from '../types/todo';
import { CATEGORIES, COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  onAdd: (title: string, priority: Priority, category?: string) => void;
}

const PRIORITY_OPTIONS: { key: Priority; label: string; color: string }[] = [
  { key: 'low', label: '🟢 Low', color: COLORS.priorityLow },
  { key: 'medium', label: '🟡 Medium', color: COLORS.priorityMedium },
  { key: 'high', label: '🔴 High', color: COLORS.priorityHigh },
];

const AddTodoInput: React.FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);

  const optionsHeight = useRef(new Animated.Value(0)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;

  const toggleExpand = useCallback(() => {
    const next = !isExpanded;
    setIsExpanded(next);
    Animated.parallel([
      Animated.spring(optionsHeight, {
        toValue: next ? 120 : 0,
        useNativeDriver: false,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(optionsOpacity, {
        toValue: next ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, optionsHeight, optionsOpacity]);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    onAdd(text.trim(), priority, category);
    setText('');
    setIsExpanded(false);
    Animated.parallel([
      Animated.spring(optionsHeight, { toValue: 0, useNativeDriver: false, tension: 80, friction: 12 }),
      Animated.timing(optionsOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();
  }, [text, priority, category, onAdd]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <View style={styles.inputIcon}>
            <Text style={styles.inputIconText}>+</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor={COLORS.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            maxLength={120}
          />
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={toggleExpand}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.expandIcon, isExpanded && styles.expandIconActive]}>⊕</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ height: optionsHeight, opacity: optionsOpacity, overflow: 'hidden' }}>
          <View style={styles.options}>
            <View style={styles.optionSection}>
              <Text style={styles.optionLabel}>Priority</Text>
              <View style={styles.chips}>
                {PRIORITY_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.chip,
                      priority === opt.key && { backgroundColor: opt.color + '20', borderColor: opt.color },
                    ]}
                    onPress={() => setPriority(opt.key)}
                  >
                    <Text style={[styles.chipText, priority === opt.key && { color: opt.color, fontWeight: '600' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionSection}>
              <Text style={styles.optionLabel}>Category</Text>
              <View style={styles.chips}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      category === cat && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
                    ]}
                    onPress={() => setCategory(category === cat ? undefined : cat)}
                  >
                    <Text style={[styles.chipText, category === cat && { color: COLORS.primary, fontWeight: '600' }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[styles.submitBtn, !text.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOW.lg,
    ...Platform.select({ android: { elevation: 6 } }),
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  inputIcon: {
    width: 36, height: 36, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  inputIconText: { fontSize: 22, color: COLORS.primary, fontWeight: '300', lineHeight: 26 },
  input: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontSize: 15, paddingVertical: SPACING.xs },
  expandBtn: { paddingLeft: SPACING.md },
  expandIcon: { fontSize: 22, color: COLORS.textMuted },
  expandIconActive: { color: COLORS.primary },
  options: { paddingTop: SPACING.sm, paddingBottom: SPACING.md, gap: SPACING.md },
  optionSection: { gap: SPACING.xs },
  optionLabel: {
    ...TYPOGRAPHY.captionBold, color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: COLORS.surfaceAlt,
  },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 12 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    paddingVertical: 14, alignItems: 'center', ...SHADOW.primary,
  },
  submitBtnDisabled: { backgroundColor: COLORS.border, shadowOpacity: 0, elevation: 0 },
  submitText: { ...TYPOGRAPHY.subheading, color: COLORS.white, letterSpacing: 0.3 },
});

export default React.memo(AddTodoInput);