/**
 * PartnerCommunityPage.tsx
 *
 * Partner-specific community view.
 * Thin wrapper: PartnerHeaderSection + shared Community component.
 * Does NOT duplicate existing Community logic.
 */

import React from 'react';
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { Community } from './Community';
import type { AppPhase } from '../types';

interface PartnerCommunityPageProps {
  phase: AppPhase;
}

export const PartnerCommunityPage: React.FC<PartnerCommunityPageProps> = ({ phase }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PartnerHeaderSection
        badge="MODE: PARTNER PERSPECTIVE"
        title="Mom Community"
        subtitle="Connect with other partners and families on this journey."
        speakText="Partner Perspective. Mom Community. Connect with other partners and families on this journey."
      />

      <Community phase={phase} />
    </div>
  );
};
