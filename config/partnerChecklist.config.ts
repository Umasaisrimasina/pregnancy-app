/**
 * partnerChecklist.config.ts
 *
 * Config-driven support checklist items for the Partner dashboard.
 * Add / remove / reorder items here — the UI re-renders automatically.
 */

// ── Types ────────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'done';

export interface PartnerTask {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
}

// ── Data ─────────────────────────────────────────────────────────────────

export const PARTNER_CHECKLIST: readonly PartnerTask[] = [
  { id: 'iron-supplements', title: 'Buy iron supplements', dueDate: 'Due: Today', status: 'pending' },
  { id: 'car-seat', title: 'Install car seat', dueDate: 'Due: Next Week', status: 'pending' },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

export const getPendingCount = (tasks: readonly PartnerTask[]): number =>
  tasks.filter((t) => t.status === 'pending').length;

export const getChecklistSpeakText = (tasks: readonly PartnerTask[]): string => {
  const pending = tasks.filter((t) => t.status === 'pending');
  if (pending.length === 0) return 'All tasks complete! Great job supporting your partner.';
  const noun = pending.length === 1 ? 'task' : 'tasks';
  return `You have ${pending.length} pending ${noun}: ${pending.map((t) => t.title).join(', ')}.`;
};
