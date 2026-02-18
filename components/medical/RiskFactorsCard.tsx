/**
 * RiskFactorsCard.tsx
 *
 * Risk factors checklist card for Digital Case History.
 * Presentational — risk flags + config via props.
 */

import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { RiskFlag, RiskLevelConfig } from '../../config/medicalView.config';

interface RiskFactorsCardProps {
  riskFlags: RiskFlag[];
  riskConfig: RiskLevelConfig;
}

export const RiskFactorsCard: React.FC<RiskFactorsCardProps> = ({ riskFlags, riskConfig }) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
          <AlertCircle size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Risk Factors</h3>
        <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${riskConfig.bg} text-white`}>
          {riskConfig.label}
        </span>
      </div>

      <div className="space-y-3">
        {riskFlags.map((flag) => (
          <div
            key={flag.key}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
              flag.active
                ? 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/40'
                : 'bg-slate-50 dark:bg-dm-muted border-slate-100 dark:border-dm-border'
            }`}
          >
            <span className={`text-sm font-semibold ${
              flag.active ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'
            }`}>
              {flag.label}
            </span>
            {flag.active ? (
              <div className="flex items-center gap-1.5">
                <XCircle size={16} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Positive</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Negative</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
