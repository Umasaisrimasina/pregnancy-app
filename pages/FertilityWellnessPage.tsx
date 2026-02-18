/**
 * FertilityWellnessPage.tsx
 *
 * Partner-specific "Mind" / wellness page.
 * Composed of: PartnerHeaderSection + FeelingTracker + SentimentTrendsCard.
 *
 * Presentational composition — no embedded business logic.
 */

import React from 'react';
import { Heart } from 'lucide-react';
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { FeelingTracker } from '../components/dashboard/FeelingTracker';
import { SentimentTrendsCard } from '../components/partner/SentimentTrendsCard';
import { InfoBannerCard } from '../components/partner/InfoBannerCard';
import { getTipOfTheDay } from '../config/partnerTips.config';

export const FertilityWellnessPage: React.FC = () => {
  const tip = getTipOfTheDay();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PartnerHeaderSection
        badge="MODE: PARTNER PERSPECTIVE"
        title="Fertility & Wellness"
        subtitle="Support your partner's emotional and physical well-being."
        speakText="Partner Perspective. Fertility and Wellness. Support your partner's emotional and physical well-being."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Daily Check-in */}
        <div className="lg:col-span-7 space-y-6">
          <FeelingTracker colorScheme="primary" />
        </div>

        {/* Right: Trends + Tip */}
        <div className="lg:col-span-5 space-y-6">
          <SentimentTrendsCard
            data={[]}
            chartColor="#10b981"
            emptyMessage="Complete daily check-ins to see sentiment trends here."
          />

          <InfoBannerCard
            icon={Heart}
            label="Wellness Tip"
            text={tip.text}
          />
        </div>
      </div>
    </div>
  );
};
