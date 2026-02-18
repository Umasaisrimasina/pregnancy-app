/**
 * ObstetricOverviewCard.tsx
 *
 * GPLAD + LMP/EDD display for Digital Case History.
 * Presentational — obstetric data via props.
 */

import React from 'react';
import { Baby } from 'lucide-react';

interface GPLADEntry {
  letter: string;
  value: number;
  label: string;
}

interface ObstetricOverviewCardProps {
  gplad: GPLADEntry[];
  lmpFormatted: string;
  eddFormatted: string;
}

export const ObstetricOverviewCard: React.FC<ObstetricOverviewCardProps> = ({
  gplad,
  lmpFormatted,
  eddFormatted,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
          <Baby size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Obstetric Overview</h3>
      </div>

      {/* GPLAD */}
      <div className="bg-purple-50 dark:bg-purple-900/15 rounded-2xl p-5 border border-purple-100 dark:border-purple-800/30 mb-5">
        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest block mb-2">GPLAD</span>
        <div className="flex items-center gap-3 flex-wrap">
          {gplad.map((g) => (
            <div key={g.letter} className="flex flex-col items-center" title={g.label}>
              <span className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">
                {g.letter}<sub className="text-base text-purple-500">{g.value}</sub>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LMP / EDD */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">LMP</span>
          <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{lmpFormatted}</span>
        </div>
        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">EDD</span>
          <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{eddFormatted}</span>
        </div>
      </div>
    </div>
  );
};
