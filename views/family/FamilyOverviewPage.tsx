/**
 * FamilyOverviewPage.tsx
 *
 * Family-role overview page — replaces the monolithic FamilyDashboard.
 * Composed of: PartnerHeaderSection (reused) + extracted family components.
 * Data from familyOverview.config.ts + some inline text components (header, promo).
 */

import React from 'react';
import { PartnerHeaderSection } from '../../components/partner/PartnerHeaderSection';
import { MilestoneAlertCard } from '../../components/family/MilestoneAlertCard';
import { SupportPromptList } from '../../components/family/SupportPromptList';
import { EventListCard } from '../../components/family/EventListCard';
import { PhotoGalleryCard } from '../../components/family/PhotoGalleryCard';
import { PromoBannerCard } from '../../components/family/PromoBannerCard';
import { DoctorConsultCTA } from '../../components/dashboard/DoctorConsultCTA';
import {
  MILESTONE_DATA,
  FAMILY_SUPPORT_PROMPTS,
  FAMILY_EVENTS,
  FAMILY_PHOTOS,
} from '../../config/familyOverview.config';

export const FamilyOverviewPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PartnerHeaderSection
        badge="MODE: FAMILY PERSPECTIVE"
        title="Your Pregnancy Journey"
        subtitle="Stay updated on Maya's journey and find ways to support."
        speakText="Family Perspective. Your Pregnancy Journey. Welcome, Family! Stay updated on Maya's journey and find ways to support."
      />

      <MilestoneAlertCard
        title={MILESTONE_DATA.title}
        description={MILESTONE_DATA.description}
        speakText={MILESTONE_DATA.speakText}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportPromptList prompts={FAMILY_SUPPORT_PROMPTS} />

        <EventListCard events={FAMILY_EVENTS} />

        <DoctorConsultCTA
          variant="card"
          description="Connect with Maya's doctor for updates or questions about her pregnancy."
          buttonLabel="Schedule Call"
        />
      </div>

      <PhotoGalleryCard photos={FAMILY_PHOTOS} />

      <PromoBannerCard
        title="Send a Care Package?"
        description="We've curated healthy snacks & wellness kits Maya will love."
      />
    </div>
  );
};
