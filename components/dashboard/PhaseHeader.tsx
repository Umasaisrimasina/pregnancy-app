/**
 * PhaseHeader.tsx
 *
 * Shared dashboard header component used by all phase views.
 * Eliminates the ~5× duplicated header pattern in Dashboard.tsx.
 *
 * Displays: animated badge · phase title · subtitle · SpeakButton
 * Optionally renders right-aligned content (CTA buttons, etc.).
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';

// ── Props ────────────────────────────────────────────────────────────────

interface PhaseHeaderProps {
  /** Text inside the animated badge (e.g. "Planning Phase", "Trimester 2"). */
  badgeText: string;
  /** Tailwind classes for badge background, border, and text color. */
  badgeColorClass?: string;
  /** Tailwind class for the animated pulse dot. */
  dotColorClass?: string;
  /** Main title (e.g. "Pre-Conception", "Pregnancy"). */
  title: string;
  /** Sub-line below the title. */
  subtitle: string;
  /** Text-to-speech content for the SpeakButton. */
  speakText: string;
  /** Optional right-aligned content (e.g. action buttons). */
  rightContent?: React.ReactNode;
}

// ── Component ────────────────────────────────────────────────────────────

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  badgeText,
  badgeColorClass = 'bg-primary-50 border-primary-100 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300',
  dotColorClass = 'bg-primary-500',
  title,
  subtitle,
  speakText,
  rightContent,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2 ${badgeColorClass}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${dotColorClass}`} />
            {badgeText}
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-dm-foreground">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        <SpeakButton text={speakText} />
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};
