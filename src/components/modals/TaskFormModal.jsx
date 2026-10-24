import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Calendar, Tag, AlertCircle, Check } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COLUMNS, PRIORITIES } from '../../data/initialTasks';

export function TaskFormModal() {
  const {
    isFormOpen,
    editingTask,
    defaultStatusForNewTask,
    closeFormModal,
    addTask,
    updateTask,
  } = useTasks();

  const titleInputRef = useRef(null);
  const dialogRef = useRef(null);
  const backdropRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    tagsString: '',
  });

  const [touched, setTouched] = useState({
    title: false,
  });

  const [errors, setErrors] = useState({});

  // Reset or pre-fill form when modal opens
  useEffect(() => {
    if (isFormOpen) {
      if (editingTask) {
        setFormData({
          title: editingTask.title || '',
          description: editingTask.description || '',
          priority: editingTask.priority || 'medium',
          status: editingTask.status || 'todo',
          dueDate: editingTask.dueDate || '',
          tagsString: editingTask.tags ? editingTask.tags.join(', ') : '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: defaultStatusForNewTask || 'todo',
          dueDate: '',
          tagsString: '',
        });
      }
      setTouched({ title: false });
      setErrors({});

      setTimeout(() => {
        titleInputRef.current?.focus();
        if (dialogRef.current) {
          gsap.fromTo(
            dialogRef.current,
            { opacity: 0, scale: 0.94, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }
          );
        }
      }, 30);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeFormModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFormOpen, editingTask, defaultStatusForNewTask, closeFormModal]);

  if (!isFormOpen) return null;

  // Validate fields
  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required.';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    } else if (formData.title.trim().length > 100) {
      errs.title = 'Title must be under 100 characters.';
    }
    return errs;
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, title: val }));
    if (touched.title) {
      if (!val.trim()) {
        setErrors(prev => ({ ...prev, title: 'Task title is required.' }));
      } else if (val.trim().length < 3) {
        setErrors(prev => ({ ...prev, title: 'Title must be at least 3 characters.' }));
      } else {
        setErrors(prev => {
          const next = { ...prev };
          delete next.title;
          return next;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ title: true });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      titleInputRef.current?.focus();
      return;
    }

    // Process tags
    const tags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      tags,
    };

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
    }

    closeFormModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={closeFormModal}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-elevated p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="task-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {editingTask ? 'Modify the details and workflow status.' : 'Fill in the information to add a task to your board.'}
            </p>
          </div>
          <button
            onClick={closeFormModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              onBlur={() => {
                setTouched(prev => ({ ...prev, title: true }));
                setErrors(validate());
              }}
              placeholder="e.g. Design token hierarchy for design system"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-400/40 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500/40 focus:border-brand-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add key context, requirements, acceptance criteria..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Column Status
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {COLUMNS.map(col => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: col.id }))}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center truncate ${
                      formData.status === col.id
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: p.id }))}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      formData.priority === p.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dotClass}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Due Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="task-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="task-tags"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Tags <span className="text-slate-400 font-normal lowercase">(comma separated)</span>
              </label>
              <input
                id="task-tags"
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData(prev => ({ ...prev, tagsString: e.target.value }))}
                placeholder="e.g. Design, Frontend, Sprint14"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <Check className="w-4 h-4" />
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
