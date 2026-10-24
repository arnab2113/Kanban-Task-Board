import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Menu,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  Command,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header({ onOpenSettings }) {
  const {
    openCreateModal,
    filters,
    setFilters,
    setMobileSidebarOpen,
    activeSidebarView,
  } = useTasks();

  const { currentUser, logout } = useAuth();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global keyboard shortcut: '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View title logic
  let viewTitle = 'Kanban Board';
  let viewSubtitle = 'Plan, organize, and track your work.';
  if (activeSidebarView === 'my_tasks') {
    viewTitle = 'My Tasks';
    viewSubtitle = 'High priority and in-progress items assigned to you.';
  } else if (activeSidebarView === 'completed') {
    viewTitle = 'Completed Tasks';
    viewSubtitle = 'Review finished work and milestones.';
  } else if (activeSidebarView === 'overview') {
    viewTitle = 'Workspace Overview';
    viewSubtitle = 'High-level metrics and sprint velocity.';
  }

  const mockNotifications = [
    {
      id: 1,
      title: 'Sprint 14 review starts in 2 hours',
      time: '10m ago',
      unread: true,
      icon: Clock,
    },
    {
      id: 2,
      title: 'Arnab Maity updated sprint board',
      time: '45m ago',
      unread: true,
      icon: CheckCircle,
    },
    {
      id: 3,
      title: 'Design token hierarchy was approved by Lead',
      time: '3h ago',
      unread: false,
      icon: Sparkles,
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {viewTitle}
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
                {viewSubtitle}
              </p>
            </div>
          </div>

          {/* Center / Right: Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input Bar */}
            <div className="relative max-w-xs sm:w-64 md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search tasks (title, tags)..."
                className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              />
              {filters.search ? (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden md:flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                    /
                  </kbd>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="View notifications"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-elevated p-2 z-50 animate-scaleUp">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium cursor-pointer hover:underline">
                      Mark all as read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                    {mockNotifications.map(n => {
                      const NIcon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mt-0.5">
                            <NIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-snug">
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 mt-1 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Add Task Button */}
            <button
              onClick={() => openCreateModal('todo')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Add Task</span>
            </button>

            {/* Profile Avatar & Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-xs"
                aria-label="User profile menu"
              >
                {currentUser?.initials || 'AM'}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-elevated p-2 z-50 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {currentUser?.name || 'Arnab Maity'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || 'arnab.maity@taskflow.dev'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenSettings?.();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Workspace Settings
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
