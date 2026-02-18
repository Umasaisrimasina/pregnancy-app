/**
 * MilestoneTracker.tsx
 *
 * Reusable milestone list with toggleable "achieved" state.
 * Consumes milestones.config.ts for data.
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { MilestoneEntry } from '../../config/milestones.config';

export interface MilestoneTrackerProps {
  /** Milestones to render (pre-filtered by consumer) */
  milestones: readonly MilestoneEntry[];
  /** Section title */
  title?: string;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  title = 'Upcoming Milestones',
}) => {
  const [achieved, setAchieved] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(milestones.map(m => [m.id, m.defaultAchieved])),
  );

  // Synchronize achieved state when milestones change
  useEffect(() => {
    setAchieved(prev => {
      const newAchieved: Record<string, boolean> = {};
      
      // Add or retain existing milestones
      milestones.forEach(m => {
        newAchieved[m.id] = prev[m.id] !== undefined ? prev[m.id] : m.defaultAchieved;
      });
      
      return newAchieved;
    });
  }, [milestones]);

  const toggle = (id: string) =>
    setAchieved(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">{title}</h3>
        <button className="text-secondary-500 text-sm font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {milestones.map((m) => {
          const done = achieved[m.id] ?? m.defaultAchieved;
          return (
            <div
              key={m.id}
              onClick={() => toggle(m.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(m.id);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={done}
              className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                done ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-100 dark:border-secondary-800' : 'bg-white dark:bg-dm-card border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-dm-accent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-secondary-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {done ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                </div>
                <div>
                  <h4 className={`font-bold ${done ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-600'}`}>{m.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Expected: {m.expectedTiming}</p>
                </div>
              </div>
              {done && <span className="text-xs font-bold text-secondary-500 dark:text-secondary-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">Achieved!</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
