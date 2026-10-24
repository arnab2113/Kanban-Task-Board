import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  X,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Copy,
  Tag,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  User
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { formatDueDate, isOverdue, getPriorityMeta } from '../../utils/helpers';
import { COLUMNS } from '../../data/initialTasks';

export function TaskDetailsModal() {
  const {
    detailsTask,
    closeDetailsModal,
    openEditModal,
    openDeleteConfirm,
    duplicateTask,
    moveTask,
  } = useTasks();

  const { currentUser } = useAuth();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (detailsTask) {
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { opacity: 0, scale: 0.94, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }
        );
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeDetailsModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [detailsTask, closeDetailsModal]);

  if (!detailsTask) return null;

  const overdue = isOverdue(detailsTask.dueDate, detailsTask.status);
  const formattedDate = formatDueDate(detailsTask.dueDate);
  const priorityMeta = getPriorityMeta(detailsTask.priority);

  const currentColumn = COLUMNS.find(c => c.id === detailsTask.status) || COLUMNS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onClick={closeDetailsModal}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-elevated p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityMeta.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${priorityMeta.dotClass}`} />
              {priorityMeta.label} Priority
            </span>

            {overdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-3.5 h-3.5" />
                Overdue
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => openEditModal(detailsTask)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                duplicateTask(detailsTask.id);
                closeDetailsModal();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Duplicate Task"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                openDeleteConfirm(detailsTask);
                closeDetailsModal();
              }}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeDetailsModal}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h2
          id="task-details-title"
          className="text-xl font-bold text-slate-900 dark:text-white mt-4 leading-snug"
        >
          {detailsTask.title}
        </h2>

        {/* Description */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description
          </h4>
          {detailsTask.description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {detailsTask.description}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400">No description provided.</p>
          )}
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-400">Current Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ring-2 ${currentColumn.dotClass}`} />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {currentColumn.title}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Due Date</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formattedDate || 'None'}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Assignee</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                {currentUser?.initials || 'AM'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {currentUser?.name || 'Arnab Maity'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Created</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {detailsTask.createdAt
                  ? new Date(detailsTask.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent'}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {detailsTask.tags && detailsTask.tags.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {detailsTask.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Change Status Fast Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Change Status
          </span>
          <div className="grid grid-cols-3 gap-2">
            {COLUMNS.map(col => {
              const isCurrent = col.id === detailsTask.status;
              return (
                <button
                  key={col.id}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => {
                    moveTask(detailsTask.id, col.id);
                    closeDetailsModal();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 ring-1 ring-brand-500/50 cursor-default'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                  {col.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
