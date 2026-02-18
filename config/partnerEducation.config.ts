/**
 * partnerEducation.config.ts
 *
 * Config data for the partner's pre-conception education page.
 * Contains comparison grid data and key benefits data.
 * Extracted from hardcoded JSX in PreConceptionEducation.tsx.
 */

import { Clock, ShieldCheck, Brain, Baby, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Comparison ───────────────────────────────────────────────────────────

export interface ComparisonItem {
  text: string;
}

export interface ComparisonColumn {
  title: string;
  icon: LucideIcon;
  items: readonly ComparisonItem[];
  variant: 'muted' | 'recommended';
}

export const CARE_COMPARISON: readonly ComparisonColumn[] = [
  {
    title: 'Standard Care',
    icon: Clock,
    variant: 'muted',
    items: [
      { text: 'Care often starts only after a positive test (Week 4-6).' },
      { text: 'Nutrient deficiencies are treated reactively.' },
    ],
  },
  {
    title: 'Preventive Care',
    icon: ShieldCheck,
    variant: 'recommended',
    items: [
      { text: 'Care begins 3-6 months pre-conception.' },
      { text: "Optimized stores for baby's critical development." },
    ],
  },
] as const;

// ── Benefits ─────────────────────────────────────────────────────────────

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export const KEY_BENEFITS: readonly BenefitItem[] = [
  {
    icon: Brain,
    title: "Baby's Brain",
    description: 'Neural tube forms in first 4 weeks.',
    color: 'text-primary-500',
    bg: 'bg-primary-50',
  },
  {
    icon: Baby,
    title: 'Recovery',
    description: 'Stronger iron stores mean faster postpartum recovery.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    icon: Shield,
    title: 'Risk Reduction',
    description: 'Lowers risk of gestational diabetes.',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
] as const;

// ── Speak Helpers ────────────────────────────────────────────────────────

export const getBenefitsSpeakText = (): string =>
  'Key Benefits of pre-conception planning: ' +
  KEY_BENEFITS.map((b) => `${b.title} — ${b.description.replace(/\.$/, '')}`).join('. ') + '.';
