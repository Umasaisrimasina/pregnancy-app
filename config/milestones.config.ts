/**
 * milestones.config.ts
 *
 * Data-driven baby milestone definitions.
 * Consumed by BabyCareDashboard (upcoming list) and potentially future milestone pages.
 *
 * Each milestone is tagged by ageMonths so consumers can filter by baby age.
 */

// ── Types ────────────────────────────────────────────────────────────────

export interface MilestoneEntry {
  /** Unique key */
  id: string;
  /** Display title */
  title: string;
  /** Human-readable expected timing */
  expectedTiming: string;
  /** Approximate month the milestone is expected */
  ageMonths: number;
  /** Category for grouping / filtering */
  category: 'social' | 'motor' | 'cognitive' | 'language';
  /** Default achieved state (demo data; override via persistence) */
  defaultAchieved: boolean;
}

// ── Data ─────────────────────────────────────────────────────────────────

export const MILESTONES: readonly MilestoneEntry[] = [
  // 0-3 months
  { id: 'social-smile',     title: 'Social Smile',          expectedTiming: 'Week 6-8',   ageMonths: 2, category: 'social',    defaultAchieved: true },
  { id: 'lift-head',        title: 'Lifting Head',          expectedTiming: 'Month 3',    ageMonths: 3, category: 'motor',     defaultAchieved: false },
  { id: 'track-objects',    title: 'Tracking Objects',      expectedTiming: 'Month 3',    ageMonths: 3, category: 'cognitive', defaultAchieved: false },
  { id: 'coos-babbles',     title: 'Cooing & Babbling',     expectedTiming: 'Month 2-3',  ageMonths: 2, category: 'language',  defaultAchieved: false },

  // 4-6 months
  { id: 'roll-over',        title: 'Rolling Over',          expectedTiming: 'Month 4-5',  ageMonths: 5, category: 'motor',     defaultAchieved: false },
  { id: 'reach-grasp',      title: 'Reaching & Grasping',   expectedTiming: 'Month 4-5',  ageMonths: 5, category: 'motor',     defaultAchieved: false },
  { id: 'recognise-faces',  title: 'Recognising Faces',     expectedTiming: 'Month 5-6',  ageMonths: 6, category: 'social',    defaultAchieved: false },
  { id: 'sit-support',      title: 'Sitting with Support',  expectedTiming: 'Month 6',    ageMonths: 6, category: 'motor',     defaultAchieved: false },

  // 7-9 months
  { id: 'sit-independent',  title: 'Sitting Independently', expectedTiming: 'Month 7-8',  ageMonths: 8, category: 'motor',     defaultAchieved: false },
  { id: 'stranger-anxiety', title: 'Stranger Anxiety',      expectedTiming: 'Month 7-9',  ageMonths: 8, category: 'social',    defaultAchieved: false },
  { id: 'crawling',         title: 'Crawling',              expectedTiming: 'Month 8-9',  ageMonths: 9, category: 'motor',     defaultAchieved: false },

  // 10-12 months
  { id: 'pull-to-stand',    title: 'Pulling to Stand',      expectedTiming: 'Month 9-10', ageMonths: 10, category: 'motor',    defaultAchieved: false },
  { id: 'first-words',      title: 'First Words',           expectedTiming: 'Month 11-12',ageMonths: 12, category: 'language', defaultAchieved: false },
  { id: 'first-steps',      title: 'First Steps',           expectedTiming: 'Month 12',   ageMonths: 12, category: 'motor',    defaultAchieved: false },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Return milestones up to `maxMonth` (inclusive).
 * Useful for dashboard previews — e.g. `getMilestonesByAge(3)` for 0-3 months.
 */
export const getMilestonesByAge = (maxMonth: number): MilestoneEntry[] =>
  MILESTONES.filter(m => m.ageMonths <= maxMonth);

/**
 * Return only the next N un-achieved milestones for a dashboard preview.
 */
export const getUpcomingMilestones = (count = 3): MilestoneEntry[] => {
  const upcoming: MilestoneEntry[] = [];
  for (const m of MILESTONES) {
    if (upcoming.length >= count) break;
    // Skip achieved milestones
    if (!m.defaultAchieved) {
      upcoming.push(m);
    }
  }
  return upcoming;
};
