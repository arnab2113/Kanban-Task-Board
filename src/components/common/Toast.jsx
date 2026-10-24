import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function ToastContainer() {
  const { toasts, removeToast } = useTasks();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 dark:border-emerald-800/60';
        let bgClass = 'bg-white dark:bg-slate-900';
        let iconClass = 'text-emerald-500';

        if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-200 dark:border-amber-800/60';
          iconClass = 'text-amber-500';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-200 dark:border-rose-800/60';
          iconClass = 'text-rose-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-indigo-200 dark:border-indigo-800/60';
          iconClass = 'text-indigo-500';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-card-hover ${bgClass} ${borderClass} transition-all duration-200 animate-slideDown`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
