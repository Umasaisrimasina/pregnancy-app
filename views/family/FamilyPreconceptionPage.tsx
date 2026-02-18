/**
 * FamilyPreconceptionPage.tsx
 *
 * Family-role pre-conception education page.
 * Composed of: PartnerHeaderSection (reused) + InfoBannerCard + ComparisonCard
 *            + BenefitCards + shared PreConceptionGuide.
 *
 * Config-driven — reuses partnerEducation.config data (science is the same for family).
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SpeakButton } from '../../components/SpeakButton';
import { PartnerHeaderSection } from '../../components/partner/PartnerHeaderSection';
import { InfoBannerCard } from '../../components/partner/InfoBannerCard';
import { ComparisonCard } from '../../components/partner/ComparisonCard';
import { BenefitCard } from '../../components/partner/BenefitCard';
import { PreConceptionGuide } from '../../components/PreConceptionGuide';
import {
  CARE_COMPARISON,
  KEY_BENEFITS,
  getBenefitsSpeakText,
} from '../../config/partnerEducation.config';

export const FamilyPreconceptionPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PartnerHeaderSection
        badge="MODE: FAMILY PERSPECTIVE"
        title="Pre-Conception Guide"
        subtitle="Learn how the family can support a healthy pregnancy from the start."
        speakText="Family Perspective. Pre-Conception Guide. Learn how the family can support a healthy pregnancy from the start."
      />

      {/* Science Banner */}
      <InfoBannerCard
        icon={ShieldCheck}
        label="The Science"
        text="An egg takes about 90 days to mature before it's released. The health of your partner's body during this 3-6 month window directly impacts the genetic material passed on."
        bgClass="bg-primary-50/50"
        borderClass="border border-primary-100"
        accentColor="text-primary-700"
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

      {/* Shared Do's & Don'ts Guide */}
      <PreConceptionGuide />
    </div>
  );
};
