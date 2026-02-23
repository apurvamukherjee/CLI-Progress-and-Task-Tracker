import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/todo';

const TODOS_KEY = '@todos_v1';

export const storage = {
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('[storage] saveTodos failed:', e);
    }
  },

  async loadTodos(): Promise<Todo[]> {
    try {
      const raw = await AsyncStorage.getItem(TODOS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Todo[];
    } catch (e) {
      console.error('[storage] loadTodos failed:', e);
      return [];
    }
  },
};