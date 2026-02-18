/**
 * partnerTips.config.ts
 *
 * Daily partner tips, categorised for filtering.
 * The dashboard cycles through these or picks by week.
 */

// ── Types ────────────────────────────────────────────────────────────────

export type TipCategory = 'physical' | 'emotional' | 'nutrition' | 'appointments';

export interface PartnerTip {
  id: string;
  text: string;
  category: TipCategory;
}

// ── Data ─────────────────────────────────────────────────────────────────

export const PARTNER_TIPS: readonly PartnerTip[] = [
  {
    id: 'back-pain-massage',
    text: 'At 24 weeks, many mothers experience back pain. Offer a 10-minute foot or lower back massage tonight before bed. It goes a long way in mental wellness.',
    category: 'physical',
  },
  {
    id: 'iron-rich-foods',
    text: 'Iron levels drop in the second trimester. Help prepare spinach, lentils, or lean red meat for dinner this week.',
    category: 'nutrition',
  },
  {
    id: 'anomaly-scan-prep',
    text: 'The anomaly scan is around 20 weeks. Make sure you have the appointment confirmed and your calendar blocked.',
    category: 'appointments',
  },
  {
    id: 'listen-actively',
    text: 'Sometimes she just needs you to listen. Put away distractions and give her 15 minutes of undivided attention tonight.',
    category: 'emotional',
  },
  {
    id: 'hydration-reminder',
    text: 'Dehydration is common in pregnancy. Keep a water bottle filled and remind her to drink at least 8 glasses today.',
    category: 'physical',
  },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

/** Pick a deterministic tip based on the day-of-year. */
export const getTipOfTheDay = (tips: readonly PartnerTip[] = PARTNER_TIPS): PartnerTip => {
  if (tips.length === 0) {
    if (PARTNER_TIPS.length > 0) return PARTNER_TIPS[0];
    // Fallback object if everything is empty to avoid crashes
    return { id: 'fallback', text: 'No tips available.', category: 'emotional' };
  }
  
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return tips[dayOfYear % tips.length];
};

export const getTipsByCategory = (
  category: TipCategory,
  tips: readonly PartnerTip[] = PARTNER_TIPS,
): readonly PartnerTip[] => tips.filter((t) => t.category === category);
