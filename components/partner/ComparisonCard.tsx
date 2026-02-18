/**
 * ComparisonCard.tsx
 *
 * Presentational side-by-side comparison card.
 * (e.g. "Standard Care" vs "Preventive Care").
 * Extracted from PreConceptionEducation's hardcoded grid.
 *
 * No business logic — receives config data via props.
 */

import React from 'react';
import type { ComparisonColumn } from '../../config/partnerEducation.config';

// ── Props ────────────────────────────────────────────────────────────────

interface ComparisonCardProps {
  columns: readonly ComparisonColumn[];
  recommendedLabel?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ columns, recommendedLabel = "Recommended" }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {columns.map((col, idx) => {
        const isRecommended = col.variant === 'recommended';
        return (
          <div
            key={idx}
            className={
              isRecommended
                ? 'bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/20 dark:to-dm-card dark:border-primary-700 rounded-[2rem] p-8 border-2 border-primary-100 relative shadow-lg shadow-primary-900/5 dark:shadow-none'
                : 'bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border opacity-75 hover:opacity-100 transition-opacity'
            }
          >
            {isRecommended && (
              <div className="absolute -top-3 left-8 bg-primary-600 dark:bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {recommendedLabel}
              </div>
            )}
            <div className={`flex items-center gap-3 mb-6 ${isRecommended ? 'mt-2' : ''}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isRecommended
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-slate-100 text-slate-400 dark:text-slate-500'
                }`}
              >
                <col.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground">{col.title}</h3>
            </div>
            <ul className="space-y-4">
              {col.items.map((item, i) => (
                <li
                  key={i}
                  className={`flex gap-3 text-sm ${
                    isRecommended ? 'text-slate-800 font-medium' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className={isRecommended ? 'text-primary-600 font-bold' : 'text-red-400 font-bold'}>
                    {isRecommended ? '✔' : '•'}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
