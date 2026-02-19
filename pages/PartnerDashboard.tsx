/**
 * PartnerDashboard.tsx
 *
 * Partner-role overview dashboard.
 * Composed of presentational components + config-driven data.
 * No inline business logic — all UI blocks are extracted.
 */

import React from 'react';
import { ChefHat, ShoppingCart, MessageCircle, Heart } from 'lucide-react';
import { DoctorConsultCTA } from '../components/dashboard/DoctorConsultCTA';

// ── Partner components ───────────────────────────────────────────────────
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { SupportChecklist } from '../components/partner/SupportChecklist';
import { GoalHighlightCard } from '../components/partner/GoalHighlightCard';
import { InsightCard } from '../components/partner/InsightCard';
import { InfoBannerCard } from '../components/partner/InfoBannerCard';
import { PartnerAppointmentsCard } from '../components/partner/PartnerAppointmentsCard';
import { LearningModuleCard } from '../components/partner/LearningModuleCard';

// ── Config-driven data ───────────────────────────────────────────────────
import { PARTNER_CHECKLIST } from '../config/partnerChecklist.config';
import { getTipOfTheDay } from '../config/partnerTips.config';

export const PartnerDashboard: React.FC = () => {
  const tip = getTipOfTheDay();

  const handlePlayVideo = () => {
    alert('Video player coming soon! This will play educational content about third trimester preparation.');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header (presentational) */}
      <PartnerHeaderSection
        badge="MODE: PARTNER PERSPECTIVE"
        title="Your Pregnancy Journey"
        speakText="Partner Perspective. Your Pregnancy Journey. Support your partner through this beautiful journey."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="xl:col-span-8 space-y-6">
          <SupportChecklist tasks={PARTNER_CHECKLIST} />

          <GoalHighlightCard
            title="Tonight&apos;s Goal: Iron-Rich Dinner"
            description="Maya&apos;s latest blood test showed iron levels are slightly on the lower side. Doctors suggest adding more spinach or lentils to her diet."
            primaryAction={{ label: 'View Recipes', icon: ChefHat }}
            secondaryAction={{ label: 'Order Groceries' }}
            bgIcon={ChefHat}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard
              icon={ShoppingCart}
              title="Shopping List"
              description="Dates, Spinach, Walnut, Milk"
              iconBg="bg-primary-50 dark:bg-primary-900/20"
              iconColor="text-primary-600 dark:text-primary-400"
            />
            <InsightCard
              icon={MessageCircle}
              title="Support Chat"
              description="Ask nutritionists or mentors"
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              iconColor="text-purple-600 dark:text-purple-400"
            />
            <DoctorConsultCTA variant="compact" subtitle="Instant video consultation" />
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-6">
          <InfoBannerCard
            icon={Heart}
            label="Partner Tip of the Day"
            text={tip.text}
          />
          <PartnerAppointmentsCard partnerName="Maya" />
          <LearningModuleCard onPlay={handlePlayVideo} />
        </div>
      </div>
    </div>
  );
};
