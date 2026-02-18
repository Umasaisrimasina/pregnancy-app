/**
 * gestationalAge.ts
 *
 * Computes trimester, week, and day from an estimated due date (EDD).
 * Replaces all hardcoded "Trimester 2 / Week 24 / Day 3" across the app.
 */

export interface GestationalAge {
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
  subtitle: string;
  speakLabel: string;
}

/** Standard pregnancy duration: 280 days (40 weeks) from LMP. */
const TOTAL_PREGNANCY_DAYS = 280;
const MS_PER_DAY = 86_400_000;

/**
 * Compute gestational age from an estimated due date.
 * @param eddISO – ISO-8601 due date string (e.g. "2026-06-07")
 * @param now    – Reference date (defaults to today)
 */
export function computeGestationalAge(eddISO: string, now = new Date()): GestationalAge {
  // Parse eddISO as local midnight to avoid timezone issues
  const [year, month, day] = eddISO.split('-').map(Number);
  const localEdd = new Date(year, month - 1, day);
  
  // Validate the parsed date
  if (isNaN(localEdd.getTime())) {
    throw new Error(`Invalid eddISO: "${eddISO}" is not a valid date string.`);
  }
  
  // Normalize 'now' to local midnight
  const localNow = new Date(now);
  localNow.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.max(0, Math.ceil((localEdd.getTime() - localNow.getTime()) / MS_PER_DAY));
  const daysPregnant = Math.max(0, Math.min(TOTAL_PREGNANCY_DAYS, TOTAL_PREGNANCY_DAYS - daysRemaining));

  const weeks = Math.floor(daysPregnant / 7);
  const days = daysPregnant % 7;

  let trimester: 1 | 2 | 3;
  if (weeks < 13) trimester = 1;
  else if (weeks < 27) trimester = 2;
  else trimester = 3;

  return {
    weeks,
    days,
    trimester,
    trimesterLabel: `Trimester ${trimester}`,
    subtitle: `Week ${weeks} · Day ${days}`,
    speakLabel: `Trimester ${trimester}, Week ${weeks}, Day ${days}`,
  };
}

/**
 * Default demo EDD.
 * Yields ≈ Week 24 Day 3 when evaluated on 2026-02-18.
 */
export const DEMO_EDD = '2026-06-07';
