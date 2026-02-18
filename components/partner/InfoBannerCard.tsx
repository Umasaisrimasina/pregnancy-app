/**
 * InfoBannerCard.tsx
 *
 * Reusable static information / tip banner card.
 * Use for: partner tip-of-the-day, science info banners, fertility intros, etc.
 *
 * Presentational only — no state, no business logic.
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';
import type { LucideIcon } from 'lucide-react';

// ── Props ────────────────────────────────────────────────────────────────

interface InfoBannerCardProps {
  /** Lucide icon for the banner accent. */
  icon: LucideIcon;
  /** Short label above the content (e.g. "Partner Tip of the Day"). */
  label: string;
  /** Main body text (rendered in italic by default). */
  text: string;
  /** Tailwind bg class for the card container. */
  bgClass?: string;
  /** Tailwind border class. */
  borderClass?: string;
  /** Tailwind text color class for the icon + label. */
  accentColor?: string;
  /** Tailwind text color class for the body text. */
  textColor?: string;
  /** TTS content. Falls back to label + text. */
  speakText?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const InfoBannerCard: React.FC<InfoBannerCardProps> = ({
  icon: Icon,
  label,
  text,
  bgClass = 'bg-[#fffbeb] dark:bg-amber-900/20',
  borderClass = 'border border-amber-50 dark:border-amber-900/30',
  accentColor = 'text-amber-700 dark:text-amber-500',
  textColor = 'text-amber-900 dark:text-amber-200',
  speakText,
}) => {
  const tts = speakText ?? `${label}. ${text}`;

  return (
    <div className={`${bgClass} rounded-[2rem] p-8 ${borderClass}`}>
      <div className={`flex items-center gap-2 mb-4 ${accentColor}`}>
        <Icon size={18} aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-start gap-2">
        <p className={`${textColor} italic text-sm leading-relaxed font-medium flex-1`}>
          &quot;{text}&quot;
        </p>
        <SpeakButton text={tts} size={14} />
      </div>
    </div>
  );
};
