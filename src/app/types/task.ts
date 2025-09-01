export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'learning' | 'other';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  dueDate?: Date;
  estimatedTime?: number;
}

export type TaskFilter = 'all' | 'todo' | 'in-progress' | 'completed' | 'overdue' | 'today' | 'this-week';
export type TaskSort = 'created' | 'updated' | 'priority' | 'dueDate' | 'title';

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completedToday: number;
  completedThisWeek: number;
  totalEstimatedTime: number;
  totalActualTime: number;
  averageCompletionTime: number;
  productivityScore: number;
}

export interface TaskFilters {
  search: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}