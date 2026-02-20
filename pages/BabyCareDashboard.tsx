/**
 * BabyCareDashboard.tsx
 *
 * Baby-Care phase (mother role) dashboard — thin composition page.
 * All heavy UI delegated to sub-components.
 *
 * 284 → ~60 lines after extraction.
 */

import React from 'react';
import { Calendar, Scale, Moon, Milk, Clock } from 'lucide-react';
import { useAQI } from '../hooks/useAQI';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { QuickStatCard } from '../components/dashboard/QuickStatCard';
import { MilestoneTracker } from '../components/dashboard/MilestoneTracker';
import { EnvironmentalSafetyCard } from '../components/dashboard/EnvironmentalSafetyCard';
import { BabyCareEssentialsCard } from '../components/dashboard/BabyCareEssentialsCard';
import { MedicalRoadmapCard } from '../components/dashboard/MedicalRoadmapCard';
import { getVaccinationSummary } from '../config/vaccinationSchedule.config';
import { getUpcomingMilestones } from '../config/milestones.config';

export const BabyCareDashboard: React.FC = () => {
  const { aqiState, fetchAQI } = useAQI();
  const { completed: doneVax, nextUp } = getVaccinationSummary();
  const upcomingMilestones = getUpcomingMilestones(4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PhaseHeader
        badgeText="Month 2"
        badgeColorClass="bg-secondary-50 border-secondary-100 text-secondary-600 dark:bg-secondary-900/20 dark:border-secondary-800 dark:text-secondary-300"
        dotColorClass="bg-secondary-400"
        title="Baby Care"
        subtitle="Leo is 8 weeks old today!"
        speakText="Baby Care Dashboard. Month 2. Leo is 8 weeks old today! Track feeding, sleep, weight, and upcoming milestones."
        rightContent={
          <button
            onClick={() => console.log('Log appointment clicked')}
            className="bg-secondary-400 hover:bg-secondary-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-secondary-400/20 transition-all flex items-center gap-2"
          >
            <Calendar size={18} />
            Log Appointment
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard icon={Milk} label="Last Feed" value="2h 15m" subtext="ago" iconBg="bg-orange-50" iconColor="text-orange-500" />
        <QuickStatCard icon={Moon} label="Last Sleep" value="45m" subtext="duration" iconBg="bg-blue-50" iconColor="text-blue-500" />
        <QuickStatCard icon={Scale} label="Weight" value="11.2 lbs" subtext="+5%" iconBg="bg-green-50" iconColor="text-green-500" />
        <QuickStatCard icon={Clock} label="Next Feed" value="1:30 PM" subtext="in 45 mins" accentBg="bg-secondary-400 shadow-secondary-400/20" />
      </div>

      {/* Environmental Safety (extracted) */}
      <EnvironmentalSafetyCard aqiState={aqiState} onRefresh={fetchAQI} />

      {/* Baby Care Essentials & Medical Roadmap */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BabyCareEssentialsCard />
        </div>
        <div className="xl:col-span-1">
          <MedicalRoadmapCard
            completedVaccinations={doneVax}
            nextVaccination={nextUp}
            speakText="Medical Roadmap. Vaccination tracker: BCG and Hepatitis B done. OPV 1 and DTP 1 due next week. Genetic monitoring: Birth data is analyzed for genetic markers. Follow up on infant metabolic screening results."
          />
        </div>
      </div>

      {/* Milestone Tracker (data from config) */}
      <MilestoneTracker milestones={upcomingMilestones} />
    </div>
  );
};
