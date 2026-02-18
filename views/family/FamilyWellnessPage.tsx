/**
 * FamilyWellnessPage.tsx
 *
 * Family-role "Mind" / wellness page.
 * Composed of: PartnerHeaderSection (reused) + FeelingTracker (readonly)
 *            + SentimentTrendsCard (reused) + InfoBannerCard (reused).
 *
 * Read-only mode: family members can observe mood state but cannot modify it.
 */

import React from 'react';
import { Heart } from 'lucide-react';
import { PartnerHeaderSection } from '../../components/partner/PartnerHeaderSection';
import { FeelingTracker } from '../../components/dashboard/FeelingTracker';
import { SentimentTrendsCard } from '../../components/partner/SentimentTrendsCard';
import { InfoBannerCard } from '../../components/partner/InfoBannerCard';

export const FamilyWellnessPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PartnerHeaderSection
        badge="MODE: FAMILY PERSPECTIVE"
        title="Wellness & Mood"
        subtitle="Stay connected to Maya's emotional well-being."
        speakText="Family Perspective. Wellness and Mood. Stay connected to Maya's emotional well-being."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Read-only mood tracker */}
        <div className="lg:col-span-7 space-y-6">
          <FeelingTracker colorScheme="primary" readonly />
        </div>

        {/* Right: Trends + Family tip */}
        <div className="lg:col-span-5 space-y-6">
          <SentimentTrendsCard
            data={[]}
            chartColor="#10b981"
            emptyMessage="Mood data will appear here once check-ins are completed."
          />

          <InfoBannerCard
            icon={Heart}
            label="Family Wellness Tip"
            text="Small gestures like preparing a warm drink or offering a foot massage can significantly boost mood during pregnancy."
          />
        </div>
      </div>
    </div>
  );
};
