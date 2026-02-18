/**
 * GoalHighlightCard.tsx
 *
 * Reusable hero-style goal card with gradient background.
 * Renders: title · description · primary CTA · optional secondary CTA.
 * Optional decorative background icon.
 *
 * Presentational only — no state, no business logic.
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';
import type { LucideIcon } from 'lucide-react';

// ── Props ────────────────────────────────────────────────────────────────

interface CTAAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

interface GoalHighlightCardProps {
  /** Main title (e.g. "Tonight's Goal: Iron-Rich Dinner"). */
  title: string;
  /** Supporting description text. */
  description: string;
  /** Primary action button. */
  primaryAction: CTAAction;
  /** Optional secondary action button. */
  secondaryAction?: CTAAction;
  /** TTS text. Falls back to title + description. */
  speakText?: string;
  /** Tailwind gradient classes for the card bg. */
  gradientClass?: string;
  /** Optional large watermark icon in bottom-right. */
  bgIcon?: LucideIcon;
}

// ── Component ────────────────────────────────────────────────────────────

export const GoalHighlightCard: React.FC<GoalHighlightCardProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  speakText,
  gradientClass = 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900',
  bgIcon: BgIcon,
}) => {
  const tts = speakText ?? `${title}. ${description}`;

  return (
    <div
      className={`${gradientClass} rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/20`}
    >
      <div className="relative z-10 max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold mb-3">{title}</h2>
            <p className="text-blue-100 dark:text-blue-200 text-sm leading-relaxed mb-8">
              {description}
            </p>
          </div>
          <SpeakButton
            text={tts}
            className="text-white border-white/30 bg-white/10 hover:bg-white/20"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={primaryAction.onClick}
            className="bg-white text-blue-700 dark:text-blue-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors"
          >
            {primaryAction.icon && <primaryAction.icon size={18} />}
            {primaryAction.label}
          </button>

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="bg-blue-500/30 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-500/40 transition-colors"
            >
              {secondaryAction.icon && <secondaryAction.icon size={18} />}
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>

      {BgIcon && (
        <BgIcon
          size={200}
          className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-12"
        />
      )}
    </div>
  );
};
