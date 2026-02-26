import { useState, useEffect, useCallback } from 'react';
import { FilterType, Priority, Todo } from '../types/todo';
import { storage } from '../utils/storage';

function generateId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.loadTodos().then(persisted => {
      setTodos(persisted);
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    if (!isLoading) {
      storage.saveTodos(todos);
    }
  }, [todos, isLoading]);

  const addTodo = useCallback(
    (title: string, priority: Priority = 'medium', category?: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const newTodo: Todo = {
        id: generateId(),
        title: trimmed,
        completed: false,
        priority,
        createdAt: Date.now(),
        category,
      };

      setTodos(prev => [newTodo, ...prev]);
    },
    [],
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const updateTodoPriority = useCallback((id: string, priority: Priority) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, priority } : todo)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Derived values — computed at call time, no extra state
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    completionRate:
      todos.length > 0
        ? Math.round(
            (todos.filter(t => t.completed).length / todos.length) * 100,
          )
        : 0,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    isLoading,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoPriority,
    clearCompleted,
    setFilter,
  };
}
