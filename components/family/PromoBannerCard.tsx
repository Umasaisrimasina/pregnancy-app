/**
 * PromoBannerCard.tsx
 *
 * Dark promotional banner with CTA (e.g. "Send a Care Package?").
 * Extracted from FamilyDashboard's inline "Care Package Banner" block.
 * Presentational — all content via props, no internal state.
 */

import React from 'react';
import { Gift, type LucideIcon } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';

interface PromoBannerCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  speakText?: string;
  bgClass?: string;
}

export const PromoBannerCard: React.FC<PromoBannerCardProps> = ({
  title,
  description,
  icon: Icon = Gift,
  speakText,
  bgClass = 'bg-secondary-900',
}) => {
  const speak = speakText ?? `${title} ${description}`;

  return (
    <div className={`${bgClass} rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden`}>
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
          <p className="text-secondary-200 text-sm">{description}</p>
        </div>
        <SpeakButton
          text={speak}
          className="text-white border-white/30 bg-white/10 hover:bg-white/20"
          size={14}
        />
      </div>
      <Icon
        size={64}
        className="text-secondary-400 opacity-50 absolute right-8 bottom-0 md:static md:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
};
