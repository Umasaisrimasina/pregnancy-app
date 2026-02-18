/**
 * PregnancyDashboard.tsx
 *
 * Pregnancy-phase (mother role) dashboard — thin composition page.
 * All heavy UI is delegated to sub-components; this file only composes the layout.
 *
 * 696 → ~120 lines after refactor.
 */

import React from 'react';
import { useHealthData } from '../contexts/HealthDataContext';
import { computeGestationalAge, DEMO_EDD } from '../utils/gestationalAge';
import { appointments } from '../config/pregnancyClinic.config';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { FetalTimeline } from '../components/dashboard/FetalTimeline';
import { MidwifeChatCard } from '../components/dashboard/MidwifeChatCard';
import { LiveVitalsPanel } from '../components/dashboard/LiveVitalsPanel';
import { ClinicalSummary } from '../components/dashboard/ClinicalSummary';
import { FeelingTracker } from '../components/dashboard/FeelingTracker';
import { DoctorConsultCTA } from '../components/dashboard/DoctorConsultCTA';
import { CravingsSection } from '../components/dashboard/CravingsSection';
import { HydrationCard } from '../components/dashboard/HydrationCard';
import { AppointmentsCard } from '../components/dashboard/AppointmentsCard';
import { PregnancyCalendar } from '../components/PregnancyCalendar';
import { ManualVitalsModal } from '../components/ManualVitalsModal';

export const PregnancyDashboard: React.FC = () => {
  const { isManualModalOpen, closeManualModal } = useHealthData();
  const ga = computeGestationalAge(DEMO_EDD);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      <PhaseHeader
        badgeText={ga.trimesterLabel}
        badgeColorClass="bg-primary-50 border-primary-100 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300"
        dotColorClass="bg-primary-400"
        title="Pregnancy"
        subtitle={ga.subtitle}
        speakText={`Pregnancy Dashboard. ${ga.speakLabel}. Track your pregnancy journey, fetal development, and health vitals.`}
      />

      {/* Timeline & Midwife Chat */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-2">
        <div className="xl:col-span-3">
          <FetalTimeline />
        </div>
        <div className="xl:col-span-2">
          <MidwifeChatCard />
        </div>
      </div>

      {/* Live Vitals (metric cards + stress chart + watch pipeline) */}
      <LiveVitalsPanel />

      {/* Doctor Summary & Feelings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ClinicalSummary />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <FeelingTracker colorScheme="primary" />
          <DoctorConsultCTA
            variant="rich"
            subtitle="Instant consultation"
            description="Connect with Dr. Aditi Sharma for personalized advice and support."
            buttonLabel="Start Video Call"
            consultationType="pregnancy"
          />
        </div>
      </div>

      {/* Cravings Tracker */}
      <CravingsSection />

      {/* Pregnancy Calendar & Side Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PregnancyCalendar />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <HydrationCard />
          <AppointmentsCard appointments={appointments} />
        </div>
      </div>

      {/* Manual Entry Modal */}
      <ManualVitalsModal isOpen={isManualModalOpen} onClose={closeManualModal} />
    </div>
  );
};
