/**
 * PreConceptionGuidePage.tsx
 *
 * Partner-specific pre-conception education page.
 * Composed of: PartnerHeaderSection + InfoBannerCard + ComparisonCard
 *            + BenefitCards + shared PreConceptionGuide.
 *
 * Config-driven — data from partnerEducation.config.ts.
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { InfoBannerCard } from '../components/partner/InfoBannerCard';
import { ComparisonCard } from '../components/partner/ComparisonCard';
import { BenefitCard } from '../components/partner/BenefitCard';
import { PreConceptionGuide } from '../components/PreConceptionGuide';
import {
  CARE_COMPARISON,
  KEY_BENEFITS,
  getBenefitsSpeakText,
} from '../config/partnerEducation.config';

export const PreConceptionGuidePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PartnerHeaderSection
        badge="MODE: PARTNER PERSPECTIVE"
        title="Pre-Conception Guide"
        subtitle="Help prepare for a healthy pregnancy together."
        speakText="Partner Perspective. Pre-Conception Guide. Help prepare for a healthy pregnancy together."
      />

      {/* Science Banner (InfoBannerCard) */}
      <InfoBannerCard
        icon={ShieldCheck}
        label="The Science"
        text="An egg takes about 90 days to mature before it's released. The health of your partner's body during this 3-6 month window directly impacts the genetic material passed on."
        bgClass="bg-primary-50/50 dark:bg-primary-900/20"
        borderClass="border border-primary-100 dark:border-primary-800"
        accentColor="text-primary-700 dark:text-primary-300"
        textColor="text-primary-900 dark:text-primary-200"
      />

      {/* Comparison Grid (config-driven) */}
      <ComparisonCard columns={CARE_COMPARISON} />

      {/* Key Benefits (config-driven) */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Key Benefits</h2>
          <SpeakButton text={getBenefitsSpeakText()} size="sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {KEY_BENEFITS.map((b, i) => (
            <BenefitCard
              key={i}
              icon={b.icon}
              title={b.title}
              description={b.description}
              color={b.color}
              bg={b.bg}
            />
          ))}
        </div>
      </div>

      {/* Do's & Don'ts Guide (existing shared component) */}
      <PreConceptionGuide />
    </div>
  );
};
