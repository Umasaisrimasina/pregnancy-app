/**
 * SupportChecklist.tsx
 *
 * Config-driven partner support checklist.
 * Renders task items with toggle behaviour.
 * Does NOT persist data — emits onToggle so the parent can decide.
 *
 * Uses PartnerTask from partnerChecklist.config.ts.
 */

import React, { useState, useEffect } from 'react';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { CardShell } from '../ui/CardShell';
import type { PartnerTask } from '../../config/partnerChecklist.config';

// ── Props ────────────────────────────────────────────────────────────────

interface SupportChecklistProps {
  /** Task list from config. */
  tasks: readonly PartnerTask[];
  /** Callback when a task is toggled (receives task id). */
  onToggle?: (taskId: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────

export const SupportChecklist: React.FC<SupportChecklistProps> = ({ tasks, onToggle }) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    tasks.forEach((t) => { if (t.status === 'done') initial.add(t.id); });
    return initial;
  });

  // Synchronize checkedIds when tasks prop changes
  useEffect(() => {
    const newCheckedIds = new Set<string>();
    tasks.forEach((t) => { if (t.status === 'done') newCheckedIds.add(t.id); });
    setCheckedIds(newCheckedIds);
  }, [tasks]);

  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onToggle?.(id);
  };

  const pendingCount = tasks.filter((t) => !checkedIds.has(t.id)).length;

  return (
    <CardShell>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <CheckSquare size={24} />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Your Support Checklist</h2>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
          {pendingCount} Task{pendingCount !== 1 ? 's' : ''} Pending
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const done = checkedIds.has(task.id);
          return (
            <div
              key={task.id}
              onClick={() => toggle(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(task.id);
                }
              }}
              role="checkbox"
              tabIndex={0}
              aria-checked={done}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-dm-border hover:bg-slate-50 dark:hover:bg-dm-muted transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded border-2 transition-colors ${
                    done
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-300 dark:border-dm-accent group-hover:border-blue-500 dark:group-hover:border-blue-500'
                  }`}
                />
                <div>
                  <h3
                    className={`font-bold text-base transition-colors ${
                      done
                        ? 'text-slate-400 line-through'
                        : 'text-slate-900 dark:text-dm-foreground'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{task.dueDate}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
            </div>
          );
        })}
      </div>

      <button 
        className="mt-6 w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors opacity-50 cursor-not-allowed"
        disabled
        aria-disabled="true"
        title="Feature coming soon"
      >
        + Add Task for Yourself
      </button>
    </CardShell>
  );
};
