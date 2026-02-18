/**
 * PartnerDashboard.tsx
 *
 * Partner-role overview dashboard.
 * Composed of presentational components + config-driven data.
 * No inline business logic — all UI blocks are extracted.
 */

import React from 'react';
import { ChefHat, ShoppingCart, MessageCircle, Play, Heart } from 'lucide-react';
import { DoctorConsultCTA } from '../components/dashboard/DoctorConsultCTA';

// ── Partner components ───────────────────────────────────────────────────
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { SupportChecklist } from '../components/partner/SupportChecklist';
import { GoalHighlightCard } from '../components/partner/GoalHighlightCard';
import { InsightCard } from '../components/partner/InsightCard';
import { InfoBannerCard } from '../components/partner/InfoBannerCard';

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
          {/* Checklist (config-driven) */}
          <SupportChecklist tasks={PARTNER_CHECKLIST} />

          {/* Goal Card (presentational) */}
          <GoalHighlightCard
            title="Tonight&apos;s Goal: Iron-Rich Dinner"
            description="Maya&apos;s latest blood test showed iron levels are slightly on the lower side. Doctors suggest adding more spinach or lentils to her diet."
            primaryAction={{ label: 'View Recipes', icon: ChefHat }}
            secondaryAction={{ label: 'Order Groceries' }}
            bgIcon={ChefHat}
          />

          {/* Bottom Grid — InsightCards + DoctorConsultCTA */}
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
          {/* Tip of the Day (config-driven) */}
          <InfoBannerCard
            icon={Heart}
            label="Partner Tip of the Day"
            text={tip.text}
          />

          {/* Appointments */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">Maya&apos;s Appointments</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Ensure you&apos;ve blocked your calendar for these:</p>

            <div className="bg-slate-50 dark:bg-dm-muted p-4 rounded-2xl border-l-4 border-blue-500">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block mb-1">In 4 Days</span>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground">Anomaly Scan</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">City Hospital · 11:30 AM</p>
            </div>
          </div>

          {/* Learning Module */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">Learning Module</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">How to prepare for the third trimester transition.</p>

            <button
              type="button"
              onClick={handlePlayVideo}
              aria-label="Play video: How to prepare for the third trimester transition"
              className="aspect-video bg-slate-100 dark:bg-dm-muted rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dm-card transition-all"
            >
              <div className="w-12 h-12 bg-white dark:bg-dm-accent rounded-full flex items-center justify-center shadow-lg text-blue-600 dark:text-blue-400 z-10 group-hover:scale-110 transition-transform">
                <Play size={20} className="ml-1" fill="currentColor" />
              </div>
              <div className="absolute inset-0 bg-slate-200/50 dark:bg-dm-card/50"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
