/**
 * MilestoneAlertCard.tsx
 *
 * Hero-style milestone card for the Family overview.
 * Extracted from FamilyDashboard's inline "Milestone Hero" block.
 * Presentational — all data via props, no internal state.
 */

import React from 'react';
import { Heart, Mic, type LucideIcon } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';

interface ActionButton { label: string; icon?: LucideIcon; onClick?: () => void }

interface MilestoneAlertCardProps {
  title: string;
  description: string;
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  speakText?: string;
}

const DEFAULT_PRIMARY: ActionButton = { label: 'Send Love', icon: Heart };
const DEFAULT_SECONDARY: ActionButton = { label: 'Record Voice Note', icon: Mic };

export const MilestoneAlertCard: React.FC<MilestoneAlertCardProps> = ({
  title,
  description,
  primaryAction = DEFAULT_PRIMARY,
  secondaryAction,
  speakText,
}) => {
  const PrimaryIcon = primaryAction.icon;
  const SecondaryIcon = secondaryAction?.icon;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-800/20 dark:to-dark-900 rounded-[2.5rem] p-10 border border-primary-100 dark:border-primary-800/30 text-center relative overflow-hidden">
      <Heart size={300} className="absolute -top-10 -left-10 text-primary-100 dark:text-primary-800/20 opacity-50 rotate-[-15deg]" />
      <Heart size={200} className="absolute -bottom-10 -right-10 text-primary-100 dark:text-primary-800/20 opacity-50 rotate-[15deg]" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-2xl font-display font-bold text-primary-700 dark:text-primary-300 mb-3">
            {title}
          </h3>
          {speakText && (
            <SpeakButton
              text={speakText}
            />
          )}
        </div>
        <p className="text-primary-800/70 dark:text-primary-200/70 text-base leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={primaryAction?.onClick}
            className="bg-primary-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-400/20 hover:bg-primary-500 transition-colors flex items-center gap-2"
          >
            {PrimaryIcon && <PrimaryIcon size={18} fill="currentColor" />} {primaryAction.label}
          </button>
          {secondaryAction && (
            <button
              onClick={secondaryAction?.onClick}
              className="bg-white dark:bg-dm-muted text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-dm-border px-8 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-dm-accent transition-colors flex items-center gap-2"
            >
              {SecondaryIcon && <SecondaryIcon size={18} />} {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
