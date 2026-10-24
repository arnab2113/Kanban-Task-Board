import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_TASKS } from '../data/initialTasks';
import { storage, generateId, isOverdue } from '../utils/helpers';

const STORAGE_KEY = 'taskflow_tasks_v3';
const THEME_STORAGE_KEY = 'taskflow_theme';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    const saved = storage.get(THEME_STORAGE_KEY, null);
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.set(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Tasks state (real-time data)
  const [tasks, setTasks] = useState(() => {
    const saved = storage.get(STORAGE_KEY, null);
    if (Array.isArray(saved)) {
      return saved;
    }
    return INITIAL_TASKS;
  });

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    storage.set(STORAGE_KEY, tasks);
  }, [tasks]);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 3500 }) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Active view & navigation
  const [activeSidebarView, setActiveSidebarView] = useState('board');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    status: 'all',
    sortBy: 'default', // 'default', 'dueDate', 'priority', 'title'
  });

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      priority: 'all',
      status: 'all',
      sortBy: 'default',
    });
  }, []);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState('todo');

  const [detailsTask, setDetailsTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Modal actions
  const openCreateModal = useCallback((status = 'todo') => {
    setEditingTask(null);
    setDefaultStatusForNewTask(status);
    setIsFormOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsFormOpen(true);
    if (detailsTask?.id === task.id) {
      setDetailsTask(null);
    }
  }, [detailsTask]);

  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  const openDetailsModal = useCallback((task) => {
    setDetailsTask(task);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setDetailsTask(null);
  }, []);

  const openDeleteConfirm = useCallback((task) => {
    setDeletingTask(task);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeletingTask(null);
  }, []);

  // Core task CRUD operations
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || '',
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      order: tasks.filter(t => t.status === (taskData.status || 'todo')).length,
    };

    setTasks(prev => [newTask, ...prev]);
    addToast({
      title: 'Task Created',
      message: `"${newTask.title}" was added to ${newTask.status.replace('_', ' ')}.`,
      type: 'success',
    });
    return newTask;
  }, [tasks, addToast]);

  const updateTask = useCallback((taskId, updatedFields) => {
    let taskName = '';
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        taskName = updatedFields.title || task.title;
        const updated = {
          ...task,
          ...updatedFields,
          updatedAt: new Date().toISOString(),
        };
        // Update detailsTask if open
        if (detailsTask?.id === taskId) {
          setDetailsTask(updated);
        }
        return updated;
      }
      return task;
    }));

    addToast({
      title: 'Task Updated',
      message: `Changes to "${taskName}" saved successfully.`,
      type: 'info',
    });
  }, [addToast, detailsTask]);

  const deleteTask = useCallback((taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (detailsTask?.id === taskId) {
      setDetailsTask(null);
    }
    if (deletingTask?.id === taskId) {
      setDeletingTask(null);
    }
    addToast({
      title: 'Task Deleted',
      message: taskToDelete ? `"${taskToDelete.title}" was deleted.` : 'Task permanently removed.',
      type: 'warning',
    });
  }, [tasks, detailsTask, deletingTask, addToast]);

  const duplicateTask = useCallback((taskId) => {
    const taskToDup = tasks.find(t => t.id === taskId);
    if (!taskToDup) return;

    const duplicated = {
      ...taskToDup,
      id: generateId(),
      title: `${taskToDup.title} (Copy)`,
      createdAt: new Date().toISOString(),
      order: tasks.filter(t => t.status === taskToDup.status).length,
    };

    setTasks(prev => [duplicated, ...prev]);
    addToast({
      title: 'Task Duplicated',
      message: `Created copy of "${taskToDup.title}".`,
      type: 'info',
    });
  }, [tasks, addToast]);

  const moveTask = useCallback((taskId, newStatus, targetIndex = null) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const currentTask = prev[taskIndex];
      const oldStatus = currentTask.status;

      // Celebrate when moving into 'completed'
      if (newStatus === 'completed' && oldStatus !== 'completed') {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
          });
        } catch (e) {
          // ignore if canvas-confetti fails
        }
      }

      const updatedTask = {
        ...currentTask,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      const remaining = prev.filter(t => t.id !== taskId);

      if (targetIndex !== null && targetIndex >= 0) {
        // Filter tasks that have this status
        const sameStatus = remaining.filter(t => t.status === newStatus);
        const otherStatus = remaining.filter(t => t.status !== newStatus);
        
        sameStatus.splice(targetIndex, 0, updatedTask);
        return [...otherStatus, ...sameStatus];
      }

      // Default: append to the end of that column
      return [...remaining, updatedTask];
    });

    // Notify user lightly
    const readableStatus = newStatus === 'in_progress' ? 'In Progress' : (newStatus === 'completed' ? 'Completed' : 'To Do');
    addToast({
      title: 'Status Updated',
      message: `Moved to ${readableStatus}.`,
      type: 'info',
      duration: 2000,
    });
  }, [addToast]);

  const reorderTaskInColumn = useCallback((draggedId, targetId, status) => {
    setTasks(prev => {
      const columnTasks = prev.filter(t => t.status === status);
      const otherTasks = prev.filter(t => t.status !== status);

      const dragIndex = columnTasks.findIndex(t => t.id === draggedId);
      const targetIndex = columnTasks.findIndex(t => t.id === targetId);

      if (dragIndex === -1 || targetIndex === -1) return prev;

      const newColumnTasks = [...columnTasks];
      const [draggedItem] = newColumnTasks.splice(dragIndex, 1);
      newColumnTasks.splice(targetIndex, 0, draggedItem);

      return [...otherTasks, ...newColumnTasks];
    });
  }, []);

  const resetToSampleTasks = useCallback(() => {
    setTasks(INITIAL_TASKS);
    storage.set(STORAGE_KEY, INITIAL_TASKS);
    addToast({
      title: 'Board Reset',
      message: 'Kanban board ready for your real-time tasks.',
      type: 'info',
    });
  }, [addToast]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    storage.remove(STORAGE_KEY);
    addToast({
      title: 'Board Cleared',
      message: 'All tasks have been removed.',
      type: 'warning',
    });
  }, [addToast]);

  // Derived statistics (dynamic)
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      completed,
      overdue,
      completionRate,
    };
  }, [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Sidebar navigation view constraints
    if (activeSidebarView === 'completed') {
      result = result.filter(t => t.status === 'completed');
    } else if (activeSidebarView === 'my_tasks') {
      // My tasks: high priority or in_progress
      result = result.filter(t => t.priority === 'high' || t.status === 'in_progress');
    }

    // Search filter (title and description)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    // Sort order
    if (filters.sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (filters.sortBy === 'priority') {
      const pOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2));
    } else if (filters.sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [tasks, filters, activeSidebarView]);

  const value = {
    theme,
    toggleTheme,
    tasks,
    filteredTasks,
    stats,
    filters,
    setFilters,
    resetFilters,
    toasts,
    addToast,
    removeToast,
    // Modals
    isFormOpen,
    editingTask,
    defaultStatusForNewTask,
    openCreateModal,
    openEditModal,
    closeFormModal,
    detailsTask,
    openDetailsModal,
    closeDetailsModal,
    deletingTask,
    openDeleteConfirm,
    closeDeleteConfirm,
    // Operations
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    moveTask,
    reorderTaskInColumn,
    resetToSampleTasks,
    clearAllTasks,
    // Navigation
    activeSidebarView,
    setActiveSidebarView,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
