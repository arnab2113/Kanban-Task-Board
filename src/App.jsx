import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { BoardSummary } from './components/board/BoardSummary';
import { SearchAndFilters } from './components/board/SearchAndFilters';
import { KanbanBoard } from './components/board/KanbanBoard';
import { OverviewView } from './components/board/OverviewView';
import { TaskFormModal } from './components/modals/TaskFormModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { SettingsModal } from './components/modals/SettingsModal';
import { ToastContainer } from './components/common/Toast';

function DashboardLayout() {
  const { activeSidebarView } = useTasks();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const layoutRef = useRef(null);

  useEffect(() => {
    if (layoutRef.current) {
      gsap.fromTo(
        layoutRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div
      ref={layoutRef}
      className="flex min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-200"
    >
      {/* Sidebar Navigation */}
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeSidebarView === 'overview' ? (
            <OverviewView />
          ) : (
            <>
              {/* Dynamic Metric Cards */}
              <BoardSummary />

              {/* Functional Search, Filters, and Sorters */}
              <SearchAndFilters />

              {/* Kanban Task Columns */}
              <KanbanBoard />
            </>
          )}
        </main>
      </div>

      {/* Modals & Portals */}
      <TaskFormModal />
      <TaskDetailsModal />
      <ConfirmDialog />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ToastContainer />
    </div>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  // User must login first before accessing the dashboard
  if (!currentUser) {
    return <AuthPage />;
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}
