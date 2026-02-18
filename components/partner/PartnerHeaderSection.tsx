/**
 * PartnerHeaderSection.tsx
 *
 * Presentational header for the Partner dashboard view.
 * Renders: optional badge · title · subtitle · SpeakButton.
 *
 * No routing, no logic, no state management.
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';

// ── Props ────────────────────────────────────────────────────────────────

interface PartnerHeaderSectionProps {
  /** Main heading text. */
  title: string;
  /** Optional sub-heading displayed below the title. */
  subtitle?: string;
  /** Optional badge text (e.g. "MODE: PARTNER PERSPECTIVE"). */
  badge?: string;
  /** Text-to-speech content. Falls back to title + subtitle. */
  speakText?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const PartnerHeaderSection: React.FC<PartnerHeaderSectionProps> = ({
  title,
  subtitle,
  badge,
  speakText,
}) => {
  const tts = speakText ?? [badge, title, subtitle].filter(Boolean).join('. ');

  return (
    <div className="mb-2 flex items-start justify-between">
      <div>
        {badge && (
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">
            {badge}
          </span>
        )}
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-dm-foreground mt-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      <SpeakButton text={tts} />
    </div>
  );
};
