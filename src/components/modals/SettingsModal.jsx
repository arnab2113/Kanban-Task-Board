import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  X,
  Moon,
  Sun,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function SettingsModal({ isOpen, onClose }) {
  const {
    theme,
    toggleTheme,
    resetToSampleTasks,
    clearAllTasks,
    tasks,
    addToast,
  } = useTasks();

  const fileInputRef = useRef(null);
  const modalBoxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (modalBoxRef.current) {
        gsap.fromTo(
          modalBoxRef.current,
          { opacity: 0, scale: 0.94, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }
        );
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      title: 'Export Complete',
      message: 'All tasks downloaded as JSON backup.',
      type: 'success',
    });
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          window.localStorage.setItem('taskflow_tasks_v2', JSON.stringify(parsed));
          window.location.reload();
        } else {
          throw new Error('Invalid JSON format');
        }
      } catch (err) {
        addToast({
          title: 'Import Failed',
          message: 'The file provided is not a valid TaskFlow JSON file.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalBoxRef}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-elevated p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="settings-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Workspace Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage appearance, data backups, and workspace preferences.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Appearance Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Theme & Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  theme === 'light'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 ring-2 ring-brand-500/20 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Light Mode</p>
                  <p className="text-[10px] text-slate-400">Crisp off-white</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  theme === 'dark'
                    ? 'border-brand-500 bg-brand-950/40 text-brand-300 ring-2 ring-brand-500/20 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Dark Mode</p>
                  <p className="text-[10px] text-slate-400">Deep slate theme</p>
                </div>
              </button>
            </div>
          </div>

          {/* Data Management Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Data & LocalStorage
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  resetToSampleTasks();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Reset Board
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Clear tasks and start fresh with a clean real-time board.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Export Tasks Backup
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Download current board tasks as a JSON file.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Import Tasks Backup
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Restore tasks from a JSON backup file.
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all tasks on this board?')) {
                    clearAllTasks();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-rose-100 dark:border-rose-950 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-colors text-left text-rose-600 dark:text-rose-400"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Clear Entire Board</p>
                    <p className="text-[11px] text-slate-400">
                      Removes all tasks and resets to an empty state.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
