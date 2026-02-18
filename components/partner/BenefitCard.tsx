/**
 * BenefitCard.tsx
 *
 * Presentational benefit item card with icon, title, description.
 * Extracted from PreConceptionEducation's repeating benefits grid.
 *
 * No business logic — receives data via props.
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';
import type { LucideIcon } from 'lucide-react';

// ── Props ────────────────────────────────────────────────────────────────

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bg?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon: Icon,
  title,
  description,
  color = 'text-primary-500',
  bg = 'bg-primary-50',
}) => {
  return (
    <div className="bg-white dark:bg-dm-card p-6 rounded-2xl border border-slate-100 dark:border-dm-border hover:shadow-md transition-shadow group relative">
      <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
        <SpeakButton text={`${title}. ${description}`} size={16} className="flex-shrink-0" />
      </div>
    </div>
  );
};
