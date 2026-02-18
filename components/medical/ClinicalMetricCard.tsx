/**
 * ClinicalMetricCard.tsx
 *
 * Reusable metric card for the clinical dashboard (Blood Sugar, Weight Gain, Sleep).
 * Presentational — all data + styling via props.
 */

import React from 'react';
import { AlertCircle, TrendingUp, Activity, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  'blood-sugar': { icon: AlertCircle, color: 'text-primary-400' },
  'weight-gain': { icon: TrendingUp, color: 'text-primary-500' },
  'avg-sleep': { icon: Activity, color: 'text-blue-500' },
};

interface ClinicalMetricCardProps {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  status?: 'urgent' | 'normal';
  iconKey: string;
  bgClass: string;
  borderClass: string;
  titleColor: string;
  subtitleColor: string;
}

export const ClinicalMetricCard: React.FC<ClinicalMetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  status,
  iconKey,
  bgClass,
  borderClass,
  titleColor,
  subtitleColor,
}) => {
  const iconEntry = ICON_MAP[iconKey] || ICON_MAP['avg-sleep'];
  const Icon = iconEntry.icon;

  return (
    <div className={`${bgClass} rounded-2xl p-5 border ${borderClass} relative overflow-hidden`}>
      {status === 'urgent' ? (
        <div 
          className="flex justify-between items-start mb-2"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          <Icon size={20} className={iconEntry.color} aria-label={`Status: ${status} - ${title}`} />
          <span className="bg-primary-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            URGENT
            <span className="sr-only">Urgent status indicator</span>
          </span>
        </div>
      ) : (
        <Icon size={20} className={`${iconEntry.color} mb-2`} aria-label={`Status indicator for ${title}`} />
      )}
      <span className={`text-xs font-bold ${titleColor} uppercase tracking-wide`}>{title}</span>
      <div className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground mt-1">
        {value} <span className="text-sm font-medium text-slate-500 dark:text-slate-500">{unit}</span>
      </div>
      <p className={`text-[10px] ${subtitleColor} mt-2 font-medium`}>{subtitle}</p>
    </div>
  );
};
