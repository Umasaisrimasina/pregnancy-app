/**
 * LiveVitalsCard.tsx
 *
 * Live vitals display (BP, HR, connection status) for Digital Case History.
 * Presentational — metric values + connection status via props.
 */

import React from 'react';
import { Activity, Droplets, Heart, Clock } from 'lucide-react';

interface LiveVitalsCardProps {
  systolicBP: number | null | undefined;
  diastolicBP: number | null | undefined;
  heartRate: number | null | undefined;
  lastUpdated: string;
  isConnected: boolean;
}

export const LiveVitalsCard: React.FC<LiveVitalsCardProps> = ({
  systolicBP,
  diastolicBP,
  heartRate,
  lastUpdated,
  isConnected,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400 rounded-lg">
          <Activity size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Live Vitals</h3>
        <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          isConnected
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
            : 'bg-slate-50 dark:bg-dm-muted text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-dm-border'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* BP */}
      <div className="bg-primary-50 dark:bg-primary-900/15 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/30 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplets size={16} className="text-primary-500" />
          <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300 uppercase tracking-widest">Blood Pressure</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">
            {systolicBP != null && diastolicBP != null ? `${systolicBP}/${diastolicBP}` : 'N/A'}
          </span>
          {systolicBP != null && diastolicBP != null && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">mmHg</span>
          )}
        </div>
      </div>

      {/* HR */}
      <div className="bg-red-50 dark:bg-red-900/15 rounded-2xl p-5 border border-red-100 dark:border-red-800/30 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-red-500" />
          <span className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-widest">Heart Rate</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">
            {heartRate != null ? heartRate : 'N/A'}
          </span>
          {heartRate != null && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">BPM</span>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Clock size={14} />
        <span className="text-xs font-medium">Last updated: {lastUpdated}</span>
      </div>
    </div>
  );
};
