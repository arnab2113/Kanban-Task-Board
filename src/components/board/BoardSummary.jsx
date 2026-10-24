import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Layers,
  CircleDashed,
  Timer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function BoardSummary() {
  const { stats, filters, setFilters } = useTasks();
  const containerRef = useRef(null);

  // GSAP Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.summary-card', {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleStatusCardClick = (statusKey) => {
    if (filters.status === statusKey) {
      setFilters(prev => ({ ...prev, status: 'all' }));
    } else {
      setFilters(prev => ({ ...prev, status: statusKey }));
    }
  };

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      count: stats.total,
      subtitle: `${stats.completionRate}% completed`,
      icon: Layers,
      color: 'indigo',
      active: filters.status === 'all',
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      borderActiveClass: 'ring-2 ring-indigo-500 border-indigo-500',
    },
    {
      id: 'todo',
      title: 'To Do',
      count: stats.todo,
      subtitle: 'Ready for action',
      icon: CircleDashed,
      color: 'slate',
      active: filters.status === 'todo',
      accentBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      borderActiveClass: 'ring-2 ring-slate-500 border-slate-500',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      count: stats.inProgress,
      subtitle: 'Active workload',
      icon: Timer,
      color: 'amber',
      active: filters.status === 'in_progress',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      borderActiveClass: 'ring-2 ring-amber-500 border-amber-500',
      pulse: stats.inProgress > 0,
    },
    {
      id: 'completed',
      title: 'Completed',
      count: stats.completed,
      subtitle: 'Successfully shipped',
      icon: CheckCircle2,
      color: 'emerald',
      active: filters.status === 'completed',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      borderActiveClass: 'ring-2 ring-emerald-500 border-emerald-500',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
    >
      {cards.map(card => {
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => handleStatusCardClick(card.id)}
            className={`summary-card group relative text-left p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer ${
              card.active
                ? `${card.borderActiveClass} bg-slate-50/50 dark:bg-slate-800/40`
                : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.accentBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {card.count}
              </span>
              {card.pulse && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
              <span>{card.subtitle}</span>
              {card.id === 'all' && stats.overdue > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {stats.overdue} overdue
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
