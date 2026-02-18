/**
 * MedicalDashboard.tsx
 *
 * Medical/Doctor-role dashboard — thin composition page.
 * All heavy UI is delegated to sub-components in components/medical/.
 * Business logic (tab state) stays here; components are presentational.
 *
 * ~200 → ~85 lines after refactor.
 */

import React, { useState } from 'react';
import { Activity, Bell, Search } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { DigitalCaseHistory } from '../components/DigitalCaseHistory';
import { ActivePatientList } from '../components/medical/ActivePatientList';
import { PatientInfoCard } from '../components/medical/PatientInfoCard';
import { ClinicalMetricCard } from '../components/medical/ClinicalMetricCard';
import { BloodSugarTrendChart } from '../components/medical/BloodSugarTrendChart';
import { MedicalFilesCard } from '../components/medical/MedicalFilesCard';
import { bloodSugarTrend } from '../config/dashboardData.config';
import { ACTIVE_PATIENTS, CLINICAL_METRICS, MEDICAL_FILES, type PatientListItem } from '../config/medicalView.config';

export const MedicalDashboard: React.FC = () => {
  const [medicalTab, setMedicalTab] = useState<'clinical' | 'case-history'>('clinical');
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem>(ACTIVE_PATIENTS[0]);

  const handlePatientSelect = (id: number) => {
    const patient = ACTIVE_PATIENTS.find(p => p.id === id);
    if (patient) setSelectedPatient(patient);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">MODE: DOCTOR PERSPECTIVE</span>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-dm-foreground mt-1">Your Pregnancy Journey</h1>
        </div>
        <SpeakButton text="Doctor Perspective. Clinical Dashboard for monitoring patient health and pregnancy progress." />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6" role="tablist">
        {(['clinical', 'case-history'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab}`}
            aria-selected={medicalTab === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={medicalTab === tab ? 0 : -1}
            onClick={() => setMedicalTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              medicalTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-dm-muted text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dm-accent'
            }`}
          >
            {tab === 'clinical' ? 'Clinical Dashboard' : 'Digital Case History'}
          </button>
        ))}
      </div>

      {medicalTab === 'case-history' ? (
        <div role="tabpanel" id="panel-case-history" aria-labelledby="tab-case-history">
          <DigitalCaseHistory />
        </div>
      ) : (
        <div role="tabpanel" id="panel-clinical" aria-labelledby="tab-clinical">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Activity size={24} /></div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Clinical Dashboard</h2>
            </div>
            <div className="flex w-full lg:w-auto gap-4">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                <input type="text" placeholder="Search patient..." aria-label="Search patient" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 dark:border-dm-border bg-white dark:bg-dm-muted text-slate-900 dark:text-dm-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:placeholder:text-slate-500" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Bell size={16} /> Alerts (2)
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <ActivePatientList patients={ACTIVE_PATIENTS} onSelect={handlePatientSelect} />

            <div className="flex-1 bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border shadow-sm min-h-[600px]">
              <PatientInfoCard
                name={selectedPatient.name}
                details={selectedPatient.details || selectedPatient.subtitle}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {CLINICAL_METRICS.map((metric) => (
                  <ClinicalMetricCard key={metric.iconKey} {...metric} />
                ))}
              </div>

              <BloodSugarTrendChart data={bloodSugarTrend} />

              <MedicalFilesCard files={MEDICAL_FILES} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
