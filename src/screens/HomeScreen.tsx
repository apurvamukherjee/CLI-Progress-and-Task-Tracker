import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../types/todo';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

import Header from '../components/Header';
import TodoStats from '../components/TodoStats';
import FilterTabs from '../components/FilterTabs';
import AddTodoInput from '../components/AddTodoInput';
import TodoItem from '../components/TodoItem';
import EmptyState from '../components/EmptyState';

const HomeScreen: React.FC = () => {
  const {
    todos,
    allTodos,
    filter,
    stats,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Todo>) => (
      <TodoItem
        todo={item}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        index={index}
      />
    ),
    [toggleTodo, deleteTodo],
  );

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  // Counts for filter badges
  const filterCounts = {
    all: allTodos.length,
    pending: stats.pending,
    completed: stats.completed,
  };

  const ListHeader = (
    <>
      <TodoStats stats={stats} />

      <AddTodoInput onAdd={addTodo} />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {filter === 'all' ? "Today's Tasks" : filter === 'pending' ? 'Pending' : 'Completed'}
        </Text>
        {stats.completed > 0 && filter !== 'pending' && (
          <TouchableOpacity onPress={clearCompleted}>
            <Text style={styles.clearBtn}>Clear done</Text>
          </TouchableOpacity>
        )}
      </View>

      <FilterTabs active={filter} onSelect={setFilter} counts={filterCounts} />
    </>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <Header pendingCount={0} />
        <View style={styles.body}>
          <View style={styles.loadingPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Coral header */}
      <Header pendingCount={stats.pending} />

      {/* White body overlapping the header */}
      <View style={styles.body}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<EmptyState filter={filter} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={12}
          windowSize={10}
          initialNumToRender={10}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    // Pull up to overlap the header slightly
    marginTop: -RADIUS.xxl,
    overflow: 'hidden',
  },
  listContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl * 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  clearBtn: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -RADIUS.xxl,
  },
});

export default HomeScreen;