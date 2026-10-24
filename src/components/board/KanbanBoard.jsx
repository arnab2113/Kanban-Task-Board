import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { KanbanColumn } from './KanbanColumn';
import { COLUMNS } from '../../data/initialTasks';
import { useTasks } from '../../context/TaskContext';
import { Plus, SearchX, Sparkles, FolderPlus, RotateCcw } from 'lucide-react';

export function KanbanBoard() {
  const {
    filteredTasks,
    tasks,
    moveTask,
    openCreateModal,
    resetFilters,
    filters,
  } = useTasks();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [mobileActiveColumn, setMobileActiveColumn] = useState('all');
  const boardContainerRef = useRef(null);

  const handleDragStart = (e, task) => {
    setDraggedTaskId(task.id);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDropTask = (columnId) => {
    if (draggedTaskId) {
      moveTask(draggedTaskId, columnId);
      setDraggedTaskId(null);
    }
  };

  // GSAP Entrance animation for columns
  useEffect(() => {
    if (boardContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.kanban-column-card', {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power3.out',
        });
      }, boardContainerRef);

      return () => ctx.revert();
    }
  }, [mobileActiveColumn, filters.status]);

  // State 1: Completely empty board (0 total tasks)
  if (tasks.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-card max-w-xl mx-auto my-12 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FolderPlus className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Your task board is ready
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          Create real-time tasks to plan, organize, and track your work across sprint columns.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => openCreateModal('todo')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add First Task
          </button>
        </div>
      </div>
    );
  }

  // State 2: No search/filter results
  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-card max-w-lg mx-auto my-12 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          No matching tasks found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {filters.search
            ? `We couldn't find any tasks matching "${filters.search}".`
            : 'No tasks match the active priority or status filter criteria.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('todo')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>
    );
  }

  // Filter columns based on mobile selector or filters.status
  const displayedColumns = COLUMNS.filter(col => {
    if (filters.status !== 'all' && filters.status !== col.id) {
      return false;
    }
    if (mobileActiveColumn !== 'all' && mobileActiveColumn !== col.id) {
      return false;
    }
    return true;
  });

  return (
    <div ref={boardContainerRef} className="space-y-4">
      {/* Mobile Column Quick Switcher Tabs (Visible on small screens) */}
      <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setMobileActiveColumn('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            mobileActiveColumn === 'all'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          All Columns
        </button>
        {COLUMNS.map(col => {
          const count = filteredTasks.filter(t => t.status === col.id).length;
          return (
            <button
              key={col.id}
              onClick={() => setMobileActiveColumn(col.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                mobileActiveColumn === col.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{col.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid (Horizontal scroll on tablet/mobile when all visible) */}
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6 overflow-x-auto pb-6 items-stretch">
        {displayedColumns.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDropTask={handleDropTask}
            />
          );
        })}
      </div>
    </div>
  );
}
