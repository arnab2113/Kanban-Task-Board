import React from 'react';
import {
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Calendar,
  BarChart2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatDueDate, isOverdue } from '../../utils/helpers';

export function OverviewView() {
  const { stats, tasks, setActiveSidebarView, openCreateModal } = useTasks();

  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'low').length;

  const upcomingDeadlines = tasks
    .filter(t => t.dueDate && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Sprint 14 Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sprint Velocity is at {stats.completionRate}%
          </h2>
          <p className="mt-2 text-sm text-indigo-100/80 leading-relaxed">
            You've completed {stats.completed} out of {stats.total} scheduled tasks. Maintain this pace to close out all sprint milestones ahead of schedule.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveSidebarView('board')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-brand-900 hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Go to Kanban Board
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCreateModal('todo')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-800/80 text-white hover:bg-brand-700 transition-colors border border-white/10"
            >
              Add New Task
            </button>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid: Priority Distribution & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-500" />
              Priority Breakdown
            </h3>
            <span className="text-xs text-slate-400">{stats.total} Total Tasks</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {highPriorityCount} ({stats.total > 0 ? Math.round((highPriorityCount / stats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (highPriorityCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium Priority
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {mediumPriorityCount} ({stats.total > 0 ? Math.round((mediumPriorityCount / stats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (mediumPriorityCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Low Priority
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {lowPriorityCount} ({stats.total > 0 ? Math.round((lowPriorityCount / stats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${stats.total > 0 ? (lowPriorityCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              Upcoming Deadlines
            </h3>
            <span className="text-xs text-slate-400">{upcomingDeadlines.length} scheduled</span>
          </div>

          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map(task => {
                const overdue = isOverdue(task.dueDate, task.status);
                const formatted = formatDueDate(task.dueDate);

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </p>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap ${
                        overdue
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {formatted}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No upcoming scheduled deadlines found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
