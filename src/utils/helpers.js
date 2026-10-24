import { PRIORITIES } from '../data/initialTasks';

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse YYYY-MM-DD safely
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

export function formatDueDate(dueDate) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return dueDate;

  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;

  return due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: due.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function getPriorityMeta(priority) {
  const normalized = (priority || 'medium').toLowerCase();
  const found = PRIORITIES.find(p => p.id === normalized);
  return found || PRIORITIES[1];
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
}

export const storage = {
  get: (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  },
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  }
};
