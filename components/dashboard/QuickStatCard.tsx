/**
 * QuickStatCard.tsx
 *
 * Reusable stat card for dashboard quick-glance metrics
 * (Last Feed, Last Sleep, Weight, Next Feed, etc.).
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface QuickStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  /** Optional accent colour class (bg + text) for full-colour variant */
  accentBg?: string;
  /** Tailwind border classes for the icon circle background */
  iconBg?: string;
  iconColor?: string;
}

export const QuickStatCard: React.FC<QuickStatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  accentBg,
  iconBg = 'bg-slate-50',
  iconColor = 'text-slate-500',
}) => {
  if (accentBg) {
    // Full-colour "highlight" variant (e.g. Next Feed card)
    return (
      <div className={`${accentBg} p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center text-center gap-2 text-white`}>
        <div className="p-3 bg-white/20 rounded-full mb-1">
          <Icon size={24} />
        </div>
        <span className="text-white/70 text-xs font-bold uppercase">{label}</span>
        <span className="text-2xl font-display font-bold">{value}</span>
        {subtext && <span className="text-xs text-white/70">{subtext}</span>}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 dark:border-dm-border shadow-sm flex flex-col items-center justify-center text-center gap-2">
      <div className={`p-3 ${iconBg} ${iconColor} rounded-full mb-1`}>
        <Icon size={24} />
      </div>
      <span className="text-slate-400 text-xs font-bold uppercase">{label}</span>
      <span className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">{value}</span>
      {subtext && <span className="text-xs text-slate-400 dark:text-slate-500">{subtext}</span>}
    </div>
  );
};
