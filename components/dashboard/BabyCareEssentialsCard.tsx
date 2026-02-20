/**
 * BabyCareEssentialsCard.tsx
 *
 * Science-backed postnatal guidance card extracted from BabyCareDashboard.
 * Presentational only — no state, no business logic.
 */

import React from 'react';
import { Baby, Utensils, FlaskConical } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';
import { CardShell } from '../ui/CardShell';

export const BabyCareEssentialsCard: React.FC = () => (
  <CardShell>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center">
        <Baby size={24} />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Baby Care Essentials</h2>
        <p className="text-slate-400 dark:text-slate-500">Science-backed postnatal guidance</p>
      </div>
      <SpeakButton text="Baby Care Essentials. Science-backed postnatal guidance including nutrition, hygiene, breastfeeding tips, formula safety, and product comparisons for diapers and skincare." />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Nutrition & Hygiene */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-primary-400">
          <Utensils size={20} />
          <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Nutrition &amp; Hygiene</h3>
        </div>
        <ul className="space-y-4">
          <li className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-dm-foreground">Breastfeeding Hygiene:</span> Cleanliness of latch and pump parts is critical. Indian milk reports suggest checking local sources for contaminants.
          </li>
          <li className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-dm-foreground">Formula Safety:</span> USA/EU standards (FDA/EFSA) are currently stricter than FSSAI. Choose certified organic imports if local purity is in doubt.
          </li>
        </ul>
      </div>

      {/* Product Comparisons */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <FlaskConical size={20} />
          <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Product Comparisons</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 block">Diaper Quality</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Indian market diapers are catching up, but Western regulations (TBT/SPS) often ensure lower chemical toxicity in materials.
            </p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 block">Skincare Alert</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Avoid talc-based powders; use pH-neutral, paraben-free lotions. India has loose ends in FSSAI cosmetic monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  </CardShell>
);
