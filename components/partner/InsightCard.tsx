/**
 * InsightCard.tsx
 *
 * Reusable action / insight card with icon, title, and description.
 * Used in the partner dashboard bottom grid.
 *
 * Presentational only — no state, no business logic.
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';

// ── Props ────────────────────────────────────────────────────────────────

interface InsightCardProps {
  /** Lucide icon component. */
  icon: LucideIcon;
  /** Card title text. */
  title: string;
  /** Short description / subtitle. */
  description: string;
  /** Tailwind bg class for the icon circle (e.g. "bg-primary-50"). */
  iconBg?: string;
  /** Tailwind text class for the icon color (e.g. "text-primary-600"). */
  iconColor?: string;
  /** Click handler (entire card is clickable). */
  onClick?: () => void;
}

// ── Component ────────────────────────────────────────────────────────────

export const InsightCard: React.FC<InsightCardProps> = ({
  icon: Icon,
  title,
  description,
  iconBg = 'bg-primary-50 dark:bg-primary-900/20',
  iconColor = 'text-primary-600 dark:text-primary-400',
  onClick,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
      className={`bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-slate-100 dark:border-dm-border flex items-center gap-4 hover:shadow-md transition-shadow ${isClickable ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`w-14 h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center`}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
};
