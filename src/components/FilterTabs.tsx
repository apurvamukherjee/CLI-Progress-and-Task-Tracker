import React, { useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FilterType } from '../types/todo';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  active: FilterType;
  onSelect: (filter: FilterType) => void;
  counts: { all: number; pending: number; completed: number };
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Done' },
];

const FilterTabs: React.FC<Props> = ({ active, onSelect, counts }) => {
  const pillX = useRef(new Animated.Value(0)).current;
  const activeIndex = FILTERS.findIndex(f => f.key === active);

  const handleSelect = useCallback(
    (key: FilterType, index: number) => {
      Animated.spring(pillX, {
        toValue: index,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }).start();
      onSelect(key);
    },
    [onSelect, pillX],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.track} onLayout={e => {
        // Set initial position
        const w = e.nativeEvent.layout.width;
      }}>
        {/* We use percentage-based positioning via flex — pill width = 1/3 */}
        <View style={styles.pillContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.pill,
              {
                transform: [
                  {
                    translateX: pillX.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: ['0%', '100%', '200%'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {FILTERS.map((filter, i) => {
          const isActive = filter.key === active;
          const count = counts[filter.key];
          return (
            <TouchableOpacity
              key={filter.key}
              style={styles.tab}
              onPress={() => handleSelect(filter.key, i)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {filter.label}
              </Text>
              {count > 0 && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  track: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    padding: 4,
    position: 'relative',
  },
  pillContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: 4,
    flexDirection: 'row',
  },
  pill: {
    width: '33.33%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  tabText: { ...TYPOGRAPHY.caption, fontWeight: '500', color: COLORS.textSecondary, fontSize: 13 },
  tabTextActive: { color: COLORS.textPrimary, fontWeight: '600' },
  badge: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeActive: { backgroundColor: COLORS.primaryLight },
  badgeText: { ...TYPOGRAPHY.captionBold, color: COLORS.textMuted, fontSize: 10 },
  badgeTextActive: { color: COLORS.primary },
});

export default React.memo(FilterTabs);