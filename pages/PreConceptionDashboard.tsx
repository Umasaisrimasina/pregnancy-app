/**
 * PreConceptionDashboard.tsx
 *
 * Extracted Pre-Conception (Planning Phase) dashboard.
 * Composes shared components — zero inlined markup or duplicated wiring.
 *
 * Sections:
 *   1. PhaseHeader  – shared header with badge, title, subtitle, SpeakButton
 *   2. PreConceptionGuide – config-driven Do's & Don'ts
 *   3. CycleCalendar – prop-driven menstrual cycle tracker
 *   4. DoctorConsultCTA – shared Doctor 1:1 Call CTA with consultation modals
 */

import React from 'react';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { DoctorConsultCTA } from '../components/dashboard/DoctorConsultCTA';
import { PreConceptionGuide } from '../components/PreConceptionGuide';
import { CycleCalendar } from '../components/CycleCalendar';

// ── Component ────────────────────────────────────────────────────────────

export const PreConceptionDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PhaseHeader
        badgeText="Planning Phase"
        title="Pre-Conception"
        subtitle="Optimization Phase"
        speakText="Pre-Conception Optimization Phase. Track your cycle, optimize your health, and prepare for pregnancy."
      />

      <PreConceptionGuide />

      <CycleCalendar />

      <DoctorConsultCTA
        variant="banner"
        subtitle="Consult with fertility specialists"
        consultationType="pre-pregnancy"
      />
    </div>
  );
};
