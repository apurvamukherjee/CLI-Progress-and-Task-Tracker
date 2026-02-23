export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'pending' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  category?: string;
}