/**
 * babyMyths.config.ts
 *
 * Myth-vs-fact data for BabyCareEducation.
 * Sourced from WHO Essential Newborn Care and WHO-UNICEF IYCF guidelines.
 */

export interface MythFact {
  mythKey: string;
  factKey: string;
}

export const BABY_MYTHS: readonly MythFact[] = [
  {
    mythKey: 'baby_myths.myth1.myth',
    factKey: 'baby_myths.myth1.fact',
  },
  {
    mythKey: 'baby_myths.myth2.myth',
    factKey: 'baby_myths.myth2.fact',
  },
  {
    mythKey: 'baby_myths.myth3.myth',
    factKey: 'baby_myths.myth3.fact',
  },
  {
    mythKey: 'baby_myths.myth4.myth',
    factKey: 'baby_myths.myth4.fact',
  },
  {
    mythKey: 'baby_myths.myth5.myth',
    factKey: 'baby_myths.myth5.fact',
  },
  {
    mythKey: 'baby_myths.myth6.myth',
    factKey: 'baby_myths.myth6.fact',
  },
] as const;
