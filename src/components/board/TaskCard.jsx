import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Clock,
  ArrowRight,
  CheckCircle2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatDueDate, isOverdue, getPriorityMeta } from '../../utils/helpers';

export function TaskCard({ task, onDragStart, onDragEnd }) {
  const {
    openDetailsModal,
    openEditModal,
    openDeleteConfirm,
    duplicateTask,
    moveTask,
  } = useTasks();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, []);

  const overdue = isOverdue(task.dueDate, task.status);
  const formattedDate = formatDueDate(task.dueDate);
  const priorityMeta = getPriorityMeta(task.priority);

  // Close dropdown menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  const handleCardClick = (e) => {
    // If clicked on action buttons or menu, don't trigger modal
    if (e.target.closest('button') || e.target.closest('[data-no-card-click]')) {
      return;
    }
    openDetailsModal(task);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetailsModal(task);
    }
  };

  const nextStatuses = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ].filter(s => s.id !== task.status);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        task.status === 'completed'
          ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700/60'
      }`}
    >
      {/* Top Row: Priority Badge, Overdue Tag & Three-dot menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${priorityMeta.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dotClass}`} />
            {priorityMeta.label}
          </span>

          {/* Overdue Badge */}
          {overdue && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 animate-pulse-subtle">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Action Menu Button */}
        <div className="relative" ref={menuRef} data-no-card-click="true">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-70 group-hover:opacity-100 focus:opacity-100"
            aria-label="Task options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-elevated py-1 z-30 animate-scaleUp text-xs font-medium text-slate-700 dark:text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openDetailsModal(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                View Details
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openEditModal(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                Edit Task
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  duplicateTask(task.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Duplicate
              </button>

              {/* Status Move submenu */}
              <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                <span className="block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Move to
                </span>
                {nextStatuses.map(ns => (
                  <button
                    key={ns.id}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      moveTask(task.id, ns.id);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors text-slate-600 dark:text-slate-300"
                  >
                    <span>{ns.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openDeleteConfirm(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`text-sm font-semibold leading-snug line-clamp-2 ${
          task.status === 'completed'
            ? 'text-slate-500 dark:text-slate-400 line-through'
            : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors'
        }`}
      >
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags Chips */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Due Date & Quick Status Toggle */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          {formattedDate ? (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                overdue
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">No due date</span>
          )}
        </div>

        {/* Quick status cycle button */}
        <button
          type="button"
          data-no-card-click="true"
          onClick={(e) => {
            e.stopPropagation();
            const cycleOrder = ['todo', 'in_progress', 'completed'];
            const nextIdx = (cycleOrder.indexOf(task.status) + 1) % cycleOrder.length;
            moveTask(task.id, cycleOrder[nextIdx]);
          }}
          className="text-[11px] font-medium text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Click to cycle status"
        >
          {task.status === 'completed' ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Move <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
