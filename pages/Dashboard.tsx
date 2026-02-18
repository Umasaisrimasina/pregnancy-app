/**
 * Dashboard.tsx — Thin Router
 *
 * Delegates rendering to the correct phase/role dashboard.
 * All view logic, hooks, data, and helpers live in their own files.
 *
 * 2,261 lines → ~50 lines.
 */

import React from 'react';
import { AppPhase, UserRole } from '../types';

// ── Role-specific dashboards ────────────────────────────────────────────
import { PartnerDashboard } from './PartnerDashboard';
import { FamilyDashboard } from './FamilyDashboard';
import { MedicalDashboard } from './MedicalDashboard';

// ── Phase-specific dashboards (mother role) ─────────────────────────────
import { PreConceptionDashboard } from './PreConceptionDashboard';
import { PregnancyDashboard } from './PregnancyDashboard';
import { PostPartumDashboard } from './PostPartumDashboard';
import { BabyCareDashboard } from './BabyCareDashboard';

interface DashboardProps {
  phase: AppPhase;
  role: UserRole;
}

/** Route map: role → component (takes priority over phase) */
const ROLE_VIEWS: Partial<Record<UserRole, React.FC>> = {
  partner: PartnerDashboard,
  family: FamilyDashboard,
  medical: MedicalDashboard,
};

/** Route map: phase → component (used when role is 'mother') */
const PHASE_VIEWS: Record<AppPhase, React.FC> = {
  'pre-pregnancy': PreConceptionDashboard,
  pregnancy: PregnancyDashboard,
  'post-partum': PostPartumDashboard,
  'baby-care': BabyCareDashboard,
};

export const Dashboard: React.FC<DashboardProps> = ({ phase, role }) => {
  // Non-mother roles get their own dedicated view
  const RoleView = ROLE_VIEWS[role];
  if (RoleView) return <RoleView />;

  // Mother role → pick by phase
  const PhaseView = PHASE_VIEWS[phase];
  return <PhaseView />;
};






