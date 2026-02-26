import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const TAB_CONFIG: Record<
  string,
  { icon: string; activeIcon: string; label: string }
> = {
  Home: { icon: '⌂', activeIcon: '⌂', label: 'All Tasks' },
  Pending: { icon: '◷', activeIcon: '◷', label: 'Pending' },
  Completed: { icon: '✓', activeIcon: '✓', label: 'Done' },
};

interface TabItemProps {
  route: { name: string; key: string };
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  route,
  isFocused,
  onPress,
  onLongPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(isFocused ? 1 : 0.55)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1.08 : 1,
        useNativeDriver: true,
        tension: 180,
        friction: 12,
      }),
      Animated.timing(opacity, {
        toValue: isFocused ? 1 : 0.55,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const config = TAB_CONFIG[route.name];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={config.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[styles.tabInner, { transform: [{ scale }], opacity }]}
      >
        {/* Active indicator pill */}
        {isFocused && <View style={styles.activePill} />}

        <View
          style={[
            styles.iconContainer,
            isFocused && styles.iconContainerActive,
          ]}
        >
          <Text style={[styles.icon, isFocused && styles.iconActive]}>
            {config.icon}
          </Text>
        </View>

        <Text style={[styles.label, isFocused && styles.labelActive]}>
          {config.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || SPACING.md }]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background || '#FFFFFF',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceAlt || '#F5F5F5',
    borderRadius: RADIUS.xl || 20,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xl || 20,
    width: '100%',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: RADIUS.lg || 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 12,
  },
  iconContainer: {
    width: 20,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 2,
  },
  iconContainerActive: {},
  icon: {
    fontSize: 20,
    color: COLORS.textSecondary || '#888888',
  },
  iconActive: {
    color: COLORS.primary || '#FF6B6B',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary || '#888888',
    marginTop: 1,
  },
  labelActive: {
    color: COLORS.primary || '#FF6B6B',
    fontWeight: '700',
  },
});

export default CustomTabBar;
