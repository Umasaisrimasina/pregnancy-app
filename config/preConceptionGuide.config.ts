/**
 * preConceptionGuide.config.ts
 *
 * Single source of truth for Pre-Conception Guide content.
 * Data-driven Do's & Don'ts — add/remove/reorder items here,
 * the UI re-renders automatically.
 */

import {
  Pill,
  Stethoscope,
  Apple,
  Moon,
  Cigarette,
  Coffee,
  AlertTriangle,
  Fish,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────

export interface GuideItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GuideConfig {
  dos: GuideItem[];
  donts: GuideItem[];
  footerTip: string;
}

// ── Config ───────────────────────────────────────────────────────────────

export const PRE_CONCEPTION_GUIDE: GuideConfig = {
  dos: [
    {
      icon: Pill,
      title: 'Start Folic Acid',
      description: 'Take 400mcg daily to prevent neural tube defects.',
    },
    {
      icon: Stethoscope,
      title: 'Pre-conception Checkup',
      description: 'Screen for underlying conditions and update vaccines.',
    },
    {
      icon: Apple,
      title: 'Balanced Nutrition',
      description: 'Focus on leafy greens, lean protein, and whole grains.',
    },
    {
      icon: Moon,
      title: 'Regular Sleep',
      description: 'Regulate hormones with 7-9 hours of consistent rest.',
    },
  ],
  donts: [
    {
      icon: Cigarette,
      title: 'Alcohol & Smoking',
      description: 'Both significantly reduce fertility and harm early development.',
    },
    {
      icon: Coffee,
      title: 'Excessive Caffeine',
      description: 'Limit intake to under 200mg (about 1-2 cups of coffee) per day.',
    },
    {
      icon: AlertTriangle,
      title: 'Self-Medication',
      description: 'Avoid over-the-counter drugs without consulting your OB-GYN.',
    },
    {
      icon: Fish,
      title: 'High-Mercury Fish',
      description: 'Avoid shark, swordfish, and king mackerel during this phase.',
    },
  ],
  footerTip:
    'Healthy habits established now can positively impact your baby\'s health for a lifetime. Start today!',
};

// ── Helpers ──────────────────────────────────────────────────────────────

/** Build a TTS-friendly summary of all guide items. */
export const buildGuideSpeakText = (config: GuideConfig = PRE_CONCEPTION_GUIDE): string => {
  const dosText = config.dos.map((d) => `${d.title}: ${d.description}`).join('. ');
  const dontsText = config.donts.map((d) => `${d.title}: ${d.description}`).join('. ');
  return `Pre-Conception Guide: Essential Do's include ${dosText}. Crucial Don'ts include ${dontsText}.`;
};
