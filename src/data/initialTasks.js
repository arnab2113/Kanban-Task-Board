// Clean real-time initial tasks: empty by default so user manages their real tasks
export const INITIAL_TASKS = [];

export const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    accentColor: 'indigo',
    dotClass: 'bg-indigo-500 ring-indigo-200 dark:ring-indigo-950',
    borderClass: 'border-indigo-500/20',
    description: 'Tasks waiting to be picked up',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    accentColor: 'amber',
    dotClass: 'bg-amber-500 ring-amber-200 dark:ring-amber-950',
    borderClass: 'border-amber-500/20',
    description: 'Tasks actively being worked on',
  },
  {
    id: 'completed',
    title: 'Completed',
    accentColor: 'emerald',
    dotClass: 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-950',
    borderClass: 'border-emerald-500/20',
    description: 'Tasks verified and done',
  },
];

export const PRIORITIES = [
  { id: 'low', label: 'Low', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', dotClass: 'bg-slate-400' },
  { id: 'medium', label: 'Medium', badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60', dotClass: 'bg-amber-500' },
  { id: 'high', label: 'High', badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60', dotClass: 'bg-rose-500' },
];
