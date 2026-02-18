/**
 * FamilyCommunityPage.tsx
 *
 * Family-role community view.
 * Thin wrapper: PartnerHeaderSection (reused with family badge) + shared Community component.
 * Does NOT duplicate existing Community logic.
 */

import React from 'react';
import { PartnerHeaderSection } from '../../components/partner/PartnerHeaderSection';
import { Community } from '../../pages/Community';
import type { AppPhase } from '../../types';

interface FamilyCommunityPageProps {
  phase: AppPhase;
}

export const FamilyCommunityPage: React.FC<FamilyCommunityPageProps> = ({ phase }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PartnerHeaderSection
        badge="MODE: FAMILY PERSPECTIVE"
        title="Mom Community"
        subtitle="Connect with other families and share experiences."
        speakText="Family Perspective. Mom Community. Connect with other families and share experiences."
      />

      <Community phase={phase} />
    </div>
  );
};
