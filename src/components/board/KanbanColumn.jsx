import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../context/TaskContext';

export function KanbanColumn({
  column,
  tasks,
  onDragStart,
  onDragEnd,
  onDropTask,
}) {
  const { openCreateModal } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only deactivate if leaving the container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(column.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`kanban-column-card flex flex-col flex-1 min-w-[280px] sm:min-w-[320px] max-w-full lg:max-w-none bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-3 sm:p-4 border transition-all duration-200 ${
        isDragOver
          ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-2 ring-brand-500/20'
          : 'border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ring-4 ${column.dotClass}`} />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {column.title}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Task in this Column */}
        <button
          type="button"
          onClick={() => openCreateModal(column.id)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          aria-label={`Add task to ${column.title}`}
          title={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards Stack */}
      <div className="flex-1 flex flex-col gap-3 min-h-[160px] overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        ) : (
          /* Empty Column State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white/40 dark:bg-slate-900/20">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              No tasks in {column.title}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 mb-3">
              {column.description}
            </p>
            <button
              type="button"
              onClick={() => openCreateModal(column.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        )}
      </div>

      {/* Subtle bottom drop target indicator */}
      {isDragOver && (
        <div className="mt-2 py-3 rounded-xl border-2 border-dashed border-brand-400 dark:border-brand-600 bg-brand-100/40 dark:bg-brand-900/20 text-center text-xs font-semibold text-brand-600 dark:text-brand-400 animate-pulse">
          Drop here to move to {column.title}
        </div>
      )}
    </div>
  );
}
