'use client';

import { useState, useCallback, useMemo } from 'react';
import { Task, TaskFormData, TaskFilter, TaskStats, TaskSort, TaskPriority, TaskCategory, TaskStatus } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('created');
  const [searchQuery, setSearchQuery] = useState('');

  const addTask = useCallback((taskData: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      status: 'todo',
      priority: taskData.priority,
      category: taskData.category,
      tags: taskData.tags,
      dueDate: taskData.dueDate,
      estimatedTime: taskData.estimatedTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
          updatedAt: new Date()
        };
      }
      return task;
    }));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status,
            completedAt: status === 'completed' ? new Date() : undefined,
            updatedAt: new Date() 
          }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'));
  }, []);

  const duplicateTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const duplicatedTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        title: `${task.title} (Cópia)`,
        status: 'todo',
        completedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks(prev => [duplicatedTask, ...prev]);
    }
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query);
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // Status filter
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      switch (filter) {
        case 'todo':
          return task.status === 'todo';
        case 'in-progress':
          return task.status === 'in-progress';
        case 'completed':
          return task.status === 'completed';
        case 'overdue':
          return task.dueDate && task.dueDate < now && task.status !== 'completed';
        case 'today':
          return task.dueDate && task.dueDate >= today && task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        case 'this-week':
          return task.dueDate && task.dueDate >= today && task.dueDate <= weekFromNow;
        default:
          return true;
      }
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sort) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'updated':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [tasks, filter, sort, searchQuery]);

  const stats: TaskStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completed = tasks.filter(t => t.status === 'completed');
    const completedToday = completed.filter(t => 
      t.completedAt && t.completedAt >= today
    );
    const completedThisWeek = completed.filter(t => 
      t.completedAt && t.completedAt >= weekAgo
    );

    const overdue = tasks.filter(t => 
      t.dueDate && t.dueDate < now && t.status !== 'completed'
    );

    const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    const totalActual = completed.reduce((sum, t) => sum + (t.actualTime || 0), 0);

    const completionTimes = completed
      .filter(t => t.completedAt && t.createdAt)
      .map(t => t.completedAt!.getTime() - t.createdAt.getTime());
    
    const averageCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;

    const productivityScore = tasks.length > 0 
      ? Math.round((completed.length / tasks.length) * 100)
      : 0;

    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: completed.length,
      overdue: overdue.length,
      completedToday: completedToday.length,
      completedThisWeek: completedThisWeek.length,
      totalEstimatedTime: totalEstimated,
      totalActualTime: totalActual,
      averageCompletionTime,
      productivityScore,
    };
  }, [tasks]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
    filter,
    sort,
    searchQuery,
    stats,
    addTask,
    toggleTask,
    updateTaskStatus,
    deleteTask,
    updateTask,
    clearCompleted,
    duplicateTask,
    setFilter,
    setSort,
    setSearchQuery,
  };
}