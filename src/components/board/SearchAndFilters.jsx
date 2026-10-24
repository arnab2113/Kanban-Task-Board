import React from 'react';
import {
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function SearchAndFilters() {
  const { filters, setFilters, resetFilters, filteredTasks, tasks } = useTasks();

  const isFiltered =
    filters.search !== '' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.sortBy !== 'default';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Left: Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors"
            aria-label="Sort tasks by"
          >
            <option value="default">Default Order</option>
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right: Active Match Count */}
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between sm:justify-end gap-2">
        <span>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredTasks.length}</span> of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{tasks.length}</span> tasks
        </span>
        {isFiltered && (
          <span className="inline-block w-2 h-2 rounded-full bg-brand-500" title="Filters active" />
        )}
      </div>
    </div>
  );
}
