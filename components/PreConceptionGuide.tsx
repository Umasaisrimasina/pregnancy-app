/**
 * PreConceptionGuide.tsx
 *
 * Config-driven Do's & Don'ts guide component.
 * Reads from preConceptionGuide.config.ts — zero hardcoded content.
 * Accepts optional config override via props for reuse / testing.
 */

import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { SpeakButton } from './SpeakButton';
import {
  PRE_CONCEPTION_GUIDE,
  buildGuideSpeakText,
  type GuideConfig,
  type GuideItem,
} from '../config/preConceptionGuide.config';

// ── Props ────────────────────────────────────────────────────────────────

interface PreConceptionGuideProps {
  /** Override the default config (useful for testing or phase variants). */
  config?: GuideConfig;
}

// ── Sub-component: single guide item card ────────────────────────────────

const GuideItemCard: React.FC<{ item: GuideItem; colorVariant: 'do' | 'dont' }> = ({
  item,
  colorVariant,
}) => {
  const Icon = item.icon;
  const iconColor =
    colorVariant === 'do'
      ? 'bg-primary-100 text-primary-600'
      : 'bg-primary-100 text-primary-500';

  return (
    <div className="bg-slate-50 dark:bg-dm-muted rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center shrink-0`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">{item.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────

export const PreConceptionGuide: React.FC<PreConceptionGuideProps> = ({
  config = PRE_CONCEPTION_GUIDE,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Pre-Conception Guide</h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Foundational Health &amp; Preparation</p>
        </div>
        <SpeakButton text={buildGuideSpeakText(config)} size="sm" />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* DO'S */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} />
            Essential Do&apos;s
          </div>
          <div className="space-y-4">
            {config.dos.map((item) => (
              <GuideItemCard key={item.title} item={item} colorVariant="do" />
            ))}
          </div>
        </div>

        {/* DON'TS */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 text-primary-600 dark:text-primary-300 text-xs font-bold uppercase tracking-wider">
            <XCircle size={14} />
            Crucial Don&apos;ts
          </div>
          <div className="space-y-4">
            {config.donts.map((item) => (
              <GuideItemCard key={item.title} item={item} colorVariant="dont" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="bg-secondary-50/50 dark:bg-secondary-900/10 border border-secondary-100 dark:border-secondary-900/30 rounded-2xl p-4 flex items-center gap-4 text-secondary-900 dark:text-secondary-200">
        <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/40 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 shrink-0">
          <Sparkles size={16} />
        </div>
        <p className="text-xs sm:text-sm font-medium">{config.footerTip}</p>
      </div>
    </div>
  );
};




