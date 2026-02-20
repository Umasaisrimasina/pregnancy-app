/**
 * ClinicalMilestonesCard.tsx
 *
 * Clinical milestones progress list for Digital Case History.
 * Presentational — milestone data via props.
 */

import React from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import type { ClinicalMilestone } from '../../config/medicalView.config';
import { CardShell } from '../ui/CardShell';

interface ClinicalMilestonesCardProps {
  milestones: ClinicalMilestone[];
}

export const ClinicalMilestonesCard: React.FC<ClinicalMilestonesCardProps> = ({ milestones }) => {
  const completedCount = milestones.filter((m) => m.done).length;
  const progressPct = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <CardShell padding="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
          <ClipboardList size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Clinical Milestones</h3>
        <span className="ml-auto text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {completedCount}/{milestones.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-dm-muted rounded-full mb-5 overflow-hidden">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
          aria-label="Clinical milestones completion"
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
        {milestones.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                m.done
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'
                  : 'bg-slate-50 dark:bg-dm-muted border-slate-100 dark:border-dm-border'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.done
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-dm-accent text-slate-400 dark:text-slate-500'
              }`}>
                <Icon size={14} />
              </div>
              <span className={`text-sm font-medium flex-1 ${
                m.done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {m.label}
              </span>
              {m.done ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-dm-accent shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </CardShell>
  );
};
