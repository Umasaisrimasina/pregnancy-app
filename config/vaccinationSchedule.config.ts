/**
 * vaccinationSchedule.config.ts
 *
 * Single source of truth for the Indian infant vaccination schedule.
 * Consumed by both BabyCareDashboard (summary) and BabyCareEducation (full list).
 *
 * Data follows WHO / IAP (Indian Academy of Pediatrics) guidelines.
 */

// ── Types ────────────────────────────────────────────────────────────────

export type VaccinationStatus = 'completed' | 'upcoming' | 'pending';

export interface VaccinationEntry {
  /** Comma-separated vaccine names */
  vaccine: string;
  /** Human-readable timing label */
  timing: string;
  /** Current completion state */
  status: VaccinationStatus;
}

// ── Data ─────────────────────────────────────────────────────────────────

export const VACCINATION_SCHEDULE: readonly VaccinationEntry[] = [
  { vaccine: 'BCG, OPV-0, Hep B-1', timing: 'At birth', status: 'completed' },
  { vaccine: 'OPV-1, Pentavalent-1, Rotavirus-1, PCV-1', timing: '6 weeks', status: 'upcoming' },
  { vaccine: 'OPV-2, Pentavalent-2, Rotavirus-2', timing: '10 weeks', status: 'pending' },
  { vaccine: 'OPV-3, Pentavalent-3, Rotavirus-3, PCV-2', timing: '14 weeks', status: 'pending' },
  { vaccine: 'Measles-1, Vitamin A-1', timing: '9 months', status: 'pending' },
  { vaccine: 'MMR-1, Varicella-1, Hep A-1, PCV Booster', timing: '12 months', status: 'pending' },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

/** Status → style mapping for badge rendering */
export const vaccinationBadge = (status: VaccinationStatus) => {
  switch (status) {
    case 'completed':
      return { label: 'Done', className: 'bg-primary-100 text-primary-700' };
    case 'upcoming':
      return { label: 'Next', className: 'bg-secondary-100 text-secondary-600' };
    case 'pending':
    default:
      return { label: 'Pending', className: 'bg-slate-100 text-slate-500' };
  }
};

/** Dashboard-friendly summary: only completed + first upcoming */
export const getVaccinationSummary = (): { completed: VaccinationEntry[]; nextUp: VaccinationEntry | undefined } => {
  const completed = VACCINATION_SCHEDULE.filter(v => v.status === 'completed');
  const nextUp = VACCINATION_SCHEDULE.find(v => v.status === 'upcoming');
  return { completed, nextUp };
};

/** Build TTS string for SpeakButton */
export const getVaccinationSpeakText = (): string =>
  'Vaccination Schedule. ' +
  VACCINATION_SCHEDULE.map(v => `${v.vaccine} ${v.timing}`).join('. ') + '.';
