/**
 * PartnerNutritionPage.tsx
 *
 * Partner-specific nutrition view.
 * Thin wrapper: PartnerHeaderSection + shared Nutrition component.
 * Does NOT duplicate existing Nutrition logic.
 */

import React from 'react';
import { PartnerHeaderSection } from '../components/partner/PartnerHeaderSection';
import { Nutrition } from './Nutrition';
import type { AppPhase } from '../types';

interface PartnerNutritionPageProps {
  phase: AppPhase;
}

export const PartnerNutritionPage: React.FC<PartnerNutritionPageProps> = ({ phase }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PartnerHeaderSection
        badge="MODE: PARTNER PERSPECTIVE"
        title="Nutrition & Diet"
        subtitle="Track and support your partner's nutritional needs."
        speakText="Partner Perspective. Nutrition and Diet. Track and support your partner's nutritional needs."
      />

      <Nutrition phase={phase} />
    </div>
  );
};
