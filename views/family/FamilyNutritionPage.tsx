/**
 * FamilyNutritionPage.tsx
 *
 * Family-role nutrition view.
 * Thin wrapper: PartnerHeaderSection (reused with family badge) + shared Nutrition component.
 * Does NOT duplicate existing Nutrition logic.
 */

import React from 'react';
import { PartnerHeaderSection } from '../../components/partner/PartnerHeaderSection';
import { Nutrition } from '../../pages/Nutrition';
import type { AppPhase } from '../../types';

interface FamilyNutritionPageProps {
  phase: AppPhase;
}

export const FamilyNutritionPage: React.FC<FamilyNutritionPageProps> = ({ phase }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PartnerHeaderSection
        badge="MODE: FAMILY PERSPECTIVE"
        title="Nutrition & Diet"
        subtitle="View and support Maya's nutritional journey."
        speakText="Family Perspective. Nutrition and Diet. View and support Maya's nutritional journey."
      />

      <Nutrition phase={phase} />
    </div>
  );
};
