/**
 * postPartumChecklist.config.ts
 *
 * Default recovery checklist items for the Post-Partum dashboard.
 * Config-driven so items can be tuned without touching the component.
 */

export interface ChecklistItem {
  label: string;
  defaultDone: boolean;
}

export const RECOVERY_CHECKLIST: readonly ChecklistItem[] = [
  { label: 'Pelvic Floor Exercises', defaultDone: true },
  { label: 'Hydration (8 glasses)', defaultDone: false },
  { label: 'Postnatal Vitamin', defaultDone: false },
  { label: '15 min Walk', defaultDone: true },
] as const;
