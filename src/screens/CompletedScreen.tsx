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
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../types/todo';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

import Header from '../components/Header';
import TodoItem from '../components/TodoItem';
import EmptyState from '../components/EmptyState';

const CompletedScreen: React.FC = () => {
  const { allTodos, stats, isLoading, toggleTodo, deleteTodo, clearCompleted } =
    useTodos();

  // Filter to only completed todos
  const completedTodos = allTodos.filter(todo => todo.completed);

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

  const ListHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Done</Text>
      {completedTodos.length > 0 && (
        <TouchableOpacity onPress={clearCompleted}>
          <Text style={styles.clearBtn}>Clear all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <Header pendingCount={0} />
        <View style={styles.body} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header pendingCount={stats.pending} />
      <View style={styles.body}>
        <FlatList
          data={completedTodos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<EmptyState filter="completed" />}
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
  safe: { flex: 1, backgroundColor: COLORS.primary },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
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
  loadingContainer: { flex: 1, backgroundColor: COLORS.primary },
});

export default CompletedScreen;
