/**
 * SafetyAlertBanner.tsx
 *
 * Shared safety-alert banner shown when consecutive negative
 * sentiment check-ins are detected.  Replaces ~45 duplicated lines
 * in PostPartumDashboard and PostPartumMind.
 *
 * Props control: title wording, resource count, CTA labels, and
 * whether outline-style or shadow-style card is used.
 */

import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';
import { MENTAL_HEALTH_RESOURCES } from '../services/sentimentService';

// ── Types ────────────────────────────────────────────────────────────────

interface SafetyAlertBannerProps {
  streakCount: number;
  /** How many resources to show (default 4). */
  maxResources?: number;
  /** Primary CTA label (default "Talk to Someone Now"). */
  ctaLabel?: string;
  /** Secondary CTA label. Omit to hide. */
  secondaryCtaLabel?: string;
  /** Visual variant. */
  variant?: 'dashboard' | 'compact';
  /** Click handler for primary CTA. Callers should supply meaningful actions (e.g., open crisis hotline, navigate to resources). */
  onPrimaryClick?: () => void;
  /** Click handler for secondary CTA. Callers should supply meaningful actions (e.g., navigate to help page). */
  onSecondaryClick?: () => void;
}

// ── Component ────────────────────────────────────────────────────────────

export const SafetyAlertBanner: React.FC<SafetyAlertBannerProps> = ({
  streakCount,
  maxResources = 4,
  ctaLabel = 'Talk to Someone Now',
  secondaryCtaLabel,
  variant = 'dashboard',
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const resources = MENTAL_HEALTH_RESOURCES.slice(0, maxResources);

  // Normalize website URL by adding https:// if no scheme is present
  const normalizeUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div
      className={`bg-gradient-to-br from-red-50 to-primary-50 rounded-[2rem] p-8 border-2 border-red-200 relative overflow-hidden ${
        variant === 'dashboard'
          ? 'shadow-lg animate-in fade-in slide-in-from-top-4 duration-500'
          : 'shadow-sm'
      }`}
    >
      {variant === 'compact' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none opacity-50" />
      )}

      <div className={variant === 'compact' ? 'relative z-10' : ''}>
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 ${
              variant === 'dashboard' ? 'w-14 h-14' : 'w-12 h-12'
            }`}
          >
            <AlertTriangle size={variant === 'dashboard' ? 28 : 24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3
              className={`font-bold font-display text-red-900 mb-1 ${
                variant === 'dashboard' ? 'text-xl mb-2' : 'text-lg'
              }`}
            >
              {variant === 'dashboard' ? 'Mental Wellness Alert' : "We're Here for You"}
            </h3>
            <p className="text-sm text-red-700 mb-4">
              We've noticed {streakCount} consecutive days of negative sentiment
              {variant === 'dashboard' ? ' in your daily check-ins. Your emotional wellbeing matters, and support is available.' : ". You don't have to go through this alone."}
            </p>

            <div className="bg-white dark:bg-dm-card rounded-xl p-5 mb-4">
              <p className="text-xs font-medium text-slate-600 mb-4">
                <strong className={variant === 'dashboard' ? 'text-red-900' : ''}>
                  {variant === 'dashboard' ? 'Important:' : 'This is not a medical diagnosis.'}
                </strong>
                {variant === 'dashboard'
                  ? ' This is not a medical diagnosis. If you\'re experiencing persistent feelings of sadness, anxiety, or thoughts of self-harm, please reach out to a mental health professional immediately.'
                  : ' If you\'re experiencing persistent sadness, anxiety, or thoughts of self-harm, please reach out to a mental health professional.'}
              </p>

              <div className={variant === 'dashboard' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
                {resources.map((resource) => (
                  <div
                    key={resource.name}
                    className={`flex items-start gap-3 p-3 bg-red-50 rounded-lg ${
                      variant === 'dashboard' ? 'border border-red-100' : ''
                    }`}
                  >
                    <Heart size={variant === 'dashboard' ? 16 : 18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`font-bold text-red-900 ${variant === 'dashboard' ? 'text-xs' : 'text-sm'}`}>
                        {resource.name}
                      </p>
                      <p className="text-xs text-red-600 mb-1">{resource.description}</p>
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone}`}
                          className={`text-xs font-medium text-red-700 ${variant === 'dashboard' ? 'hover:text-red-900' : ''} underline block`}
                        >
                          {variant === 'dashboard' ? '☎ ' : ''}{resource.phone}
                        </a>
                      )}
                      {variant === 'dashboard' && resource.website && (
                        <a
                          href={normalizeUrl(resource.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-red-700 hover:text-red-900 underline block"
                        >
                          🌐 {resource.website}
                        </a>
                      )}
                      <p className="text-xs text-red-500 mt-1">
                        {variant === 'dashboard' ? '🕐 ' : ''}{resource.available}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onPrimaryClick}
                className={`${
                  variant === 'dashboard' ? 'flex-1' : 'w-full'
                } bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg ${
                  variant === 'compact' ? 'shadow-red-600/20' : ''
                } hover:bg-red-700 transition-colors`}
              >
                {ctaLabel}
              </button>
              {variant === 'dashboard' && secondaryCtaLabel && (
                <button 
                  type="button"
                  onClick={onSecondaryClick}
                  className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-red-200 text-red-900 hover:bg-red-50 transition-colors"
                >
                  {secondaryCtaLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
