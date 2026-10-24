import React from 'react';
import {
  KanbanSquare,
  CheckCircle2,
  ListTodo,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  X,
  User,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ onOpenSettings }) {
  const {
    activeSidebarView,
    setActiveSidebarView,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    stats,
  } = useTasks();

  const { currentUser, logout } = useAuth();

  const navItems = [
    {
      id: 'board',
      label: 'Kanban Board',
      icon: KanbanSquare,
      badge: stats.total,
    },
    {
      id: 'my_tasks',
      label: 'My Tasks',
      icon: ListTodo,
      badge: stats.todo + stats.inProgress,
    },
    {
      id: 'completed',
      label: 'Completed Tasks',
      icon: CheckCircle2,
      badge: stats.completed,
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: PieChart,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => onOpenSettings?.(),
    },
  ];

  const handleNavClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      setActiveSidebarView(item.id);
    }
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 ${sidebarCollapsed ? 'px-3 justify-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                TaskFlow
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Sprint Workspace</span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            sidebarCollapsed ? 'mt-2' : ''
          }`}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {!sidebarCollapsed && (
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspaces
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
              
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {typeof item.badge !== 'undefined' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-brand-200/70 text-brand-800 dark:bg-brand-900 dark:text-brand-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick stats mini card (when expanded) */}
      {!sidebarCollapsed && (
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sprint Progress
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats.completionRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className={`p-3 border-t border-slate-100 dark:border-slate-800 ${sidebarCollapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${sidebarCollapsed ? 'justify-center p-1' : ''}`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs overflow-hidden shadow-xs">
              {currentUser?.initials || 'AM'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                {currentUser?.name || 'Arnab Maity'}
              </p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.role || 'Lead Engineer'}</p>
            </div>
          )}

          {!sidebarCollapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 h-full bg-white dark:bg-slate-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
