import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function ConfirmDialog() {
  const { deletingTask, closeDeleteConfirm, deleteTask } = useTasks();
  const cancelBtnRef = useRef(null);
  const dialogBoxRef = useRef(null);

  useEffect(() => {
    if (deletingTask) {
      if (dialogBoxRef.current) {
        gsap.fromTo(
          dialogBoxRef.current,
          { opacity: 0, scale: 0.92, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'back.out(1.4)' }
        );
      }

      // Auto-focus cancel button for safe keyboard UX
      setTimeout(() => cancelBtnRef.current?.focus(), 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeDeleteConfirm();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [deletingTask, closeDeleteConfirm]);

  if (!deletingTask) return null;

  const handleDelete = () => {
    deleteTask(deletingTask.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onClick={closeDeleteConfirm}
    >
      <div
        ref={dialogBoxRef}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-elevated p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-delete-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              Delete Task
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                "{deletingTask.title}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <button
            onClick={closeDeleteConfirm}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={closeDeleteConfirm}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
