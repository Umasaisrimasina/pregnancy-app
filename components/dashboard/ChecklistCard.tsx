/**
 * ChecklistCard.tsx
 *
 * Reusable checklist card with toggle-able items.
 * Reads default items from config, manages local checked state.
 * Used in PostPartumDashboard; can be reused by BabyCare or future phases.
 */

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ChecklistItem } from '../../config/postPartumChecklist.config';

// ── Props ────────────────────────────────────────────────────────────────

interface ChecklistCardProps {
  title: string;
  items: readonly ChecklistItem[];
  /** Tailwind accent color class (e.g. 'purple', 'primary'). */
  accent?: string;
}

// ── Accent class maps (static strings required for Tailwind purge) ────────
const ACCENT_TEXT: Record<string, string> = {
  purple: 'text-purple-600',
  primary: 'text-primary-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  pink: 'text-pink-600',
  secondary: 'text-secondary-600',
};

const ACCENT_BG_LIGHT: Record<string, string> = {
  purple: 'bg-purple-50',
  primary: 'bg-primary-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  pink: 'bg-pink-50',
  secondary: 'bg-secondary-50',
};

const ACCENT_BG: Record<string, string> = {
  purple: 'bg-purple-500',
  primary: 'bg-primary-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  secondary: 'bg-secondary-500',
};

// ── Component ────────────────────────────────────────────────────────────

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  title,
  items,
  accent = 'purple',
}) => {
  const [checklist, setChecklist] = useState(
    items.map((item) => ({ label: item.label, done: item.defaultDone })),
  );

  const toggle = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item)),
    );
  };

  const doneCount = checklist.filter((i) => i.done).length;

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-xl">{title}</h3>
        <span className={`${ACCENT_TEXT[accent] ?? 'text-purple-600'} font-bold text-sm`}>
          {doneCount}/{checklist.length} done
        </span>
      </div>

      <div className="space-y-2">
        {checklist.map((item, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
              item.done ? (ACCENT_BG_LIGHT[accent] ?? 'bg-purple-50') : 'hover:bg-slate-50 dark:hover:bg-dm-muted'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                item.done ? (ACCENT_BG[accent] ?? 'bg-purple-500') : 'border-2 border-slate-300'
              }`}
            >
              {item.done && <Check size={16} className="text-white" />}
            </div>
            <span
              className={`font-medium text-base ${
                item.done ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-600'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
